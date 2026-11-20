import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

function configurarPwaAdministrativo() {
  if (!window.location.pathname.startsWith('/admin')) return

  document.title = 'Ghamma Admin'

  const manifest = document.createElement('link')
  manifest.rel = 'manifest'
  manifest.href = '/admin.webmanifest'
  document.head.append(manifest)

  const iconeApple = document.createElement('link')
  iconeApple.rel = 'apple-touch-icon'
  iconeApple.href = '/admin-icon-192.png'
  document.head.append(iconeApple)

  const modoAplicativo = document.createElement('meta')
  modoAplicativo.name = 'apple-mobile-web-app-capable'
  modoAplicativo.content = 'yes'
  document.head.append(modoAplicativo)

  if ('serviceWorker' in navigator) {
    window.addEventListener(
      'load',
      () => {
        void navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin/' }).catch(() => undefined)
      },
      { once: true },
    )
  }
}

configurarPwaAdministrativo()

// Cache/sincronização de dados remotos (convenção da stack). Etapa 6 passa a
// consumir a API de atletas por aqui; por ora o provider já entra no ar.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 401 é tratado pelo wrapper de sessão (renovação + retry), não por retry cego
      retry: false,
      staleTime: 30_000,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
