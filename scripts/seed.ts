// Seed do banco: popula Atletas a partir do JSON convertido da planilha do
// Google Forms (scripts/converter-xlsx.py → data-seed/respostas-atletas.json)
// e garante o usuário admin (ADMIN_EMAIL/ADMIN_PASSWORD do .env).
//
// Fluxo quando chegam respostas novas:
//   1. python scripts/converter-xlsx.py
//   2. npm run seed
import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import bcrypt from 'bcryptjs'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/client'
import { athleteFields } from '../src/modules/ficha/data/formSchema'

// Mesmas regras do normalizeText do front: os aliases do formSchema estão
// nessa forma normalizada (minúsculas, sem acento, só letras/números).
function normalizarTexto(valor: string) {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

const HEADER_CARIMBO = 'carimbo de data hora'

// Índice de casamento: header normalizado → campo da ficha.
// Nível 1: igualdade exata. Nível 2: alias mais longo CONTIDO no header
// (o Google Forms concatena aviso de "desconsiderar" ao fim das perguntas).
const indiceCampos = new Map<string, string>()
for (const campo of athleteFields) {
  const chaves = [campo.key, ...(campo.aliases ?? [])].map(normalizarTexto)
  for (const chave of chaves) {
    if (!indiceCampos.has(chave)) {
      indiceCampos.set(chave, campo.key)
    }
  }
}

function casarCampo(header: string): string | null {
  const headerNormalizado = normalizarTexto(header)
  const exato = indiceCampos.get(headerNormalizado)
  if (exato) {
    return exato
  }

  let melhorAlias = ''
  let melhorCampo: string | null = null
  for (const [alias, campoKey] of indiceCampos) {
    if (alias.length > 8 && headerNormalizado.includes(alias) && alias.length > melhorAlias.length) {
      melhorAlias = alias
      melhorCampo = campoKey
    }
  }
  return melhorCampo
}

// Cache do casamento para não repetir a busca coluna a coluna em 32 linhas.
const cacheCasamento = new Map<string, string | null>()

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter })

  try {
    // ── Admin inicial ──────────────────────────────────────────────
    const emailAdmin = process.env.ADMIN_EMAIL
    const senhaAdmin = process.env.ADMIN_PASSWORD

    if (!emailAdmin || !senhaAdmin) {
      throw new Error('Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env para criar o admin.')
    }

    const senhaHash = await bcrypt.hash(senhaAdmin, 12)
    const admin = await prisma.usuario.upsert({
      where: { email: emailAdmin },
      update: { senhaHash },
      create: { email: emailAdmin, senhaHash, papel: 'ADMIN' },
    })
    console.log(`[seed] admin pronto: ${admin.email}`)

    // ── Atletas a partir da planilha ───────────────────────────────
    const caminhoJson = path.resolve('data-seed/respostas-atletas.json')
    const linhas = JSON.parse(readFileSync(caminhoJson, 'utf-8')) as Record<string, string>[]

    let criados = 0
    let atualizados = 0
    const headersSemCampo = new Set<string>()

    for (const linha of linhas) {
      // Casamento dos headers com os campos da ficha (com cache por header)
      const valores: Record<string, string> = {}
      let respostaRecebidaEm: Date | null = null

      for (const [header, valorBruto] of Object.entries(linha)) {
        const valor = valorBruto ?? ''
        const headerNormalizado = normalizarTexto(header)

        if (headerNormalizado === HEADER_CARIMBO) {
          const data = new Date(valor)
          respostaRecebidaEm = Number.isNaN(data.getTime()) ? null : data
          continue
        }

        const campoKey = cacheCasamento.get(header) ?? casarCampo(header)
        cacheCasamento.set(header, campoKey)

        if (campoKey) {
          valores[campoKey] = valor
        } else {
          headersSemCampo.add(headerNormalizado)
          // dado não se perde: fica sob o próprio header
          valores[headerNormalizado] = valor
        }
      }

      const nomeCompleto = (valores.fullName ?? '').trim()
      if (!nomeCompleto) {
        console.warn('[seed] linha ignorada: sem nome completo')
        continue
      }

      const idade = Number.parseInt(valores.age ?? '', 10)
      const temDorAtual =
        valores.hasCurrentPain === 'Sim' ? true : valores.hasCurrentPain === 'Não' ? false : null

      // atleta do Ghamma/CTGV = aparece na seção pública do site.
      // Regra de importação: só na CRIAÇÃO — o seed nunca desmarca
      // uma curadoria feita à mão pelo admin depois.
      const equipeNormalizada = normalizarTexto(valores.currentTeam ?? '')
      const exibeNoSite = equipeNormalizada.includes('gh')

      const dadosAtualizacao = {
        nomeCompleto,
        idade: Number.isFinite(idade) ? idade : null,
        sexo: valores.gender || null,
        telefone: valores.phone || null,
        email: valores.email || null,
        equipeAtual: valores.currentTeam || null,
        categoriaAtual: valores.currentCategory || null,
        posicao: valores.position || null,
        temDorAtual,
        respostas: valores,
        respostaRecebidaEm,
      }

      const existente = await prisma.atleta.findFirst({ where: { nomeCompleto } })

      if (existente) {
        await prisma.atleta.update({ where: { id: existente.id }, data: dadosAtualizacao })
        atualizados += 1
      } else {
        await prisma.atleta.create({ data: { ...dadosAtualizacao, exibeNoSite } })
        criados += 1
      }
    }

    console.log(`[seed] atletas: ${criados} criados, ${atualizados} atualizados`)

    if (headersSemCampo.size) {
      console.warn('[seed] headers sem campo no formSchema (dados mantidos sob o header):')
      for (const header of headersSemCampo) {
        console.warn('  -', header)
      }
    }
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((erro) => {
  console.error('[seed] falhou:', erro.message)
  process.exit(1)
})
