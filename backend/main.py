from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from .gen_ai import analyze_contract
from .serializers import TextRequest, ContractAnalysisRequest
from .orquestrador import analyze_text_langChain
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
async def analyze_contract_api(request: ContractAnalysisRequest):
    print('request: ', request)
    analysis = analyze_contract(request.contract_text)
    return {"analysis": analysis}

@app.post("/api/upload-contract")
async def upload_contract(file: UploadFile = File(...)):
    content = await file.read()
    text = content.decode("utf-8")
    analysis = analyze_contract(text)
    return {"analysis": analysis}


@app.post("/api/analyze-text")
async def analyze_text_api(request: TextRequest):
    result = analyze_text_langChain(request.text)
    return {"analysis": result}