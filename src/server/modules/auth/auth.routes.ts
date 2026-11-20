// Rotas do módulo auth. O rate limit fica SÓ no login: endpoint público de
// escrita que expõe credenciais — alvo de brute force.
import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import * as authController from './auth.controller'

export const authRouter = Router()

// 5 tentativas por IP a cada 15 minutos; sem headers legados no response
const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas de login. Tente novamente mais tarde.' },
})

authRouter.post('/auth/login', limiteLogin, authController.login)
authRouter.post('/auth/refresh', authController.refresh)
authRouter.post('/auth/logout', authController.logout)
