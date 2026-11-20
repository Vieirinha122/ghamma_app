// Raiz do app: escolhe a tela pela rota.
// Landing é pública; /admin/* exige sessão (portão do AuthProvider) e
// /admin/login é a exceção que aparece quando não há sessão.
import { useEffect } from 'react'
import { LandingPage } from './modules/landing/pages/LandingPage'
import { AdminPanel } from './modules/atletas/pages/AdminPanel'
import { FichaAtleta } from './modules/atletas/pages/FichaAtleta'
import { LoginPage } from './modules/auth/pages/LoginPage'
import { AuthProvider } from './modules/auth/context/AuthProvider'
import { useAuth } from './modules/auth/hooks/useAuth'
import { Spinner } from './components/ui/spinner'

function App() {
  const caminho = window.location.pathname

  if (caminho.startsWith('/admin/login')) {
    return (
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    )
  }

  if (caminho === '/admin' || caminho.startsWith('/admin/')) {
    return (
      <AuthProvider>
        <PainelProtegido>
          {/* listagem em /admin; ficha em /admin/atletas/:id */}
          <RoteadorPainel />
        </PainelProtegido>
      </AuthProvider>
    )
  }

  return <LandingPage />
}

function RoteadorPainel() {
  const caminho = window.location.pathname
  const partida = caminho.match(/^\/admin\/atletas\/([^/]+)/)
  return partida ? <FichaAtleta /> : <AdminPanel />
}

// Portão de autenticação: enquanto a sessão é verificada, não renderiza nada
// sensível; sem sessão, vai para o login (recarga completa para limpar estado).
function PainelProtegido({ children }: { children: React.ReactNode }) {
  const { status } = useAuth()

  useEffect(() => {
    if (status === 'nao-autenticado') {
      window.location.replace('/admin/login')
    }
  }, [status])

  if (status !== 'autenticado') {
    return <SplashCarregando />
  }

  return <>{children}</>
}

// Splash de espera em brand-ink: mesma cara do login, spinner nas cores do clube
function SplashCarregando() {
  return (
    <div className="grid min-h-svh place-items-center bg-brand-ink">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-10 w-10 border-brand-soft/25 border-t-accent" />
        <p className="text-sm text-brand-soft">Carregando</p>
      </div>
    </div>
  )
}

export default App
