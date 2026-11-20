// Tela de login do painel (/admin/login). Form com RHF + Zod reaproveitando
// o MESMO schema validado no backend (src/contracts/schemas/auth).
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import { schemaLogin, type CredenciaisLogin } from '../../../contracts/schemas/auth'
import './login.css'

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
      <div className="login-page">
        <p className="login-footer">Carregando…</p>
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
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit(submeter)}>
        <div className="login-brand">
          <img src="/ghamma-logo.png" alt="Ghamma Vôlei" />
          <div>
            <strong>Ghamma Volley</strong>
            <small>Painel de gestão de jogadores</small>
          </div>
        </div>

        <div className="login-fields">
          <label className="login-field">
            <span>E-mail</span>
            <input
              type="email"
              autoComplete="email"
              placeholder="voce@email.com"
              aria-invalid={Boolean(errors.email)}
              {...register('email')}
            />
            {errors.email ? <p className="login-error">{errors.email.message}</p> : null}
          </label>

          <label className="login-field">
            <span>Senha</span>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Sua senha"
              aria-invalid={Boolean(errors.senha)}
              {...register('senha')}
            />
            {errors.senha ? <p className="login-error">{errors.senha.message}</p> : null}
          </label>
        </div>

        {errors.root ? <p className="login-error">{errors.root.message}</p> : null}

        <button className="login-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando…' : 'Entrar no painel'}
        </button>

        <p className="login-footer">Dados clínicos dos atletas — acesso restrito à comissão técnica.</p>
      </form>
    </div>
  )
}
