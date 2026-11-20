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

## Etapa 2 — Schema, migration e seed ✅ *(concluída em 2026-11-20)*

- [x] Models no Prisma:
  - `Usuario` (email, hash de senha, papel) — base do login multi-usuário
  - `Atleta` (colunas-chave: nome, idade, sexo, categoria, posição, equipe, telefone, dor atual + `respostas` JSONB com as 65 respostas)
  - Tabela de refresh tokens (rotatividade, hash do token)
- [x] `prisma migrate` contra o Neon (migration `20261120145837_init`)
- [x] Seed: xlsx convertido (`scripts/converter-xlsx.py` → `data-seed/`, gitignored) e 32 atletas importados (`scripts/seed.ts`, matching por aliases do formSchema)
- [x] Admin inicial criado via env (`ADMIN_EMAIL`/`ADMIN_PASSWORD`, só no seed local)

## Etapa 3 — Auth (login multi-usuário) ✅ *(concluída em 2026-11-20)*

- [x] `modules/auth/` no back: `auth.routes.ts`, `auth.controller.ts`, `service.ts`, `repository.ts`
- [x] `POST /api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`
- [x] bcrypt custo 12; access token JWT curto em memória; refresh em cookie `HttpOnly Secure SameSite=strict` com rotação
- [x] Rate limit no login (5/15 min por IP); middleware `requireAuth` pronto para proteger rotas
- [x] Validação Zod de body/login nos contratos (`src/contracts/schemas/auth.ts`)

## Etapa 4 — Endpoints de atletas + seção pública do site ✅ *(concluída em 2026-11-20, aguardando teste)*

- [x] `modules/atletas/` no back: `atletas.routes.ts`, `atletas.controller.ts`, `service.ts`, `repository.ts`
- [x] `GET /api/atletas?q=&posicao=` (protegido) → listagem admin, A-Z no banco, busca em nome/categoria/posição
- [x] `GET /api/atletas/:id` (protegido) → ficha completa (JSONB)
- [x] `GET /api/site/atletas?q=&posicao=` (público) → seção de atletas na landing: só `{ id, nome, idade, posição }` de quem tem `exibeNoSite`
- [x] `PATCH /api/atletas/:id/exibicao` (protegido) → curadoria do admin para o site
- [x] Coluna `exibeNoSite` + migration com backfill (23 de 32 marcados — equipes Ghamma/CTGV)
- [x] Seed marca `exibeNoSite` na criação e nunca desmarca curadoria manual
- [x] Contratos em `src/contracts/schemas/atletas.ts` (consulta, exibição, tipos de resposta)

> [!info] Para a etapa do front
> Criar componente da **seção de atletas do Ghamma Vôlei** na landing: consome `GET /api/site/atletas` (público), com filtro de posição (dropdown com as posições vindas da própria lista) + campo de busca, card com nome/idade/posição.

## Etapa 5 — Front: autenticação + TanStack Query ✅ *(concluída e testada em 2026-11-20)*

- [x] Instalar `@tanstack/react-query` (+ provider no app, `retry: false` — 401 é tratado pelo wrapper de sessão), `react-hook-form` e `@hookform/resolvers`
- [x] Tela de login `/admin/login` (RHF + Zod reaproveitando `schemaLogin` do contrato)
- [x] Context de auth (`AuthContext` + `AuthProvider` + hook `useAuth` em arquivos separados, convenção)
- [x] Access token em memória; renovação silenciosa no boot e em 401 com **mutex entre abas** (refresh rotativo) e `BroadcastChannel` (logout/token entre abas)
- [x] Portão de sessão em `/admin/*` (redireciona ao login; nada sensível renderiza durante a verificação)
- [x] Botão "Sair" no painel (revoga sessão, limpa memória e anuncia às abas)

> [!info] Performance (backlog)
> Bundle principal passou de 500 kB com query/form libs — considerar code-splitting do painel admin (`import()` dinâmico) quando a landing for prioridade de carga.

## Etapa 6 — Front: tabela, ficha separada e remoção do CRUD ✅ *(concluída em 2026-11-20, aguardando teste da seção pública)*

- [x] Tabela de atletas com busca (debounce) e A-Z (server-side), dados da API (TanStack Query)
- [x] Filtro de posição **e categoria** (opções vindas do formSchema; contagem do header com plural — "12 levantadores")
- [x] Ficha completa em rota própria `/admin/atletas/:id` (leitura), renderizada do `formSchema` + JSONB
- [x] Curadoria do site: switch "No site" na listagem (PATCH `/exibicao`, invalidação de cache)
- [x] **Removido**: wizard de cadastro manual, import/export CSV, localStorage, CRUD de atletas (`utils/{athlete,csv}.ts`, papaparse)
- [x] **Migração completa para Tailwind v4 + shadcn/ui** (tema com a paleta do projeto; landing e login inclusive; `AdminPanel.css`/`LandingPage.css`/`login.css` apagados; alias `@/` criado)
- [x] Responsividade refinada (mobile-first) em painel e ficha; loadings com `Spinner` nas cores do Ghamma
- [x] **Seção "Atletas do Ghamma" na landing**: componente público (`modules/landing/`) consumindo `/api/site/atletas`, filtro de posição + busca, cards nome/idade/posição; some sozinha se ninguém estiver marcado
- [x] **Idade viva**: `dataNascimento` no banco + cálculo no servidor (exato, muda no aniversário); editor na ficha para preencher a data; sem data, usa a idade reportada como fallback
- [x] Correções de deploy do back com a nova base (prisma cjs fixo, CommonJS na função, parser de JSON)

> [!info] Performance (backlog)
> Bundle principal passou de 800 kB com query/form libs + Base UI — considerar code-splitting do painel admin (`import()` dinâmico) quando a landing for prioridade de carga.

## Etapa 7 — Endurecimento e fechamento ✅ *(concluída em 2026-11-20 — verificação de deploy é sua, no push)*

- [x] `npm audit`: minimatch (moderada) corrigida via `audit fix`; as 3 altas restantes são do **CLI do Prisma em dev** (`effect` via `@prisma/config`) — não vão para a função serverless; risco aceito e monitorado (o único fix disponível rebaixaria o Prisma inteiro)
- [x] `errors/` centralizada: `ApiErro.validacao()` padroniza as respostas 400 de Zod em todos os controllers
- [x] Revisão de segurança conferida no código: `requireAuth` nas 3 rotas admin, rate limit no login (5/15 min), bcrypt 12, refresh só com hash + rotação, cookie `HttpOnly/Secure/Strict` com path restrito, endpoint público com seleção mínima de campos, CORS whitelist, Helmet, morgan sem corpo, env validada com Zod
- [ ] Deploy completo verificado: landing (com seção de atletas), login, tabela, ficha, `/admin` recarregando direto — **a fazer no seu push**

## Etapa 8 - Landing page 2.0 *(próxima - foco principal)*

- [ ] **Escala tipográfica definida e aplicada**: Barlow Condensed só em display grande (hero, h2 de seção); Manrope para nomes em card, números grandes (placar) e UI; eyebrows nos h2; corpo com leading relaxado; limpar pesos da Barlow não usados no `index.html`

- [ ] **Menu mobile**: nav some no celular — menu hambúrguer/drawer com os links
- [ ] **Seção de contato**: formulário curto (nome + interesse) → mensagem pré-definida no WhatsApp (wa.me, sem backend)
- [ ] **Prova social**: foto real de treino/time + números do CTGV (alunos formados, anos de quadra)
- [ ] **Depoimentos** de alunas / resultados
- [ ] **Ícones nos pilares** + microcopy de apoio
- [ ] **FAQ** (horários, mensalidade, local, idade mínima)
- [ ] **CTA segmentado** em "Há espaço para o seu momento" (volta vs. nunca jogou)
- [ ] **Footer útil**: Instagram, endereço/quadra, WhatsApp
- [ ] **Reveal on scroll** nas seções (`motion-safe`)
- [ ] Textura/profundidade no hero + unificação dos tokens `lp-*` com os do painel

---

## Ideias futuras / backlog (aberto — adicione à vontade)

> **Como usar:** escreva aqui qualquer ideia, desejo ou necessidade futura. Não precisa estar bem formada — eu transformo em etapa quando você pedir.

### Pedidos já feitos por você (aguardando hora certa)

- [x] ~~Sincronização automática com o Google Forms~~ — descartado por enquanto (você: "não precisa por enquanto"); o fluxo atual (xlsx → conversor → seed) cobre
- [x] Alias de imports — **concluído**: alias `@/` criado com o setup do Tailwind/shadcn
- [ ] Papel `VISUALIZADOR` no RBAC (ex: fisioterapeuta vê ficha, não edita usuários)
- [ ] Log de auditoria de acesso a fichas clínicas (quem consultou qual atleta e quando) — LGPD
- [ ] Testes automatizados (Vitest) — só quando você pedir explicitamente
- [ ] Export CSV de atletas de volta, gerado pelo backend
- [ ] **Refino da landing page (UX/UI)**: releitura geral com olhar sênior (hierarquia, microdecisões, copy) — ver itens visuais abaixo
- [ ] **Seção de contato na landing**: formulário curto (nome + interesse) que monta uma mensagem pré-definida e abre o WhatsApp (wa.me com texto preenchido) — sem backend, link direto
- [ ] Painel de indicadores agregados (EVA médio, dores por região, evolução por categoria)
- [ ] Página pública de resultados/calendário do CTGV na landing
- [ ] Notificações para o admin quando chega resposta nova do formulário
- [ ] Code-splitting do bundle (820 kB): painel admin em chunk separado com `import()` dinâmico; landing mais leve

### Melhorias visuais — landing page

*As melhorias visuais viraram a **Etapa 8 — Landing page 2.0** (foco principal depois da etapa 7). O checklist oficial mora lá; esta lista serve de histórico da review de 2026-11-20.*

- [ ] **Menu mobile**: a nav some no celular sem substituto — adicionar menu hambúrguer/drawer com os mesmos links
- [ ] **Prova social no hero ou logo após**: foto real de treino/time (hoje é 100% tipográfico) + números do CTGV (alunos formados, anos de quadra)
- [ ] **Depoimentos/resultados**: seção com relatos de alunas (as fichas de evolução podem alimentar isso no futuro)
- [ ] **Ícones nos pilares**: as 3 frases dos pilares pedem ícone + microcopy de apoio, não só tipografia
- [ ] **FAQ**: dúvidas frequentes (horários, mensalidade, local, idade mínima) — reduz atrito antes do contato
- [ ] **CTA segmentado na seção "Há espaço para o seu momento"**: caminho diferente para quem volta vs. quem nunca jogou (divulgação progressiva)
- [ ] **Footer mais útil**: Instagram, endereço/quadra, WhatsApp direto — hoje é só a assinatura
- [ ] **Animações discretas de entrada** nas seções (reveal on scroll, `motion-safe`) — a página é estática depois do hero
- [ ] **Imagem/texture no fundo do hero**: gradiente puro ficou flat; ruído sutil ou padrão de quadra daria profundidade
- [ ] Consistência de tokens: landing usa paleta própria (`lp-*`) que converge com a do painel — unificar num dia de limpeza
