// Seção "Atletas do Ghamma" na landing: cards públicos (nome, idade, posição)
// com filtro de posição e busca — dados do endpoint público.
// Se a base pública estiver vazia, a seção nem aparece (landing não mostra
// vitrine vazia).
import { useMemo, useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { athleteFields } from '@/modules/ficha/data/formSchema'
import { useAtletasPublicos, useBasePublica } from '../hooks/useAtletasPublicos'

const opcoesPosicao =
  athleteFields.find((campo) => campo.key === 'position')?.options ?? []

export function SecaoAtletas() {
  const [buscaInput, setBuscaInput] = useState('')
  const [posicao, setPosicao] = useState('')

  const busca = useDebounce(buscaInput, 300)
  const consulta = useMemo(
    () => ({ q: busca || undefined, posicao: posicao || undefined }),
    [busca, posicao],
  )

  const base = useBasePublica()
  const lista = useAtletasPublicos(consulta)

  // sem atletas marcados: seção some da landing (sem vitrine vazia)
  const basePublica = base.data?.atletas ?? []
  if (base.isPending || basePublica.length === 0) {
    return null
  }

  const atletas = lista.data?.atletas ?? []

  return (
    <section id="atletas" className="py-[clamp(76px,10vw,128px)]">
      <div className="mx-auto w-[min(calc(100%-40px),1180px)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="m-0 max-w-[720px] font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.92] font-black tracking-[-0.03em] text-balance">
              Atletas do Ghamma.
            </h2>
            <p className="mt-6 max-w-[66ch] text-[1.04rem] text-[#6a6074]">
              Quem representa o CTGV em quadra, nas posições e categorias que fazem o time.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:items-center">
            <Input
              type="search"
              placeholder="Buscar atleta"
              value={buscaInput}
              onChange={(evento) => setBuscaInput(evento.target.value)}
              className="w-full bg-muted sm:w-56"
            />
            <Select
              value={posicao}
              onValueChange={(valor) => setPosicao(valor && valor !== 'todas' ? valor : '')}
            >
              <SelectTrigger className="w-full bg-muted sm:w-44">
                <SelectValue placeholder="Todas as posições" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as posições</SelectItem>
                {opcoesPosicao.map((opcao) => (
                  <SelectItem key={opcao} value={opcao}>
                    {opcao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {lista.isError ? (
          <p className="mt-8 text-sm text-[#6a6074]">
            Não foi possível carregar os atletas agora. Tente de novo em instantes.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lista.isPending ? (
              Array.from({ length: 6 }).map((_, indice) => (
                <div key={indice} className="h-32 animate-pulse rounded-[18px] border bg-[#efe9f4]" />
              ))
            ) : atletas.length ? (
              atletas.map((atleta) => (
                <article
                  key={atleta.id}
                  className="rounded-[18px] border bg-card p-5 shadow-sm transition-transform hover:-translate-y-px"
                >
                  <strong className="block text-xl font-extrabold tracking-tight">{atleta.nomeResumido}</strong>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-xs font-extrabold text-secondary-foreground">
                      {atleta.idade ? `${atleta.idade} anos` : 'Idade não informada'}
                    </span>
                    <span className="inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
                      {atleta.posicao || 'Posição livre'}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <p className="col-span-full rounded-[18px] border bg-card p-6 text-center text-sm text-muted-foreground">
                Nenhum atleta com esse filtro. Ajuste a busca ou a posição.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
