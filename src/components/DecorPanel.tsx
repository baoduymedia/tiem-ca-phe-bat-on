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

  const [currentCategory, setCurrentCategory] = React.useState<'all' | 'furniture' | 'decor' | 'special'>('all');

  return (
    <div className="absolute inset-0 z-50 cozy-modal-backdrop flex items-center justify-center p-3 select-none font-sans animate-in zoom-in-95 duration-150">
      {/* Click backdrop to dismiss */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => setActiveTab(null)}
      />

      {/* Modal Container (matching Mockup 9) */}
      <div className="relative z-10 w-full max-w-[420px] cozy-card p-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-2.5 border-b-2 border-[#D8C7B5] mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-2xl bg-[#FAF0E1] border border-[#D8C7B5] flex items-center justify-center text-lg">
              🪴
            </span>
            <div>
              <h2 className="text-[#3E2415] font-serif font-black text-base tracking-wide leading-none">
                Decor (Trang trí quán)
              </h2>
              <p className="text-[11px] text-[#8C6E54] font-semibold mt-0.5 leading-none">
                Tăng điểm sống ảo ⭐ & thu hút khách sành điệu
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab(null)}
            className="w-8 h-8 rounded-full bg-[#FAF0E1] hover:bg-[#EADDC9] text-[#5D4037] text-sm font-black border border-[#DECBB9] flex items-center justify-center cursor-pointer transition-colors"
            title="Đóng bảng"
          >
            ✕
          </button>
        </div>

        {/* Sub-tabs (matching Mockup 9: New, Furniture, Decor, Special) */}
        <div className="grid grid-cols-4 gap-1.5 mb-2.5">
          {[
            { id: 'all', label: 'Mới (New)' },
            { id: 'furniture', label: 'Bàn ghế' },
            { id: 'decor', label: 'Trang trí' },
            { id: 'special', label: 'Đặc biệt' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentCategory(tab.id as any)}
              className={`py-1 text-[11px] font-bold rounded-xl border transition-colors ${
                currentCategory === tab.id
                  ? 'bg-[#E08738] text-white border-[#A85A1D] shadow-xs'
                  : 'bg-[#FAF0E1] text-[#6D4C41] border-[#D8C7B5] hover:bg-[#F0E4D5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3-Column Card Grid (matching Mockup 9) */}
        <div className="grid grid-cols-3 gap-2 overflow-y-auto pr-1 flex-1 pb-1">
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
                className="cozy-card-inner p-2 flex flex-col justify-between items-center text-center gap-1"
              >
                {/* Item Thumbnail */}
                <div className="w-12 h-12 rounded-xl bg-[#FAF0E1] border border-[#D8C7B5] flex items-center justify-center text-2xl shadow-inner">
                  {getDecorIcon(item.id)}
                </div>

                {/* Info */}
                <div className="w-full">
                  <h4 className="text-[11px] font-bold text-[#3E2415] truncate" title={item.name}>
                    {item.name}
                  </h4>
                  <span className="text-[10px] text-[#B45309] font-bold block mt-0.5">
                    ⭐ +{item.reputationBonus} Rep
                  </span>
                </div>

                {/* Button */}
                <div className="w-full pt-0.5">
                  {isOwned ? (
                    <button
                      onClick={() => toggleEquipDecor(item.id)}
                      className={`w-full py-1 text-[10px] font-bold rounded-lg transition-all ${
                        isEquipped
                          ? 'cozy-btn-green'
                          : 'cozy-btn-gold'
                      }`}
                    >
                      {isEquipped ? 'Đang dùng' : 'Lắp đặt'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={isLocked || !canAfford}
                      className={`w-full py-1 text-[10px] font-bold rounded-lg transition-all ${
                        isLocked
                          ? 'cozy-btn-gray opacity-50 cursor-not-allowed'
                          : canAfford
                          ? 'cozy-btn-orange'
                          : 'cozy-btn-gray opacity-70 cursor-not-allowed'
                      }`}
                    >
                      {isLocked ? `GĐ ${item.stage}` : 'Mua'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-2.5 pt-2 border-t border-[#D8C7B5] flex justify-between items-center text-xs text-[#8C6E54]">
          <span className="font-semibold">Vốn & Hạt vàng:</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#3E2415]">🪙 {formatVND(gold)}</span>
            <span className="font-bold text-[#B45309]">🫘 {goldenBeans}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
