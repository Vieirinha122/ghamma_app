// Acesso a dados de atletas via Prisma. Nenhuma regra de negócio aqui.
import { prisma } from '../../db'
import type { ConsultaAtletas } from '../../../contracts/schemas/atletas'

// Seleção da listagem admin: colunas-chave, sem as respostas (payload enxuto).
const COLUNAS_LISTAGEM = {
  id: true,
  nomeCompleto: true,
  idade: true,
  sexo: true,
  categoriaAtual: true,
  posicao: true,
  equipeAtual: true,
  telefone: true,
  temDorAtual: true,
  exibeNoSite: true,
  respostaRecebidaEm: true,
} as const

// Seleção do endpoint público: o mínimo que a landing precisa mostrar.
// Qualquer campo novo aqui é decisão consciente de exposição pública.
const COLUNAS_PUBLICAS = {
  id: true,
  nomeCompleto: true,
  idade: true,
  posicao: true,
} as const

function montarOnde(consulta: ConsultaAtletas) {
  const condicoes: object[] = []

  if (consulta.q) {
    // busca livre em nome, categoria e posição (case-insensitive)
    condicoes.push({
      OR: [
        { nomeCompleto: { contains: consulta.q, mode: 'insensitive' } },
        { categoriaAtual: { contains: consulta.q, mode: 'insensitive' } },
        { posicao: { contains: consulta.q, mode: 'insensitive' } },
      ],
    })
  }

  if (consulta.posicao) {
    condicoes.push({ posicao: { equals: consulta.posicao, mode: 'insensitive' } })
  }

  return condicoes.length ? { AND: condicoes } : undefined
}

export function listarAtletas(consulta: ConsultaAtletas) {
  // lista admin: ordenação A-Z no banco, nunca no front
  return prisma.atleta.findMany({
    where: montarOnde(consulta),
    orderBy: { nomeCompleto: 'asc' },
    select: COLUNAS_LISTAGEM,
  })
}

export function listarAtletasPublicos(consulta: ConsultaAtletas) {
  // lista pública: só atletas marcados com exibeNoSite
  return prisma.atleta.findMany({
    where: { AND: [{ exibeNoSite: true }, montarOnde(consulta) ?? {}] },
    orderBy: { nomeCompleto: 'asc' },
    select: COLUNAS_PUBLICAS,
  })
}

export function buscarAtletaPorId(id: string) {
  // busca por id para a ficha completa (inclui respostas)
  return prisma.atleta.findUnique({ where: { id } })
}

export function atualizarExibicao(id: string, exibeNoSite: boolean) {
  // curadoria: marca/desmarca o atleta na seção pública do site
  return prisma.atleta.update({
    where: { id },
    data: { exibeNoSite },
    select: COLUNAS_LISTAGEM,
  })
}
