import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TriangleAlert, RotateCcw, Power } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 120;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
    setSpeed(INITIAL_SPEED);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOver) resetGame();
        else setIsPaused((p) => !p);
        return;
      }

      if (isPaused || gameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, gameOver]);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (
          prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 1;
            if (newScore > highScore) setHighScore(newScore);
            setSpeed((sp) => Math.max(40, sp - 2));
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [isPaused, gameOver, food, generateFood, highScore, speed]);

  return (
    <div className="flex flex-col items-center justify-center bg-black p-6 border-4 border-[#0ff] shadow-[8px_8px_0px_#f0f] relative">
      <div className="absolute top-0 left-0 bg-[#0ff] text-black px-2 py-1 text-xs font-bold">
        PID: 8092
      </div>
      
      <div className="flex justify-between w-full max-w-[400px] mb-4 text-[#0ff] font-mono mt-4 border-b-2 border-[#f0f] pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl tracking-widest">DATA_VOL: {score}</span>
        </div>
        <div className="flex items-center gap-2 text-[#f0f]">
          <span className="text-xl tracking-widest">MAX_CAP: {highScore}</span>
        </div>
      </div>

      <div
        className="relative bg-black border-2 border-[#0ff] overflow-hidden"
        style={{
          width: '400px',
          height: '400px',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Render Food */}
        <div
          className="bg-[#f0f] animate-pulse"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            margin: '1px',
            boxShadow: '0 0 10px #f0f'
          }}
        />

        {/* Render Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`${
                isHead ? 'bg-[#fff]' : 'bg-[#0ff]'
              }`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
                margin: '1px',
                zIndex: isHead ? 10 : 1,
                boxShadow: isHead ? '0 0 10px #fff' : 'none'
              }}
            />
          );
        })}

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-4 border-[#f0f]">
            <TriangleAlert size={48} className="text-[#f0f] mb-4 animate-bounce" />
            <h2 className="text-4xl text-[#f0f] mb-2 tracking-widest glitch" data-text="FATAL_ERROR">
              FATAL_ERROR
            </h2>
            <p className="text-[#0ff] font-mono mb-6 text-xl">SECTOR_CORRUPTED</p>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-black text-[#0ff] border-2 border-[#0ff] hover:bg-[#0ff] hover:text-black transition-none font-mono tracking-wider uppercase text-xl"
            >
              <RotateCcw size={20} />
              REBOOT_SYS
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
            <button
              onClick={() => setIsPaused(false)}
              className="flex items-center gap-2 px-8 py-4 bg-black text-[#f0f] border-2 border-[#f0f] hover:bg-[#f0f] hover:text-black transition-none font-mono tracking-wider text-2xl"
            >
              <Power size={28} />
              INITIATE
            </button>
            <div className="mt-8 text-center border-t border-[#0ff] pt-4">
              <p className="text-[#0ff] font-mono text-lg">INPUT: [SPACE] TO HALT</p>
              <p className="text-[#0ff] font-mono text-lg">NAV: [ARROWS] TO ROUTE</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
