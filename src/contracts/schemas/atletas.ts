// Contratos do módulo atletas: filtros de listagem e payload de curadoria
// do site, compartilhados entre backend e frontend.
import { z } from 'zod'

// Filtros da listagem (admin) e da seção pública: busca livre + posição.
// Posição fica solta em string (não enum) para não quebrar se surgir
// uma posição nova no formulário — o filtro só não encontra nada.
export const schemaConsultaAtletas = z.object({
  q: z.string().trim().max(80, 'Busca com no máximo 80 caracteres').optional(),
  posicao: z.string().trim().max(40).optional(),
})

export type ConsultaAtletas = z.infer<typeof schemaConsultaAtletas>

// Body do PATCH de curadoria: marcar/desmarcar exibição no site
export const schemaExibicaoAtleta = z.object({
  exibeNoSite: z.boolean(),
})

export type ExibicaoAtleta = z.infer<typeof schemaExibicaoAtleta>

// Linha da listagem administrativa (enxuta, sem respostas da ficha)
export interface AtletaListagem {
  id: string
  nomeCompleto: string
  idade: number | null
  sexo: string | null
  categoriaAtual: string | null
  posicao: string | null
  equipeAtual: string | null
  telefone: string | null
  temDorAtual: boolean | null
  exibeNoSite: boolean
  respostaRecebidaEm: string | null
}

// Item público do site: APENAS info esportiva básica, nunca dado clínico
// ou contato. Se um dia precisar de mais um campo público, adicione aqui
// e na seleção do repositório conscientemente.
export interface AtletaPublico {
  id: string
  nomeCompleto: string
  idade: number | null
  posicao: string | null
}

// Resposta do detalhe (ficha completa)
export interface AtletaDetalhe extends AtletaListagem {
  respostas: Record<string, string>
}
