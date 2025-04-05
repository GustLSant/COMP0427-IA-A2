from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

GENAI_API_KEY = os.environ['GENAI_API_KEY']

client = genai.Client(api_key=GENAI_API_KEY)
model = "gemini-2.0-flash"

def analyze_contract(text: str) -> str:

    prompt = (
        "Analise o seguinte contrato e extraia informações jurídicas relevantes, "
        "como partes envolvidas, valores, prazos e obrigações:\n\n"
        f"{text}\n\nResumo jurídico detalhado:"
    )

    response = client.models.generate_content(model=model, contents=prompt)
    return response.text or ""