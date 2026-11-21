import { getUpgrades, calcUpgradeCost } from '../data/gameData';
import { useGameStore, formatVND } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';

export function UpgradePanel() {
  const { gold, upgrades, buyUpgrade, currentStage, unlockNextStage, setActiveTab } = useGameStore();
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
    <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 select-none font-pixel animate-in fade-in duration-150">
      {/* Click backdrop to dismiss */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => setActiveTab(null)}
      />

      {/* Centered Pixel Panel container */}
      <div className="relative z-10 bg-[#24140B] border-4 border-black shadow-[4px_4px_0px_#000] p-3 max-h-[82vh] flex flex-col max-w-[440px] w-full">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b-2 border-black mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <div>
              <h2 className="text-[#FFD700] font-bold text-base tracking-wide uppercase leading-none">
                NÂNG CẤP QUÁN (GIAI ĐOẠN {currentStage})
              </h2>
              <p className="text-xs text-[#D4A373] mt-0.5 leading-none">
                Tăng tốc độ pha, tuyển nhân sự tự động & mở rộng doanh thu
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

        {/* Upgrade list */}
        <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1 pb-2">
          {stageUpgrades.map((item) => {
            const currentLevel = upgrades[item.id] || 0;
            const isMax = currentLevel >= item.maxLevel;
            const nextCost = calcUpgradeCost(item.baseCost, currentLevel + 1);
            const canAfford = gold >= nextCost;

            return (
              <div
                key={item.id}
                className="bg-[#2D180C] border-2 border-black shadow-[2px_2px_0px_#000] p-2 flex items-center justify-between gap-2"
              >
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <div className="w-10 h-10 bg-[#1A0E05] flex items-center justify-center p-1 border border-black shrink-0">
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
                      className="w-full h-full object-contain image-rendering-pixelated"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[#FFF8E7] font-bold text-sm truncate uppercase leading-none">
                        {item.name}
                      </h3>
                      <span className="bg-[#0D9488] text-white text-xs px-1.5 py-0.5 border border-black font-bold shrink-0 leading-none">
                        {currentLevel}/{item.maxLevel}
                      </span>
                    </div>
                    <p className="text-[#FFF8E7]/70 text-xs mt-1 line-clamp-1 leading-none">
                      {item.effect}
                    </p>
                    <span className="text-[#FFD700] text-xs font-bold mt-1 block leading-none">
                      {isMax ? 'ĐÃ ĐẠT CẤP TỐI ĐA' : `GIÁ: ${formatVND(nextCost)}`}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => buyUpgrade(item.id, nextCost)}
                    disabled={isMax || !canAfford}
                    className={`px-3 py-1 text-xs font-bold border-2 transition-transform cursor-pointer text-center uppercase ${
                      isMax
                        ? 'bg-stone-800 text-stone-500 border-stone-900 cursor-not-allowed'
                        : canAfford
                        ? 'bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1A0E05] border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                        : 'bg-stone-800 text-stone-500 border-stone-900 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {isMax ? 'MAX' : 'NÂNG CẤP'}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Cột mốc cuối Stage 1: Xe Đẩy Lưu Động */}
          {currentStage === 1 && (
            <div className="bg-[#3B1515] border-2 border-[#DC2626] shadow-[2px_2px_0px_#000] p-2 flex items-center justify-between gap-2 mt-1">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">🛵</span>
                  <h3 className="text-[#FFF8E7] font-bold text-sm truncate uppercase leading-none">
                    XE ĐẨY LƯU ĐỘNG (GĐ 1 ▶ GĐ 2)
                  </h3>
                </div>
                <p className="text-[#FFF8E7]/70 text-xs mt-1 leading-none">
                  Bán mang đi tại ngã tư sầm uất, x2 lượng khách!
                </p>
                <span className="text-[#FFD700] text-xs font-bold mt-1 block leading-none">
                  {isXeDayOwned ? 'ĐÃ SỞ HỮU XE ĐẨY' : `GIÁ: ${formatVND(250000)}`}
                </span>
              </div>

              <div className="shrink-0">
                <button
                  onClick={handleUnlockStage2}
                  disabled={isXeDayOwned || !canBuyXeDay}
                  className={`px-3 py-1 text-xs font-bold border-2 transition-transform cursor-pointer text-center uppercase ${
                    isXeDayOwned
                      ? 'bg-[#16A34A] text-white border-black cursor-default'
                      : canBuyXeDay
                      ? 'bg-[#DC2626] hover:bg-[#EF4444] text-white border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                      : 'bg-stone-800 text-stone-500 border-stone-900 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {isXeDayOwned ? 'ĐÃ ĐẠT' : 'MỞ KHÓA GĐ 2'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
