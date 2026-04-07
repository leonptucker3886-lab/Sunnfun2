import React, { useRef, useEffect, useState, useCallback } from 'react';

// Symbol definitions
const SYMBOLS = {
  PIG: '🐷',
  BEER: '🍺',
  TRUCK: '🚚',
  NEEDLE: '💉',
  WILD: '🥾', // Glowing boot/kick
  SCATTER: '⭐', // Free spins
  MOBILE_HOME: '🏠',
};

// Symbol values for payout calculation
const SYMBOL_VALUES = {
  [SYMBOLS.PIG]: 10,
  [SYMBOLS.BEER]: 5,
  [SYMBOLS.TRUCK]: 4,
  [SYMBOLS.NEEDLE]: 3,
  [SYMBOLS.MOBILE_HOME]: 2,
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

interface SlotMachineProps {}

const SlotMachine: React.FC<SlotMachineProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [balance, setBalance] = useState(1000); // Start with 1000 coins
  const [bet, setBet] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState<string[][]>([]);
  const [winningLines, setWinningLines] = useState<number[]>([]);
  const [lastWin, setLastWin] = useState(0);
  const [freeSpins, setFreeSpins] = useState(0);
  const [jackpot, setJackpot] = useState(10000);
  const [spinHistory, setSpinHistory] = useState<number[]>([]);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Initialize reels (3 rows x 5 reels)
  useEffect(() => {
    const initialReels = Array(5).fill(null).map(() =>
      Array(3).fill(null).map(() => getRandomSymbol())
    );
    setReels(initialReels);
  }, []);

  const getRandomSymbol = () => {
    const symbolKeys = Object.keys(SYMBOLS);
    return SYMBOLS[symbolKeys[Math.floor(Math.random() * symbolKeys.length)] as keyof typeof SYMBOLS];
  };

  // Simulate RTP by adjusting win chances
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
      reel.forEach(symbol => {
        if (symbol === SYMBOLS.SCATTER) scatterCount++;
      });
    });
    if (scatterCount >= 3) {
      setFreeSpins(prev => prev + 10); // 10 free spins
    }

    return { totalWin, wins };
  };

  const spin = useCallback(() => {
    if (isSpinning || balance < bet) return;

    setIsSpinning(true);
    setWinningLines([]);
    setLastWin(0);

    // Deduct bet
    setBalance(prev => prev - bet);

    // Grow jackpot slightly
    setJackpot(prev => prev + Math.floor(bet * 0.01));

    // Simulate spinning animation (in a real implementation, this would animate the reels)
    setTimeout(() => {
      const newReels = Array(5).fill(null).map(() =>
        Array(3).fill(null).map(() => getRandomSymbol())
      );
      setReels(newReels);

      const { totalWin, wins } = calculateWins(newReels);

      setWinningLines(wins);
      setLastWin(totalWin);
      setBalance(prev => prev + totalWin);

      // Add to history
      setSpinHistory(prev => [totalWin, ...prev.slice(0, 4)]);

      // Chance for jackpot (1 in 1000)
      if (Math.random() < 0.001) {
        setLastWin(prev => prev + jackpot);
        setBalance(prev => prev + jackpot);
        setJackpot(10000); // Reset
      }

      setIsSpinning(false);

      // If free spins, trigger another spin
      if (freeSpins > 0) {
        setFreeSpins(prev => prev - 1);
        setTimeout(spin, 1000);
      }
    }, 2000); // Spin duration
  }, [isSpinning, balance, bet, jackpot, freeSpins]);

  // Simple canvas drawing (for demonstration)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    reels.forEach((reel, reelIndex) => {
      reel.forEach((symbol, rowIndex) => {
        const x = reelIndex * 100 + 50;
        const y = rowIndex * 100 + 50;
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(symbol, x, y);
      });
    });

    // Highlight winning lines (simplified)
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
  }, [reels, winningLines]);

  // Sound placeholders (Web Audio API)
  const playSound = (type: string) => {
    // Placeholder: In real implementation, load and play audio files
    console.log(`Playing ${type} sound`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-green-100 p-4">
      <h1 className="text-4xl font-bold mb-4">Sun N Fun Slots - Kick the Pig Edition</h1>

      <div className="mb-4 flex space-x-4">
        <div>Balance: {balance} coins</div>
        <div>Bet: {bet}</div>
        <div>Jackpot: {jackpot} coins</div>
        <div>Free Spins: {freeSpins}</div>
      </div>

      <canvas ref={canvasRef} width={500} height={300} className="border-2 border-gray-800 mb-4" />

      <div className="mb-4">
        <button
          onClick={spin}
          disabled={isSpinning}
          className="bg-red-500 text-white px-8 py-4 text-2xl rounded-lg disabled:opacity-50"
        >
          {isSpinning ? 'Spinning...' : 'SPIN!'}
        </button>
      </div>

      <div className="mb-4 flex space-x-4">
        <button onClick={() => setBet(Math.max(1, bet - 1))}>-</button>
        <span>Bet: {bet}</span>
        <button onClick={() => setBet(Math.min(10, bet + 1))}>+</button>
      </div>

      <div>Last Win: {lastWin} coins</div>

      <div className="mt-4">
        <h3>Spin History:</h3>
        <ul>
          {spinHistory.map((win, index) => (
            <li key={index}>{win} coins</li>
          ))}
        </ul>
      </div>

      <button onClick={() => setShowHowToPlay(true)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        How to Play
      </button>

      {showHowToPlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md">
            <h2 className="text-2xl mb-4">How to Play</h2>
            <p>Match 3 or more symbols on paylines to win. Wilds multiply wins. 3+ scatters give free spins. Good luck!</p>
            <button onClick={() => setShowHowToPlay(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotMachine;