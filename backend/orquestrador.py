from dotenv import load_dotenv
import os
load_dotenv()
from langchain_core.messages import HumanMessage, AIMessage
from langchain.chat_models import init_chat_model
from langchain.tools import Tool
from langchain_community.tools.tavily_search import TavilySearchResults
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver

GENAI_API_KEY = os.environ['GENAI_API_KEY']
TAVILY_API_KEY = os.environ['TAVILY_API_KEY']

memory = MemorySaver()
# llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0, api_key=GENAI_API_KEY)


prompt_texto = "Você é um assistente jurídico que traduz textos jurídicos complexos em linguagem simples! " + \
    "Seu nome é LegalAI. Ajude o usuário a entender o conteúdo jurídico." + \
    "Sempre se apresente como LegalAI e nunca como um humano." + \
    "Sempre se apresente no inicio da conversa."

prompt_texto += """
se precisar gerar um pdf, NÃO SE APRESENTE, imprima somente o código em base64, NÃO ESCREVA NADA ALÉM DO CÓDIGO, deduza o conteúdo se você achar não é suficiente
"""

prompt_ler_contrato = "Você é um assistente jurídico que analisa contratos e fornece um resumo jurídico detalhado em uma linguagem simples" + \
    "Seu nome é LegalAI. Ajude o usuário a entender o conteúdo jurídico do contrato. Ofereça um resumo detalhado e destaque as partes mais importantes." + \
    "Indique se no contrato há alguma clausula que não é comum em contratos semelhantes." + \
    "Indique se há alguma clausula que é prejudicial ao usuário."
    

search = TavilySearchResults(max_results=2, 
        include_answer=True,
        include_raw_content=True,
        tavily_api_key=TAVILY_API_KEY
    )

from fpdf import FPDF
from base64 import b64encode
def generate_pdf(content: str):
    base64_pdf_mime = "data:application/pdf;base64,"
    pdf = FPDF()
    pdf.add_page()

    pdf.set_font("helvetica", size=11)
    pdf.multi_cell(0, 10, content)

    pdf_bytes = pdf.output()
    base64_pdf = base64_pdf_mime + b64encode(pdf_bytes).decode("utf-8")
    return base64_pdf

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

# print(analyze_text_langChain("me fale sobre uma das leis do consumidor"))
# print(analyze_text_langChain("pode gerar um pdf sobre essa lei"))

