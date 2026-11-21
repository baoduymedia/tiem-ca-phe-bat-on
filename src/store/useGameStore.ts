import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StageId } from '../data/gameData';

export interface DailyQuestProgress {
  id: string;
  description: string;
  target: number;
  current: number;
  claimed: boolean;
  rewardBeans: number;
}

export interface Inventory {
  coffee: number;
  milk: number;
  ice: number;
  tea: number;
}

export interface DailyReport {
  revenue: number;
  tips: number;
  ingredientCost: number;
  cupsSold: number;
  reputationEarned: number;
}

export interface WeatherForecast {
  type: 'sunny' | 'rainy' | 'patrol';
  title: string;
  desc: string;
}

export interface MarketNews {
  headline: string;
  type: keyof Inventory | 'all';
  multiplier: number;
}

export interface BrewingSession {
  customerSeatIndex: number;
  customerName: string;
  recipeId: string;
  recipeName: string;
  price: number;
}

export interface GameState {
  shopName: string;
  currentStage: StageId;
  gold: number;
  goldenBeans: number;
  reputation: number;
  unlockedRecipes: Record<string, number>;
  upgrades: Record<string, number>;
  equippedDecor: string[];
  ownedDecor: string[];
  hasNoAds: boolean;
  noAdsExpiry: number | null;
  lastActiveTimestamp: number;
  dailyQuests: DailyQuestProgress[];
  settings: {
    bgmVolume: number;
    sfxVolume: number;
  };
  // Day Cycle State
  currentDay: number;
  dayPhase: 'PREP' | 'OPEN' | 'SUMMARY';
  dayTimeRemainingSec: number;
  inventory: Inventory;
  dailyReport: DailyReport;
  weatherForecast: WeatherForecast;
  // UI state
  hasCompletedSplash: boolean;
  activeTab: 'menu' | 'upgrade' | 'decor' | 'shop' | 'quest' | null;
  activeBrewing: BrewingSession | null;
  dirtyTables: number[];
  isRenameModalOpen: boolean;
  isPhotoModeOpen: boolean;
  isRoadmapModalOpen: boolean;
  isWidescreenPC: boolean;
  isMuted: boolean;
  // Real-life solidarity & adversity
  loanAmount: number;
  marketNews: MarketNews;
  friendHelperActiveUntil: number;
  // Temporary buffs
  rainTipBoostUntil: number;
}

export interface GameActions {
  setShopName: (name: string) => void;
  completeSplash: () => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  addGoldenBeans: (amount: number) => void;
  addReputation: (amount: number) => void;
  setActiveTab: (tab: GameState['activeTab']) => void;
  setStage: (stage: StageId) => void;
  unlockRecipe: (recipeId: string, cost: number) => boolean;
  upgradeRecipe: (recipeId: string, cost: number) => boolean;
  buyUpgrade: (upgradeId: string, cost: number) => boolean;
  // Real-life Community Solidarity Actions
  borrowFromUncleBa: (amount?: number) => void;
  repayUncleBa: () => boolean;
  activateFriendHelper: (durationSec?: number) => void;
  // Modal & Audio Actions
  setRenameModalOpen: (open: boolean) => void;
  setPhotoModeOpen: (open: boolean) => void;
  setRoadmapModalOpen: (open: boolean) => void;
  setWidescreenPC: (wide: boolean) => void;
  toggleWidescreenPC: () => void;
  toggleMute: () => void;
  unlockNextStage: () => boolean;
  // Quest Actions
  incrementQuestProgress: (type: 'brew' | 'clean' | 'revenue', amount?: number) => void;
  claimQuestReward: (questId: string) => boolean;
  // Brewing & Table Actions
  startManualBrewing: (session: BrewingSession) => void;
  finishManualBrewing: () => void;
  cancelBrewing: () => void;
  addDirtyTable: (tableIndex: number) => void;
  cleanTable: (tableIndex: number) => number;
  cleanAllDirtyTables: () => number;
  // Day Cycle Actions
  buyIngredient: (type: keyof Inventory, amount: number, cost: number) => boolean;
  hasIngredientsForDrink: (recipeId: string) => boolean;
  consumeIngredientsForDrink: (recipeId: string) => boolean;
  recordDrinkSale: (basePrice: number, tipAmount: number, repGain: number) => void;
  startDay: () => void;
  endDay: () => void;
  nextDay: () => void;
  tickDayTimer: (deltaSec: number) => boolean;
  setRainTipBoost: (durationSec: number) => void;
  updateLastActive: () => void;
  resetGame: () => void;
}

const WEATHERS: WeatherForecast[] = [
  {
    type: 'sunny',
    title: '☀️ Nắng Ráo Sài Gòn',
    desc: 'Thời tiết ấm áp, khách chuộng gọi Cà Phê Sữa Đá và Bạc Xỉu mát lạnh.',
  },
  {
    type: 'rainy',
    title: '🌧️ Mưa Rào Chiều',
    desc: 'Có mưa bất chợt lúc tan tầm, chuẩn bị sẵn sàng bạt che mưa!',
  },
  {
    type: 'patrol',
    title: '🚨 Đô Thị Tuần Tra',
    desc: 'Khu vực có đoàn trật tự đô thị đi tuần tra vỉa hè, chú ý thu ghế nhanh!',
  },
];

export const DAILY_MARKET_NEWS: MarketNews[] = [
  {
    headline: '📰 Bão giá chợ đầu mối: Sữa đặc Ông Thọ tăng giá +35% do nhà máy bảo trì!',
    type: 'milk',
    multiplier: 1.35,
  },
  {
    headline: '📰 Trúng mùa Tây Nguyên: Bột Cà Phê Robusta đại lý trợ giá giảm 20%!',
    type: 'coffee',
    multiplier: 0.8,
  },
  {
    headline: '📰 Nắng nóng đỉnh điểm Sài Gòn: Giá bao đá bi tăng 25%!',
    type: 'ice',
    multiplier: 1.25,
  },
  {
    headline: '📰 Chợ nông sản bình ổn: Giá nguyên vật liệu hôm nay giữ mức bình thường.',
    type: 'all',
    multiplier: 1.0,
  },
];

export function generateDailyQuests(day: number): DailyQuestProgress[] {
  return [
    {
      id: `quest_brew_${day}`,
      description: 'Pha 10 ly cà phê cho khách vỉa hè',
      target: 10,
      current: 0,
      claimed: false,
      rewardBeans: 2,
    },
    {
      id: `quest_clean_${day}`,
      description: 'Dọn dẹp 4 lượt bàn bẩn & gom tiền tip',
      target: 4,
      current: 0,
      claimed: false,
      rewardBeans: 2,
    },
    {
      id: `quest_revenue_${day}`,
      description: 'Đạt mốc 150.000đ doanh thu trong ngày',
      target: 150000,
      current: 0,
      claimed: false,
      rewardBeans: 3,
    },
  ];
}

const initialState: GameState = {
  shopName: 'Tiệm Cà Phê Bất Ổn',
  currentStage: 1,
  gold: 60000,
  goldenBeans: 5,
  reputation: 0,
  unlockedRecipes: { cf_den_da: 1, cf_sua_da: 1 },
  upgrades: {},
  equippedDecor: [],
  ownedDecor: [],
  hasNoAds: false,
  noAdsExpiry: null,
  lastActiveTimestamp: Date.now(),
  dailyQuests: generateDailyQuests(1),
  settings: {
    bgmVolume: 0.5,
    sfxVolume: 0.7,
  },
  // Day cycle default
  currentDay: 1,
  dayPhase: 'PREP',
  dayTimeRemainingSec: 75,
  inventory: {
    coffee: 16,
    milk: 12,
    ice: 30,
    tea: 25,
  },
  dailyReport: {
    revenue: 0,
    tips: 0,
    ingredientCost: 0,
    cupsSold: 0,
    reputationEarned: 0,
  },
  weatherForecast: WEATHERS[0],
  hasCompletedSplash: false,
  activeTab: null,
  activeBrewing: null,
  dirtyTables: [],
  isRenameModalOpen: false,
  isPhotoModeOpen: false,
  isRoadmapModalOpen: false,
  isWidescreenPC: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  isMuted: false,
  loanAmount: 0,
  marketNews: DAILY_MARKET_NEWS[3],
  friendHelperActiveUntil: 0,
  rainTipBoostUntil: 0,
};

/** Format VNĐ: 15.000đ, 1.5M, 2.3B */
export function formatVND(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  return `${amount.toLocaleString('vi-VN')}đ`;
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setShopName: (name: string) => set({ shopName: name }),

      completeSplash: () => set({ hasCompletedSplash: true }),

      addGold: (amount: number) => set((s) => ({ gold: s.gold + amount })),

      spendGold: (amount: number) => {
        const { gold } = get();
        if (gold < amount) return false;
        set({ gold: gold - amount });
        return true;
      },

      addGoldenBeans: (amount: number) =>
        set((s) => ({ goldenBeans: s.goldenBeans + amount })),

      addReputation: (amount: number) =>
        set((s) => ({ reputation: s.reputation + amount })),

      setActiveTab: (tab: GameState['activeTab']) =>
        set((s) => ({ activeTab: s.activeTab === tab ? null : tab })),

      setStage: (stage: StageId) => set({ currentStage: stage }),

      unlockRecipe: (recipeId: string, cost: number) => {
        const { gold, unlockedRecipes } = get();
        if (gold < cost || unlockedRecipes[recipeId]) return false;
        set((s) => ({
          gold: s.gold - cost,
          unlockedRecipes: { ...s.unlockedRecipes, [recipeId]: 1 },
        }));
        return true;
      },

      upgradeRecipe: (recipeId: string, cost: number) => {
        const { gold, unlockedRecipes } = get();
        if (gold < cost) return false;
        const currentLevel = unlockedRecipes[recipeId] || 1;
        set((s) => ({
          gold: s.gold - cost,
          unlockedRecipes: {
            ...s.unlockedRecipes,
            [recipeId]: currentLevel + 1,
          },
        }));
        return true;
      },

      buyUpgrade: (upgradeId: string, cost: number) => {
        const { gold, upgrades } = get();
        if (gold < cost) return false;
        const currentLevel = upgrades[upgradeId] || 0;
        set((s) => ({
          gold: s.gold - cost,
          upgrades: {
            ...s.upgrades,
            [upgradeId]: currentLevel + 1,
          },
        }));
        return true;
      },

      // Real-life Community Solidarity Actions
      borrowFromUncleBa: (amount: number = 50000) => {
        const { gold, loanAmount } = get();
        set({
          gold: gold + amount,
          loanAmount: loanAmount + amount,
        });
      },

      repayUncleBa: () => {
        const { gold, loanAmount, reputation } = get();
        if (loanAmount <= 0 || gold < loanAmount) return false;
        set({
          gold: gold - loanAmount,
          loanAmount: 0,
          reputation: reputation + 5, // +5 sao uy tín làm ăn sòng phẳng
        });
        return true;
      },

      activateFriendHelper: (durationSec: number = 25) => {
        set({ friendHelperActiveUntil: Date.now() + durationSec * 1000 });
      },

      // Modal & Audio Actions
      setRenameModalOpen: (open: boolean) => set({ isRenameModalOpen: open }),
      setPhotoModeOpen: (open: boolean) => set({ isPhotoModeOpen: open }),
      setRoadmapModalOpen: (open: boolean) => set({ isRoadmapModalOpen: open }),
      setWidescreenPC: (wide: boolean) => set({ isWidescreenPC: wide }),
      toggleWidescreenPC: () => set((s) => ({ isWidescreenPC: !s.isWidescreenPC })),
      toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),

      unlockNextStage: () => {
        const { currentStage, gold, reputation } = get();
        const stageReqs: Record<number, { next: StageId; goldReq: number; repReq: number }> = {
          1: { next: 2, goldReq: 250000, repReq: 15 },
          2: { next: 3, goldReq: 1200000, repReq: 50 },
          3: { next: 4, goldReq: 6000000, repReq: 150 },
          4: { next: 5, goldReq: 30000000, repReq: 400 },
          5: { next: 6, goldReq: 150000000, repReq: 1000 },
        };
        const req = stageReqs[currentStage];
        if (!req || gold < req.goldReq || reputation < req.repReq) return false;
        set({
          gold: gold - req.goldReq,
          currentStage: req.next,
        });
        return true;
      },

      // Quest Actions
      incrementQuestProgress: (type: 'brew' | 'clean' | 'revenue', amount: number = 1) => {
        const { dailyQuests } = get();
        const updated = dailyQuests.map((q) => {
          if (q.claimed) return q;
          if (type === 'brew' && q.id.startsWith('quest_brew')) {
            return { ...q, current: Math.min(q.target, q.current + amount) };
          }
          if (type === 'clean' && q.id.startsWith('quest_clean')) {
            return { ...q, current: Math.min(q.target, q.current + amount) };
          }
          if (type === 'revenue' && q.id.startsWith('quest_revenue')) {
            return { ...q, current: Math.min(q.target, q.current + amount) };
          }
          return q;
        });
        set({ dailyQuests: updated });
      },

      claimQuestReward: (questId: string) => {
        const { dailyQuests, goldenBeans } = get();
        const quest = dailyQuests.find((q) => q.id === questId);
        if (!quest || quest.claimed || quest.current < quest.target) return false;
        const updated = dailyQuests.map((q) =>
          q.id === questId ? { ...q, claimed: true } : q
        );
        set({
          dailyQuests: updated,
          goldenBeans: goldenBeans + (quest.rewardBeans || 2),
        });
        return true;
      },

      startManualBrewing: (session: BrewingSession) => set({ activeBrewing: session }),

      finishManualBrewing: () => set({ activeBrewing: null }),

      cancelBrewing: () => set({ activeBrewing: null }),

      addDirtyTable: (tableIndex: number) =>
        set((s) => ({
          dirtyTables: s.dirtyTables.includes(tableIndex)
            ? s.dirtyTables
            : [...s.dirtyTables, tableIndex],
        })),

      cleanTable: (tableIndex: number) => {
        const { dirtyTables } = get();
        if (!dirtyTables.includes(tableIndex)) return 0;
        const tip = Math.floor(Math.random() * 3000) + 2000;
        set((s) => ({
          dirtyTables: s.dirtyTables.filter((t) => t !== tableIndex),
          gold: s.gold + tip,
        }));
        get().incrementQuestProgress('clean', 1);
        return tip;
      },

      cleanAllDirtyTables: () => {
        const { dirtyTables } = get();
        if (dirtyTables.length === 0) return 0;
        const count = dirtyTables.length;
        const totalTip = count * 3000;
        set((s) => ({
          dirtyTables: [],
          gold: s.gold + totalTip,
        }));
        get().incrementQuestProgress('clean', count);
        return totalTip;
      },

      buyIngredient: (type: keyof Inventory, amount: number, cost: number) => {
        const { gold, inventory, dailyReport } = get();
        if (gold < cost) return false;
        set({
          gold: gold - cost,
          inventory: {
            ...inventory,
            [type]: inventory[type] + amount,
          },
          dailyReport: {
            ...dailyReport,
            ingredientCost: dailyReport.ingredientCost + cost,
          },
        });
        return true;
      },

      hasIngredientsForDrink: (recipeId: string) => {
        const { inventory } = get();
        if (recipeId === 'cf_den_da') {
          return inventory.coffee >= 1 && inventory.ice >= 1;
        }
        if (recipeId === 'cf_sua_da') {
          return inventory.coffee >= 1 && inventory.milk >= 1 && inventory.ice >= 1;
        }
        if (recipeId === 'bac_xiu') {
          return inventory.coffee >= 1 && inventory.milk >= 2 && inventory.ice >= 1;
        }
        // Fallback generic
        return inventory.coffee >= 1;
      },

      consumeIngredientsForDrink: (recipeId: string) => {
        const { hasIngredientsForDrink, inventory } = get();
        if (!hasIngredientsForDrink(recipeId)) return false;

        const nextInv = { ...inventory };
        if (recipeId === 'cf_den_da') {
          nextInv.coffee -= 1;
          nextInv.ice -= 1;
        } else if (recipeId === 'cf_sua_da') {
          nextInv.coffee -= 1;
          nextInv.milk -= 1;
          nextInv.ice -= 1;
        } else if (recipeId === 'bac_xiu') {
          nextInv.coffee -= 1;
          nextInv.milk -= 2;
          nextInv.ice -= 1;
        } else {
          nextInv.coffee -= 1;
        }

        set({ inventory: nextInv });
        return true;
      },

      recordDrinkSale: (basePrice: number, tipAmount: number, repGain: number) => {
        const { dailyReport } = get();
        set({
          dailyReport: {
            ...dailyReport,
            revenue: dailyReport.revenue + basePrice,
            tips: dailyReport.tips + tipAmount,
            cupsSold: dailyReport.cupsSold + 1,
            reputationEarned: dailyReport.reputationEarned + repGain,
          },
        });
        get().incrementQuestProgress('brew', 1);
        get().incrementQuestProgress('revenue', basePrice + tipAmount);
      },

      startDay: () => {
        set({
          dayPhase: 'OPEN',
          dayTimeRemainingSec: 75,
          dailyReport: {
            revenue: 0,
            tips: 0,
            ingredientCost: 0,
            cupsSold: 0,
            reputationEarned: 0,
          },
        });
      },

      endDay: () => {
        set({ dayPhase: 'SUMMARY' });
      },

      nextDay: () => {
        const { currentDay } = get();
        const nextDayNum = currentDay + 1;
        const nextWeather = WEATHERS[currentDay % WEATHERS.length];
        const nextMarketNews = DAILY_MARKET_NEWS[nextDayNum % DAILY_MARKET_NEWS.length];
        set({
          currentDay: nextDayNum,
          dayPhase: 'PREP',
          dayTimeRemainingSec: 75,
          weatherForecast: nextWeather,
          marketNews: nextMarketNews,
          dailyQuests: generateDailyQuests(nextDayNum),
        });
      },

      tickDayTimer: (deltaSec: number) => {
        const { dayTimeRemainingSec, dayPhase } = get();
        if (dayPhase !== 'OPEN') return false;

        const nextTime = Math.max(0, dayTimeRemainingSec - deltaSec);
        if (nextTime <= 0) {
          set({ dayTimeRemainingSec: 0, dayPhase: 'SUMMARY' });
          return true; // Day ended
        }
        set({ dayTimeRemainingSec: nextTime });
        return false;
      },

      setRainTipBoost: (durationSec: number) =>
        set({ rainTipBoostUntil: Date.now() + durationSec * 1000 }),

      updateLastActive: () => set({ lastActiveTimestamp: Date.now() }),

      resetGame: () =>
        set({ ...initialState, lastActiveTimestamp: Date.now() }),
    }),
    {
      name: 'tiem-ca-phe-bat-on-save',
    }
  )
);
