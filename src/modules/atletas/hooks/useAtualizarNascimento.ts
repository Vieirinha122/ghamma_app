// Hook do módulo atletas: salva a data de nascimento e invalida ficha +
// listagens — a idade recalculada aparece em toda a interface.
import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as atletasRepository from '../data/atletas.repository'

export function useAtualizarNascimento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dataNascimento }: { id: string; dataNascimento: string | null }) =>
      atletasRepository.atualizarNascimento(id, dataNascimento),
    onSuccess: (_resultado, variaveis) => {
      void queryClient.invalidateQueries({ queryKey: ['atletas'] })
      void queryClient.invalidateQueries({ queryKey: ['atleta', variaveis.id] })
    },
  })
}
