import { useState, useRef } from "react";
import { BiMenu, BiSend } from "react-icons/bi";


type Message = {
  sender: 'user' | 'ai';
  data: string,
}

const defaultMessages: Message[] = [
  {
    sender: 'user',
    data: 'Quem é o cabra mais inteligente do mundo?'
  },
  {
    sender: 'ai',
    data: 'Você mesmo!'
  }
]


export default function App(){
  const [textInput, setTextInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
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
    <div className='w-[100vw] h-[100vh] flex flex-col gap-4 bg-zinc-900 text-white'>
      <header className="flex justify-between items-center p-4 bg-zinc-800 shadow-01">
        <h1 className="text-lg">LegalAI</h1>
        <BiMenu className="text-2xl hover:cursor-pointer" />
      </header>

      <div className="p-4 pt-0 grow flex flex-col gap-4 overflow-hidden">
        <main className="grow overflow-auto max-w-[80vw] self-center pr-2 flex flex-col gap-4">
          {
            messages.map((message: Message)=>{
              if(message.sender === 'ai'){
                return(
                  <div className="p-2 rounded-sm bg-blue-500">
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
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas illo, repellat, eos nihil deleniti explicabo vel consectetur, laboriosam temporibus corrupti aliquid maiores inventore maxime fugiat sit saepe quia ipsam consequatur?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas illo, repellat, eos nihil deleniti explicabo vel consectetur, laboriosam temporibus corrupti aliquid maiores inventore maxime fugiat sit saepe quia ipsam consequatur?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas illo, repellat, eos nihil deleniti explicabo vel consectetur, laboriosam temporibus corrupti aliquid maiores inventore maxime fugiat sit saepe quia ipsam consequatur?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas illo, repellat, eos nihil deleniti explicabo vel consectetur, laboriosam temporibus corrupti aliquid maiores inventore maxime fugiat sit saepe quia ipsam consequatur?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas illo, repellat, eos nihil deleniti explicabo vel consectetur, laboriosam temporibus corrupti aliquid maiores inventore maxime fugiat sit saepe quia ipsam consequatur?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas illo, repellat, eos nihil deleniti explicabo vel consectetur, laboriosam temporibus corrupti aliquid maiores inventore maxime fugiat sit saepe quia ipsam consequatur?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas illo, repellat, eos nihil deleniti explicabo vel consectetur, laboriosam temporibus corrupti aliquid maiores inventore maxime fugiat sit saepe quia ipsam consequatur?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas illo, repellat, eos nihil deleniti explicabo vel consectetur, laboriosam temporibus corrupti aliquid maiores inventore maxime fugiat sit saepe quia ipsam consequatur?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas illo, repellat, eos nihil deleniti explicabo vel consectetur, laboriosam temporibus corrupti aliquid maiores inventore maxime fugiat sit saepe quia ipsam consequatur?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas illo, repellat, eos nihil deleniti explicabo vel consectetur, laboriosam temporibus corrupti aliquid maiores inventore maxime fugiat sit saepe quia ipsam consequatur?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas illo, repellat, eos nihil deleniti explicabo vel consectetur, laboriosam temporibus corrupti aliquid maiores inventore maxime fugiat sit saepe quia ipsam consequatur?</p>
        </main>

      
        <footer className="flex justify-between items-center p-4 bg-zinc-800 shadow-01 rounded-md">
          <textarea placeholder="O que deseja saber?" rows={1} cols={1} ref={textAreaRef} value={textInput} onChange={handleTextAreaChange} onKeyDown={handleTextAreaKeyDown} className="bg-transparent-50 text-white grow resize-none" />
          <BiSend className="text-2xl hover:cursor-pointer" onClick={sendMessageToAi} />
        </footer>
      </div>
    </div>
  )
}