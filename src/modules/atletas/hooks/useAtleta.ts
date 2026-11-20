// Hook do módulo atletas: ficha completa de um atleta por id.
import { useQuery } from '@tanstack/react-query'
import * as atletasRepository from '../data/atletas.repository'

export function useAtleta(id: string | null) {
  return useQuery({
    queryKey: ['atleta', id],
    queryFn: () => atletasRepository.buscarAtleta(id as string),
    enabled: Boolean(id),
  })
}
