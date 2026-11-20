-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "papel" TEXT NOT NULL DEFAULT 'ADMIN',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessaoRefresh" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiraEm" TIMESTAMP(3) NOT NULL,
    "revogadoEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessaoRefresh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Atleta" (
    "id" TEXT NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "idade" INTEGER,
    "sexo" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "equipeAtual" TEXT,
    "categoriaAtual" TEXT,
    "posicao" TEXT,
    "temDorAtual" BOOLEAN,
    "respostas" JSONB NOT NULL DEFAULT '{}',
    "respostaRecebidaEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Atleta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SessaoRefresh_tokenHash_key" ON "SessaoRefresh"("tokenHash");

-- CreateIndex
CREATE INDEX "SessaoRefresh_usuarioId_idx" ON "SessaoRefresh"("usuarioId");

-- CreateIndex
CREATE INDEX "Atleta_nomeCompleto_idx" ON "Atleta"("nomeCompleto");

-- CreateIndex
CREATE INDEX "Atleta_categoriaAtual_idx" ON "Atleta"("categoriaAtual");

-- AddForeignKey
ALTER TABLE "SessaoRefresh" ADD CONSTRAINT "SessaoRefresh_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
