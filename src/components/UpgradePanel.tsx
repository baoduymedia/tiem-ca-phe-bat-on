import { getUpgrades, calcUpgradeCost } from '../data/gameData';
import { useGameStore, formatVND } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';

export function UpgradePanel() {
  const { gold, upgrades, buyUpgrade, currentStage, unlockNextStage, setActiveTab, setStaffPanelOpen } = useGameStore();
  const stageUpgrades = getUpgrades().filter((u) => u.stage <= currentStage);

  // Milestone Xe Đẩy Lưu Động (Stage 1 milestone: 250.000đ)
  const isXeDayOwned = currentStage >= 2 || !!upgrades['xe_day_luu_dong'];
  const canBuyXeDay = gold >= 250000;

  const handleUnlockStage2 = () => {
    SoundManager.playCoinTing();
    const success = unlockNextStage();
    if (success) {
      buyUpgrade('xe_day_luu_dong', 0);
    }
  };

  return (
    <div className="absolute inset-0 z-50 cozy-modal-backdrop flex items-center justify-center p-3 select-none font-sans animate-in zoom-in-95 duration-150">
      {/* Click backdrop to dismiss */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => setActiveTab(null)}
      />

      {/* Centered Cozy Card container (matching Mockup 4) */}
      <div className="relative z-10 w-full max-w-[420px] cozy-card p-4 max-h-[85vh] flex flex-col">
        {/* Header Ribbon */}
        <div className="flex justify-between items-center pb-2.5 border-b-2 border-[#D8C7B5] mb-3">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-2xl bg-[#FAF0E1] border border-[#D8C7B5] flex items-center justify-center text-lg">
              ⚡
            </span>
            <div>
              <h2 className="text-[#3E2415] font-serif font-black text-base tracking-wide leading-none">
                Nâng cấp quán (GĐ {currentStage})
              </h2>
              <p className="text-[11px] text-[#8C6E54] font-semibold mt-0.5 leading-none">
                Tuyển nhân sự, nâng cấp dụng cụ & chỗ ngồi
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

        {/* Staff Quick Management Bar */}
        <div className="flex items-center justify-between bg-[#FAF0E1] border border-[#D8C7B5] rounded-xl px-2.5 py-1.5 mb-2.5 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-base">👥</span>
            <span className="font-bold text-[#4A3222] text-[11px]">Đội ngũ nhân sự & Thể lực</span>
          </div>
          <button
            onClick={() => {
              setActiveTab(null);
              setStaffPanelOpen(true);
            }}
            className="py-1 px-2.5 bg-[#E08738] hover:bg-[#ED9445] text-white text-[10px] font-bold rounded-lg border border-[#4A3222] shadow-2xs cursor-pointer active:translate-y-0.5"
          >
            Quản lý ➔
          </button>
        </div>

        {/* 2-Column Grid of Upgrades (matching Mockup 4) */}
        <div className="grid grid-cols-2 gap-2.5 overflow-y-auto pr-1 flex-1 pb-1">
          {stageUpgrades.map((item) => {
            const currentLevel = upgrades[item.id] || 0;
            const isMax = currentLevel >= item.maxLevel;
            const nextCost = calcUpgradeCost(item.baseCost, currentLevel + 1);
            const canAfford = gold >= nextCost;

            return (
              <div
                key={item.id}
                className="cozy-card-inner p-2.5 flex flex-col justify-between items-center text-center gap-1.5"
              >
                {/* Upgrade image */}
                <div className="w-16 h-16 bg-[#FAF0E1] border border-[#D8C7B5] rounded-xl flex items-center justify-center p-1 shadow-inner">
                  <img
                    src={
                      item.id === 'phin_nhom_xin'
                        ? '/assets/sprites/phin_ca_phe.png'
                        : item.id === 'staff_barista_1'
                        ? '/assets/sprites/khach_sinh_vien.png'
                        : item.id === 'staff_cat_shipper'
                        ? '/assets/sprites/pet_meo_muop.png'
                        : '/assets/sprites/ghe_nhua_do.png'
                    }
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="w-full">
                  <h3 className="text-xs font-bold text-[#3E2415] truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-[11px] text-[#8C6E54] font-bold mt-0.5">
                    <span className="text-[#4E8A47]">Lv.{currentLevel}/{item.maxLevel}</span>
                    <span>•</span>
                    <span className="text-[#E08738]">{isMax ? 'Tối đa' : formatVND(nextCost)}</span>
                  </div>
                </div>

                {/* Button */}
                <div className="w-full pt-1">
                  <button
                    onClick={() => buyUpgrade(item.id, nextCost)}
                    disabled={isMax || !canAfford}
                    className={`w-full py-1.5 px-1 text-xs font-bold rounded-xl transition-all ${
                      isMax
                        ? 'cozy-btn-gray opacity-70 cursor-not-allowed'
                        : canAfford
                        ? 'cozy-btn-orange'
                        : 'cozy-btn-gray opacity-70 cursor-not-allowed'
                    }`}
                  >
                    {isMax ? 'Cấp tối đa' : 'Nâng cấp'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Milestone Stage 2 Promo Card */}
        {currentStage === 1 && (
          <div className="mt-2.5 p-2.5 bg-[#FAF0E1] border-2 border-[#D8C7B5] rounded-2xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-2xl shrink-0">🛵</span>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#3E2415] truncate">
                  Xe Đẩy Lưu Động (Giai đoạn 2)
                </h4>
                <p className="text-[10px] text-[#8C6E54] font-semibold line-clamp-1">
                  {isXeDayOwned ? 'Đã mở khóa! Quán tiến hóa sang Stage 2.' : 'Bán mang đi + Món Cà phê muối & Trà chanh'}
                </p>
              </div>
            </div>
            <div>
              <button
                onClick={handleUnlockStage2}
                disabled={isXeDayOwned || !canBuyXeDay}
                className={`py-1.5 px-3 text-xs font-bold rounded-xl shrink-0 ${
                  isXeDayOwned
                    ? 'cozy-btn-green cursor-default'
                    : canBuyXeDay
                    ? 'cozy-btn-gold'
                    : 'cozy-btn-gray opacity-70 cursor-not-allowed'
                }`}
              >
                {isXeDayOwned ? 'Đã đạt' : '250.000đ'}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-2.5 pt-2 border-t border-[#D8C7B5] flex justify-between items-center text-xs text-[#8C6E54]">
          <span className="font-semibold">Vốn hiện có:</span>
          <span className="font-bold text-[#3E2415] bg-[#FAF0E1] px-2 py-0.5 rounded-lg border border-[#DECBB9]">
            🪙 {formatVND(gold)}
          </span>
        </div>
      </div>
    </div>
  );
}
