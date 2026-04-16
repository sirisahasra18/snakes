import { useEffect, useRef, useState } from 'react';

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 0;
    let dy = -1;
    let nextDx = 0;
    let nextDy = -1;
    let gameLoop: number;
    let lastTime = 0;
    const TICK_RATE = 100; // ms per move

    const spawnFood = () => {
      let newFood;
      while (true) {
        newFood = {
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20)
        };
        if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
          break;
        }
      }
      food = newFood;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
      if (!isPlaying && e.key === ' ') {
        setIsPlaying(true);
        setGameOver(false);
        setScore(0);
        snake = [{ x: 10, y: 10 }];
        dx = 0;
        dy = -1;
        nextDx = 0;
        nextDy = -1;
        spawnFood();
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (dy === 0) { nextDx = 0; nextDy = -1; }
          break;
        case 'ArrowDown':
        case 's':
          if (dy === 0) { nextDx = 0; nextDy = 1; }
          break;
        case 'ArrowLeft':
        case 'a':
          if (dx === 0) { nextDx = -1; nextDy = 0; }
          break;
        case 'ArrowRight':
        case 'd':
          if (dx === 0) { nextDx = 1; nextDy = 0; }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const draw = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 440, 440);

      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ff00ff';
      ctx.fillStyle = '#ff00ff';
      ctx.beginPath();
      ctx.arc(food.x * 22 + 11, food.y * 22 + 11, 11, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 8;
      ctx.shadowColor = '#39ff14';
      ctx.fillStyle = '#39ff14';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      snake.forEach((segment) => {
        ctx.fillRect(segment.x * 22, segment.y * 22, 22, 22);
        ctx.strokeRect(segment.x * 22, segment.y * 22, 22, 22);
      });
      ctx.shadowBlur = 0;
    };

    const update = (time: number) => {
      gameLoop = requestAnimationFrame(update);
      
      if (!isPlaying || gameOver) {
        draw();
        return;
      }

      if (time - lastTime < TICK_RATE) return;
      lastTime = time;

      dx = nextDx;
      dy = nextDy;

      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        setGameOver(true);
        setIsPlaying(false);
        return;
      }

      if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          setHighScore(hs => Math.max(hs, newScore));
          return newScore;
        });
        spawnFood();
      } else {
        snake.pop();
      }

      draw();
    };

    gameLoop = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(gameLoop);
    };
  }, [isPlaying, gameOver]);

  return (
    <div className="flex flex-col items-center font-sans">
      <div className="w-[440px] flex justify-between items-end mb-[15px]">
        <div>
          <h1 className="text-[24px] font-[800] tracking-[-1px] text-white m-0 leading-none">
            NEON<span className="text-[#00ffff] drop-shadow-[0_0_5px_#00ffff]">SLITHER</span>
          </h1>
          <p className="text-[10px] opacity-50 uppercase mt-1 m-0">High Score: {highScore}</p>
        </div>
        <div className="text-right">
          <div className="font-mono text-[10px] text-[#39ff14] uppercase">Current Score</div>
          <div className="font-digital text-[64px] font-bold text-white leading-none glitch-text mt-1">
            {score.toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="relative w-[440px] h-[440px] bg-[#0a0a0a] border-2 border-[#39ff14] shadow-[0_0_20px_rgba(57,255,20,0.2)]">
        <canvas
          ref={canvasRef}
          width={440}
          height={440}
          className="w-full h-full block"
        />
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10">
            <h2 className="text-4xl font-bold text-[#ff00ff] mb-4 drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]">
              {gameOver ? 'GAME OVER' : 'SNAKE'}
            </h2>
            <p className="text-white font-mono animate-pulse text-center px-4">
              Press SPACE to {gameOver ? 'Restart' : 'Start'}
            </p>
          </div>
        )}
      </div>
      <p className="mt-[20px] font-mono text-[12px] text-[#555]">
        USE [WASD] TO NAVIGATE THE GRID
      </p>
    </div>
  );
}
