// Regras de negócio do módulo atletas: validação de existência e formatos
// de saída (datas em ISO para o JSON).
import { ApiErro } from '../../errors/api-error'
import { resumirNome } from '../../utils/nome'
import { idadeParaExibicao } from '../../utils/idade'
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
  dataNascimento?: Date | null
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
    nomeResumido: resumirNome(atleta.nomeCompleto),
    // idade viva: do nascimento quando existir; senão, a reportada
    idade: idadeParaExibicao(atleta.dataNascimento ?? null, atleta.idade),
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
    nomeResumido: resumirNome(atleta.nomeCompleto),
    idade: idadeParaExibicao(atleta.dataNascimento ?? null, atleta.idade),
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
    dataNascimento: atleta.dataNascimento?.toISOString() ?? null,
    respostas: (atleta.respostas ?? {}) as Record<string, string>,
  }
}

export async function atualizarNascimento(
  id: string,
  dataNascimento: string | null,
): Promise<AtletaListagem> {
  const existente = await atletasRepository.buscarAtletaPorId(id)

  if (!existente) {
    throw new ApiErro(404, 'Atleta não encontrado')
  }

  const atualizado = await atletasRepository.atualizarDataNascimento(
    id,
    dataNascimento ? new Date(`${dataNascimento}T12:00:00`) : null,
  )
  return paraListagem(atualizado)
}

export async function atualizarExibicao(id: string, exibeNoSite: boolean): Promise<AtletaListagem> {
  const existente = await atletasRepository.buscarAtletaPorId(id)

  if (!existente) {
    throw new ApiErro(404, 'Atleta não encontrado')
  }

  const atualizado = await atletasRepository.atualizarExibicao(id, exibeNoSite)
  return paraListagem(atualizado)
}
