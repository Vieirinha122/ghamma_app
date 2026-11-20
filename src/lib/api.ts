// Wrapper de fetch da API: anexa o token de acesso em memória e, em 401,
// tenta UMA renovação silenciosa antes de repetir a request. Se a renovação
// falhar, propaga o logout para as outras abas e devolve o 401 ao chamador.
import { anunciarLogout, definirSessao, obterTokenAcesso, renovarSessao } from './sessao'

interface OpcoesApi extends RequestInit {
  // chamadores de auth (login/refresh) não devem tentar renovar em 401
  semRenovacao?: boolean
}

export async function apiFetch<T>(caminho: string, opcoes: OpcoesApi = {}): Promise<T> {
  const { semRenovacao, headers, ...resto } = opcoes

  const resposta = await fetch(caminho, {
    ...resto,
    headers: {
      ...headers,
      ...(obterTokenAcesso() ? { Authorization: `Bearer ${obterTokenAcesso()}` } : {}),
    },
  })

  if (resposta.status !== 401 || semRenovacao) {
    return tratarResposta<T>(resposta)
  }

  // 401 → tenta renovar UMA vez e repete a request original
  try {
    await renovarSessao()
  } catch {
    // refresh falhou: sessão morreu de verdade
    definirSessao(null, null)
    anunciarLogout()
    return tratarResposta<T>(resposta)
  }

  const repetida = await fetch(caminho, {
    ...resto,
    headers: {
      ...headers,
      ...(obterTokenAcesso() ? { Authorization: `Bearer ${obterTokenAcesso()}` } : {}),
    },
  })

  return tratarResposta<T>(repetida)
}

async function tratarResposta<T>(resposta: Response): Promise<T> {
  if (!resposta.ok) {
    // extrai a mensagem de erro padrão da API ({ erro: '...' })
    let mensagem = `Erro ${resposta.status}`
    try {
      const corpo = (await resposta.json()) as { erro?: string }
      if (corpo?.erro) {
        mensagem = corpo.erro
      }
    } catch {
      // resposta sem JSON: mantém mensagem genérica
    }
    throw new ErroApi(mensagem, resposta.status)
  }

  return (await resposta.json()) as T
}

export class ErroApi extends Error {
  status: number

  constructor(mensagem: string, status: number) {
    super(mensagem)
    this.name = 'ErroApi'
    this.status = status
  }
}
