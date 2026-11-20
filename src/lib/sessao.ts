// Infra de sessão do front — resolve os problemas não óbvios de sync de auth:
//
// 1. Token de acesso em memória (nunca em localStorage: XSS lê localStorage,
//    mas não uma variável que mora só no runtime da aba).
// 2. Mutex de renovação entre abas: o refresh token ROTACIONA no servidor, então
//    duas abas renovando em paralelo invalidariam a sessão uma da outra (a segunda
//    chega com o cookie já revogado). O lock garante uma renovadora por vez; as
//    outras esperam o anúncio do token novo.
// 3. BroadcastChannel: logout e token novo são anunciados às OUTRAS abas
//    (o canal não entrega mensagem para quem enviou).
import type { UsuarioAutenticado } from '../contracts/schemas/auth'

const CHAVE_LOCK = 'ghamma:auth:refresh_lock'
const TTL_LOCK_MS = 10_000
const ESPERA_ANUNCIO_MS = 2000

export interface SessaoRenovada {
  accessToken: string
  usuario: UsuarioAutenticado
}

let tokenAcesso: string | null = null
let usuarioSessao: UsuarioAutenticado | null = null
let renovacaoEmAndamento: Promise<SessaoRenovada> | null = null
const meuTabId = crypto.randomUUID()

const canal = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('ghamma-auth') : null

function anunciar(tipo: 'LOGOUT' | 'TOKEN_RENOVADO', token?: string, usuario?: UsuarioAutenticado) {
  canal?.postMessage({ tipo, token, usuario })
}

export function definirSessao(token: string | null, usuario: UsuarioAutenticado | null) {
  tokenAcesso = token
  usuarioSessao = usuario
}

export function obterTokenAcesso() {
  return tokenAcesso
}

// ── Mutex de renovação (localStorage como lock distribuído) ────────────────
// Race: abas A e B têm o mesmo cookie; A rotaciona (C1 → C2); B chega com C1
// já revogado → 401 → logout forçado injusto. O lock deixa só uma renovar.

function adquirirLock(): boolean {
  const registro = localStorage.getItem(CHAVE_LOCK)
  if (registro) {
    try {
      const { expiraEm } = JSON.parse(registro) as { expiraEm: number }
      if (Date.now() < expiraEm) {
        return false // outra aba está renovando
      }
    } catch {
      // lock corrompido ou sem expiração: sobrescreve
    }
  }
  localStorage.setItem(CHAVE_LOCK, JSON.stringify({ tabId: meuTabId, expiraEm: Date.now() + TTL_LOCK_MS }))
  return true
}

function liberarLock() {
  const registro = localStorage.getItem(CHAVE_LOCK)
  if (registro) {
    try {
      const { tabId } = JSON.parse(registro) as { tabId: string }
      if (tabId === meuTabId) {
        localStorage.removeItem(CHAVE_LOCK)
      }
    } catch {
      localStorage.removeItem(CHAVE_LOCK)
    }
  }
}

// Espera um anúncio de token de outra aba (resolvido porBroadcastChannel)
const esperandoToken: Array<(token: string | null) => void> = []

function esperarAnuncioToken(tempoMaxMs: number): Promise<string | null> {
  return new Promise((resolver) => {
    const timeout = setTimeout(() => resolver(null), tempoMaxMs)
    esperandoToken.push((token) => {
      clearTimeout(timeout)
      resolver(token)
    })
  })
}

// ── Ouvintes de eventos de sessão (para o AuthProvider reagir) ──────────────

type OuvinteSessao = (evento: 'logout' | 'token-renovado') => void
const ouvintes: OuvinteSessao[] = []

export function inscreverEventosSessao(ouvinte: OuvinteSessao) {
  ouvintes.push(ouvinte)
  return () => {
    const indice = ouvintes.indexOf(ouvinte)
    if (indice >= 0) ouvintes.splice(indice, 1)
  }
}

export function anunciarLogout() {
  anunciar('LOGOUT')
}

canal?.addEventListener('message', ({ data }: MessageEvent) => {
  if (data?.tipo === 'LOGOUT') {
    definirSessao(null, null)
    for (const ouvinte of ouvintes) ouvinte('logout')
    return
  }

  if (data?.tipo === 'TOKEN_RENOVADO' && typeof data.token === 'string') {
    definirSessao(data.token, data.usuario ?? null)
    esperandoToken.forEach((resolver) => resolver(data.token as string))
    esperandoToken.length = 0
    for (const ouvinte of ouvintes) ouvinte('token-renovado')
  }
})

// ── Renovação silenciosa (deduplicada nesta aba + lock entre abas) ─────────

async function renovarComFetch(): Promise<SessaoRenovada> {
  // credenciais same-origin: o cookie httpOnly vai junto automaticamente
  const resposta = await fetch('/api/auth/refresh', { method: 'POST' })

  if (!resposta.ok) {
    throw new Error('Sessão expirada')
  }

  return (await resposta.json()) as SessaoRenovada
}

export function renovarSessao(): Promise<SessaoRenovada> {
  // deduplicação na aba: renovações simultâneas esperam a mesma promise
  if (renovacaoEmAndamento) {
    return renovacaoEmAndamento
  }

  renovacaoEmAndamento = (async () => {
    if (!adquirirLock()) {
      // outra aba venceu o lock: espera o anúncio do token novo
      const tokenAnunciado = await esperarAnuncioToken(ESPERA_ANUNCIO_MS)
      if (tokenAnunciado && usuarioSessao) {
        return { accessToken: tokenAnunciado, usuario: usuarioSessao }
      }
      // anúncio não chegou (aba vencedora demorou/morreu): sem sessão reutilizável
      throw new Error('Sessão expirada')
    }

    try {
      const sessao = await renovarComFetch()
      definirSessao(sessao.accessToken, sessao.usuario)
      anunciar('TOKEN_RENOVADO', sessao.accessToken, sessao.usuario)
      return sessao
    } finally {
      liberarLock()
    }
  })()

  return renovacaoEmAndamento.finally(() => {
    renovacaoEmAndamento = null
  })
}
