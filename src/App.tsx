/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#0ff] flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono selection:bg-[#f0f] selection:text-black crt-flicker">
      <div className="static-noise"></div>
      <div className="scanlines"></div>
      
      {/* Header */}
      <header className="absolute top-4 left-4 flex flex-col gap-1 z-10">
        <div className="flex items-center gap-2 text-[#f0f]">
          <Terminal size={24} />
          <h1 className="text-3xl font-bold tracking-widest glitch" data-text="SYS.OVERRIDE">
            SYS.OVERRIDE
          </h1>
        </div>
        <p className="text-[#0ff] text-sm tracking-widest border-l-2 border-[#f0f] pl-2">
          EXEC: SNAKE_PROTOCOL.EXE<br/>
          STATUS: COMPROMISED
        </p>
      </header>

      {/* Main Content */}
      <main className="flex flex-col xl:flex-row items-center justify-center gap-8 w-full max-w-7xl z-10 mt-24 xl:mt-0">
        
        {/* Left/Top: Music Player */}
        <div className="w-full xl:w-auto flex justify-center xl:justify-end">
          <MusicPlayer />
        </div>

        {/* Center/Right: Game */}
        <div className="w-full xl:w-auto flex justify-center xl:justify-start">
          <SnakeGame />
        </div>

      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 right-4 text-right text-[#f0f] text-sm tracking-widest z-10 border-r-2 border-[#0ff] pr-2">
        <p className="glitch" data-text="AWAITING_INPUT...">AWAITING_INPUT...</p>
        <p className="text-[#0ff]">SEQ: 0x00F9A</p>
      </footer>
    </div>
  );
}
