'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

// Symbol definitions (using emojis for simplicity)
const SYMBOLS = {
  PIG: '🐷',
  BEER: '🍺',
  TRUCK: '🚚',
  NEEDLE: '💉',
  WILD: '🥾', // Glowing boot/kick
  SCATTER: '⭐', // Free spins
  MOBILE_HOME: '🏠',
  // Note: User listed truck twice, using once
};

// Symbol values for payout calculation (higher for rarer symbols)
const SYMBOL_VALUES = {
  [SYMBOLS.PIG]: 50, // High value
  [SYMBOLS.BEER]: 20,
  [SYMBOLS.TRUCK]: 15,
  [SYMBOLS.NEEDLE]: 10,
  [SYMBOLS.MOBILE_HOME]: 5,
  [SYMBOLS.WILD]: 0, // Wild multiplies
  [SYMBOLS.SCATTER]: 0, // Scatter for free spins
};

// Paylines (5 lines for a 3x5 grid)
const PAYLINES = [
  [0, 1, 2, 3, 4], // Top row
  [5, 6, 7, 8, 9], // Middle row
  [10, 11, 12, 13, 14], // Bottom row
  [0, 6, 12, 8, 4], // Diagonal
  [10, 6, 2, 8, 14], // Other diagonal
];

// Particle system for effects
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const SlotMachine: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [balance, setBalance] = useState(1); // Start with 1 coin
  const [bet, setBet] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reelPositions, setReelPositions] = useState<number[]>([0, 0, 0, 0, 0]); // For animation
  const [reels, setReels] = useState<string[][]>([]);
  const [winningLines, setWinningLines] = useState<number[]>([]);
  const [lastWin, setLastWin] = useState(0);
  const [freeSpins, setFreeSpins] = useState(0);
  const [jackpot, setJackpot] = useState(1000);
  const [spinHistory, setSpinHistory] = useState<number[]>([]);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [winMessage, setWinMessage] = useState('');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [autoSpin, setAutoSpin] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);
  const audioContextRef = useRef<AudioContext | undefined>(undefined);

  // Initialize reels
  useEffect(() => {
    const initialReels = Array(5).fill(null).map(() =>
      Array(20).fill(null).map(() => getRandomSymbol()) // More symbols for scrolling
    );
    setReels(initialReels);
  }, []);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }, []);

  const getRandomSymbol = () => {
    // Weighted random for RTP simulation
    const weights = {
      [SYMBOLS.PIG]: 5,
      [SYMBOLS.BEER]: 15,
      [SYMBOLS.TRUCK]: 20,
      [SYMBOLS.NEEDLE]: 25,
      [SYMBOLS.MOBILE_HOME]: 30,
      [SYMBOLS.WILD]: 3,
      [SYMBOLS.SCATTER]: 2,
    };
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    for (const [symbol, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) return symbol;
    }
    return SYMBOLS.BEER; // Fallback
  };

  const calculateWins = (reelSymbols: string[][]) => {
    let totalWin = 0;
    const wins: number[] = [];

    PAYLINES.forEach((payline, lineIndex) => {
      const lineSymbols = payline.map(index => {
        const reelIndex = Math.floor(index / 3);
        const rowIndex = index % 3;
        return reelSymbols[reelIndex][rowIndex];
      });

      // Check for wins (3 or more matching symbols)
      for (let length = 5; length >= 3; length--) {
        const symbols = lineSymbols.slice(0, length);
        const firstSymbol = symbols[0];
        if (symbols.every(s => s === firstSymbol || s === SYMBOLS.WILD)) {
          let multiplier = 1;
          const wildCount = symbols.filter(s => s === SYMBOLS.WILD).length;
          if (wildCount > 0) multiplier = Math.pow(2, wildCount);
          totalWin += SYMBOL_VALUES[firstSymbol] * bet * length * multiplier;
          wins.push(lineIndex);
          break;
        }
      }
    });

    // Check for scatters (free spins)
    let scatterCount = 0;
    reelSymbols.forEach(reel => {
      reel.slice(0, 3).forEach(symbol => {
        if (symbol === SYMBOLS.SCATTER) scatterCount++;
      });
    });
    if (scatterCount >= 3) {
      setFreeSpins(prev => prev + 10); // 10 free spins with multiplier
    }

    return { totalWin, wins };
  };

  // Smooth reel spinning animation
  const animateReels = useCallback((startTime: number, duration: number, finalReels: string[][]) => {
    const animate = (currentTime: number = performance.now()) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for realistic stop
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

      setReelPositions(prev => prev.map((pos, index) => {
        const reelProgress = Math.min(progress + index * 0.1, 1); // Staggered stops
        const easedProgress = easeOut(reelProgress);
        return pos + (100 - pos) * easedProgress; // Scroll from current position to final
      }));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete, set final state
        setReels(finalReels);
        setReelPositions([0, 0, 0, 0, 0]);
        setIsSpinning(false);

        const { totalWin, wins } = calculateWins(finalReels);
        setWinningLines(wins);
        setLastWin(totalWin);
        setBalance(prev => prev + totalWin);

        setSpinHistory(prev => [totalWin, ...prev.slice(0, 4)]);

        // Humorous win messages
        if (totalWin > 0) {
          const messages = ["That pig flew!", "Booted to the jackpot!", "Lake splash win!", "Mischievous pig strikes!"];
          setWinMessage(messages[Math.floor(Math.random() * messages.length)]);
          createParticles(totalWin > bet * 10); // Big win particles
          shakeScreen(totalWin > bet * 20);
          playSound('win');
        }

        // Chance for jackpot (1 in 1000)
        if (Math.random() < 0.001) {
          setLastWin(prev => prev + jackpot);
          setBalance(prev => prev + jackpot);
          setJackpot(1000); // Reset
          setWinMessage("JACKPOT! Booted the pig!");
          createParticles(true);
          shakeScreen(true);
          playSound('jackpot');
        }

        // If free spins, trigger another spin
        if (freeSpins > 0) {
          setFreeSpins(prev => prev - 1);
          setTimeout(spin, 1000);
        } else if (autoSpin && balance >= bet) {
          setTimeout(spin, 1500);
        }
      }
    };
    animationRef.current = requestAnimationFrame(animate);
  }, [freeSpins, autoSpin, bet, jackpot]);

  const spin = useCallback(() => {
    if (isSpinning || balance < bet) return;

    setIsSpinning(true);
    setWinningLines([]);
    setLastWin(0);
    setWinMessage('');
    playSound('spin');

    // Deduct bet
    setBalance(prev => prev - bet);

    // Grow jackpot slightly
    setJackpot(prev => prev + Math.floor(bet * 0.01));

    // Generate final reel results
    const finalReels = Array(5).fill(null).map(() =>
      Array(20).fill(null).map(() => getRandomSymbol())
    );

    // Start animation
    animateReels(performance.now(), 2000, finalReels);
  }, [isSpinning, balance, bet, jackpot, animateReels]);

  // Particle system
  const createParticles = (isBigWin: boolean) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < (isBigWin ? 50 : 20); i++) {
      newParticles.push({
        x: Math.random() * 500,
        y: 150,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * -10 - 5,
        life: 0,
        maxLife: 60,
        color: isBigWin ? '#FFD700' : '#FF6B6B',
        size: Math.random() * 5 + 2,
      });
    }
    setParticles(newParticles);
  };

  const updateParticles = () => {
    setParticles(prev => prev.map(p => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      vy: p.vy + 0.2, // Gravity
      life: p.life + 1,
    })).filter(p => p.life < p.maxLife));
  };

  // Screen shake
  const shakeScreen = (isBigWin: boolean) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
    setTimeout(() => {
      container.style.transform = 'translate(0, 0)';
    }, isBigWin ? 500 : 200);
  };

  // Web Audio API for sounds
  const playSound = (type: string) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    switch (type) {
      case 'spin':
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        break;
      case 'win':
        oscillator.frequency.setValueAtTime(523, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.3);
        break;
      case 'jackpot':
        oscillator.frequency.setValueAtTime(659, ctx.currentTime);
        oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.8);
        break;
    }
  };

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = (timestamp?: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw reels with animation
      reels.forEach((reel, reelIndex) => {
        const offset = reelPositions[reelIndex];
        for (let i = 0; i < 3; i++) {
          const symbolIndex = Math.floor(offset / 100) + i;
          const symbol = reel[symbolIndex % reel.length];
          const y = i * 100 - (offset % 100) + 50;
          ctx.font = '48px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(symbol, reelIndex * 100 + 50, y);
        }
      });

      // Draw particles
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 1 - (p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      updateParticles();

      requestAnimationFrame(draw);
    };

    draw();

    // Highlight winning lines
    if (winningLines.length > 0) {
      winningLines.forEach(lineIndex => {
        const payline = PAYLINES[lineIndex];
        payline.forEach(index => {
          const reelIndex = Math.floor(index / 3);
          const rowIndex = index % 3;
          const x = reelIndex * 100 + 50;
          const y = rowIndex * 100 + 50;
          ctx.strokeStyle = 'yellow';
          ctx.lineWidth = 3;
          ctx.strokeRect(x - 25, y - 25, 50, 50);
        });
      });
    }
  }, [reels, reelPositions, winningLines, particles]);

  // Touch support for mobile
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0].clientY;
      if (startY - endY > 50) { // Swipe up to spin
        spin();
      }
    };

    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [spin]);

  return (
    <div ref={containerRef} className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-200 to-green-200 p-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Sun N Fun Slots - Kick the Pig Edition</h1>

      <div className="mb-4 flex flex-wrap justify-center space-x-4 text-lg">
        <div>Balance: {balance} coins</div>
        <div>Bet: {bet}</div>
        <div>Jackpot: {jackpot} coins</div>
        <div>Free Spins: {freeSpins}</div>
      </div>

      <canvas ref={canvasRef} width={500} height={300} className="border-4 border-yellow-400 rounded-lg mb-4 shadow-lg" />

      {winMessage && (
        <div className="text-2xl font-bold text-yellow-600 mb-2 animate-bounce">
          {winMessage}
        </div>
      )}

      <div className="mb-4 flex flex-col items-center space-y-2">
        <button
          onClick={spin}
          disabled={isSpinning}
          className="bg-red-600 hover:bg-red-700 text-white px-12 py-6 text-3xl rounded-full disabled:opacity-50 shadow-lg transition-transform hover:scale-105"
        >
          {isSpinning ? '🎰' : 'SPIN!'}
        </button>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setAutoSpin(!autoSpin)}
            className={`px-4 py-2 rounded ${autoSpin ? 'bg-green-500' : 'bg-gray-500'} text-white`}
          >
            Auto-Spin {autoSpin ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <button onClick={() => setBet(Math.max(1, bet - 1))} className="px-3 py-1 bg-gray-300 rounded">-</button>
        <span className="text-xl">Bet: {bet}</span>
        <button onClick={() => setBet(Math.min(10, bet + 1))} className="px-3 py-1 bg-gray-300 rounded">+</button>
      </div>

      <div className="text-xl mb-4">Last Win: {lastWin} coins</div>

      <div className="mb-4">
        <h3 className="text-lg mb-2">Spin History:</h3>
        <div className="flex space-x-2">
          {spinHistory.map((win, index) => (
            <div key={index} className="px-2 py-1 bg-gray-100 rounded">{win}</div>
          ))}
        </div>
      </div>

      <button onClick={() => setShowHowToPlay(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow">
        How to Play
      </button>

      {showHowToPlay && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-md max-h-96 overflow-y-auto">
            <h2 className="text-2xl mb-4">How to Play Sun N Fun Slots</h2>
            <ul className="space-y-2 text-sm">
              <li>🐷 Pig: High value symbol</li>
              <li>🍺 Beer: Medium value</li>
              <li>🚚 Truck: Medium value</li>
              <li>💉 Needle: Low value</li>
              <li>🏠 Mobile Home: Low value</li>
              <li>🥾 Wild: Multiplies wins</li>
              <li>⭐ Scatter: Free spins</li>
            </ul>
            <p className="mt-4">Match 3+ on paylines. Wilds substitute. 3+ scatters = 10 free spins. Swipe up or tap spin!</p>
            <button onClick={() => setShowHowToPlay(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotMachine;