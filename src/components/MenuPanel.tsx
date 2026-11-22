import { getRecipesByStage, getStages, calcDrinkPrice, calcUpgradeCost } from '../data/gameData';
import { useGameStore, formatVND } from '../store/useGameStore';
import { X, Lock } from 'lucide-react';

export function MenuPanel() {
  const { gold, unlockedRecipes, unlockRecipe, upgradeRecipe, setActiveTab, currentStage } =
    useGameStore();
  const stage = currentStage || 1;
  const stageInfo = getStages().find((s) => s.id === stage);
  const recipes = getRecipesByStage(stage);

  return (
    <div className="absolute inset-0 z-50 bg-[#170C06]/80 backdrop-blur-xs flex items-center justify-center p-3 select-none font-sans animate-in zoom-in-95 duration-150">
      {/* Click backdrop to dismiss */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => setActiveTab(null)}
      />

      {/* Centered Cozy Card container (matching Mockup 4 & 8) */}
      <div className="relative z-10 w-full max-w-[400px] game-panel p-4 max-h-[85vh] flex flex-col">
        {/* Header Ribbon */}
        <div className="flex justify-between items-center pb-2.5 border-b-2 border-[#4A3222]/20 mb-3">
          <div className="game-ribbon px-3 py-1 flex items-center gap-2">
            <span className="text-base">☕</span>
            <h2 className="text-[#4A3222] font-mali font-bold text-sm md:text-base tracking-wide leading-none">
              Thực đơn & Nâng cấp ({stageInfo ? stageInfo.name : `GĐ ${stage}`})
            </h2>
          </div>
          <button
            onClick={() => setActiveTab(null)}
            className="w-8 h-8 rounded-full game-btn game-btn-red flex items-center justify-center cursor-pointer transition-transform"
            title="Đóng bảng"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* 2-Column Grid (matching Mockup 4 & 8) */}
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
                className="game-card p-2.5 flex flex-col justify-between items-center text-center gap-1.5"
              >
                {/* Drink image */}
                <div className="w-16 h-16 bg-[#FAF0E1] border-2 border-[#4A3222] rounded-xl flex items-center justify-center p-1 shadow-inner">
                  <img
                    src={`/assets/sprites/${item.id}.png`}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-2xl hidden only:block">☕</span>
                </div>

                {/* Name & details */}
                <div className="w-full">
                  <h3 className="text-xs font-mali font-bold text-[#4A3222] truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-nunito font-extrabold mt-0.5">
                    {isUnlocked ? (
                      <>
                        <span className="text-[#5C9E54]">Lv.{level}</span>
                        <span className="text-[#7A543A]">•</span>
                        <span className="text-[#E04F4F]">{formatVND(currentPrice)}</span>
                      </>
                    ) : (
                      <span className="text-stone-500 flex items-center gap-0.5">
                        <Lock className="w-3 h-3" /> Chưa mở
                      </span>
                    )}
                  </div>
                </div>

                {/* Action button */}
                <div className="w-full pt-1">
                  {isUnlocked ? (
                    <button
                      onClick={() => upgradeRecipe(item.id, upgradeCost)}
                      disabled={!canUpgrade}
                      className={`w-full py-1.5 px-1 rounded-xl text-xs font-nunito font-extrabold game-btn ${
                        canUpgrade
                          ? 'game-btn-gold'
                          : 'bg-stone-200 text-stone-400 border-[#8C7A6B] cursor-not-allowed shadow-none'
                      }`}
                    >
                      <span>Nâng cấp</span>
                      <span className="block text-[10px] font-bold">
                        {formatVND(upgradeCost)}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => unlockRecipe(item.id, item.unlockCost)}
                      disabled={!canUnlock}
                      className={`w-full py-1.5 px-1 rounded-xl text-xs font-nunito font-extrabold game-btn ${
                        canUnlock
                          ? 'game-btn-green'
                          : 'bg-stone-200 text-stone-400 border-[#8C7A6B] cursor-not-allowed shadow-none'
                      }`}
                    >
                      <span>Mở khóa</span>
                      <span className="block text-[10px] font-bold">
                        {formatVND(item.unlockCost)}
                      </span>
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
}
