// Regras de negócio do módulo atletas: validação de existência e formatos
// de saída (datas em ISO para o JSON).
import { ApiErro } from '../../errors/api-error'
import type {
  AtletaDetalhe,
  AtletaListagem,
  AtletaPublico,
  ConsultaAtletas,
} from '../../../contracts/schemas/atletas'
import * as atletasRepository from './repository'

interface AtletaDoBanco {
  id: string
  nomeCompleto: string
  idade: number | null
  sexo: string | null
  categoriaAtual: string | null
  posicao: string | null
  equipeAtual: string | null
  telefone: string | null
  temDorAtual: boolean | null
  exibeNoSite?: boolean
  respostaRecebidaEm?: Date | null
  respostas?: unknown
}

function paraListagem(atleta: AtletaDoBanco): AtletaListagem {
  return {
    id: atleta.id,
    nomeCompleto: atleta.nomeCompleto,
    idade: atleta.idade,
    sexo: atleta.sexo,
    categoriaAtual: atleta.categoriaAtual,
    posicao: atleta.posicao,
    equipeAtual: atleta.equipeAtual,
    telefone: atleta.telefone,
    temDorAtual: atleta.temDorAtual,
    exibeNoSite: atleta.exibeNoSite ?? false,
    respostaRecebidaEm: atleta.respostaRecebidaEm?.toISOString() ?? null,
  }
}

export async function listarAtletas(consulta: ConsultaAtletas): Promise<AtletaListagem[]> {
  const atletas = await atletasRepository.listarAtletas(consulta)
  return atletas.map(paraListagem)
}

export async function listarAtletasPublicos(consulta: ConsultaAtletas): Promise<AtletaPublico[]> {
  const atletas = await atletasRepository.listarAtletasPublicos(consulta)
  return atletas.map((atleta) => ({
    id: atleta.id,
    nomeCompleto: atleta.nomeCompleto,
    idade: atleta.idade,
    posicao: atleta.posicao,
  }))
}

export async function buscarAtletaDetalhe(id: string): Promise<AtletaDetalhe> {
  const atleta = await atletasRepository.buscarAtletaPorId(id)

  if (!atleta) {
    throw new ApiErro(404, 'Atleta não encontrado')
  }

  return {
    ...paraListagem(atleta),
    respostas: (atleta.respostas ?? {}) as Record<string, string>,
  }
}

export async function atualizarExibicao(id: string, exibeNoSite: boolean): Promise<AtletaListagem> {
  const existente = await atletasRepository.buscarAtletaPorId(id)

  if (!existente) {
    throw new ApiErro(404, 'Atleta não encontrado')
  }

  const atualizado = await atletasRepository.atualizarExibicao(id, exibeNoSite)
  return paraListagem(atualizado)
}
