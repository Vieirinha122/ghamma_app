// Hook de acesso ao auth: encapsula o useContext e falha cedo se usado
// fora do AuthProvider (convenção: context nunca é consumido direto).
import { useContext } from 'react'
import { AuthContext, type ValorAuth } from '../context/AuthContext'

export function useAuth(): ValorAuth {
  const valor = useContext(AuthContext)

  if (!valor) {
    throw new Error('useAuth precisa estar dentro de um AuthProvider')
  }

  return valor
}
