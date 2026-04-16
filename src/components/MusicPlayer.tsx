import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Pulse',
    artist: 'AI Composer v1.2',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'Cyber Dreams',
    artist: 'Neural Synth Engine',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'Grid Runner',
    artist: 'Bitstream Audio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  }
];

function formatTime(seconds: number) {
  if (isNaN(seconds)) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(dur);
      if (dur) {
        setProgress((current / dur) * 100);
      }
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const track = TRACKS[currentTrack];

  return (
    <>
      <aside className="col-start-1 row-start-1 bg-[rgba(10,10,10,0.8)] border-r border-[rgba(255,255,255,0.1)] p-6 flex flex-col gap-5">
        <h2 className="text-[14px] uppercase tracking-[2px] text-[#ff00ff] mb-2.5 font-sans">Library</h2>
        <div className="flex flex-col gap-3 list-none">
          {TRACKS.map((t, i) => (
            <div 
              key={t.id} 
              onClick={() => { setCurrentTrack(i); setIsPlaying(true); }}
              className={`p-3 rounded-lg border-l-[3px] cursor-pointer transition-colors ${currentTrack === i ? 'border-[#00ffff] bg-[rgba(0,255,255,0.05)]' : 'border-transparent bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)]'}`}
            >
              <span className="font-semibold text-[14px] block font-sans">{t.title}</span>
              <span className="text-[12px] text-[#888] font-sans">{t.artist}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto text-[10px] text-[#444] uppercase font-sans">
          Active Session: 04:12:05
        </div>
      </aside>

      <footer className="col-span-2 row-start-2 bg-[#000] border-t border-[rgba(255,255,255,0.1)] flex items-center px-10 justify-between">
        <audio
          ref={audioRef}
          src={track.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
        
        <div className="flex items-center gap-[15px] w-[300px]">
          <div className="w-[50px] h-[50px] rounded bg-gradient-to-tr from-[#ff00ff] to-[#00ffff] shrink-0" />
          <div className="min-w-0 font-sans">
            <div className="font-bold text-[14px] truncate">{track.title}</div>
            <div className="text-[12px] text-[#888] truncate">{track.artist}</div>
          </div>
        </div>

        <div className="flex items-center gap-[30px]">
          <button 
            onClick={prevTrack}
            className="bg-transparent border-none text-[#00ffff] cursor-pointer opacity-80 hover:opacity-100 transition-all hover:scale-110"
          >
            <SkipBack className="w-8 h-8 drop-shadow-[0_0_8px_#00ffff]" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-[60px] h-[60px] rounded-full border-2 border-[#ff00ff] flex items-center justify-center shadow-[0_0_15px_#ff00ff] bg-transparent text-[#ff00ff] cursor-pointer opacity-90 hover:opacity-100 transition-all hover:scale-110 hover:shadow-[0_0_25px_#ff00ff]"
          >
            {isPlaying ? <Pause className="w-8 h-8 drop-shadow-[0_0_8px_#ff00ff]" /> : <Play className="w-8 h-8 ml-1 drop-shadow-[0_0_8px_#ff00ff]" />}
          </button>
          
          <button 
            onClick={nextTrack}
            className="bg-transparent border-none text-[#00ffff] cursor-pointer opacity-80 hover:opacity-100 transition-all hover:scale-110"
          >
            <SkipForward className="w-8 h-8 drop-shadow-[0_0_8px_#00ffff]" />
          </button>
        </div>

        <div className="flex items-center gap-4 w-[300px]">
          <button 
            onClick={toggleMute}
            className="text-[#888] hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between text-[10px] font-mono text-[#666]">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="h-1 bg-[#333] rounded-[2px] relative w-full">
              <div 
                className="h-full bg-[#00ffff] shadow-[0_0_8px_#00ffff] rounded-[2px] transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
