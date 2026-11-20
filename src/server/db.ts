// Cliente Prisma único por processo: cada instância abre um pool de conexões,
// e em serverless (Vercel) várias instâncias esgotariam o limite do Neon.
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/client'
import { env } from './env'

// O adapter é quem fala com o Postgres usando o driver pg por baixo dos panos.
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })

// globalThis evita recriar o client no hot-reload do tsx watch (mesmo truque do singleton).
const globalParaPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalParaPrisma.prisma ?? new PrismaClient({ adapter })

if (env.NODE_ENV !== 'production') {
  globalParaPrisma.prisma = prisma
}
