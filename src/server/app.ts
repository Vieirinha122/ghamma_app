// Aplicação Express da API: middlewares de segurança + rotas.
// O roteador é montado em /api (produção/Vite proxy) e na raiz (fallback local),
// cobrindo os dois comportamentos de URL que o serverless da Vercel pode entregar.
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import { env } from './env'
import { healthRouter } from './modules/health/health.routes'

// CORS com whitelist explícita: só o front conhecido pode chamar (nunca '*').
const allowedOrigins = [env.FRONTEND_URL]

export function criarApp() {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  )

  // Log estruturado das requests. Em rota de auth/logins os dados sensíveis
  // nunca passam por query/URL, então o log padrão do morgan é seguro por design.
  app.use(morgan('tiny'))

  // Router principal (novos grupos entram aqui: /auth, /atletas...)
  app.use('/api', healthRouter)
  app.use('/', healthRouter)

  // 404 padronizado para tudo que não casou
  app.use((_req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada' })
  })

  // Tratamento de erro central: responde sempre em JSON, sem vazar stack em produção
  app.use((erro: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[api] erro não tratado:', erro.message)
    res.status(500).json({ erro: 'Erro interno no servidor' })
  })

  return app
}
