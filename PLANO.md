# Ghamma App — Plano de implementação

> Plano vivo do projeto: estado atual, etapas na ordem combinada e backlog aberto para ideias futuras.
> Como usar: quando quiser puxar um item do backlog, é só dizer "faz o item X do plano" na conversa.

## Estado atual (concluído)

- [x] Landing page pública (logo corrigida, detalhes brancos restaurados)
- [x] Painel `/admin` com CRUD local (localStorage) — **legado**, será substituído pela API
- [x] Estrutura de módulos aplicada (convenção): `modules/{landing,ficha,atletas}` + `contracts/` + `server/modules/`
- [x] Casca do backend: Express, env com Zod, Helmet, CORS whitelist, morgan, health endpoint
- [x] Prisma 7 + adapter-pg apontando para Neon; client singleton; `generated/` gitignored
- [x] Deploy preparado: rewrites `/api/*` → função + SPA, `vercel.json`, env vars listadas
- [x] Git inicializado, commit + push em andamento (meu lado: comandos bloqueados por permissão)

## Etapa 2 — Schema, migration e seed *(próxima)*

- [ ] Models no Prisma:
  - `Usuario` (email, hash de senha, papel) — base do login multi-usuário
  - `Atleta` (colunas-chave: nome, idade, sexo, categoria, posição, equipe, telefone, dor atual + `respostas` JSONB com as 65 respostas)
  - Tabela de refresh tokens (rotatividade, hash do token)
- [ ] `prisma migrate` contra o Neon
- [ ] Seed: converter o xlsx do Google Forms (32 respostas × 65 colunas) em JSON e popular `Atleta`
- [ ] Admin inicial criado via env (`ADMIN_EMAIL`/`ADMIN_PASSWORD`, só no seed local)

## Etapa 3 — Auth (login multi-usuário)

- [ ] `modules/auth/` no back: `auth.routes.ts`, `auth.controller.ts`, `service.ts`, `repository.ts`
- [ ] `POST /api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`
- [ ] bcrypt custo 12; access token JWT curto em memória; refresh em cookie `HttpOnly Secure SameSite=strict` com rotação
- [ ] Rate limit no login; middleware `requireAuth` para proteger `/api/atletas`
- [ ] Validação Zod de body/login nos contratos (`src/contracts/`)

## Etapa 4 — Endpoint de atletas

- [ ] `modules/atletas/` no back: routes/controller/service/repository
- [ ] `GET /api/atletas?q=busca` → ordenação A-Z no banco (`orderBy` nome), busca por nome/categoria/posição
- [ ] `GET /api/atletas/:id` → ficha completa (JSONB)
- [ ] Resposta enxuta na listagem (só colunas-chave), ficha completa só no detalhe

## Etapa 5 — Front: autenticação + TanStack Query

- [ ] Instalar `@tanstack/react-query`; provider no app
- [ ] Tela de login `/admin/login` (RHF + Zod reaproveitando contrato)
- [ ] Context de auth com access token em memória e refresh silencioso
- [ ] Logout limpa memória + cookie

## Etapa 6 — Front: tabela, ficha separada e remoção do CRUD

- [ ] Tabela de atletas com busca (debounce) e A-Z (server-side), dados da API
- [ ] Ficha completa em rota própria `/admin/atletas/:id` (leitura), renderizada do `formSchema` + JSONB
- [ ] **Remover**: wizard de cadastro manual, import/export CSV, localStorage, CRUD de atletas
- [ ] Limpar órfãos: `utils/{athlete,csv}.ts`, contratos de importação

## Etapa 7 — Endurecimento e fechamento

- [ ] `npm audit` (12 vulnerabilidades reportadas na instalação — investigar e resolver)
- [ ] `errors/` centralizada com respostas de erro consistentes
- [ ] Revisão final de segurança (dado clínico: validação, RBAC, logging)
- [ ] Deploy completo verificado: landing, login, tabela, ficha, `/admin` recarregando direto

---

## Ideias futuras / backlog (aberto — adicione à vontade)

> **Como usar:** escreva aqui qualquer ideia, desejo ou necessidade futura. Não precisa estar bem formada — eu transformo em etapa quando você pedir.

- [ ] *(exemplo de formato)* Sincronização automática com o Google Forms (webhook ou polling da API do Forms) em vez de subir xlsx manualmente
- [ ] *(pré-marcado da conversa)* Alias de imports (`@contracts`, `@modules`) para eliminar caminhos `../../../`
- [ ] *(pré-marcado da conversa)* Papel `VISUALIZADOR` no RBAC (ex: fisioterapeuta vê ficha, não edita usuários)
- [ ] *(pré-marcado da conversa)* Log de auditoria de acesso a fichas clínicas (quem consultou qual atleta e quando) — LGPD
- [ ] *(pré-marcado da conversa)* Testes automatizados (Vitest) — só quando você pedir explicitamente
- [ ] Export CSV de atletas de volta, gerado pelo backend
- [ ] Painel de indicadores agregados (EVA médio, dores por região, evolução por categoria)
- [ ] Página pública de resultados/calendário do CTGV na landing
- [ ] Notificações para o admin quando chega resposta nova do formulário
