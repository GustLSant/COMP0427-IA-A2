from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from .serializers import TextRequest
from .orquestrador import analyze_text_langChain, analyze_contract_langChain

app = FastAPI(title="Consultoria Jurídica com IA", version="1.0")

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite requisições de qualquer origem (para desenvolvimento)
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos os headers
)

@app.post("/api/analyze-contract")
async def analyze_contract_api(file: UploadFile = File(...)):
    try:
        if not file.filename.lower().endswith(".pdf"):
            return {"error": "O arquivo deve ser um PDF."}

        content = await file.read()

        result = analyze_contract_langChain(content)
        return {"analysis": result}
    except Exception as e:
        print("Erro ao analisar contrato:", e)
        return {"error": f"Ocorreu um erro: {str(e)}"}

@app.post("/api/analyze-text")
async def analyze_text_api(request: TextRequest):
    result = analyze_text_langChain(request.text)
    return {"analysis": result}
     