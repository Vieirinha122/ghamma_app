// Adaptação HTTP do módulo auth: valida entrada, chama o service e
// monta a resposta (incluindo o cookie do refresh token).
import type { Request, Response } from 'express'
import { ApiErro } from '../../errors/api-error'
import { schemaLogin } from '../../../contracts/schemas/auth'
import * as authService from './service'

const NOME_COOKIE_REFRESH = 'refresh_token'
const DIAS_REFRESH = 30

export function opcoesCookieRefresh(maxAgeMs?: number) {
  return {
    httpOnly: true,
    // secure só em produção: localhost roda em http
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    // path limita o cookie às rotas de auth — o navegador só envia onde precisa
    path: '/api/auth',
    ...(maxAgeMs ? { maxAge: maxAgeMs } : {}),
  } as const
}

function lerCookieRefresh(req: Request) {
  return req.cookies?.[NOME_COOKIE_REFRESH] as string | undefined
}

// POST /auth/login → valida credenciais, devolve access token e grava cookie de refresh
export async function login(req: Request, res: Response) {
  const resultado = schemaLogin.safeParse(req.body)

  if (!resultado.success) {
    throw ApiErro.validacao(resultado.error)
  }

  const sessao = await authService.autenticarUsuario(resultado.data)

  res.cookie(
    NOME_COOKIE_REFRESH,
    sessao.refreshToken,
    opcoesCookieRefresh(DIAS_REFRESH * 24 * 60 * 60 * 1000),
  )
  res.json({ accessToken: sessao.accessToken, usuario: sessao.usuario })
}

// POST /auth/refresh → rota que o front chama quando o access token expira;
// rotaciona o refresh (novo cookie) e devolve novo access token
export async function refresh(req: Request, res: Response) {
  const refreshTokenBruto = lerCookieRefresh(req)

  if (!refreshTokenBruto) {
    throw ApiErro.naoAutenticado('Sem sessão para renovar')
  }

  const sessao = await authService.renovarSessao(refreshTokenBruto)

  res.cookie(
    NOME_COOKIE_REFRESH,
    sessao.refreshToken,
    opcoesCookieRefresh(DIAS_REFRESH * 24 * 60 * 60 * 1000),
  )
  res.json({ accessToken: sessao.accessToken, usuario: sessao.usuario })
}

// POST /auth/logout → revoga a sessão e limpa o cookie
export async function logout(req: Request, res: Response) {
  const refreshTokenBruto = lerCookieRefresh(req)

  if (refreshTokenBruto) {
    await authService.encerrarSessao(refreshTokenBruto)
  }

  res.clearCookie(NOME_COOKIE_REFRESH, opcoesCookieRefresh())
  res.json({ ok: true })
}
