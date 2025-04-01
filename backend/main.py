from fastapi import FastAPI, UploadFile, File
from .gen_ai import analyze_contract, analyze_text
from .serializers import TextRequest, ContractAnalysisRequest

app = FastAPI(title="Consultoria Jurídica com IA", version="1.0")

@app.post("/api/analyze-contract")
async def analyze_contract_api(request: ContractAnalysisRequest):
    analysis = analyze_contract(request.contract_text)
    return {"analysis": analysis}

@app.post("/api/upload-contract")
async def upload_contract(file: UploadFile = File(...)):
    content = await file.read()
    text = content.decode("utf-8")
    analysis = analyze_contract(text)
    return {"analysis": analysis}


@app.post("/analyze-text")
async def analyze_text_api(request: TextRequest):
    result = analyze_text(request.text)
    return {"analysis": result}