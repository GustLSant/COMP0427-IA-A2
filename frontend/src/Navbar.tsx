import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarState } from "./App";


type NavbarProps = {
    state: NavbarState,
    setterStateFunc: (newState: NavbarState) => void;
}


export default function Navbar({state, setterStateFunc}: NavbarProps){
    const navbarRef = useRef<HTMLDivElement | null>(null)
    const navigate = useNavigate();
    const navButtonsStyleClasses = 'p-2 text-center border-b-1 hover:cursor-pointer hover:brightness-125 select-none'
    const visibilityStyleClass = (state === 'first-render') ? 'translate-x-[20px] opacity-0' : ((state === 'open') ? 'fade-in-right' : 'fade-out-right');


    function handleClickLink(link: string){
        setterStateFunc('closed');
        navigate(link);
    }


    return(
        <nav ref={navbarRef} className={`bg-zinc-800 p-2 fixed right-0 top-[62px] bottom-0 shadow-01-left z-10 ${visibilityStyleClass}`}>
            <p onClick={()=>{handleClickLink('/')}} className={`${navButtonsStyleClasses} select-none`} style={{borderColor: 'rgba(255,255,255, 0.15'}}>
                Consultoria
            </p>
            <p onClick={()=>{handleClickLink('/analisar-contrato')}} className={navButtonsStyleClasses} style={{borderColor: 'rgba(255,255,255, 0.15'}}>
                Analisar<br />Contrato
            </p>
        </nav>
    )
}