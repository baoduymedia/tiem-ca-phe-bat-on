import { getRecipesByStage, calcDrinkPrice, calcUpgradeCost } from '../data/gameData';
import { useGameStore, formatVND } from '../store/useGameStore';

export function MenuPanel() {
  const { gold, unlockedRecipes, unlockRecipe, upgradeRecipe, setActiveTab } =
    useGameStore();
  const recipes = getRecipesByStage(1);

  return (
    <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex flex-col justify-end pointer-events-none select-none font-pixel">
      {/* Click backdrop to dismiss */}
      <div
        className="absolute inset-0 pointer-events-auto cursor-pointer"
        onClick={() => setActiveTab(null)}
      />

      {/* Panel container docked right above BottomNav */}
      <div className="relative z-10 bg-[#24140B] border-t-4 border-x-4 border-black shadow-[0_-4px_0px_#000] p-3 max-h-[70vh] flex flex-col animate-in slide-in-from-bottom duration-150 mb-[58px] pointer-events-auto max-w-[620px] mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b-2 border-black mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xl">☕</span>
            <div>
              <h2 className="text-[#FFD700] font-bold text-base tracking-wide uppercase leading-none">
                THỰC ĐƠN QUÁN CÓC (GĐ 1)
              </h2>
              <p className="text-xs text-[#D4A373] mt-0.5 leading-none">
                Pha chế & nâng cấp công thức để tăng giá bán
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

        {/* Recipe list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-y-auto pr-1 flex-1 pb-2">
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
                className="bg-[#2D180C] border-2 border-black shadow-[2px_2px_0px_#000] p-2 flex items-center justify-between gap-2"
              >
                {/* Info */}
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <div className="w-10 h-10 bg-[#1A0E05] flex items-center justify-center p-1 border border-black shrink-0">
                    <img
                      src={`/assets/sprites/${item.id}.png`}
                      alt={item.name}
                      className="w-full h-full object-contain image-rendering-pixelated"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[#FFF8E7] font-bold text-sm truncate uppercase leading-none">
                        {item.name}
                      </h3>
                      {isUnlocked && (
                        <span className="bg-[#15803D] text-[#A8E6CF] text-xs px-1.5 py-0.5 border border-black font-bold shrink-0 leading-none">
                          LV.{level}
                        </span>
                      )}
                    </div>
                    <p className="text-[#FFF8E7]/70 text-xs mt-1 line-clamp-1 leading-none">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2.5 mt-1 text-xs">
                      <span className="text-[#FFD700] font-bold">
                        GIÁ: {formatVND(currentPrice)}
                      </span>
                      <span className="text-[#D4A373]">
                        ⏱ {item.brewTimeSec}S
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="shrink-0">
                  {!isUnlocked ? (
                    <button
                      onClick={() => unlockRecipe(item.id, item.unlockCost)}
                      disabled={!canUnlock}
                      className={`px-3 py-1 text-xs font-bold border-2 transition-transform cursor-pointer text-center uppercase ${
                        canUnlock
                          ? 'bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1A0E05] border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                          : 'bg-stone-800 text-stone-500 border-stone-900 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      MỞ KHÓA
                      <div className="text-[11px] leading-none">
                        {formatVND(item.unlockCost)}
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={() => upgradeRecipe(item.id, upgradeCost)}
                      disabled={!canUpgrade}
                      className={`px-3 py-1 text-xs font-bold border-2 transition-transform cursor-pointer text-center uppercase ${
                        canUpgrade
                          ? 'bg-[#16A34A] hover:bg-[#22C55E] text-white border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                          : 'bg-stone-800 text-stone-500 border-stone-900 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      NÂNG CẤP
                      <div className="text-[11px] leading-none">
                        {formatVND(upgradeCost)}
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
}
