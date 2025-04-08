import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { BiMenu } from "react-icons/bi";

export type NavbarState = 'first-render' | 'open' | 'closed';


export default function App(){
  const [navbarState, setNavbarState] = useState<NavbarState>('first-render');


  function handleClickToggleNavbarButton(){
    if(navbarState === 'first-render'){ setNavbarState('open'); }
    if(navbarState === 'open'){ setNavbarState('closed'); }
    else{ setNavbarState('open'); }
  }


  return(
    <div className='app w-[100vw] h-[100vh] flex flex-col gap-6 bg-zinc-900 text-white'>
      <header className="flex justify-between items-center p-4 bg-zinc-800 shadow-01 z-20">
        <h1 className="text-xl select-none">LegalAI</h1>
        <BiMenu onClick={handleClickToggleNavbarButton} className="text-3xl hover:cursor-pointer select-none" />
      </header>

      <Navbar state={navbarState} setterStateFunc={setNavbarState} />

      <Outlet />
    </div>
  )
}