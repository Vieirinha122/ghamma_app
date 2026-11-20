// Adaptação HTTP do módulo atletas: valida query/params/body com Zod
// e delega as regras ao service.
import type { Request, Response } from 'express'
import { z } from 'zod'
import { ApiErro } from '../../errors/api-error'
import {
  schemaConsultaAtletas,
  schemaExibicaoAtleta,
  schemaNascimentoAtleta,
} from '../../../contracts/schemas/atletas'
import * as atletasService from './service'

function parseConsulta(req: Request) {
  const resultado = schemaConsultaAtletas.safeParse(req.query)

  if (!resultado.success) {
    throw ApiErro.validacao(resultado.error)
  }

  // filtra valores vazios: ?q= e ?posicao= não vira filtro
  return {
    q: resultado.data.q || undefined,
    posicao: resultado.data.posicao || undefined,
    categoria: resultado.data.categoria || undefined,
  }
}

// GET /atletas (protegido) → listagem administrativa com filtros
export async function listar(req: Request, res: Response) {
  const consulta = parseConsulta(req)
  res.json({ atletas: await atletasService.listarAtletas(consulta) })
}

// GET /site/atletas (público) → seção de atletas na landing
export async function listarPublicos(req: Request, res: Response) {
  const consulta = parseConsulta(req)
  res.json({ atletas: await atletasService.listarAtletasPublicos(consulta) })
}

// GET /atletas/:id (protegido) → ficha completa
export async function detalhar(req: Request, res: Response) {
  const resultado = z.uuid().safeParse(req.params.id)

  if (!resultado.success) {
    throw new ApiErro(400, 'Id de atleta inválido')
  }

  res.json({ atleta: await atletasService.buscarAtletaDetalhe(resultado.data) })
}

// PATCH /atletas/:id/exibicao (protegido) → curadoria da seção do site
export async function atualizarExibicao(req: Request, res: Response) {
  const id = z.uuid().safeParse(req.params.id)

  if (!id.success) {
    throw new ApiErro(400, 'Id de atleta inválido')
  }

  const corpo = schemaExibicaoAtleta.safeParse(req.body)

  if (!corpo.success) {
    throw ApiErro.validacao(corpo.error)
  }

  res.json({
    atleta: await atletasService.atualizarExibicao(id.data, corpo.data.exibeNoSite),
  })
}

// PATCH /atletas/:id/nascimento (protegido) → data que alimenta a idade exata
export async function atualizarNascimento(req: Request, res: Response) {
  const id = z.uuid().safeParse(req.params.id)

  if (!id.success) {
    throw new ApiErro(400, 'Id de atleta inválido')
  }

  const corpo = schemaNascimentoAtleta.safeParse(req.body)

  if (!corpo.success) {
    throw ApiErro.validacao(corpo.error)
  }

  res.json({
    atleta: await atletasService.atualizarNascimento(id.data, corpo.data.dataNascimento),
  })
}
