// Página de atletas (rota /atletas): elenco completo com busca e filtro de
// posição. A landing mostra só uma amostra e manda para cá.
import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDebounce } from '@/hooks/useDebounce'
import { athleteFields } from '@/modules/ficha/data/formSchema'
import { CabecalhoPublico } from '../components/CabecalhoPublico'
import { useAtletasPublicos } from '../hooks/useAtletasPublicos'

const opcoesPosicao =
  athleteFields.find((campo) => campo.key === 'position')?.options ?? []

export function AtletasPage() {
  const [buscaInput, setBuscaInput] = useState('')
  const [posicao, setPosicao] = useState('')

  const busca = useDebounce(buscaInput, 300)
  const consulta = useMemo(
    () => ({ q: busca || undefined, posicao: posicao || undefined }),
    [busca, posicao],
  )

  const lista = useAtletasPublicos(consulta)
  const atletas = lista.data?.atletas ?? []

  return (
    <div className="min-h-svh bg-white pb-24 pt-20 text-brand-ink">
      <CabecalhoPublico />

      <section className="pt-16">
        <div className="mx-auto w-[min(calc(100%-40px),1180px)]">
          <span className="mb-3 block h-1.5 w-12 -skew-x-[18deg] rounded-sm bg-lp-magenta" aria-hidden="true" />
          <h1 className="font-display text-[clamp(2.6rem,5vw,4rem)] font-black uppercase leading-[0.95] tracking-[-0.02em]">
            Atletas do Ghamma.
          </h1>
          <p className="mt-4 max-w-[66ch] text-[1.04rem] leading-relaxed text-[#6a6074]">
            Quem treina, compete e veste a camisa toda semana.
          </p>

          <div className="mt-10 flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
            <Input
              type="search"
              placeholder="Buscar atleta"
              value={buscaInput}
              onChange={(evento) => setBuscaInput(evento.target.value)}
              className="w-full bg-muted sm:max-w-64"
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

          {lista.isError ? (
            <p className="mt-10 text-sm text-[#6a6074]">
              Não foi possível carregar os atletas agora. Tente de novo em instantes.
            </p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {lista.isPending ? (
                Array.from({ length: 8 }).map((_, indice) => (
                  <div key={indice} className="h-28 animate-pulse rounded-[18px] border bg-[#f4f1f7]" />
                ))
              ) : atletas.length ? (
                atletas.map((atleta) => (
                  <article
                    key={atleta.id}
                    className="rounded-[18px] border border-[#ded6e5] bg-lp-paper p-5 shadow-sm transition-all hover:-translate-y-px hover:border-primary/50 hover:shadow-md"
                  >
                    <strong className="block text-xl font-extrabold tracking-tight">{atleta.nomeResumido}</strong>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-1 text-xs font-extrabold text-primary">
                        {atleta.idade ? `${atleta.idade} anos` : 'Idade não informada'}
                      </span>
                      <span className="inline-flex rounded-full border border-[#ded6e5] bg-white px-2.5 py-1 text-xs font-bold text-[#6a6074]">
                        {atleta.posicao || 'Posição livre'}
                      </span>
                    </div>
                  </article>
                ))
              ) : (
                <p className="col-span-full rounded-[18px] border bg-lp-paper p-6 text-center text-sm text-[#6a6074]">
                  Nenhum atleta com esse filtro. Ajuste a busca ou a posição.
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
