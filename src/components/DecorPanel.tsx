import React from 'react';
import { getDecor } from '../data/gameData';
import { useGameStore, formatVND } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';

export const DecorPanel: React.FC = () => {
  const activeTab = useGameStore((s) => s.activeTab);
  const setActiveTab = useGameStore((s) => s.setActiveTab);
  const gold = useGameStore((s) => s.gold);
  const goldenBeans = useGameStore((s) => s.goldenBeans);
  const currentStage = useGameStore((s) => s.currentStage);
  const ownedDecor = useGameStore((s) => s.ownedDecor);
  const equippedDecor = useGameStore((s) => s.equippedDecor);
  const buyDecor = useGameStore((s) => s.buyDecor);
  const toggleEquipDecor = useGameStore((s) => s.toggleEquipDecor);

  if (activeTab !== 'decor') return null;

  const decors = getDecor();

  const handleBuy = (item: (typeof decors)[0]) => {
    const success = buyDecor(
      item.id,
      item.costGold || 0,
      item.costGoldenBeans || 0,
      item.reputationBonus
    );
    if (success) {
      SoundManager.playCoinTing();
    }
  };

  const getDecorIcon = (id: string) => {
    if (id.includes('cho_du')) return '🐕';
    if (id.includes('den_long')) return '🏮';
    if (id.includes('da_lat')) return '🌸';
    if (id.includes('merch')) return '🏺';
    return '🪴';
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 select-none font-pixel animate-in fade-in duration-150">
      {/* Click backdrop to dismiss */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => setActiveTab(null)}
      />

      {/* Modal Container */}
      <div className="relative z-10 bg-[#24140B] border-4 border-black shadow-[4px_4px_0px_#000] p-3.5 max-h-[82vh] flex flex-col max-w-[440px] w-full">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b-2 border-black mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪴</span>
            <div>
              <h2 className="text-[#FFD700] font-bold text-base tracking-wide uppercase leading-none">
                TRANG TRÍ QUÁN (DECOR)
              </h2>
              <p className="text-xs text-[#D4A373] mt-0.5 leading-none">
                Tăng điểm sống ảo ⭐ & thu hút khách sành điệu
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab(null)}
            className="w-7 h-7 flex items-center justify-center bg-[#DC2626] hover:bg-[#EF4444] text-white text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer transition-transform"
            title="Đóng bảng"
          >
            ✕
          </button>
        </div>

        {/* Decor Items List */}
        <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1 pb-2">
          {decors.map((item) => {
            const isOwned = ownedDecor.includes(item.id);
            const isEquipped = equippedDecor.includes(item.id);
            const isLocked = item.stage > currentStage;

            const canAfford =
              (!item.costGold || gold >= item.costGold) &&
              (!item.costGoldenBeans || goldenBeans >= item.costGoldenBeans);

            return (
              <div
                key={item.id}
                className="bg-[#2D180C] border-2 border-black shadow-[2px_2px_0px_#000] p-2 flex items-center justify-between gap-2"
              >
                <div className="flex-1 flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 bg-[#1A0E05] flex items-center justify-center text-2xl border border-black shrink-0">
                    {getDecorIcon(item.id)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-[#FFF8E7] font-bold text-xs truncate uppercase leading-none">
                        {item.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <span className="text-[#FFD700] font-bold">
                        +{item.reputationBonus} ⭐ Sống ảo
                      </span>
                      {isLocked && (
                        <span className="text-red-400 font-bold">
                          (Khóa: GĐ {item.stage})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {isOwned ? (
                    <button
                      onClick={() => toggleEquipDecor(item.id)}
                      className={`px-3 py-1 text-xs font-bold border-2 uppercase transition-transform cursor-pointer ${
                        isEquipped
                          ? 'bg-[#15803D] hover:bg-[#16A34A] text-white border-black shadow-[2px_2px_0px_#000]'
                          : 'bg-[#451A03] hover:bg-[#5A2508] text-[#FFF8E7] border-black shadow-[2px_2px_0px_#000]'
                      }`}
                    >
                      {isEquipped ? '✓ ĐANG BẬT' : 'CHƯA DÙNG'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={isLocked || !canAfford}
                      className={`px-3 py-1 text-xs font-bold border-2 uppercase transition-transform cursor-pointer text-center ${
                        isLocked
                          ? 'bg-stone-800 text-stone-500 border-stone-900 opacity-50 cursor-not-allowed'
                          : canAfford
                          ? 'bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1A0E05] border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5'
                          : 'bg-stone-800 text-stone-500 border-stone-900 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      MUA NGAY
                      <div className="text-[11px] leading-none">
                        {item.costGold
                          ? formatVND(item.costGold)
                          : `${item.costGoldenBeans} Hạt Vàng 🫘`}
                      </div>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
