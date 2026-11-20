// Raiz do app: escolhe a tela pela rota.
// Landing é pública; /admin/* exige sessão (portão do AuthProvider) e
// /admin/login é a exceção que aparece quando não há sessão.
import { lazy, Suspense, useEffect } from 'react'
import { LandingPage } from './modules/landing/pages/LandingPage'
import { AuthProvider } from './modules/auth/context/AuthProvider'
import { useAuth } from './modules/auth/hooks/useAuth'
import { Spinner } from './components/ui/spinner'

const AdminPanel = lazy(() => import('./modules/atletas/pages/AdminPanel').then((modulo) => ({ default: modulo.AdminPanel })))
const FichaAtleta = lazy(() => import('./modules/atletas/pages/FichaAtleta').then((modulo) => ({ default: modulo.FichaAtleta })))
const LoginPage = lazy(() => import('./modules/auth/pages/LoginPage').then((modulo) => ({ default: modulo.LoginPage })))
const GaleriaPage = lazy(() => import('./modules/landing/pages/GaleriaPage').then((modulo) => ({ default: modulo.GaleriaPage })))
const AtletasPage = lazy(() => import('./modules/landing/pages/AtletasPage').then((modulo) => ({ default: modulo.AtletasPage })))

function App() {
  return (
    <Suspense fallback={<SplashCarregando />}>
      <RoteadorPrincipal />
    </Suspense>
  )
}

function RoteadorPrincipal() {
  const caminho = window.location.pathname

  if (caminho === '/galeria') {
    return <GaleriaPage />
  }

  if (caminho === '/atletas') {
    return <AtletasPage />
  }

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
