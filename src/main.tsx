import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

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
