import React from 'react';
import { useGameStore, formatVND } from '../store/useGameStore';
import { RESTOCK_BASE_COSTS } from '../types/game';
import { SoundManager } from '../game/audio/SoundManager';
import { EventBus } from '../game/EventBus';

export const SubHudBar: React.FC = () => {
  const {
    inventoryStock,
    timeOfDay,
    dayTimeRemainingSec,
    dayPhase,
    gold,
    restockInventory,
    setPhotoModeOpen,
    weatherForecast,
  } = useGameStore();

  const coffee = Math.round(inventoryStock.coffeeStock ?? 100);
  const ice = Math.round(inventoryStock.iceStock ?? 100);
  const milk = Math.round(inventoryStock.milkStock ?? 100);

  const isLowStock = coffee < 20 || ice < 20 || milk < 20;

  // Convert remaining seconds to virtual 06:00 - 22:00 clock
  const totalDaySec = 210;
  const elapsed = Math.max(0, totalDaySec - dayTimeRemainingSec);
  const progressRatio = Math.min(1, Math.max(0, elapsed / totalDaySec));
  const currentTotalMinutes = 6 * 60 + Math.round(progressRatio * (16 * 60)); // 6:00 (360m) to 22:00 (1320m)
  const hour = Math.floor(currentTotalMinutes / 60);
  const minute = currentTotalMinutes % 60;
  const timeFormatted = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

  const phaseIcons: Record<string, { icon: string; label: string; color: string }> = {
    MORNING: { icon: '🌅', label: 'Sáng sớm', color: 'text-amber-700' },
    NOON: { icon: '☀️', label: 'Trưa nắng', color: 'text-orange-600' },
    AFTERNOON: { icon: '🌇', label: 'Xế chiều', color: 'text-rose-600' },
    EVENING: { icon: '🌙', label: 'Tối muộn', color: 'text-indigo-600' },
  };

  const currentPhaseInfo = phaseIcons[timeOfDay] || phaseIcons.MORNING;

  const handleRestock = (type: 'all' | 'coffee' | 'ice' | 'milk') => {
    const cost =
      type === 'all'
        ? RESTOCK_BASE_COSTS.coffee + RESTOCK_BASE_COSTS.ice + RESTOCK_BASE_COSTS.milk
        : RESTOCK_BASE_COSTS[type];

    if (gold < cost) {
      EventBus.emit('customer-speak', {
        name: 'Chủ Quán',
        dialogue: `Chưa đủ tiền nhập hàng! Cần ${formatVND(cost)} để gọi mối giao.`,
      });
      return;
    }

    const success = restockInventory(type);
    if (success) {
      SoundManager.playCoinTing();
      EventBus.emit('customer-speak', {
        name: 'Mối Giao Hàng',
        dialogue: 'Xe giao hàng tới rồi! Nguyên liệu đã nạp đầy 100%!',
      });
    }
  };

  return (
    <div className="absolute top-[76px] left-0 right-0 z-20 pointer-events-none select-none px-2.5 md:px-4 max-w-[420px] mx-auto w-full transition-all duration-300">
      <div className="bg-[#FFF3D6] border-2 border-[#4A3222] shadow-[0_3px_0_#4A3222] px-2.5 py-1.5 rounded-xl pointer-events-auto flex items-center justify-between gap-1.5 text-xs font-nunito">
        
        {/* 1. Virtual Clock & Phase Indicator */}
        <div className="flex items-center gap-1 shrink-0 bg-[#FFFDF9] border-2 border-[#4A3222] px-1.5 py-0.5 rounded-lg shadow-[0_1px_0_#4A3222]">
          <span className="text-sm">{currentPhaseInfo.icon}</span>
          <span className="font-nunito font-extrabold text-[#4A3222] text-[11px] tracking-tight">
            {timeFormatted}
          </span>
          {timeOfDay === 'NOON' && (
            <span className="text-[10px] text-red-600 animate-pulse font-bold" title="Trưa nắng: Đá tan nhanh -1%/15s!">
              🌡️
            </span>
          )}
        </div>

        {/* 2. Mini Stock Percentage Gauges */}
        <div className="flex items-center gap-1.5 flex-1 justify-center min-w-0">
          {/* Coffee Stock */}
          <div
            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border-2 text-[10px] font-extrabold transition-colors cursor-pointer ${
              coffee < 20
                ? 'bg-red-100 text-red-700 border-red-500 animate-pulse'
                : 'bg-[#FFFDF9] text-[#4A3222] border-[#4A3222]'
            }`}
            title={`Cà phê bột: ${coffee}% (Click để nạp đầy - ${formatVND(RESTOCK_BASE_COSTS.coffee)})`}
            onClick={() => coffee < 50 && handleRestock('coffee')}
          >
            <span>☕</span>
            <span>{coffee}%</span>
          </div>

          {/* Ice Stock */}
          <div
            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border-2 text-[10px] font-extrabold transition-colors cursor-pointer ${
              ice < 20
                ? 'bg-red-100 text-red-700 border-red-500 animate-pulse'
                : 'bg-[#FFFDF9] text-sky-800 border-[#4A3222]'
            }`}
            title={`Đá bi: ${ice}% (Click để nạp đầy - ${formatVND(RESTOCK_BASE_COSTS.ice)})`}
            onClick={() => ice < 50 && handleRestock('ice')}
          >
            <span>🧊</span>
            <span>{ice}%</span>
          </div>

          {/* Milk Stock */}
          <div
            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border-2 text-[10px] font-extrabold transition-colors cursor-pointer ${
              milk < 20
                ? 'bg-red-100 text-red-700 border-red-500 animate-pulse'
                : 'bg-[#FFFDF9] text-amber-800 border-[#4A3222]'
            }`}
            title={`Sữa đặc: ${milk}% (Click để nạp đầy - ${formatVND(RESTOCK_BASE_COSTS.milk)})`}
            onClick={() => milk < 50 && handleRestock('milk')}
          >
            <span>🥛</span>
            <span>{milk}%</span>
          </div>
        </div>

        {/* 3. Action Buttons: Restock All */}
        <div className="flex items-center gap-1 shrink-0">
          {isLowStock ? (
            <button
              onClick={() => handleRestock('all')}
              className="game-btn game-btn-red px-2 py-0.5 text-[10px] rounded-lg animate-bounce"
              title="Gọi mối giao hàng nạp đầy cả 3 kho"
            >
              🚚 Nhập kho!
            </button>
          ) : (
            <button
              onClick={() => handleRestock('all')}
              className="game-btn game-btn-cream px-2 py-0.5 text-[10px] rounded-lg"
              title="Gọi mối giao hàng trước khi hết nguyên liệu"
            >
              🚚 Nhập thêm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
