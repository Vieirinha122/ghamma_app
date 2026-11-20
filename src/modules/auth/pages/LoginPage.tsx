// Tela de login do painel (/admin/login). Form com RHF + Zod reaproveitando
// o MESMO schema validado no backend (src/contracts/schemas/auth).
// UI em Tailwind + shadcn com os tokens do tema.
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import { schemaLogin, type CredenciaisLogin } from '../../../contracts/schemas/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'

export function LoginPage() {
  const { status, entrar } = useAuth()

  // já logado não vê o formulário: direto pro painel (sem efeito no render)
  useEffect(() => {
    if (status === 'autenticado') {
      window.location.replace('/admin')
    }
  }, [status])

  if (status !== 'nao-autenticado') {
    // verificando a sessão ou redirecionando: sem flash de formulário
    return (
      <div className="grid min-h-svh place-items-center bg-brand-ink">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-10 w-10 border-brand-soft/25 border-t-accent" />
          <p className="text-sm text-brand-soft">Carregando</p>
        </div>
      </div>
    )
  }

  return <FormularioLogin onEntrar={entrar} />
}

function FormularioLogin({ onEntrar }: { onEntrar: (email: string, senha: string) => Promise<void> }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CredenciaisLogin>({
    resolver: zodResolver(schemaLogin),
  })

  async function submeter(credenciais: CredenciaisLogin) {
    try {
      await onEntrar(credenciais.email, credenciais.senha)
    } catch (erro) {
      // credenciais erradas aparecem no campo; erros de rede/429 acima do form
      setError('root', { message: erro instanceof Error ? erro.message : 'Falha no login' })
    }
  }

  return (
    <div
      className="grid min-h-svh place-items-center bg-brand-ink p-6 [background-image:radial-gradient(circle_at_15%_20%,rgba(112,24,184,0.16),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(0,185,194,0.12),transparent_40%)]"
    >
      <form
        className="flex w-[min(420px,100%)] flex-col gap-5 rounded-[22px] border bg-card px-9 pt-10 pb-8 shadow-[0_18px_46px_rgba(45,18,70,0.1)]"
        onSubmit={handleSubmit(submeter)}
      >
        <div className="flex items-center gap-3.5">
          <img src="/ghamma-logo.webp" alt="Ghamma Vôlei" width="1212" height="1073" className="h-[76px] w-[84px] object-contain" />
          <div className="flex flex-col">
            <strong className="font-display text-[1.6rem] leading-[1.05] text-brand-ink">Ghamma Volley</strong>
            <small className="text-[0.78rem] text-muted-foreground">Painel de gestão de jogadores</small>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[0.78rem] font-bold uppercase tracking-[0.04em] text-muted-foreground">
              E-mail
            </Label>
            <Input
              type="email"
              autoComplete="email"
              placeholder="voce@email.com"
              aria-invalid={Boolean(errors.email)}
              className="rounded-xl border-[1.5px] bg-muted"
              {...register('email')}
            />
            {errors.email ? <p className="text-[0.82rem] text-destructive">{errors.email.message}</p> : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[0.78rem] font-bold uppercase tracking-[0.04em] text-muted-foreground">
              Senha
            </Label>
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="Sua senha"
              aria-invalid={Boolean(errors.senha)}
              className="rounded-xl border-[1.5px] bg-muted"
              {...register('senha')}
            />
            {errors.senha ? <p className="text-[0.82rem] text-destructive">{errors.senha.message}</p> : null}
          </div>
        </div>

        {errors.root ? <p className="text-[0.82rem] text-destructive">{errors.root.message}</p> : null}

        <Button type="submit" className="mt-1 h-12 w-full rounded-xl font-extrabold" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando…' : 'Entrar no painel'}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Dados clínicos dos atletas — acesso restrito à comissão técnica.
        </p>
      </form>
    </div>
  )
}
