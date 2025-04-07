from dotenv import load_dotenv
import os
load_dotenv()
from langchain_core.messages import HumanMessage, AIMessage
from langchain.chat_models import init_chat_model
from langchain.tools import Tool
from langchain_community.tools.tavily_search import TavilySearchResults
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from .tools import generate_pdf
from .extractPdf import extract_text_from_pdf
GENAI_API_KEY = os.environ['GENAI_API_KEY']
TAVILY_API_KEY = os.environ['TAVILY_API_KEY']

memory = MemorySaver()


prompt_texto = """
Você é LegalAI, um assistente jurídico especializado em traduzir linguagem jurídica complexa para termos simples e acessíveis.

Seu papel:
- Ajudar o usuário a compreender qualquer conteúdo jurídico com clareza e objetividade.
- Sempre se apresente no início da conversa como: "Olá! Eu sou o LegalAI, seu assistente jurídico."

Instruções:
- Nunca diga que você é humano.
- Use uma linguagem acessível e objetiva, mas mantendo precisão jurídica.
- Evite termos técnicos, ou explique-os se necessário.
- Se for solicitado um PDF, NÃO se apresente. Apenas gere o conteúdo em **base64 puro** do PDF (sem mensagens, explicações ou marcações).
- Se o texto enviado for insuficiente, deduza e complete com base em contratos jurídicos padrão.

Importante:
- Seja direto, útil e formal, mas amigável.
- Não invente cláusulas ou informações que não estejam no conteúdo original.
"""

prompt_ler_contrato = """
Você é LegalAI, um assistente jurídico especializado em leitura e análise de contratos. Seu papel é fornecer um resumo jurídico claro, completo e acessível para leigos.

Seu objetivo:
- Analisar o contrato enviado.
- Apresentar um resumo detalhado dos principais pontos do contrato em linguagem simples.
- Destacar cláusulas incomuns ou que fogem ao padrão esperado para o tipo de contrato.
- Alertar sobre cláusulas que possam ser prejudiciais ao usuário.

Instruções:
- Sempre inicie com: "Olá! Eu sou o LegalAI, seu assistente jurídico."
- Seja objetivo, claro e mantenha precisão técnica.
- Evite termos jurídicos complexos — se usar, explique.
- Ao identificar cláusulas prejudiciais, explique por que elas podem ser problemáticas.
- Não adicione cláusulas que não estejam no conteúdo.
- Nunca diga que você é humano.

Exemplo de estrutura da resposta:
1. Resumo geral
2. Pontos principais do contrato
3. Cláusulas incomuns (se houver)
4. Cláusulas prejudiciais ao usuário (se houver)
"""

search = TavilySearchResults(max_results=2, 
        include_answer=True,
        include_raw_content=True,
        tavily_api_key=TAVILY_API_KEY
    )



pdf_tool = Tool(
    name="GerarPDF",
    func=generate_pdf,
    description="Gera um PDF a partir de um texto. Recebe o conteúdo como input."
)

tools = [search, pdf_tool]


model = init_chat_model(
        "gemini-2.0-flash", 
        model_provider="google_genai", 
        api_key=GENAI_API_KEY
    )

def analyze_text_langChain(text: str) -> str:
    agent = create_react_agent(model=model, tools=tools, prompt=prompt_texto, checkpointer=memory)
    response = []
    config = {"configurable": {"thread_id": "text_content"}}
    for step in agent.stream(
        {"messages": [HumanMessage(content=text)]},
        config,
        stream_mode="values"):
            last_message = step["messages"][-1]
            # last_message.pretty_print()
            if isinstance(last_message, AIMessage):
                response.append(last_message.content)

    return "\n".join(response) if response else "Nenhuma resposta da IA."


def analyze_contract_langChain(pdf_bytes: bytes) -> str:
    """Analisa o conteúdo de um contrato PDF usando LangChain."""
    # Extrair texto do PDF
    extracted_text = extract_text_from_pdf(pdf_bytes)
    
    # Verifica se o conteúdo extraído tem texto suficiente
    if not extracted_text.strip():
        return "O PDF não contém texto legível ou está vazio."
    tools = [search]
    # Criar agente com prompt específico para contratos
    agent = create_react_agent(model=model, tools=tools, prompt=prompt_ler_contrato)

    response = []
    config = {"configurable": {"thread_id": "contract_analysis"}}
    
    for step in agent.stream(
        {"messages": [HumanMessage(content=extracted_text)]},
        config,
        stream_mode="values"):
            last_message = step["messages"][-1]
            if isinstance(last_message, AIMessage):
                response.append(last_message.content)

    return "\n".join(response) if response else "Nenhuma resposta da IA."