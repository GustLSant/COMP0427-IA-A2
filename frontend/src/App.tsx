import { useState, useRef } from "react";
import { BiMenu, BiSend } from "react-icons/bi";


type Message = {
  sender: 'user' | 'ai';
  data: string,
}


export default function App(){
  const [textInput, setTextInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
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
    else{ // quebra de linha comum
      console.log('quebra de linha');
    }
  }


  function sendMessageToAi(){
    if(textInput === ''){ return; }

    const newMessages: Message[] = [...messages];
    newMessages.push({
      sender: 'user',
      data: textInput
    })
    newMessages.push({
      sender: 'ai',
      data: 'Resposta da IA'
    })
    setMessages(newMessages);
    setTextInput('');

    // reset na altura do input
    if(textAreaRef.current){
      textAreaRef.current.style.height = 'auto';
    }
  }


  return (
    <div className='app w-[100vw] h-[100vh] flex flex-col gap-4 bg-zinc-900 text-white'>
      <header className="flex justify-between items-center p-4 bg-zinc-800 shadow-01">
        <h1 className="text-lg">LegalAI</h1>
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
          <div className="grow overflow-auto pr-2 md:max-w-[80vw] lg:max-w-[80vw] flex flex-col gap-4">
            {
              messages.map((message: Message)=>{
                if(message.sender === 'ai'){
                  return(
                    <div className="p-2 rounded-sm rounded-tl-none bg-blue-500">
                      <p className="whitespace-pre-line">{message.data}</p>
                    </div>
                  )
                }
                else{
                  return(
                    <div className="self-end p-2 rounded-sm rounded-tr-none bg-red-500">
                      <p className="whitespace-pre-line">{message.data}</p>
                    </div>
                  )
                }
              })
            }
          </div> 
        }
      </main>
        
      <footer className="flex justify-center p-4 pt-0">
        <div className="grow flex justify-between items-center md:max-w-[80vw] lg:max-w-[80vw] p-4 bg-zinc-800 shadow-01 rounded-md">
          <textarea placeholder="O que deseja saber?" rows={1} cols={1} ref={textAreaRef} value={textInput} onChange={handleTextAreaChange} onKeyDown={handleTextAreaKeyDown} className="bg-transparent-50 text-white grow resize-none" />
          <BiSend className="text-2xl hover:cursor-pointer" onClick={sendMessageToAi} />
        </div>
      </footer>
    </div>
  )
}