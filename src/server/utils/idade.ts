// Cálculo de idade a partir da data de nascimento.
// Exato: compara mês/dia ANTES de subtrair o ano — alguém que faz aniversário
// em 1º de dezembro tem 23 anos em novembro, não 24.
export function calcularIdade(dataNascimento: Date, hoje = new Date()): number {
  let idade = hoje.getFullYear() - dataNascimento.getFullYear()

  const mesAtual = hoje.getMonth()
  const mesNascimento = dataNascimento.getMonth()
  const diaAtual = hoje.getDate()
  const diaNascimento = dataNascimento.getDate()

  // aniversário ainda não chegou neste ano: ainda não completou a idade
  const antesDoAniversario =
    mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)

  if (antesDoAniversario) {
    idade -= 1
  }

  return idade
}

// Idade para exibição: prioridade é o nascimento (sempre atualiza sozinho);
// sem data registrada, cai para a idade reportada na ficha.
export function idadeParaExibicao(
  dataNascimento: Date | null,
  idadeReportada: number | null,
): number | null {
  if (dataNascimento) {
    return calcularIdade(dataNascimento)
  }
  return idadeReportada
}
