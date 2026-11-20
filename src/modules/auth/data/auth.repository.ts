// Acesso à API de auth do módulo. A renovação silenciosa e o controle de token
// moram em src/lib/{api,sessao}.ts (infra compartilhada); aqui ficam só as
// chamadas específicas de entrar/sair.
import { apiFetch } from '../../../lib/api'
import type { CredenciaisLogin, UsuarioAutenticado } from '../../../contracts/schemas/auth'

interface RespostaSessao {
  accessToken: string
  usuario: UsuarioAutenticado
}

export function login(credenciais: CredenciaisLogin) {
  // POST /api/auth/login → access token no corpo + cookie de refresh
  return apiFetch<RespostaSessao>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credenciais),
    semRenovacao: true,
  })
}

export function logout() {
  // POST /api/auth/logout → revoga a sessão do cookie
  return apiFetch<{ ok: boolean }>('/api/auth/logout', { method: 'POST', semRenovacao: true })
}
