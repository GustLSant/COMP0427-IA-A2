from google import genai

GENAI_API_KEY = "chave"

client = genai.Client(api_key=GENAI_API_KEY)
model = "gemini-2.0-flash"

def analyze_contract(text: str) -> str:

    prompt = (
        "Analise o seguinte contrato e extraia informações jurídicas relevantes, "
        "como partes envolvidas, valores, prazos e obrigações:\n\n"
        f"{text}\n\nResumo jurídico detalhado:"
    )

    response = client.models.generate_content(model, prompt)
    return response.text

def analyze_text(text: str) -> str:
    prompt = f"Analise o seguinte texto e forneça um resumo jurídico: {text}"
    
    response = client.models.generate_content(model, prompt)
    return response.text