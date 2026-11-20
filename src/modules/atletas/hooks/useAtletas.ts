// Hook do módulo atletas: listagem com filtros (cache por consulta).
// Hoje usada pela página do painel; a seção pública usa o endpoint público
// com hook próprio — não cruza lateralmente.
import { useQuery } from '@tanstack/react-query'
import type { ConsultaAtletas } from '../../../contracts/schemas/atletas'
import * as atletasRepository from '../data/atletas.repository'

export function useAtletas(consulta: ConsultaAtletas) {
  return useQuery({
    queryKey: ['atletas', consulta.q ?? '', consulta.posicao ?? '', consulta.categoria ?? ''],
    queryFn: () => atletasRepository.listarAtletas(consulta),
  })
}

// Listagem completa sem filtros — usada para os indicadores do topo
export function useAtletasTotais() {
  return useQuery({
    queryKey: ['atletas', 'totais'],
    queryFn: () => atletasRepository.listarAtletas({}),
  })
}
