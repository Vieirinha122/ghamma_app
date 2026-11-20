// Painel de gestão (rota /admin): listagem de atletas vindos da API.
// A ficha completa mora em página separada (/admin/atletas/:id).
// UI em Tailwind + shadcn/ui com a paleta do projeto (ver index.css).
import { useMemo, useState } from 'react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useDebounce } from '@/hooks/useDebounce'
import { athleteFields } from '@/modules/ficha/data/formSchema'
import { useAtletas, useAtletasTotais } from '../hooks/useAtletas'
import { useAtualizarExibicao } from '../hooks/useAtualizarExibicao'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// opções de posição e categoria vêm do próprio domínio da ficha (fonte única)
const campoPosicao = athleteFields.find((campo) => campo.key === 'position')
const opcoesPosicao = campoPosicao?.options ?? []
const opcoesCategoria =
  athleteFields.find((campo) => campo.key === 'currentCategory')?.options ?? []

// plural por posição: as opções vêm como "Levantador(a)", então o rótulo
// do contador precisa de grafia humana ("12 levantadores", "9 centrais")
const pluralPosicoes: Record<string, string> = {
  'Levantador(a)': 'levantadores',
  'Ponteiro(a)': 'ponteiros',
  Central: 'centrais',
  Líbero: 'líberos',
  Oposto: 'opostos',
}

export function AdminPanel() {
  const { sair, usuario } = useAuth()
  const [buscaInput, setBuscaInput] = useState('')
  const [posicao, setPosicao] = useState('')
  const [categoria, setCategoria] = useState('')

  // busca só dispara a requisição depois de 300ms sem digitar
  const busca = useDebounce(buscaInput, 300)
  const consulta = useMemo(
    () => ({ q: busca || undefined, posicao: posicao || undefined, categoria: categoria || undefined }),
    [busca, posicao, categoria],
  )

  const lista = useAtletas(consulta)
  const totais = useAtletasTotais()
  const curadoria = useAtualizarExibicao()

  const atletas = lista.data?.atletas ?? []
  const todos = totais.data?.atletas ?? []

  // indicadores vêm da base completa, não da busca filtrada
  const totalAtletas = todos.length
  const totalComDor = todos.filter((atleta) => atleta.temDorAtual === true).length
  const totalCategorias = new Set(
    todos.map((atleta) => atleta.categoriaAtual).filter(Boolean),
  ).size

  const alternarExibicao = (id: string, exibeNoSite: boolean) => {
    curadoria.mutate({ id, exibeNoSite })
  }

  // contador do header: sempre o resultado DA BUSCA atual (não da base toda)
  const totalResultado = lista.data?.atletas.length ?? 0
  const rotuloContagem = lista.isPending
    ? 'Contando…'
    : `${
        posicao
          ? `${totalResultado} ${pluralPosicoes[posicao] ?? posicao.toLocaleLowerCase('pt-BR')}`
          : `${totalResultado} ${totalResultado === 1 ? 'atleta' : 'atletas'}`
      }${categoria ? ` · ${categoria}` : ''}`

  return (
    <div className="mx-auto w-full max-w-[1600px] p-4 md:p-8">
      {/* topbar em brand-ink: identidade do painel */}
      <header className="mb-4 grid grid-cols-1 items-center gap-3 rounded-[18px] bg-brand-ink p-4 text-white md:min-h-[88px] md:grid-cols-[auto_1fr_auto] md:gap-8 md:px-[18px] md:py-2.5">
        <a className="flex items-center gap-3 no-underline" href="/admin" aria-label="Ghamma Volley — painel">
          <img src="/ghamma-logo.png" alt="Ghamma Vôlei" className="h-16 w-18 object-contain" />
          <span className="flex flex-col">
            <strong className="font-display text-[1.35rem] leading-none">Ghamma Volley</strong>
            <small className="text-xs text-brand-soft">Gestão de jogadores</small>
          </span>
        </a>
        <nav className="flex items-center gap-1.5 overflow-x-auto" aria-label="Navegação do painel">
          <a
            href="/admin"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold text-white transition-colors hover:bg-purple-500/20"
          >
            Jogadores
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-accent px-1.5 text-xs text-brand-ink">
              {totalAtletas}
            </span>
          </a>
        </nav>
        <div className="flex flex-wrap items-center gap-3 md:justify-self-end">
          <p className="m-0 hidden truncate text-xs text-brand-soft sm:block">{usuario?.email ?? 'Conectado ao banco'}</p>
          <a className="text-xs font-bold text-accent underline-offset-4 hover:underline" href="/">
            Ver landing page
          </a>
          <button
            type="button"
            onClick={sair}
            className="cursor-pointer rounded-md border border-white/25 px-3 py-2 text-xs font-bold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            Sair
          </button>
        </div>
      </header>

      <section className="mt-5 flex flex-col gap-6 rounded-[18px] border bg-card p-5 shadow-sm md:flex-row md:items-start md:justify-between md:p-7">
        <div>
          <h1 className="font-display text-[clamp(2rem,3.5vw,3.4rem)] leading-[1.05] tracking-[-0.02em]">Jogadores e anamnese</h1>
          <p className="mt-4 max-w-[800px] text-muted-foreground">
            Consulte a base de atletas do CTGV, marque quem aparece no site e abra a ficha
            completa de cada jogador.
          </p>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-[20px] border border-primary/25 bg-secondary p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Total de atletas
          </span>
          <strong className="mt-2.5 block font-display text-3xl font-extrabold">{totalAtletas}</strong>
          <p className="text-sm text-muted-foreground">Base do banco, entre todas as fichas importadas.</p>
        </article>
        <article className="rounded-[20px] border bg-card p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Com dor atual
          </span>
          <strong className="mt-2.5 block font-display text-3xl font-extrabold">{totalComDor}</strong>
          <p className="text-sm text-muted-foreground">Ajuda a priorizar avaliações e acompanhamentos.</p>
        </article>
        <article className="rounded-[20px] border bg-card p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Categorias ativas
          </span>
          <strong className="mt-2.5 block font-display text-3xl font-extrabold">{totalCategorias}</strong>
          <p className="text-sm text-muted-foreground">Resumo rápido das turmas já registradas.</p>
        </article>
      </section>

      {lista.isError ? (
        <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-red-700">
          {lista.error instanceof Error ? lista.error.message : 'Falha ao carregar atletas.'}
        </div>
      ) : null}

      <main className="mt-5 rounded-3xl border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Cadastros</p>
            <h2 className="mt-2 text-xl font-bold">Jogadores</h2>
          </div>
          <div className="flex w-full flex-col items-start gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            {/* contador do lado direito, refletindo os filtros aplicados */}
            <span className="order-first text-xs font-semibold text-muted-foreground sm:order-none">
              {rotuloContagem}
            </span>
            <Input
              type="search"
              placeholder="Buscar por nome, categoria ou posição"
              value={buscaInput}
              onChange={(evento) => setBuscaInput(evento.target.value)}
              className="w-full bg-muted sm:max-w-80"
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
            <Select
              value={categoria}
              onValueChange={(valor) => setCategoria(valor && valor !== 'todas' ? valor : '')}
            >
              <SelectTrigger className="w-full bg-muted sm:w-44">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as categorias</SelectItem>
                {opcoesCategoria.map((opcao) => (
                  <SelectItem key={opcao} value={opcao}>
                    {opcao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex max-h-[calc(100vh-280px)] flex-col gap-3 overflow-auto pr-1 max-md:max-h-none">
          {lista.isPending ? (
            <div className="flex items-center justify-center gap-3 rounded-[18px] border bg-card p-8 text-muted-foreground">
              <Spinner />
              <span className="text-sm">Carregando atletas…</span>
            </div>
          ) : atletas.length ? (
            atletas.map((atleta) => (
              <div
                key={atleta.id}
                role="button"
                tabIndex={0}
                className="cursor-pointer rounded-[18px] border bg-card p-4 text-left transition-transform hover:-translate-y-px hover:shadow-sm focus-visible:outline-2 focus-visible:outline-ring"
                onClick={() => window.location.assign(`/admin/atletas/${atleta.id}`)}
                onKeyDown={(evento) => {
                  if (evento.key === 'Enter') {
                    window.location.assign(`/admin/atletas/${atleta.id}`)
                  }
                }}
              >
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <strong className="text-base font-extrabold tracking-tight">{atleta.nomeResumido}</strong>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    {atleta.temDorAtual === true ? (
                      <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800">
                        Dor atual
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Sem dor atual
                      </Badge>
                    )}
                    {/* curadoria: stopPropagation para o clique não abrir a ficha */}
                    <label
                      className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-muted-foreground select-none"
                      onClick={(evento) => evento.stopPropagation()}
                      onKeyDown={(evento) => evento.stopPropagation()}
                    >
                      <Switch
                        checked={atleta.exibeNoSite}
                        disabled={curadoria.isPending}
                        onCheckedChange={(marcado) => alternarExibicao(atleta.id, marcado)}
                      />
                      No site
                    </label>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {atleta.categoriaAtual || 'Sem categoria'} · {atleta.posicao || 'Sem posição'} ·{' '}
                  {atleta.equipeAtual || 'Sem equipe'}
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2.5 text-[0.82rem] text-muted-foreground">
                  <span className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-xs font-extrabold text-secondary-foreground">
                    {atleta.idade ? `${atleta.idade} anos` : 'Idade não informada'}
                  </span>
                  <span>{atleta.telefone || 'Sem telefone'}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[18px] border bg-card p-6 text-center">
              <strong className="block">Nenhum atleta encontrado</strong>
              <p className="mt-1 text-sm text-muted-foreground">Ajuste a busca ou o filtro de posição.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


