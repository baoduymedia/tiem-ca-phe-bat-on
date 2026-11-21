import { useGameStore } from '../store/useGameStore';
import type { GameState } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';

interface NavItem {
  id: GameState['activeTab'];
  label: string;
  icon: string;
  hotkey?: string;
}

const navItems: NavItem[] = [
  { id: 'menu', label: 'Thực đơn', icon: '☕', hotkey: '1' },
  { id: 'upgrade', label: 'Nâng cấp', icon: '⚡', hotkey: '2' },
  { id: 'decor', label: 'Trang trí', icon: '🪴', hotkey: '3' },
  { id: 'shop', label: 'Chợ phố', icon: '🏪', hotkey: '4' },
  { id: 'quest', label: 'Nhiệm vụ', icon: '📜', hotkey: '5' },
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
    <div className="absolute bottom-2 md:bottom-3 left-2 right-2 z-30 pointer-events-none select-none max-w-[540px] mx-auto w-full font-pixel">
      {/* Outer Pixel Arcade Console Frame */}
      <div className="bg-[#2D180C] border-2 border-black shadow-[3px_3px_0px_#000] p-1 pointer-events-auto">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-0.5 cursor-pointer relative transition-transform duration-75
                  ${
                    isActive
                      ? 'bg-[#F59E0B] border-2 border-black shadow-none translate-y-0.5 text-[#1A0E05]'
                      : 'bg-[#451A03] hover:bg-[#5A2508] border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-[#FFF8E7]'
                  }`}
              >
                <span className="text-base leading-none drop-shadow">
                  {item.icon}
                </span>
                <span className={`text-xs font-bold leading-none mt-1 tracking-wider uppercase flex items-center justify-center gap-0.5 ${isActive ? 'text-[#1A0E05]' : 'text-[#FFF8E7]'}`}>
                  <span>{item.label}</span>
                  {item.hotkey && (
                    <span className="hidden md:inline text-[9px] text-[#FFD700] font-bold opacity-80">
                      [{item.hotkey}]
                    </span>
                  )}
                </span>

                {/* Active Indicator Pixel Lamp */}
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-[#DC2626] border border-black absolute -top-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
