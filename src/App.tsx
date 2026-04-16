import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#050505] text-white font-sans flex flex-col">
      <div className="grid grid-cols-[280px_1fr] grid-rows-[1fr_100px] h-full w-full">
        <MusicPlayer />
        <main className="col-start-2 row-start-1 relative flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,#111_0%,#050505_100%)] p-5">
          <SnakeGame />
        </main>
      </div>
    </div>
  );
}
