from pydantic import BaseModel

class TextRequest(BaseModel):
    text: str
    
class ContractAnalysisRequest(BaseModel):
    contract_text: str