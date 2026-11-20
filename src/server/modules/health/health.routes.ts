// Rota de health: sonda simples para conferir que a API subiu.
// Quando o schema tiver modelos, aqui também vale checar a conexão com o banco.
import { Router } from 'express'

export const healthRouter = Router()

// GET /health → status da API (sem dados sensíveis)
healthRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', servico: 'ghamma-api' })
})
