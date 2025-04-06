import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { BiMenu, BiSend, BiLoaderAlt } from "react-icons/bi";


const API_URL = 'http://127.0.0.1:8000/api';

type Message = {
  sender: 'user' | 'ai';
  data: string,
}

type Response = {
  data: {
    analysis: string,
  }
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
    if(textInput === ''){ return; }

    setIsLoading(true);

    // adicao da mensagem do usuario no chat antes de receber a resposta da IA
    setMessages((prevState: Message[])=>{
      const newMessages: Message[] = [...prevState];
      
      newMessages.push({
        sender: 'user',
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

      setMessages((prevState: Message[])=>{
        const newMessages: Message[] = [...prevState];

        newMessages.push({
          sender: 'ai',
          data: response.data.analysis
        })

        return newMessages;
      });

      setIsLoading(false);
      console.log('response da API: ', response);
    }
    catch(error){
      setMessages((prevState: Message[])=>{
        const newMessages: Message[] = [...prevState];

        newMessages.push({
          sender: 'ai',
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


  return (
    <div className='app w-[100vw] h-[100vh] flex flex-col gap-6 bg-zinc-900 text-white'>
      <header className="flex justify-between items-center p-4 bg-zinc-800 shadow-01">
        <h1 className="text-xl">LegalAI</h1>
        <BiMenu className="text-3xl hover:cursor-pointer" />
      </header>

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
                  return(
                    <div key={idx} className="">
                      <p className="whitespace-pre-line">{message.data}</p>
                    </div>
                  )
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