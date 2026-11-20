# Converte a planilha de respostas do Google Forms (xlsx) em JSON para o seed.
# Normaliza os cabeçalhos com as MESMAS regras do normalizeText do front
# (minúsculas, sem acentos, só letras/números, espaços colapsados) para que
# o seed case os headers com os aliases do formSchema.
import re
import json
import unicodedata
import pandas as pd

XLSX = r"C:\Users\Arthu\Downloads\Ficha Anamnese (Vôlei) (respostas).xlsx"
SAIDA = r"C:\PROJETOS_PESSOAIS\ghamma_App\data-seed\respostas-atletas.json"


def normalizar(texto: str) -> str:
    sem_acento = unicodedata.normalize("NFD", str(texto))
    sem_acento = "".join(c for c in sem_acento if unicodedata.category(c) != "Mn")
    minuscula = sem_acento.lower()
    return re.sub(r"[^a-z0-9]+", " ", minuscula).strip()


df = pd.read_excel(XLSX)
df.columns = [normalizar(c) for c in df.columns]

# valores NaN viram string vazia; datas viram ISO quando possível
registros = []
for _, linha in df.iterrows():
    registro = {}
    for coluna in df.columns:
        valor = linha[coluna]
        if pd.isna(valor):
            registro[coluna] = ""
        elif hasattr(valor, "isoformat"):
            registro[coluna] = valor.isoformat()
        else:
            registro[coluna] = str(valor)
    registros.append(registro)

import os
os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
with open(SAIDA, "w", encoding="utf-8") as f:
    json.dump(registros, f, ensure_ascii=False, indent=2)

print(f"linhas: {len(registros)}")
print("colunas normalizadas:")
for c in df.columns:
    print(" -", c)
