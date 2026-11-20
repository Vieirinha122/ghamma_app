// Contratos do módulo auth: validação de entrada compartilhada entre
// backend (rota) e frontend (formulário de login com RHF + Zod).
import { z } from 'zod'

export const schemaLogin = z.object({
  email: z.email('E-mail inválido'),
  senha: z.string().min(1, 'Informe a senha'),
})

export type CredenciaisLogin = z.infer<typeof schemaLogin>

// Forma do usuário que a API devolve — nunca inclui hash de senha.
export interface UsuarioAutenticado {
  id: string
  email: string
  papel: string
}
