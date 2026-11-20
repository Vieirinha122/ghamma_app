// Context do auth: definição e tipo do valor. A lógica vive no AuthProvider
// (convenção: context e provider em arquivos separados) e o consumo é sempre
// pelo hook useAuth — nunca importando o context direto.
import { createContext } from 'react'
import type { UsuarioAutenticado } from '../../../contracts/schemas/auth'

export type StatusSessao = 'verificando' | 'autenticado' | 'nao-autenticado'

export interface ValorAuth {
  status: StatusSessao
  usuario: UsuarioAutenticado | null
  entrar(email: string, senha: string): Promise<void>
  sair(): Promise<void>
}

export const AuthContext = createContext<ValorAuth | null>(null)
