import { useState, useRef } from "react";
import { BiMenu, BiSend } from "react-icons/bi";

let canSendMessage: boolean = false;


export default function App(){
  const [textInput, setTextInput] = useState<string>('');
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  

  function handleTextAreaChange(event: React.ChangeEvent<HTMLTextAreaElement>){
    setTextInput(event.target.value);
    
    if(textAreaRef.current){
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Ajusta a altura
    }
  };


  function handleTextAreaKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>){
    if(event.key === 'Enter'){
      if(canSendMessage){ // duplo pressionamento do Enter, envio da mensagem
        event.preventDefault();
        canSendMessage = false;
      }
      else{ // quebra da primeira linha
        console.log('quebra da primeira linha');
        canSendMessage = true;
      }
    }
    else{ // digitacao comum
      canSendMessage = false;
    }
  }


  return (
    <div className='w-[100vw] h-[100vh] flex flex-col gap-4 bg-zinc-900 text-white'>
      <header className="flex justify-between items-center p-4 bg-zinc-800 shadow-01">
        <h1 className="text-lg">LegalAI</h1>
        <BiMenu className="text-2xl hover:cursor-pointer" />
      </header>

      <div className="p-4 pt-0 grow flex flex-col gap-4 overflow-hidden">
        <main className="grow overflow-auto max-w-[80vw] self-center">
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
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas illo, repellat, eos nihil deleniti explicabo vel consectetur, laboriosam temporibus corrupti aliquid maiores inventore maxime fugiat sit saepe quia ipsam consequatur?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas illo, repellat, eos nihil deleniti explicabo vel consectetur, laboriosam temporibus corrupti aliquid maiores inventore maxime fugiat sit saepe quia ipsam consequatur?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas illo, repellat, eos nihil deleniti explicabo vel consectetur, laboriosam temporibus corrupti aliquid maiores inventore maxime fugiat sit saepe quia ipsam consequatur?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas illo, repellat, eos nihil deleniti explicabo vel consectetur, laboriosam temporibus corrupti aliquid maiores inventore maxime fugiat sit saepe quia ipsam consequatur?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas illo, repellat, eos nihil deleniti explicabo vel consectetur, laboriosam temporibus corrupti aliquid maiores inventore maxime fugiat sit saepe quia ipsam consequatur?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas illo, repellat, eos nihil deleniti explicabo vel consectetur, laboriosam temporibus corrupti aliquid maiores inventore maxime fugiat sit saepe quia ipsam consequatur?</p>
        
        </main>

      
        <footer className="flex justify-between items-center p-4 bg-zinc-800 shadow-01 rounded-md">
          <textarea placeholder="O que deseja saber?" rows={1} cols={1} ref={textAreaRef} value={textInput} onChange={handleTextAreaChange} onKeyDown={handleTextAreaKeyDown} className="bg-transparent-50 text-white grow resize-none" />
          <BiSend className="text-2xl hover:cursor-pointer" />
        </footer>
      </div>
    </div>
  )
}