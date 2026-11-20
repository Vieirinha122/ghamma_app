// Hook da seção pública de atletas (módulo landing): cache por filtro.
// A base inteira (sem filtros) decide se a seção existe na página.
import { useQuery } from '@tanstack/react-query'
import * as atletasPublicosRepository from '../data/atletas-publicos.repository'

export function useAtletasPublicos(consulta: { q?: string; posicao?: string }) {
  return useQuery({
    queryKey: ['atletas-publicos', consulta.q ?? '', consulta.posicao ?? ''],
    queryFn: () => atletasPublicosRepository.listarAtletasPublicos(consulta),
  })
}

export function useBasePublica() {
  return useQuery({
    queryKey: ['atletas-publicos', 'base'],
    queryFn: () => atletasPublicosRepository.listarAtletasPublicos({}),
  })
}
