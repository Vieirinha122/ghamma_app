// Acesso aos dados de auth via Prisma. Nenhuma regra de negócio aqui —
// só consultas e escritas.
import { prisma } from '../../db'

export function buscarUsuarioPorEmail(email: string) {
  // busca usuário pelo e-mail (login)
  return prisma.usuario.findUnique({ where: { email } })
}

export function criarSessaoRefresh(usuarioId: string, tokenHash: string, expiraEm: Date) {
  // cria sessão de refresh (guarda só o hash do token)
  return prisma.sessaoRefresh.create({ data: { usuarioId, tokenHash, expiraEm } })
}

export function buscarSessaoAtivaPorToken(tokenHash: string) {
  // busca sessão vigente: não revogada e não expirada
  return prisma.sessaoRefresh.findFirst({
    where: { tokenHash, revogadoEm: null, expiraEm: { gt: new Date() } },
    include: { usuario: true },
  })
}

export function revogarSessao(id: string) {
  // marca a sessão como revogada (rotação de token e logout)
  return prisma.sessaoRefresh.update({
    where: { id },
    data: { revogadoEm: new Date() },
  })
}
