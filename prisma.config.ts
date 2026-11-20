// Configuração do CLI do Prisma 7: aponta o schema e injeta a URL do banco
// a partir do .env (lido pelo dotenv), sem segredo em código.
import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Resolvida no runtime de cada comando: `generate` não precisa de conexão com
    // o banco (roda no build da Vercel sem env vars), enquanto `migrate`/`db push`
    // falham com mensagem clara se DATABASE_URL estiver ausente ou vazia.
    url: process.env.DATABASE_URL ?? '',
  },
})
