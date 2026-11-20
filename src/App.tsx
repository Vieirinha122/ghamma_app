// Raiz do app: escolhe a tela pela rota. Landing é pública; /admin é o painel de gestão.
import { LandingPage } from './modules/landing/pages/LandingPage'
import { AdminPanel } from './modules/atletas/pages/AdminPanel'

function App() {
  const isAdminRoute = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')
  return isAdminRoute ? <AdminPanel /> : <LandingPage />
}

export default App
