// Erro de API com status: permite que serviços lancem falhas de negócio
// (401, 400, 403...) e o handler central responda JSON consistente.
export class ApiErro extends Error {
  constructor(
    readonly status: number,
    readonly mensagem: string,
  ) {
    super(mensagem)
    this.name = 'ApiErro'
  }

  // Credenciais erradas: mesma mensagem para e-mail inexistente e senha errada,
  // para não revelar se o e-mail existe no sistema.
  static credenciaisInvalidas() {
    return new ApiErro(401, 'E-mail ou senha incorretos')
  }

  static naoAutenticado(mensagem = 'Sessão expirada ou inválida') {
    return new ApiErro(401, mensagem)
  }
}
