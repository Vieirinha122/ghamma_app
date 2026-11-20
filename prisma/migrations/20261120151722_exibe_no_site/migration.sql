-- AlterTable
ALTER TABLE "Atleta" ADD COLUMN     "exibeNoSite" BOOLEAN NOT NULL DEFAULT false;

-- Backfill: relaciona com o site quem já é do Ghamma/CTGV.
-- O padrão 'gh' pega todas as grafias encontradas na planilha
-- (Ghamma, Ghama, Ghma, Ghamama, GHAMMA Volei, CT Ghamma Volley...)
-- e nenhum dos outros clubes (AMIS, MT vôlei, Navegantes, etc.).
UPDATE "Atleta" SET "exibeNoSite" = true WHERE lower("equipeAtual") LIKE '%gh%';
