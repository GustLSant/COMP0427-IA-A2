import { Outlet } from "react-router-dom"
import { BiMenu } from "react-icons/bi";


export default function App(){

  return (
    <div className='app w-[100vw] h-[100vh] flex flex-col gap-6 bg-zinc-900 text-white'>
      <header className="flex justify-between items-center p-4 bg-zinc-800 shadow-01">
        <h1 className="text-xl">LegalAI</h1>
        <BiMenu className="text-3xl hover:cursor-pointer" />
      </header>

      <Outlet />
    </div>
  )
}