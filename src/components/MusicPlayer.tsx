import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, TerminalSquare } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "ERR_01: VOID_SIGNAL",
    artist: "UNKNOWN_ENTITY",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12"
  },
  {
    id: 2,
    title: "ERR_02: CORRUPT_SECTOR",
    artist: "SYS.ADMIN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05"
  },
  {
    id: 3,
    title: "ERR_03: MEMORY_LEAK",
    artist: "GHOST_IN_MACHINE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:44"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="w-full max-w-md bg-black border-4 border-[#f0f] p-6 shadow-[-8px_8px_0px_#0ff] relative">
      <div className="absolute top-0 right-0 bg-[#f0f] text-black px-2 py-1 text-xs font-bold">
        AUDIO.SYS v1.0
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex items-center gap-4 mb-6 mt-4">
        <div className="w-16 h-16 bg-black border-2 border-[#0ff] flex items-center justify-center relative overflow-hidden">
          <TerminalSquare className="text-[#0ff] relative z-10" size={32} />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-80">
              <div className="w-2 h-full bg-[#f0f] animate-[glitch-anim-1_0.5s_infinite_0ms]"></div>
              <div className="w-2 h-full bg-[#0ff] animate-[glitch-anim-2_0.7s_infinite_200ms]"></div>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-hidden border-l-2 border-[#0ff] pl-4">
          <h3 className="text-[#f0f] font-bold text-xl truncate tracking-widest uppercase">
            {currentTrack.title}
          </h3>
          <p className="text-[#0ff] text-lg font-mono truncate">
            SRC: {currentTrack.artist}
          </p>
          <p className="text-white text-sm animate-pulse">
            {isPlaying ? "STREAMING_DATA..." : "STREAM_HALTED"}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="h-4 bg-black mb-6 cursor-pointer border-2 border-[#0ff] relative"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-[#f0f] relative transition-all duration-75"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white"></div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between border-t-2 border-[#f0f] pt-4">
        <div className="flex items-center gap-2 text-[#0ff]">
          <button onClick={() => setIsMuted(!isMuted)} className="hover:text-[#f0f] hover:bg-[#0ff] p-1 transition-none">
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-24 h-2 bg-black border border-[#0ff] appearance-none cursor-pointer accent-[#f0f]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={prevTrack}
            className="p-2 bg-black text-[#0ff] border-2 border-[#0ff] hover:bg-[#0ff] hover:text-black transition-none"
          >
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="px-6 py-2 flex items-center justify-center bg-[#f0f] text-black border-2 border-[#f0f] hover:bg-black hover:text-[#f0f] transition-none font-bold text-xl tracking-widest"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            <span className="ml-2">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>
          
          <button 
            onClick={nextTrack}
            className="p-2 bg-black text-[#0ff] border-2 border-[#0ff] hover:bg-[#0ff] hover:text-black transition-none"
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
