// Regras de negócio do auth: autenticação, emissão e rotação de tokens.
// Access token: JWT curto (15 min), fica em memória no front.
// Refresh token: opaco, 30 dias, em cookie HttpOnly; no banco só o hash SHA-256.
import { createHash, randomBytes } from 'node:crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../../env'
import { ApiErro } from '../../errors/api-error'
import type { CredenciaisLogin, UsuarioAutenticado } from '../../../contracts/schemas/auth'
import {
  buscarSessaoAtivaPorToken,
  buscarUsuarioPorEmail,
  criarSessaoRefresh,
  revogarSessao,
} from './repository'

const EXPIRACAO_ACCESS_TOKEN = '15m'
const DIAS_REFRESH = 30

export interface TokensSessao {
  accessToken: string
  refreshToken: string
  usuario: UsuarioAutenticado
}

function gerarHashDeToken(tokenBruto: string) {
  // nunca persistimos o token em claro — só o hash
  return createHash('sha256').update(tokenBruto).digest('hex')
}

function paraUsuarioAutenticado(usuario: { id: string; email: string; papel: string }): UsuarioAutenticado {
  return { id: usuario.id, email: usuario.email, papel: usuario.papel }
}

function gerarAccessToken(usuario: UsuarioAutenticado) {
  return jwt.sign({ sub: usuario.id, papel: usuario.papel }, env.JWT_SECRET, {
    expiresIn: EXPIRACAO_ACCESS_TOKEN,
  })
}

async function criarSessaoPara(usuario: UsuarioAutenticado): Promise<string> {
  // refresh opaco: aleatório forte; o bruto vai pro cookie, o hash pro banco
  const refreshToken = randomBytes(48).toString('base64url')
  const expiraEm = new Date(Date.now() + DIAS_REFRESH * 24 * 60 * 60 * 1000)
  await criarSessaoRefresh(usuario.id, gerarHashDeToken(refreshToken), expiraEm)
  return refreshToken
}

export async function autenticarUsuario(credenciais: CredenciaisLogin): Promise<TokensSessao> {
  const usuario = await buscarUsuarioPorEmail(credenciais.email)

  // compara hash; mesmo erro nos dois caminhos para não vazar existência de conta
  const senhaConfere = usuario
    ? await bcrypt.compare(credenciais.senha, usuario.senhaHash)
    : false

  if (!usuario || !senhaConfere) {
    throw ApiErro.credenciaisInvalidas()
  }

  const usuarioAutenticado = paraUsuarioAutenticado(usuario)
  return {
    accessToken: gerarAccessToken(usuarioAutenticado),
    refreshToken: await criarSessaoPara(usuarioAutenticado),
    usuario: usuarioAutenticado,
  }
}

export async function renovarSessao(refreshTokenBruto: string): Promise<TokensSessao> {
  const sessao = await buscarSessaoAtivaPorToken(gerarHashDeToken(refreshTokenBruto))

  if (!sessao) {
    throw ApiErro.naoAutenticado()
  }

  // rotação: a sessão antiga morre a cada renovação, então um refresh roubado
  // só funciona uma vez — e o uso legítimo logo o invalida
  await revogarSessao(sessao.id)

  const usuarioAutenticado = paraUsuarioAutenticado(sessao.usuario)
  return {
    accessToken: gerarAccessToken(usuarioAutenticado),
    refreshToken: await criarSessaoPara(usuarioAutenticado),
    usuario: usuarioAutenticado,
  }
}

export async function encerrarSessao(refreshTokenBruto: string): Promise<void> {
  // logout: revoga a sessão se existir; idempotente (cookie já limpo = nada a fazer)
  const sessao = await buscarSessaoAtivaPorToken(gerarHashDeToken(refreshTokenBruto))
  if (sessao) {
    await revogarSessao(sessao.id)
  }
}

export function verificarAccessToken(token: string): UsuarioAutenticado | null {
  // valida assinatura e expiração; payload esperado: { sub, papel }
  try {
    const payload = jwt.verify(token, env.JWT_SECRET)
    if (typeof payload === 'object' && payload !== null && typeof payload.sub === 'string') {
      const papel = typeof payload.papel === 'string' ? payload.papel : 'ADMIN'
      return { id: payload.sub, email: '', papel }
    }
    return null
  } catch {
    return null
  }
}
