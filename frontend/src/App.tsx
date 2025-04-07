import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { BiMenu, BiSend, BiLoaderAlt, BiDownload  } from "react-icons/bi";


const API_URL = 'http://127.0.0.1:8000/api';

type Message = {
  sender: 'user' | 'ai',
  type: 'text' | 'pdf',
  data: string,
}

type Response = {
  data: {
    analysis: string,
  }
}

const pdfTestMessage: Message = {
  sender: 'ai',
  type: 'pdf',
  data: 'data:application/pdf;base64,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'
}


export default function App(){
  const [textInput, setTextInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);


  function handleTextAreaChange(event: React.ChangeEvent<HTMLTextAreaElement>){
    setTextInput(event.target.value);

    if(textAreaRef.current){
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Ajusta a altura
    }
  };


  function handleTextAreaKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>){
    if(event.key === 'Enter' && !event.shiftKey){
      event.preventDefault();
      sendMessageToAi();
    }
  }


  async function sendMessageToAi(){
    if(textInput.trim() === ''){ return; }

    setIsLoading(true);

    // adicao da mensagem do usuario no chat antes de receber a resposta da IA
    setMessages((prevState: Message[])=>{
      const newMessages: Message[] = [...prevState];
      
      newMessages.push({
        sender: 'user',
        type: "text",
        data: textInput
      })
      
      return newMessages;
    });
    setTextInput('');
    if(textAreaRef.current){ textAreaRef.current.style.height = 'auto'; } // reset na altura do input

    try{
      const response: Response = await axios.post(`${API_URL}/analyze-text`, {
        text: textInput,
      });

      const isMessagePdf: boolean = response.data.analysis.includes('data:application/pdf');
      let newMessageData: string = response.data.analysis;

      // tratamento da resposta da IA (caso seja um texto comum)
      if(!isMessagePdf){
        const rawHtmlString: string | Promise<string> = await marked.parse(response.data.analysis); // converte para HTML
        const sanitizedHtmlString: string = DOMPurify.sanitize(rawHtmlString); // remove scripts e tags maliciosas
        newMessageData = sanitizedHtmlString;
      }

      // adicao da resposta da IA no chat
      setMessages((prevState: Message[])=>{
        const newMessages: Message[] = [...prevState];

        newMessages.push({
          sender: 'ai',
          type: (isMessagePdf) ? 'pdf' : 'text',
          data: newMessageData
        })

        return newMessages;
      });

      setIsLoading(false);
      // console.log('response da API: ', response);
    }
    catch(error){
      // adicao resposta de erro no chat
      setMessages((prevState: Message[])=>{
        const newMessages: Message[] = [...prevState];

        newMessages.push({
          sender: 'ai',
          type: "text",
          data: 'Algo deu errado, por favor tente novamente.'
        })

        return newMessages;
      });
      console.error("Error:", error);
      setIsLoading(false);
    }
  }


  useEffect(()=>{
    if(chatRef.current){ chatRef.current.scrollTop = chatRef.current.scrollHeight; } // scrollando o chat para o final
  }, [messages])


  useEffect(()=>{
    textAreaRef.current?.focus();
  }, [isLoading])


  function handleClickDownloadPdf(pdfData: string){
    const link = document.createElement("a");
    console.log('pdfData: ', pdfData)
    link.href = pdfData.trim().replace(/^["']+|["']+$/g, "").replace(/\s/g, ""); // tratamento da resposta;
    link.download = 'pdf-legalai';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  async function handleClickUploadContract(){
    const file = document.getElementById('file-input').files[0]
    console.log(file)
    
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post(`${API_URL}/analyze-contract`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('response da API: ', response.data);
    } catch (error) {
      console.error("Erro ao enviar contrato:", error);
    }
  }


  return (
    <div className='app w-[100vw] h-[100vh] flex flex-col gap-6 bg-zinc-900 text-white'>
      <header className="flex justify-between items-center p-4 bg-zinc-800 shadow-01">
        <h1 className="text-xl">LegalAI</h1>
        <BiMenu className="text-3xl hover:cursor-pointer" />
      </header>

      <div className="flex flex-col">
        <p onClick={handleClickUploadContract} className="p-4 bg-gray-800 self-start hover:cursor-pointer">TestUpload Contract</p>
        <input type="file" name="" id="file-input" />
      </div>

      <main className="grow overflow-hidden flex justify-center px-4">
        {
          (messages.length === 0)
          ?
          <div className="flex items-center">
            <p className="opacity-5" style={{fontSize: `clamp(16px, 20vw, 96px)`}}>LegalAI</p>
          </div>
          :
          <div ref={chatRef} className="grow overflow-auto pr-2 md:max-w-[80vw] lg:max-w-[80vw] flex flex-col gap-6">
            {
              messages.map((message: Message, idx: number)=>{
                if(message.sender === 'ai'){
                  if(message.type === 'pdf'){
                    return(
                      <div key={idx} onClick={()=>{handleClickDownloadPdf(message.data)}} className="flex items-center gap-2 self-start bg-zinc-800 p-2 px-4 rounded-sm hover:cursor-pointer hover:brightness-125">
                        <BiDownload className="text-xl" />
                        <p>Baixar PDF</p>
                      </div>
                    )
                  }
                  else{
                    return(
                      <div key={idx} className="">
                        <div className="prose prose-invert" dangerouslySetInnerHTML={{__html: message.data}}></div>
                      </div>
                    )
                  }
                }
                else{
                  return(
                    <div key={idx} className="self-end p-2 rounded-sm rounded-tr-none bg-zinc-800">
                      <p className="whitespace-pre-line">{message.data}</p>
                    </div>
                  )
                }
              })
            }
            {
              (isLoading) &&
              <div className="self-start">
                <BiLoaderAlt className="rotate text-xl"  />
              </div>
            }
          </div> 
        }
      </main>
        
      <footer className="flex justify-center p-4 pt-0">
        <div className="grow flex justify-between items-center md:max-w-[80vw] lg:max-w-[80vw] p-4 bg-zinc-800 shadow-01 rounded-md">
          <textarea placeholder={(isLoading) ? "Carregando..." : "O que deseja saber?"} rows={1} cols={1} ref={textAreaRef} value={textInput} onChange={handleTextAreaChange} disabled={isLoading} onKeyDown={handleTextAreaKeyDown} className="bg-transparent-50 text-white grow resize-none" />
          {
            (isLoading) ?
            <BiLoaderAlt className="rotate text-xl"  /> :
            <BiSend className="text-2xl hover:cursor-pointer" onClick={sendMessageToAi} />
          }
        </div>
      </footer>
    </div>
  )
}