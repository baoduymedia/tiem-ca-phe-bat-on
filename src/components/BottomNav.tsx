import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { GameState } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';
import { EventBus } from '../game/EventBus';

interface NavItem {
  id: GameState['activeTab'];
  label: string;
  icon: string;
  hotkey?: string;
}

const navItems: NavItem[] = [
  { id: 'menu', label: 'Thực đơn', icon: '☕', hotkey: '1' },
  { id: 'upgrade', label: 'Nâng cấp', icon: '⚡', hotkey: '2' },
  { id: 'decor', label: 'Decor', icon: '🏠', hotkey: '3' },
  { id: 'shop', label: 'Shop', icon: '🧺', hotkey: '4' },
  { id: 'quest', label: 'Nhiệm vụ', icon: '📜', hotkey: '5' },
];

export function BottomNav() {
  const { activeTab, setActiveTab, dayPhase } = useGameStore();
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

  const handleTabClick = (tabId: GameState['activeTab']) => {
    SoundManager.playIceClink();
    if (activeTab === tabId) {
      setActiveTab(null);
    } else {
      setActiveTab(tabId);
    }
  };

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
    <div className="absolute bottom-2 md:bottom-3 left-2 right-2 z-30 pointer-events-none select-none max-w-[420px] mx-auto w-full font-sans">
      {/* 1. Barista Coffee Brew Status Bar (matching Mockups 1, 2, 3, 4, 5, 6, 7, 8, 9, 10) */}
      <div className="mb-2 bg-[#FFF8ED] border-2 border-[#8C6E54] rounded-2xl p-2 shadow-[0_4px_0_#5D4037] pointer-events-auto flex items-center gap-2.5">
        {/* Phin Icon */}
        <div className="w-10 h-10 rounded-xl bg-[#FAF0E1] border border-[#D8C7B5] flex items-center justify-center shrink-0 text-xl shadow-inner">
          ☕
        </div>

        {/* Brewing Progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-serif font-black text-[#3E2415] tracking-wide">
              Pha cà phê phin
            </span>
            <span className="text-[10px] font-bold text-[#8C6E54]">
              {Math.round(brewProgress)}%
            </span>
          </div>
          <div className="w-full h-3 bg-[#422615] rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#D97706] to-[#F59E0B] rounded-full transition-all duration-200"
              style={{ width: `${brewProgress}%` }}
            />
          </div>
        </div>

        {/* Boost Button */}
        <button
          onClick={handleBoostClick}
          className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1 cursor-pointer transition-all ${
            boostActive
              ? 'bg-[#E08738] text-white border-[#A85A1D] scale-95'
              : 'bg-[#FAF0E1] hover:bg-[#F2ECE1] text-[#3E2415] border-[#8C6E54] shadow-[0_2px_0_#5D4037] active:translate-y-0.5 active:shadow-none'
          }`}
          title="Tăng tốc độ pha cà phê"
        >
          <span>⚡</span>
          <span>Boost</span>
        </button>
      </div>

      {/* 2. Cozy Rounded Arched BottomNav Tabs (matching Mockups 1-10) */}
      <div className="bg-[#FFF8ED] border-2 border-[#8C6E54] rounded-2xl p-1.5 shadow-[0_4px_0_#5D4037] pointer-events-auto">
        <div className="grid grid-cols-5 gap-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-0.5 rounded-xl cursor-pointer relative transition-all duration-100 ${
                  isActive
                    ? 'bg-[#FAF0E1] border-2 border-[#E08738] text-[#E08738] shadow-inner'
                    : 'bg-[#FFFDF9] hover:bg-[#FAF0E1] border border-[#D8C7B5] text-[#3E2415] shadow-xs active:scale-95'
                }`}
              >
                <span className="text-xl leading-none">
                  {item.icon}
                </span>
                <span className={`text-[11px] font-bold mt-1 tracking-tight ${isActive ? 'text-[#E08738]' : 'text-[#3E2415]'}`}>
                  {item.label}
                </span>

                {/* Active Indicator Pip */}
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-[#E08738] rounded-full absolute top-1 right-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
