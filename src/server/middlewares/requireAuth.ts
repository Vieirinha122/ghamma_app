// Middleware de autenticação para rotas protegidas.
// Verifica o Bearer token (JWT curto) e confirma que o usuário ainda existe
// no banco — se a conta sumir, o token morre junto, mesmo dentro da validade.
import type { NextFunction, Request, Response } from 'express'
import { ApiErro } from '../errors/api-error'
import { verificarAccessToken } from '../modules/auth/service'
import { prisma } from '../db'
import type { UsuarioAutenticado } from '../../contracts/schemas/auth'

declare module 'express-serve-static-core' {
  interface Request {
    usuario?: UsuarioAutenticado
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const cabecalho = req.headers.authorization

  if (!cabecalho?.startsWith('Bearer ')) {
    throw ApiErro.naoAutenticado('Token ausente')
  }

  const usuarioDoToken = verificarAccessToken(cabecalho.slice('Bearer '.length))
  if (!usuarioDoToken) {
    throw ApiErro.naoAutenticado()
  }

  const usuarioNoBanco = await prisma.usuario.findUnique({ where: { id: usuarioDoToken.id } })
  if (!usuarioNoBanco) {
    throw ApiErro.naoAutenticado()
  }

  req.usuario = {
    id: usuarioNoBanco.id,
    email: usuarioNoBanco.email,
    papel: usuarioNoBanco.papel,
  }
  next()
}
