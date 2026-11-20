// Repository da seção pública de atletas da landing (módulo landing).
// Fala exclusivamente com o endpoint público /api/site/atletas — que só
// devolve nome, idade e posição de quem o admin marcou com exibeNoSite.
import { apiFetch } from '../../../lib/api'
import type { AtletaPublico } from '../../../contracts/schemas/atletas'

export function listarAtletasPublicos(consulta: { q?: string; posicao?: string }) {
  const params = new URLSearchParams()
  if (consulta.q) params.set('q', consulta.q)
  if (consulta.posicao) params.set('posicao', consulta.posicao)
  const query = params.toString()

  return apiFetch<{ atletas: AtletaPublico[] }>(`/api/site/atletas${query ? `?${query}` : ''}`, {
    semRenovacao: true,
  })
}
