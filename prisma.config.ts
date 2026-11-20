// Configuração do CLI do Prisma 7: aponta o schema e injeta a URL do banco
// a partir do .env (lido pelo dotenv), sem segredo em código.
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
})
