import { getRecipesByStage, getStages, calcDrinkPrice, calcUpgradeCost } from '../data/gameData';
import { useGameStore, formatVND } from '../store/useGameStore';

export function MenuPanel() {
  const { gold, unlockedRecipes, unlockRecipe, upgradeRecipe, setActiveTab, currentStage } =
    useGameStore();
  const stage = currentStage || 1;
  const stageInfo = getStages().find((s) => s.id === stage);
  const recipes = getRecipesByStage(stage);

  return (
    <div className="absolute inset-0 z-50 cozy-modal-backdrop flex items-center justify-center p-3 select-none font-sans animate-in zoom-in-95 duration-150">
      {/* Click backdrop to dismiss */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => setActiveTab(null)}
      />

      {/* Centered Cozy Card container (matching Mockup 4) */}
      <div className="relative z-10 w-full max-w-[400px] cozy-card p-4 max-h-[85vh] flex flex-col">
        {/* Header Ribbon */}
        <div className="flex justify-between items-center pb-2.5 border-b-2 border-[#D8C7B5] mb-3">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-2xl bg-[#FAF0E1] border border-[#D8C7B5] flex items-center justify-center text-lg">
              ☕
            </span>
            <div>
              <h2 className="text-[#3E2415] font-serif font-black text-base tracking-wide leading-none">
                Thực đơn {stageInfo ? stageInfo.name : `GĐ ${stage}`}
              </h2>
              <p className="text-[11px] text-[#8C6E54] font-semibold mt-0.5 leading-none">
                Nâng cấp công thức để tăng vĩnh viễn giá bán
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

        {/* 2-Column Grid (matching Mockup 4) */}
        <div className="grid grid-cols-2 gap-2.5 overflow-y-auto pr-1 flex-1 pb-1">
          {recipes.map((item) => {
            const isUnlocked = !!unlockedRecipes[item.id];
            const level = unlockedRecipes[item.id] || 0;
            const currentPrice = calcDrinkPrice(item.basePrice, level || 1);
            const upgradeCost = calcUpgradeCost(item.basePrice * 2, level);
            const canUnlock = gold >= item.unlockCost;
            const canUpgrade = gold >= upgradeCost;

            return (
              <div
                key={item.id}
                className="cozy-card-inner p-2.5 flex flex-col justify-between items-center text-center gap-1.5"
              >
                {/* Drink image */}
                <div className="w-16 h-16 bg-[#FAF0E1] border border-[#D8C7B5] rounded-xl flex items-center justify-center p-1 shadow-inner">
                  <img
                    src={`/assets/sprites/${item.id}.png`}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                {/* Name & details */}
                <div className="w-full">
                  <h3 className="text-xs font-bold text-[#3E2415] truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-[11px] text-[#8C6E54] font-bold mt-0.5">
                    {isUnlocked ? (
                      <span className="text-[#4E8A47]">Lv.{level}</span>
                    ) : (
                      <span className="text-stone-400">Chưa mở</span>
                    )}
                    <span>•</span>
                    <span className="text-[#E08738]">{formatVND(currentPrice)}</span>
                  </div>
                </div>

                {/* Action button */}
                <div className="w-full pt-1">
                  {!isUnlocked ? (
                    <button
                      onClick={() => unlockRecipe(item.id, item.unlockCost)}
                      disabled={!canUnlock}
                      className={`w-full py-1.5 px-1 text-xs font-bold rounded-xl transition-all ${
                        canUnlock
                          ? 'cozy-btn-orange'
                          : 'cozy-btn-gray opacity-70 cursor-not-allowed'
                      }`}
                    >
                      Mở khóa ({formatVND(item.unlockCost)})
                    </button>
                  ) : (
                    <button
                      onClick={() => upgradeRecipe(item.id, upgradeCost)}
                      disabled={!canUpgrade}
                      className={`w-full py-1.5 px-1 text-xs font-bold rounded-xl transition-all ${
                        canUpgrade
                          ? 'cozy-btn-orange'
                          : 'cozy-btn-gray opacity-70 cursor-not-allowed'
                      }`}
                    >
                      Nâng cấp ({formatVND(upgradeCost)})
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

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
