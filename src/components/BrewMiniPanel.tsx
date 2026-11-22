import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';
import { EventBus } from '../game/EventBus';
import { Zap } from 'lucide-react';

interface BrewMiniPanelProps {
  className?: string;
}

export function BrewMiniPanel({ className = '' }: BrewMiniPanelProps) {
  const { dayPhase } = useGameStore();
  const [brewProgress, setBrewProgress] = useState(35);
  const [boostActive, setBoostActive] = useState(false);

  // Animated continuous brewing bar (matching all 10 mockups)
  useEffect(() => {
    if (dayPhase !== 'OPEN') return;

    const interval = setInterval(() => {
      setBrewProgress((prev) => {
        if (prev >= 100) {
          SoundManager.playWaterPour();
          return 0;
        }
        return prev + (boostActive ? 8 : 2);
      });
    }, 200);

    return () => clearInterval(interval);
  }, [dayPhase, boostActive]);

  const handleBoostClick = () => {
    SoundManager.playWaterPour();
    setBoostActive(true);
    setBrewProgress((prev) => Math.min(100, prev + 25));
    EventBus.emit('customer-speak', {
      name: 'Chủ Quán',
      dialogue: 'Tay nghề nhanh thoăn thoắt! Cà phê phin giọt đậm đà sẵn sàng!',
    });
    setTimeout(() => setBoostActive(false), 2000);
  };

  return (
    <div
      className={`game-panel p-2.5 flex items-center gap-2.5 select-none pointer-events-auto transition-transform ${className}`}
    >
      {/* Phin Icon Card */}
      <div className="w-11 h-11 rounded-xl bg-[#FAF0E1] border-2 border-[#4A3222] shadow-[0_2px_0_#4A3222] flex items-center justify-center shrink-0 overflow-hidden p-1">
        <img
          src="/assets/sprites/phin_ca_phe.png"
          alt="Phin cà phê"
          className="w-full h-full object-contain animate-pulse"
          onError={(e) => {
            // Fallback to emoji if image fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <span className="text-xl hidden only:block">☕</span>
      </div>

      {/* Brewing Progress Section */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-mali font-bold text-[#4A3222] tracking-wide">
            Pha cà phê phin
          </span>
          <span className="text-[11px] font-nunito font-extrabold text-[#7A543A]">
            {Math.round(brewProgress)}%
          </span>
        </div>
        <div className="w-full h-3.5 game-bar-track">
          <div
            className="game-bar-fill transition-all duration-200"
            style={{ width: `${brewProgress}%` }}
          />
        </div>
      </div>

      {/* Boost Button */}
      <button
        onClick={handleBoostClick}
        className={`game-btn px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1 ${
          boostActive ? 'game-btn-gold scale-95' : 'game-btn-cream'
        }`}
        title="Tăng tốc độ pha cà phê"
      >
        <Zap className="w-3.5 h-3.5 fill-[#F4A236] text-[#4A3222]" />
        <span className="font-mali font-bold text-[#4A3222]">Boost</span>
      </button>
    </div>
  );
}
