import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { API_URL, Message, Response } from "./tools";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { BiSend, BiLoaderAlt, BiDownload  } from "react-icons/bi";



export default function ChatPage(){
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
        link.href = pdfData
        .trim()
        .replace(/^["']+|["']+$/g, "")
        .replace(/\n/g, "")
        .replace(/\s/g, "");
        link.download = 'pdf-legalai';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }





    return(
        <>
            <main className="grow overflow-hidden flex justify-center px-4">
                {
                (messages.length === 0)
                ?
                <div className="flex items-center pointer-events-none">
                    <p className="opacity-5 select-none" style={{fontSize: `clamp(16px, 20vw, 96px)`}}>LegalAI</p>
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
        </>
    )
}