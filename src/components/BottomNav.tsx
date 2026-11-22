import React from 'react';
import { useGameStore } from '../store/useGameStore';
import type { GameState } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';
import { BrewMiniPanel } from './BrewMiniPanel';
import { Sparkles, ShoppingBasket, ScrollText } from 'lucide-react';

interface NavItem {
  id: GameState['activeTab'];
  label: string;
  sprite?: string;
  icon?: React.ReactNode;
  hotkey?: string;
}

const navItems: NavItem[] = [
  {
    id: 'menu',
    label: 'Thực đơn',
    sprite: '/assets/sprites/cf_sua_da.png',
    hotkey: '1',
  },
  {
    id: 'upgrade',
    label: 'Nâng cấp',
    icon: <Sparkles className="w-5 h-5 text-[#5C9E54]" />,
    hotkey: '2',
  },
  {
    id: 'decor',
    label: 'Decor',
    sprite: '/assets/sprites/ghe_nhua_do.png',
    hotkey: '3',
  },
  {
    id: 'shop',
    label: 'Shop',
    icon: <ShoppingBasket className="w-5 h-5 text-[#E04F4F]" />,
    hotkey: '4',
  },
  {
    id: 'quest',
    label: 'Nhiệm vụ',
    icon: <ScrollText className="w-5 h-5 text-[#F4A236]" />,
    hotkey: '5',
  },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = useGameStore();

  const handleTabClick = (tabId: GameState['activeTab']) => {
    SoundManager.playIceClink();
    if (activeTab === tabId) {
      setActiveTab(null);
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="absolute bottom-2 md:bottom-3 left-2 right-2 z-30 pointer-events-none select-none max-w-[420px] mx-auto w-full font-sans">
      {/* 1. Barista Coffee Brew Status Bar (matching Mockups 1, 2, 3, 4, 5, 6, 7, 8, 9, 10) */}
      <div className="mb-2">
        <BrewMiniPanel />
      </div>

      {/* 2. Cozy Storybook Bottom Navigation Bar */}
      <nav
        aria-label="Thanh điều hướng trò chơi"
        className="pointer-events-auto grid grid-cols-5 gap-1.5 p-1.5 bg-[#FFF3D6] border-[3px] border-[#4A3222] shadow-[0_5px_0_#4A3222] rounded-2xl"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all game-btn ${
                isActive
                  ? 'bg-[#F4A236] text-[#4A3222] translate-y-[2px] shadow-[0_1px_0_#4A3222]'
                  : 'bg-[#FFFDF9] hover:bg-[#FAF0E1] text-[#4A3222]'
              }`}
              title={`${item.label} (Phím tắt: ${item.hotkey})`}
            >
              {/* Icon / Sprite container */}
              <div className="w-6 h-6 flex items-center justify-center shrink-0 mb-0.5">
                {item.sprite ? (
                  <img
                    src={item.sprite}
                    alt={item.label}
                    className="w-full h-full object-contain drop-shadow-[0_1px_0_rgba(74,50,34,0.3)]"
                  />
                ) : (
                  item.icon
                )}
              </div>

              {/* Tab Title */}
              <span className="text-[11px] font-mali font-bold leading-tight tracking-tight text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
