import React from 'react';
import { getDecor } from '../data/gameData';
import { useGameStore, formatVND } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';
import { X, Sparkles } from 'lucide-react';

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

  const [currentCategory, setCurrentCategory] = React.useState<
    'all' | 'furniture' | 'decor' | 'special'
  >('all');

  return (
    <div className="absolute inset-0 z-50 bg-[#170C06]/80 backdrop-blur-xs flex items-center justify-center p-3 select-none font-sans animate-in zoom-in-95 duration-150">
      {/* Click backdrop to dismiss */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => setActiveTab(null)}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-[420px] game-panel p-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-2.5 border-b-2 border-[#4A3222]/20 mb-2.5">
          <div className="game-ribbon px-3 py-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#5C9E54]" />
            <div>
              <h2 className="text-[#4A3222] font-mali font-bold text-sm md:text-base tracking-wide leading-none">
                Decor (Trang trí quán)
              </h2>
              <p className="text-[10px] text-[#7A543A] font-nunito mt-0.5 font-bold leading-none">
                Tăng điểm sống ảo ⭐ & thu hút khách sành điệu
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab(null)}
            className="w-8 h-8 rounded-full game-btn game-btn-red flex items-center justify-center cursor-pointer transition-transform"
            title="Đóng bảng"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="grid grid-cols-4 gap-1.5 mb-2.5">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'furniture', label: 'Bàn ghế' },
            { id: 'decor', label: 'Trang trí' },
            { id: 'special', label: 'Đặc biệt' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentCategory(tab.id as any)}
              className={`py-1 text-[11px] font-mali font-bold rounded-xl transition-all game-btn ${
                currentCategory === tab.id
                  ? 'game-btn-gold'
                  : 'game-btn-cream'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3-Column Card Grid */}
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
                className="game-card p-2 flex flex-col justify-between items-center text-center gap-1"
              >
                {/* Item Thumbnail */}
                <div className="w-12 h-12 rounded-xl bg-[#FAF0E1] border-2 border-[#4A3222] flex items-center justify-center text-2xl shadow-inner">
                  {getDecorIcon(item.id)}
                </div>

                {/* Info */}
                <div className="w-full">
                  <h4
                    className="text-[11px] font-mali font-bold text-[#4A3222] truncate"
                    title={item.name}
                  >
                    {item.name}
                  </h4>
                  <span className="text-[10px] text-[#B45309] font-nunito font-extrabold block mt-0.5">
                    ⭐ +{item.reputationBonus}
                  </span>
                </div>

                {/* Button */}
                <div className="w-full pt-0.5">
                  {isOwned ? (
                    <button
                      onClick={() => toggleEquipDecor(item.id)}
                      className={`w-full py-1 text-[10px] font-nunito font-extrabold rounded-lg transition-all game-btn ${
                        isEquipped ? 'game-btn-green' : 'game-btn-gold'
                      }`}
                    >
                      {isEquipped ? 'Đang dùng' : 'Lắp đặt'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={isLocked || !canAfford}
                      className={`w-full py-1 text-[10px] font-nunito font-extrabold rounded-lg transition-all game-btn ${
                        isLocked
                          ? 'bg-stone-200 text-stone-400 border-[#8C7A6B] cursor-not-allowed shadow-none'
                          : canAfford
                          ? 'game-btn-gold'
                          : 'bg-stone-200 text-stone-400 border-[#8C7A6B] cursor-not-allowed shadow-none'
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
        <div className="mt-2.5 pt-2 border-t border-[#4A3222]/20 flex justify-between items-center text-xs text-[#7A543A] font-nunito font-bold">
          <span className="font-mali">Vốn & Hạt vàng:</span>
          <div className="flex items-center gap-2">
            <span className="text-[#4A3222]">🪙 {formatVND(gold)}</span>
            <span className="text-[#B45309]">🫘 {goldenBeans}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
