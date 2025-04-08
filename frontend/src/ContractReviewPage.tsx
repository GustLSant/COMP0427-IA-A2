import { useRef, useState } from "react";
import axios from "axios";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { API_URL, Response } from "./tools";
import { BiFileFind, BiLoaderAlt, BiUpload } from "react-icons/bi";


export default function ContractReviewPage(){
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [aiMessage, setAiMessage] = useState<string>('');
    const [file, setFile] = useState<File | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const footerButtonClassList: string = "flex justify-between items-center gap-2 p-4 overflow-hidden bg-zinc-800 shadow-01 rounded-md hover:cursor-pointer hover:brightness-125 select-none"


    function handleClickSearchFile(){
        if(!fileInputRef.current){ return; }
        fileInputRef.current.click();
    }


    function handleOnChangeFileInput(event: React.ChangeEvent<HTMLInputElement>){
        if(event.target.files){
            setFile(event.target.files[0]);
        }

        event.target.value = ''; // reseta o valor do input para permitir o mesmo arquivo novamente depois
    }


    async function handleClickUploadFile(){
        if(!file){ return; }

        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", file);
    
        try{
            const response: Response = await axios.post(`${API_URL}/analyze-contract`, formData, {
                headers: {
                'Content-Type': 'multipart/form-data',
                },
            });
    
            const rawHtmlString: string | Promise<string> = await marked.parse(response.data.analysis); // converte para HTML
            const sanitizedHtmlString: string = DOMPurify.sanitize(rawHtmlString); // remove scripts e tags maliciosas
            const treatedMessage: string = sanitizedHtmlString;
            
            setAiMessage(treatedMessage);
            setIsLoading(false);
            setFile(undefined);
            // console.log('response da API: ', response.data);
        }
        catch(error){
            console.error('Erro ao enviar contrato: ', error);
            setAiMessage('Algo deu errado, por favor tente novamente.');
            setIsLoading(false);
            setFile(undefined);
        }
    }


    return(
        <>
            <main className="grow overflow-hidden flex justify-center px-4 fade-in">
                {
                    (aiMessage === '')
                    ?
                    <div className="grow flex flex-col justify-center items-center">
                        <p className="opacity-5 select-none" style={{fontSize: `clamp(16px, 20vw, 96px)`}}>LegalAI</p>
                        <p className=" opacity-15 text-xl text-center">Faça o upload de um contrato abaixo para que nossa<br />inteligência artificial possa analisá-lo</p>
                    </div>
                    :
                    <div className="grow overflow-auto pr-2 md:max-w-[80vw] lg:max-w-[80vw] fade-in">
                        <div className="prose prose-invert" dangerouslySetInnerHTML={{__html: aiMessage}} />
                    </div>
                }
            </main>

            <footer className="flex justify-center p-6 pt-0 fade-in-bottom">
                {
                    (isLoading)
                    ?
                    <div className="flex justify-between items-center p-4 px-10 bg-zinc-800 shadow-01 rounded-md">
                        <BiLoaderAlt className="rotate text-2xl"  />
                    </div>
                    :
                    (file === undefined)
                    ?
                    <div onClick={handleClickSearchFile} className={footerButtonClassList}>
                        <BiFileFind className="text-2xl shrink-0"  />
                        <p>Procurar Arquivo</p>
                    </div>
                    :
                    <div onClick={handleClickUploadFile} className={footerButtonClassList}>
                        <BiUpload className="text-2xl shrink-0"  />
                        <p className="max-w-[500px]">Arquivo Selecionado: {file.name}</p>
                    </div>
                }           
                
                <input ref={fileInputRef} onChange={handleOnChangeFileInput} type="file" accept="application/pdf" name="" id="file-input" className="fixed bottom-[-100px] opacity-0" />
            </footer>
        </>
    )
}