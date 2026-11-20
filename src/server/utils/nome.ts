// Regras de exibição de nome de atleta.
// - normalizarNome: Title Case em português (partículas "de/da/do..." minúsculas)
// - resumirNome: primeiro nome + sobrenome ("Arthur Vieira"), mantendo partícula
//   quando o segundo nome for uma ("Maria da Silva" → "Maria da Silva"; já curto,
//   não se mutila). Regra de negócio: vive no backend, front só exibe.
const PARTICULAS = new Set(['de', 'da', 'do', 'das', 'dos', 'e'])

function capitalizar(palavra: string) {
  return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()
}

export function normalizarNome(nomeCompleto: string) {
  const palavras = nomeCompleto.trim().split(/\s+/).filter(Boolean)
  return palavras
    .map((palavra, indice) =>
      indice > 0 && PARTICULAS.has(palavra.toLowerCase())
        ? palavra.toLowerCase()
        : capitalizar(palavra),
    )
    .join(' ')
}

export function resumirNome(nomeCompleto: string) {
  const palavras = normalizarNome(nomeCompleto).split(/\s+/)

  if (palavras.length <= 2) {
    return palavras.join(' ')
  }

  const [primeiro, segundo, ...resto] = palavras

  // segundo nome é partícula? inclui ela + o nome seguinte ("Maria de Souza")
  if (PARTICULAS.has(segundo.toLowerCase()) && resto.length > 0) {
    return [primeiro, segundo, resto[0]].join(' ')
  }

  return [primeiro, segundo].join(' ')
}
