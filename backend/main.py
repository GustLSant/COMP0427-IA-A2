from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .gen_ai import analyze_contract
from .serializers import TextRequest, ContractAnalysisRequest
from .orquestrador import analyze_text_langChain
from .extractPdf import extract_text_from_pdf, FileBase64Request
import base64

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
async def upload_contract(request: FileBase64Request):
    try:
        # Decode the base64 string
        content = base64.b64decode(request.file_base64)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid base64 content")

    # Process the content based on the content type
    if request.content_type == "application/pdf":
        text = extract_text_from_pdf(content)
    else:
        try:
            text = content.decode("utf-8")
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="Unable to decode non-UTF-8 text file")

    # Do your analysis
    analysis = analyze_contract(text)
    return {"analysis": analysis}


@app.post("/api/analyze-text")
async def analyze_text_api(request: TextRequest):
    result = analyze_text_langChain(request.text)
    return {"analysis": result}
     