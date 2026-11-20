// Provider do auth: dono do estado de sessão do front.
// - No boot: renovação silenciosa (o cookie httpOnly decide — o front não
//   armazena nada em storage), evitando flash de "não autenticado".
// - Ouve eventos de sessão (logout/token renovado) vindos das outras abas.
// - login/logout falam com o backend e propagam o estado entre abas.
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type StatusSessao } from './AuthContext'
import type { UsuarioAutenticado } from '../../../contracts/schemas/auth'
import * as authRepository from '../data/auth.repository'
import { definirSessao } from '../../../lib/sessao'
import {
  anunciarLogout,
  definirSessao as definirSessaoInfra,
  inscreverEventosSessao,
  renovarSessao,
} from '../../../lib/sessao'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<StatusSessao>('verificando')
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null)

  // boot: tenta renovar a sessão antes de decidir o que renderizar
  useEffect(() => {
    let ativo = true

    renovarSessao()
      .then((sessao) => {
        if (!ativo) return
        setUsuario(sessao.usuario)
        setStatus('autenticado')
      })
      .catch(() => {
        if (!ativo) return
        setStatus('nao-autenticado')
      })

    return () => {
      ativo = false
    }
  }, [])

  // eventos das outras abas: logout forçado e token renovado
  useEffect(
    () =>
      inscreverEventosSessao((evento) => {
        if (evento === 'logout') {
          setUsuario(null)
          setStatus('nao-autenticado')
          return
        }

        // token renovado em outra aba: esta aba acompanha (mesma sessão)
        setStatus((atual) => atual)
      }),
    [],
  )

  const valor = useMemo(
    () => ({
      status,
      usuario,
      async entrar(email: string, senha: string) {
        const sessao = await authRepository.login({ email, senha })
        definirSessaoInfra(sessao.accessToken, sessao.usuario)
        setUsuario(sessao.usuario)
        setStatus('autenticado')
      },
      async sair() {
        // revoga a sessão no servidor mesmo que a rede falhe depois:
        // o estado local sai de qualquer jeito
        try {
          await authRepository.logout()
        } finally {
          definirSessao(null, null)
          anunciarLogout()
          setUsuario(null)
          setStatus('nao-autenticado')
        }
      },
    }),
    [status, usuario],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
