// Repository do módulo atletas (front): única camada que fala com a API.
import { apiFetch } from '../../../lib/api'
import type {
  AtletaDetalhe,
  AtletaListagem,
  ConsultaAtletas,
} from '../../../contracts/schemas/atletas'

export function listarAtletas(consulta: ConsultaAtletas) {
  // listagem com filtros server-side (busca + posição + A-Z no banco)
  const params = new URLSearchParams()
  if (consulta.q) params.set('q', consulta.q)
  if (consulta.posicao) params.set('posicao', consulta.posicao)
  if (consulta.categoria) params.set('categoria', consulta.categoria)
  const query = params.toString()

  return apiFetch<{ atletas: AtletaListagem[] }>(`/api/atletas${query ? `?${query}` : ''}`)
}

export function buscarAtleta(id: string) {
  // ficha completa (respostas JSONB inclusas)
  return apiFetch<{ atleta: AtletaDetalhe }>(`/api/atletas/${id}`)
}

export function atualizarExibicao(id: string, exibeNoSite: boolean) {
  // curadoria da seção pública do site
  return apiFetch<{ atleta: AtletaListagem }>(`/api/atletas/${id}/exibicao`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ exibeNoSite }),
  })
}

export function atualizarNascimento(id: string, dataNascimento: string | null) {
  // define/limpa o nascimento → idade passa a ser calculada (ou volta ao reportado)
  return apiFetch<{ atleta: AtletaListagem }>(`/api/atletas/${id}/nascimento`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataNascimento }),
  })
}
