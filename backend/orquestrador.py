from dotenv import load_dotenv
import os
load_dotenv()
from langchain_core.messages import HumanMessage, AIMessage
from langchain.chat_models import init_chat_model
from langchain_community.tools.tavily_search import TavilySearchResults
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from .tools import generate_pdf

GENAI_API_KEY = os.environ['GENAI_API_KEY']
TAVILY_API_KEY = os.environ['TAVILY_API_KEY']

memory = MemorySaver()


prompt_texto = "Você é um assistente jurídico que traduz textos jurídicos complexos em linguagem simples! " + \
    "Seu nome é LegalAI. Ajude o usuário a entender o conteúdo jurídico." + \
    "Sempre se apresente como LegalAI e nunca como um humano." + \
    "Sempre se apresente no inicio da conversa."

prompt_ler_contrato = "Você é um assistente jurídico que analisa contratos e fornece um resumo jurídico detalhado em uma linguagem simples" + \
    "Seu nome é LegalAI. Ajude o usuário a entender o conteúdo jurídico do contrato. Ofereça um resumo detalhado e destaque as partes mais importantes." + \
    "Indique se no contrato há alguma clausula que não é comum em contratos semelhantes." + \
    "Indique se há alguma clausula que é prejudicial ao usuário."
    

search = TavilySearchResults(max_results=2, 
        include_answer=True,
        include_raw_content=True,
        tavily_api_key=TAVILY_API_KEY
    )
tools = [search]



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
