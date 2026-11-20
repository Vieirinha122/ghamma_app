// Raiz do app: escolhe a tela pela rota.
// Landing é pública; /admin/* exige sessão (portão do AuthProvider) e
// /admin/login é a exceção que aparece quando não há sessão.
import { useEffect } from 'react'
import { LandingPage } from './modules/landing/pages/LandingPage'
import { AdminPanel } from './modules/atletas/pages/AdminPanel'
import { LoginPage } from './modules/auth/pages/LoginPage'
import { AuthProvider } from './modules/auth/context/AuthProvider'
import { useAuth } from './modules/auth/hooks/useAuth'

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
        <PainelProtegido />
      </AuthProvider>
    )
  }

  return <LandingPage />
}

// Portão de autenticação: enquanto a sessão é verificada, não renderiza nada
// sensível; sem sessão, vai para o login (recarga completa para limpar estado).
function PainelProtegido() {
  const { status } = useAuth()

  useEffect(() => {
    if (status === 'nao-autenticado') {
      window.location.replace('/admin/login')
    }
  }, [status])

  if (status !== 'autenticado') {
    return (
      <div className="app-shell">
        <p className="storage-note">{status === 'verificando' ? 'Verificando sessão…' : 'Redirecionando para o login…'}</p>
      </div>
    )
  }

  return <AdminPanel />
}

export default App
