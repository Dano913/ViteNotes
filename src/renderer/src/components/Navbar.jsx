import React, { useContext } from "react";
import { ThemeContext } from "./themeContext";
import { Sun, Moon, Minus, Square, X, Heart } from "lucide-react";
import { Link } from 'react-router-dom';
import MediaPlayer from './MediaPlayer';

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleMinimize = () => {
    window.electron?.ipcRenderer?.send("minimize-window");
  };

  const handleMaximize = () => {
    window.electron?.ipcRenderer?.send("maximize-window");
  };

  const handleClose = () => {
    window.electron?.ipcRenderer?.send("close-window");
  };

  return (
    <nav className="bg-[var(--secondary-bg-color)] z-10">
      <div className="text-xs font-poppins font-bold absolute p-1 py-2 flex justify-between items-center w-screen h-12 ">
        <div className="w-[25%] flex items-center">
          <div className="flex px-5 font-bold text-pink-500 transition duration-100 hover:brightness-150 hover:drop-shadow-[1px_1px_0px_#f0f]">
            <Heart size={17} strokeWidth={2.75} />
          </div>
          <div className="h-6"><MediaPlayer /></div>
        </div>
        <div style={{ WebkitAppRegion: "drag" }} className="w-[15%] h-7">

        </div>
        <div className="text-xs gap-x-6 flex space-x-6 w-[30%] justify-around py-1">
          
          <Link to="/mind" className="flex items-center space-x-2 justify-center w-[20%] font-bold text-[var(--text-color)] transition duration-100 hover:brightness-150 hover:drop-shadow-[1px_1px_0px_#22d3ee]">
            <span>MIND</span>
          </Link>
          <Link to="/time" className="flex items-center space-x-2 justify-center w-[20%] font-bold text-[var(--text-color)] transition duration-100 hover:brightness-150 hover:drop-shadow-[1px_1px_0px_#22d3ee]">
            <span>TIME</span>
          </Link>
          <Link to="/crypto" className="flex items-center space-x-2 justify-center w-[20%] font-bold text-[var(--text-color)] transition duration-100 hover:brightness-150 hover:drop-shadow-[1px_1px_0px_#22d3ee]">
            <span>CRYPTO</span>
          </Link>
          <Link to="/budget" className="flex items-center space-x-2 justify-center w-[20%] font-bold text-[var(--text-color)] transition duration-100 hover:brightness-150 hover:drop-shadow-[1px_1px_0px_#22d3ee]">
            <span>BUDGET</span>
          </Link>
          <Link to="/news" className="flex items-center space-x-2 justify-center w-[20%] font-bold text-[var(--text-color)] transition duration-100 hover:brightness-150 hover:drop-shadow-[1px_1px_0px_#22d3ee]">
            <span>NEWS</span>
          </Link>
        </div>
        <div style={{ WebkitAppRegion: "drag" }} className="w-[32%] h-7">

        </div>
        <div className="flex gap-2 w-[10%] h-7 justify-end px-2">
          
          <button
            onClick={toggleTheme}
            className="px-2 rounded-lg"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-yellow-300"  />
            ) : (
              <Moon className="h-4 w-4 text-blue-900" />
            )}
          </button>

          <button onClick={handleMinimize} className="w-8 justify-center items-center flex font-bold text-red-500 transition duration-100 hover:brightness-150 hover:drop-shadow-[1px_1px_0px_#FF4500]">
            <Minus size={17} strokeWidth={2.75}/>
          </button>

          <button onClick={handleMaximize} className="w-8 justify-center items-center flex font-bold text-red-500 transition duration-100 hover:brightness-150 hover:drop-shadow-[1px_1px_0px_#FF4500]">
            <Square size={12} strokeWidth={2.75}/>
          </button>

          <button onClick={handleClose} className="w-8 justify-center items-center flex font-bold text-red-500 transition duration-100 hover:brightness-150 hover:drop-shadow-[1px_1px_0px_#FF4500]">
            <X size={17} strokeWidth={2.75}/>
          </button>
        </div>
      </div>
    </nav>
  );
}