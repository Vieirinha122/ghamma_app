// Debounce genérico: segura o valor por X ms antes de propagar — evita
// disparar a busca a cada tecla na listagem com filtro server-side.
import { useEffect, useState } from 'react'

export function useDebounce<T>(valor: T, atrasoMs = 300) {
  const [valorAtrasado, setValorAtrasado] = useState(valor)

  useEffect(() => {
    const timer = setTimeout(() => setValorAtrasado(valor), atrasoMs)
    return () => clearTimeout(timer)
  }, [valor, atrasoMs])

  return valorAtrasado
}
