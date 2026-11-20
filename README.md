# CTGV - Cadastro de Atletas

Aplicação web para o Centro de Treinamento Ghamma Volley (CTGV), pensada para organizar fichas de anamnese e consultas rápidas dos atletas.

## O que a aplicação faz

- importa respostas em `.csv` exportadas do Google Forms;
- mantém os dados salvos no `localStorage` do navegador;
- exibe listagem com busca por nome, categoria e posição;
- mostra a ficha completa do atleta em um painel detalhado;
- permite cadastro manual, edição e exclusão;
- exporta novamente todos os registros em CSV.

## Como rodar

```bash
npm install
npm run dev
```

## Fluxo sugerido

1. atletas respondem o Google Forms;
2. o professor exporta as respostas em CSV;
3. o arquivo é importado na aplicação;
4. a listagem fica disponível para consulta e atualização manual.

## Observação importante

Os dados ficam salvos no navegador do aparelho usado. Se o navegador for limpo, os registros locais são perdidos. Por isso, o botão de exportação CSV serve como backup rápido.

## Vault do Obsidian

Há um vault pronto em `obsidian-vault-ctgv` com notas do projeto, campos da ficha e fluxo de importação.
