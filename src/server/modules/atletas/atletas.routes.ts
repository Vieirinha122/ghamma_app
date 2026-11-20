// Rotas do módulo atletas.
// Admin (listagem completa, ficha, curadoria): atrás de requireAuth —
// contém dado pessoal e clínico.
// Público (/site/atletas): seção de atletas na landing, devolvendo
// exclusivamente info esportiva básica (o recorte está no repository).
import { Router } from 'express'
import { requireAuth } from '../../middlewares/requireAuth'
import * as atletasController from './atletas.controller'

// Rotas administrativas: exigem sessão válida
export const atletasRouter = Router()

atletasRouter.get('/atletas', requireAuth, atletasController.listar)
atletasRouter.get('/atletas/:id', requireAuth, atletasController.detalhar)
atletasRouter.patch('/atletas/:id/exibicao', requireAuth, atletasController.atualizarExibicao)
atletasRouter.patch('/atletas/:id/nascimento', requireAuth, atletasController.atualizarNascimento)

// Rota pública da landing: sem auth, com seleção mínima de campos
export const atletasPublicosRouter = Router()

atletasPublicosRouter.get('/site/atletas', atletasController.listarPublicos)
