// Valida as variáveis de ambiente na borda: se faltar ou vier malformada,
// o processo sobe com erro explícito em vez de quebrar depois, no meio de uma request.
import { z } from 'zod'

// Tudo que a API lê do ambiente passa por aqui. ADMIN_* só é exigido pelo seed,
// então fica opcional no runtime do servidor.
const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória (Neon/Postgres)'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET precisa de pelo menos 16 caracteres').optional(),
  FRONTEND_URL: z.string().url('FRONTEND_URL deve ser uma URL válida').default('http://localhost:5173'),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8, 'Senha do admin precisa de 8+ caracteres').optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  const detalhes = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n')
  throw new Error(`Variáveis de ambiente inválidas:\n${detalhes}`)
}

export const env = parsed.data
