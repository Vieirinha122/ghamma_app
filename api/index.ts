// Entrypoint do backend.
// - Na Vercel: o export default vira a serverless function que atende /api/*.
// - Local: o bloco de baixo sobe um servidor na porta 3001 (só fora de produção),
//   usado pelo proxy do Vite durante o desenvolvimento.
import 'dotenv/config'
import { criarApp } from '../src/server/app'
import { env } from '../src/server/env'

const app = criarApp()

export default app

if (env.NODE_ENV !== 'production') {
  const PORTA_API = 3001
  app.listen(PORTA_API, () => {
    console.log(`[api] rodando em http://localhost:${PORTA_API} (modo ${env.NODE_ENV})`)
  })
}
