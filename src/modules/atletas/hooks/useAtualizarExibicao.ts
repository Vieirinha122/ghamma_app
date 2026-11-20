// Hook do módulo atletas: mutação de curadoria (exibeNoSite) que
// invalida as listagens em cache — o painel reage sem refresh manual.
import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as atletasRepository from '../data/atletas.repository'

export function useAtualizarExibicao() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, exibeNoSite }: { id: string; exibeNoSite: boolean }) =>
      atletasRepository.atualizarExibicao(id, exibeNoSite),
    onSuccess: () => {
      // listagens (todas as variações de filtro) ficam desatualizadas
      void queryClient.invalidateQueries({ queryKey: ['atletas'] })
    },
  })
}
