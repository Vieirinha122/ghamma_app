// Ficha completa do atleta (rota /admin/atletas/:id) — leitura, dados da API.
// Renderização guiada pelo formSchema: mesmas seções e labels da anamnese.
// UI em Tailwind + shadcn com a paleta do projeto.
import { useState } from 'react'
import { athleteFields, athleteSections } from '@/modules/ficha/data/formSchema'
import { useAtleta } from '../hooks/useAtleta'
import { useAtualizarNascimento } from '../hooks/useAtualizarNascimento'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

// extrai o id do caminho: /admin/atletas/<id>
function idDoCaminho() {
  const partida = window.location.pathname.match(/^\/admin\/atletas\/([^/]+)/)
  return partida?.[1] ?? null
}

// Editor do nascimento: componente separado para os hooks ficarem fora dos
// retornos antecipados da página (regra dos hooks).
function EditorNascimento({ id, dataSalva }: { id: string; dataSalva: string | null }) {
  const [valorDigitado, setValorDigitado] = useState<string | null>(null)
  const nascimento = useAtualizarNascimento()

  const dataAtual = dataSalva?.slice(0, 10) ?? ''
  const alterado = valorDigitado !== null && valorDigitado !== dataAtual

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        Nascimento
      </span>
      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={valorDigitado ?? dataAtual}
          onChange={(evento) => setValorDigitado(evento.target.value)}
          className="h-8 w-36 rounded-lg bg-muted text-xs"
        />
        {alterado ? (
          <button
            type="button"
            disabled={nascimento.isPending}
            onClick={() =>
              nascimento.mutate(
                { id, dataNascimento: valorDigitado || null },
                { onSuccess: () => setValorDigitado(null) },
              )
            }
            className="cursor-pointer rounded-lg bg-primary px-2.5 py-1.5 text-xs font-bold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {nascimento.isPending ? 'Salvando…' : 'Salvar'}
          </button>
        ) : null}
      </div>
      <small className="text-[0.7rem] text-muted-foreground">
        {dataAtual ? 'A idade se atualiza sozinha' : 'Sem data: usa a idade reportada na ficha'}
      </small>
    </div>
  )
}

export function FichaAtleta() {
  const id = idDoCaminho()
  const ficha = useAtleta(id)

  if (ficha.isPending) {
    return (
      <div className="grid min-h-svh place-items-center bg-brand-ink">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-10 w-10 border-brand-soft/25 border-t-accent" />
          <p className="text-sm text-brand-soft">Carregando ficha…</p>
        </div>
      </div>
    )
  }

  if (ficha.isError || !ficha.data) {
    return (
      <div className="mx-auto w-full max-w-[1600px] space-y-4 p-4 md:p-8">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-red-700">
          {ficha.error instanceof Error ? ficha.error.message : 'Atleta não encontrado.'}
        </div>
        <a href="/admin" className="inline-block rounded-xl border px-4 py-3 font-bold hover:bg-muted">
          Voltar à listagem
        </a>
      </div>
    )
  }

  const atleta = ficha.data.atleta
  const valores = atleta.respostas ?? {}

  // valor exibido de um campo: vazio vira traço (o seed gravou o texto original do form)
  function valorExibido(chave: string) {
    const valor = valores[chave] ?? ''
    return valor.trim() || '—'
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] p-4 md:p-8">
      <header className="mb-4 grid grid-cols-1 items-center gap-3 rounded-[18px] bg-brand-ink p-4 text-white md:min-h-[88px] md:grid-cols-[auto_1fr_auto] md:gap-8 md:px-[18px] md:py-2.5">
        <a className="flex items-center gap-3 no-underline" href="/admin" aria-label="Ghamma Volley — painel">
          <img src="/ghamma-logo.png" alt="Ghamma Vôlei" className="h-16 w-18 object-contain" />
          <span className="flex flex-col">
            <strong className="font-display text-[1.35rem] leading-none">Ghamma Volley</strong>
            <small className="text-xs text-brand-soft">Ficha de anamnese</small>
          </span>
        </a>
        <nav className="flex items-center gap-1.5" aria-label="Navegação do painel">
          <a
            href="/admin"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold text-white transition-colors hover:bg-purple-500/20"
          >
            Jogadores
          </a>
        </nav>
        <div className="flex items-center gap-3 md:justify-self-end">
          <a className="text-xs font-bold text-accent underline-offset-4 hover:underline" href="/admin">
            Voltar à listagem
          </a>
        </div>
      </header>

      <section className="mt-5 rounded-[18px] border bg-card p-5 shadow-sm md:p-7">
        <h1 className="font-display text-[clamp(2rem,3.5vw,3.4rem)] leading-[1.05] tracking-[-0.02em]">{atleta.nomeCompleto}</h1>
        <p className="mt-3 text-muted-foreground">
          {atleta.categoriaAtual || 'Sem categoria'} · {atleta.posicao || 'Sem posição'} ·{' '}
          {atleta.equipeAtual || 'Sem equipe'}
          {atleta.temDorAtual === true ? ' · Relata dor atual' : ''}
        </p>
      </section>

      <section className="mt-2 grid grid-cols-2 gap-3.5 rounded-[22px] border bg-card p-5 shadow-sm md:grid-cols-4 xl:grid-cols-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Idade</span>
          <strong className="block font-display text-2xl">{atleta.idade ? `${atleta.idade} anos` : 'Não informada'}</strong>
        </div>
        {/* editor do nascimento: com a data, a idade se atualiza sozinha todo ano */}
        <EditorNascimento id={atleta.id} dataSalva={atleta.dataNascimento} />
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Equipe</span>
          <strong className="block">{atleta.equipeAtual || 'Não informada'}</strong>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Posição</span>
          <strong className="block">{atleta.posicao || 'Não informada'}</strong>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Telefone</span>
          <strong className="block">{atleta.telefone || 'Não informado'}</strong>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">No site</span>
          <strong className="block">{atleta.exibeNoSite ? 'Sim' : 'Não'}</strong>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Resposta recebida
          </span>
          <strong className="block">
            {atleta.respostaRecebidaEm
              ? new Date(atleta.respostaRecebidaEm).toLocaleDateString('pt-BR')
              : '—'}
          </strong>
        </div>
      </section>

      <div className="mt-4 flex flex-col gap-4">
        {athleteSections.map((secao) => {
          const campos = athleteFields.filter((campo) => campo.section === secao.key)
          return (
            <article className="rounded-[22px] border bg-card p-5 shadow-sm" key={secao.key}>
              <header className="mb-4">
                <h3 className="font-bold">{secao.title}</h3>
                <p className="text-sm text-muted-foreground">{secao.description}</p>
              </header>
              <div className="grid gap-2.5 md:grid-cols-2">
                {campos.map((campo) => (
                  <div
                    key={campo.key}
                    className="flex min-h-[92px] flex-col gap-2 rounded-2xl border bg-[#faf8fb] p-3.5"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {campo.label}
                    </span>
                    <strong className="whitespace-pre-wrap font-semibold">{valorExibido(campo.key)}</strong>
                  </div>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

