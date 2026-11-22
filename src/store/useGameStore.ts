import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StageId } from '../data/gameData';
import { EventBus } from '../game/EventBus';
import type {
  OrderModifier,
  TimeOfDay,
  RoastLevel,
  ProvinceId,
  SpotType,
  TableStatus,
  SeatState,
  InventoryStock,
  BranchLocationState,
  ProvincialLeagueState,
  SignatureRecipe,
  TechTreeState,
  RoasteryState,
  StaffState,
  DailyReport,
} from '../types/game';
import {
  calculateTimeOfDay,
  DEFAULT_DAY_DURATION_SEC,
  RESTOCK_BASE_COSTS,
  TECH_NODE_COSTS,
} from '../types/game';

// Re-export all game types so downstream consumers can import either from types or store
export * from '../types/game';

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
  orderModifier?: OrderModifier;
}

export interface GameState {
  shopName: string;
  ownerGender: 'MALE' | 'FEMALE';
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
  isVietnamMapOpen: boolean;
  isProvincialLeagueOpen: boolean;
  isStaffPanelOpen: boolean;
  isRndModalOpen: boolean;
  isWidescreenPC: boolean;
  isMuted: boolean;
  // Real-life solidarity & adversity
  loanAmount: number;
  marketNews: MarketNews;
  friendHelperActiveUntil: number;
  // Temporary buffs
  rainTipBoostUntil: number;

  // --- Realism Add-on Batch A & B State ---
  timeOfDay: TimeOfDay;
  selectedProvince: ProvinceId;
  selectedLocationType: SpotType;
  seatStates: SeatState[];
  inventoryStock: InventoryStock;
  branchLocations: BranchLocationState[];
  provincialLeague: ProvincialLeagueState;
  signatureRecipes: SignatureRecipe[];
  techTree: TechTreeState;
  roastery: RoasteryState;
  staffState: StaffState;
  staffStamina: number;
}

export interface GameActions {
  setShopName: (name: string) => void;
  setOwnerGender: (gender: 'MALE' | 'FEMALE') => void;
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
  buyDecor: (decorId: string, costGold?: number, costBeans?: number, repBonus?: number) => boolean;
  toggleEquipDecor: (decorId: string) => void;
  // Real-life Community Solidarity Actions
  borrowFromUncleBa: (amount?: number) => void;
  repayUncleBa: () => boolean;
  activateFriendHelper: (durationSec?: number) => void;
  // Modal & Audio Actions
  setRenameModalOpen: (open: boolean) => void;
  setPhotoModeOpen: (open: boolean) => void;
  setRoadmapModalOpen: (open: boolean) => void;
  setVietnamMapOpen: (open: boolean) => void;
  setProvincialLeagueOpen: (open: boolean) => void;
  setStaffPanelOpen: (open: boolean) => void;
  setRndModalOpen: (open: boolean) => void;
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

  // --- Realism Add-on Batch A & B Actions ---
  restockInventory: (type?: 'all' | 'coffee' | 'ice' | 'milk') => boolean;
  setSeatState: (index: number, status: TableStatus, customerId?: string | null, dirtyDroppedVnd?: number) => void;
  updateSeatStatus: (index: number, status: TableStatus, customerId?: string | null, dirtyDroppedVnd?: number) => void;
  consumeInventoryStock: (recipeId: string, modifier?: OrderModifier) => boolean;
  tickIceMelting: (deltaSec: number) => void;
  setProvince: (id: ProvinceId) => void;
  setLocationType: (type: SpotType) => void;
  recordOrderResult: (isPerfect: boolean, tip: number, revenue: number) => void;
  treatStaffMilkTea: () => boolean;
  updateStaffStamina: (delta: number) => void;
  drainStaffStamina: (amount: number) => void;
  addSignatureRecipe: (recipe: Omit<SignatureRecipe, 'id'>) => SignatureRecipe;
  unlockTechNode: (nodeId: string) => boolean;
  addResearchPoints: (amount: number) => void;
  updateRoasterySettings: (beans: 'robusta' | 'arabica', roast: RoastLevel) => void;
  addBranchLocation: (branch: BranchLocationState) => void;
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
  ownerGender: 'MALE',
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
  dayTimeRemainingSec: DEFAULT_DAY_DURATION_SEC,
  inventory: {
    coffee: 16,
    milk: 12,
    ice: 30,
    tea: 25,
  },
  dailyReport: {
    dayNumber: 1,
    revenue: 0,
    tips: 0,
    supplyCost: 0,
    ingredientCost: 0,
    penalties: 0,
    rentCost: 0,
    netProfit: 0,
    cupsSold: 0,
    perfectOrdersCount: 0,
    reputationEarned: 0,
    reviewStars: 5,
    reviewComment: 'Quán bắt đầu ngày mới rộn ràng!',
  },
  weatherForecast: WEATHERS[0],
  hasCompletedSplash: false,
  activeTab: null,
  activeBrewing: null,
  dirtyTables: [],
  isRenameModalOpen: false,
  isPhotoModeOpen: false,
  isRoadmapModalOpen: false,
  isVietnamMapOpen: false,
  isProvincialLeagueOpen: false,
  isStaffPanelOpen: false,
  isRndModalOpen: false,
  isWidescreenPC: false,
  isMuted: false,
  loanAmount: 0,
  marketNews: DAILY_MARKET_NEWS[3],
  friendHelperActiveUntil: 0,
  rainTipBoostUntil: 0,

  // --- Realism Add-on Batch A & B State ---
  timeOfDay: 'MORNING',
  selectedProvince: 'hcm',
  selectedLocationType: 'alley',
  seatStates: [
    { id: 0, index: 0, status: 'EMPTY', customerId: null },
    { id: 1, index: 1, status: 'EMPTY', customerId: null },
    { id: 2, index: 2, status: 'EMPTY', customerId: null },
    { id: 3, index: 3, status: 'EMPTY', customerId: null },
  ],
  inventoryStock: {
    coffeeStock: 100,
    iceStock: 100,
    milkStock: 100,
  },
  branchLocations: [],
  provincialLeague: {
    homeProvinceId: 'hcm',
    weeklyContributionScore: 0,
    currentRankInProvince: 1,
    provinceTotalScore: 1250,
    claimedWeekendReward: false,
  },
  signatureRecipes: [],
  techTree: {
    researchPoints: 0,
    unlockedNodes: [],
  },
  roastery: {
    beanType: 'robusta',
    beansType: 'robusta',
    roastLevel: 'MEDIUM',
    supplyDiscountPercent: 0,
    autoRoast: false,
  },
  staffState: {
    stamina: 100,
    maxStamina: 100,
    isExhausted: false,
    speedMultiplier: 1.0,
    milkTeaBuffUntil: 0,
  },
  staffStamina: 100,
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
  persist<GameState & GameActions>(
    (set, get) => ({
      ...initialState,

      setShopName: (name: string) => set({ shopName: name }),
      setOwnerGender: (gender: 'MALE' | 'FEMALE') => {
        set({ ownerGender: gender });
        EventBus.emit('owner-gender-changed', gender);
      },

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

      buyDecor: (decorId: string, costGold = 0, costBeans = 0, repBonus = 0) => {
        const { gold, goldenBeans, ownedDecor, reputation } = get();
        if (ownedDecor.includes(decorId)) return false;
        if (costGold > 0 && gold < costGold) return false;
        if (costBeans > 0 && goldenBeans < costBeans) return false;
        set((s) => ({
          gold: s.gold - costGold,
          goldenBeans: s.goldenBeans - costBeans,
          ownedDecor: [...s.ownedDecor, decorId],
          equippedDecor: [...s.equippedDecor, decorId],
          reputation: s.reputation + repBonus,
        }));
        return true;
      },

      toggleEquipDecor: (decorId: string) => {
        set((s) => {
          const isEquipped = s.equippedDecor.includes(decorId);
          return {
            equippedDecor: isEquipped
              ? s.equippedDecor.filter((id) => id !== decorId)
              : [...s.equippedDecor, decorId],
          };
        });
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
      setVietnamMapOpen: (open: boolean) => set({ isVietnamMapOpen: open }),
      setProvincialLeagueOpen: (open: boolean) => set({ isProvincialLeagueOpen: open }),
      setStaffPanelOpen: (open: boolean) => set({ isStaffPanelOpen: open }),
      setRndModalOpen: (open: boolean) => set({ isRndModalOpen: open }),
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

      addDirtyTable: (index: number) => {
        set((s) => {
          const tableIdx = index <= 1 ? index : Math.floor(index / 2);
          const newDirtyTables = s.dirtyTables.includes(tableIdx)
            ? s.dirtyTables
            : [...s.dirtyTables, tableIdx];

          const updatedSeats = s.seatStates.map((seat) => {
            const seatTableIdx = Math.floor(seat.index / 2);
            const shouldDirty = (index <= 1 && seatTableIdx === index) || seat.index === index;
            if (shouldDirty) {
              return {
                ...seat,
                status: 'DIRTY' as TableStatus,
                dirtyDroppedVnd: seat.dirtyDroppedVnd ?? (Math.floor(Math.random() * 1001) + 1000),
                dirtySince: seat.dirtySince ?? Date.now(),
              };
            }
            return seat;
          });

          return { dirtyTables: newDirtyTables, seatStates: updatedSeats };
        });
      },

      cleanTable: (idOrIndex: number) => {
        const { dirtyTables, seatStates, gold } = get();

        const isTableMatch = dirtyTables.includes(idOrIndex);
        const isSeatMatch = idOrIndex >= 0 && idOrIndex < seatStates.length && seatStates[idOrIndex].status === 'DIRTY';

        if (!isTableMatch && !isSeatMatch) return 0;

        const tip = Math.floor(Math.random() * 1001) + 1000; // 1.000đ - 2.000đ
        let cleanedSeats = [...seatStates];

        if (idOrIndex <= 1 && isTableMatch) {
          // Clean all seats associated with this table
          cleanedSeats = cleanedSeats.map((seat) =>
            Math.floor(seat.index / 2) === idOrIndex
              ? { ...seat, status: 'EMPTY' as TableStatus, customerId: null, dirtyDroppedVnd: undefined, dirtySince: undefined }
              : seat
          );
        } else if (isSeatMatch) {
          // Clean specific seat
          cleanedSeats = cleanedSeats.map((seat) =>
            seat.index === idOrIndex
              ? { ...seat, status: 'EMPTY' as TableStatus, customerId: null, dirtyDroppedVnd: undefined, dirtySince: undefined }
              : seat
          );
        }

        // Recalculate remaining dirty tables from seatStates
        const isTable0Dirty = cleanedSeats[0]?.status === 'DIRTY' || cleanedSeats[1]?.status === 'DIRTY';
        const isTable1Dirty = cleanedSeats[2]?.status === 'DIRTY' || cleanedSeats[3]?.status === 'DIRTY';
        const nextDirtyTables: number[] = [];
        if (isTable0Dirty) nextDirtyTables.push(0);
        if (isTable1Dirty) nextDirtyTables.push(1);

        set({
          dirtyTables: nextDirtyTables,
          seatStates: cleanedSeats,
          gold: gold + tip,
        });

        get().incrementQuestProgress('clean', 1);
        EventBus.emit('table-cleaned', { index: idOrIndex, tip });
        return tip;
      },

      cleanAllDirtyTables: () => {
        const { dirtyTables, seatStates, gold } = get();
        const dirtySeatsCount = seatStates.filter((s) => s.status === 'DIRTY').length;
        const totalUnits = Math.max(dirtyTables.length, dirtySeatsCount);

        if (totalUnits === 0) return 0;

        let totalTip = 0;
        for (let i = 0; i < totalUnits; i++) {
          totalTip += Math.floor(Math.random() * 1001) + 1000; // 1.000đ - 2.000đ each
        }

        const clearedSeats = seatStates.map((seat) => ({
          ...seat,
          status: 'EMPTY' as TableStatus,
          customerId: null,
          dirtyDroppedVnd: undefined,
          dirtySince: undefined,
        }));

        set({
          dirtyTables: [],
          seatStates: clearedSeats,
          gold: gold + totalTip,
        });

        get().incrementQuestProgress('clean', totalUnits);
        EventBus.emit('all-tables-cleaned', { count: totalUnits, totalTip });
        return totalTip;
      },

      updateSeatStatus: (index: number, status: TableStatus, customerId: string | null = null, dirtyDroppedVnd?: number) => {
        set((s) => {
          const updatedSeats = s.seatStates.map((seat) =>
            seat.index === index
              ? {
                  ...seat,
                  status,
                  customerId,
                  dirtyDroppedVnd: status === 'DIRTY' ? (dirtyDroppedVnd ?? (Math.floor(Math.random() * 1001) + 1000)) : undefined,
                  dirtySince: status === 'DIRTY' ? (seat.dirtySince ?? Date.now()) : undefined,
                }
              : seat
          );

          const isTable0Dirty = updatedSeats[0]?.status === 'DIRTY' || updatedSeats[1]?.status === 'DIRTY';
          const isTable1Dirty = updatedSeats[2]?.status === 'DIRTY' || updatedSeats[3]?.status === 'DIRTY';

          const newDirtyTables: number[] = [];
          if (isTable0Dirty) newDirtyTables.push(0);
          if (isTable1Dirty) newDirtyTables.push(1);

          return { seatStates: updatedSeats, dirtyTables: newDirtyTables };
        });
      },

      setSeatState: (index: number, status: TableStatus, customerId: string | null = null, dirtyDroppedVnd?: number) => {
        get().updateSeatStatus(index, status, customerId, dirtyDroppedVnd);
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
            supplyCost: (dailyReport.supplyCost || 0) + cost,
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
        const newRevenue = dailyReport.revenue + basePrice;
        const newTips = dailyReport.tips + tipAmount;
        const totalExpenses = (dailyReport.supplyCost || 0) + (dailyReport.penalties || 0) + (dailyReport.rentCost || 0);

        set({
          dailyReport: {
            ...dailyReport,
            revenue: newRevenue,
            tips: newTips,
            cupsSold: dailyReport.cupsSold + 1,
            reputationEarned: dailyReport.reputationEarned + repGain,
            netProfit: (newRevenue + newTips) - totalExpenses,
          },
        });
        get().incrementQuestProgress('brew', 1);
        get().incrementQuestProgress('revenue', basePrice + tipAmount);
      },

      startDay: () => {
        set({
          dayPhase: 'OPEN',
          dayTimeRemainingSec: DEFAULT_DAY_DURATION_SEC,
          timeOfDay: 'MORNING',
          dailyReport: {
            dayNumber: get().currentDay,
            revenue: 0,
            tips: 0,
            supplyCost: 0,
            ingredientCost: 0,
            penalties: 0,
            rentCost: 0,
            netProfit: 0,
            cupsSold: 0,
            perfectOrdersCount: 0,
            reputationEarned: 0,
            reviewStars: 5,
            reviewComment: 'Quán mở cửa ngày mới tràn đầy năng lượng!',
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
          dayTimeRemainingSec: DEFAULT_DAY_DURATION_SEC,
          timeOfDay: 'MORNING',
          weatherForecast: nextWeather,
          marketNews: nextMarketNews,
          dailyQuests: generateDailyQuests(nextDayNum),
        });
      },

      tickDayTimer: (deltaSec: number) => {
        const { dayTimeRemainingSec, dayPhase, timeOfDay } = get();
        if (dayPhase !== 'OPEN') return false;

        // SPEC §1.3: iceStock melts -1% / 15s during NOON
        get().tickIceMelting(deltaSec);

        const nextTime = Math.max(0, dayTimeRemainingSec - deltaSec);
        const nextTimeOfDay = calculateTimeOfDay(nextTime, DEFAULT_DAY_DURATION_SEC);

        if (nextTime <= 0) {
          set({
            dayTimeRemainingSec: 0,
            dayPhase: 'SUMMARY',
            timeOfDay: 'EVENING',
          });
          EventBus.emit('day-ended');
          return true; // Crucial boolean return value for CafeScene.ts:1159
        }

        if (nextTimeOfDay !== timeOfDay) {
          set({ dayTimeRemainingSec: nextTime, timeOfDay: nextTimeOfDay });
          EventBus.emit('time-of-day-changed', nextTimeOfDay);
        } else {
          set({ dayTimeRemainingSec: nextTime });
        }
        return false;
      },

      setRainTipBoost: (durationSec: number) =>
        set({ rainTipBoostUntil: Date.now() + durationSec * 1000 }),

      updateLastActive: () => set({ lastActiveTimestamp: Date.now() }),

      resetGame: () =>
        set({ ...initialState, lastActiveTimestamp: Date.now() }),

      // --- Realism Add-on Batch A & B Actions ---

      restockInventory: (type = 'all') => {
        const { gold, inventoryStock, roastery, dailyReport, inventory } = get();
        const discount = (roastery?.supplyDiscountPercent || 0) / 100;

        let costToCharge = 0;
        const newStock = { ...inventoryStock };
        const newInv = { ...inventory };

        const categories: Array<'coffee' | 'ice' | 'milk'> =
          type === 'all' ? ['coffee', 'ice', 'milk'] : [type];

        let anyItemRestocked = false;

        categories.forEach((cat) => {
          const stockKey = `${cat}Stock` as keyof InventoryStock;
          if (newStock[stockKey] < 100) {
            anyItemRestocked = true;
            const baseCost = RESTOCK_BASE_COSTS[cat];
            const effectiveCost = Math.round(baseCost * (1 - discount));
            costToCharge += effectiveCost;
            newStock[stockKey] = 100;

            // Sync legacy discrete inventory units
            if (cat === 'coffee') newInv.coffee = Math.max(newInv.coffee, 30);
            if (cat === 'ice') newInv.ice = Math.max(newInv.ice, 50);
            if (cat === 'milk') newInv.milk = Math.max(newInv.milk, 30);
          }
        });

        if (!anyItemRestocked || gold < costToCharge) return false;

        set({
          gold: gold - costToCharge,
          inventoryStock: newStock,
          inventory: newInv,
          dailyReport: {
            ...dailyReport,
            supplyCost: (dailyReport.supplyCost || 0) + costToCharge,
            ingredientCost: dailyReport.ingredientCost + costToCharge,
          },
        });

        EventBus.emit('inventory-restocked', { type, cost: costToCharge });
        return true;
      },

      consumeInventoryStock: (recipeId: string, modifier?: OrderModifier) => {
        const { inventoryStock } = get();
        const nextStock = { ...inventoryStock };

        // Coffee / Tea depletion: -4%
        nextStock.coffeeStock = Math.max(0, nextStock.coffeeStock - 4);

        // Ice depletion: -5% (adjusted by modifier)
        if (modifier !== 'no_sugar') {
          const iceDeduction = modifier === 'less_ice' ? 2.5 : 5;
          nextStock.iceStock = Math.max(0, nextStock.iceStock - iceDeduction);
        }

        // Milk depletion: -4% (adjusted by modifier)
        if (modifier === 'more_milk') {
          nextStock.milkStock = Math.max(0, nextStock.milkStock - 6);
        } else if (recipeId.includes('sua') || recipeId.includes('bac_xiu')) {
          nextStock.milkStock = Math.max(0, nextStock.milkStock - 4);
        }

        set({ inventoryStock: nextStock });
        return true;
      },

      tickIceMelting: (deltaSec: number) => {
        const { inventoryStock, dayPhase, timeOfDay } = get();
        if (dayPhase !== 'OPEN' || timeOfDay !== 'NOON' || inventoryStock.iceStock <= 0) return;

        // Melts 1% every 15s during NOON
        const meltAmount = deltaSec / 15;
        const currentIce = inventoryStock.iceStock;
        const newIce = Math.max(0, parseFloat((currentIce - meltAmount).toFixed(2)));

        set({
          inventoryStock: {
            ...inventoryStock,
            iceStock: newIce,
          },
        });

        if (newIce < 20 && currentIce >= 20) {
          EventBus.emit('stock-low', { type: 'ice', stock: newIce });
        }
        if (newIce === 0 && currentIce > 0) {
          EventBus.emit('stock-depleted', { type: 'ice' });
        }
      },

      setProvince: (id: ProvinceId) => {
        set((s) => ({
          selectedProvince: id,
          provincialLeague: {
            ...s.provincialLeague,
            homeProvinceId: s.provincialLeague?.homeProvinceId || id,
          },
        }));
        EventBus.emit('province-changed', id);
      },

      setLocationType: (type: SpotType) => {
        set({ selectedLocationType: type });
        EventBus.emit('location-type-changed', type);
      },

      addBranchLocation: (branch: BranchLocationState) => {
        set((s) => ({
          branchLocations: [...(s.branchLocations || []), branch],
        }));
      },

      recordOrderResult: (isPerfect: boolean, tip: number, revenue: number) => {
        const { dailyReport, reputation, provincialLeague, gold } = get();
        const repGain = isPerfect ? 2 : 1;
        const totalVnd = revenue + tip;

        const newRevenue = dailyReport.revenue + revenue;
        const newTips = dailyReport.tips + tip;
        const totalExpenses = (dailyReport.supplyCost || 0) + (dailyReport.penalties || 0) + (dailyReport.rentCost || 0);

        set({
          gold: gold + totalVnd,
          reputation: reputation + repGain,
          dailyReport: {
            ...dailyReport,
            revenue: newRevenue,
            tips: newTips,
            cupsSold: (dailyReport.cupsSold || 0) + 1,
            perfectOrdersCount: (dailyReport.perfectOrdersCount || 0) + (isPerfect ? 1 : 0),
            reputationEarned: (dailyReport.reputationEarned || 0) + repGain,
            netProfit: (newRevenue + newTips) - totalExpenses,
          },
          provincialLeague: {
            ...provincialLeague,
            weeklyContributionScore:
              (provincialLeague?.weeklyContributionScore || 0) +
              (isPerfect ? 10 : 5) +
              Math.floor(totalVnd / 1000),
          },
        });

        get().incrementQuestProgress('brew', 1);
        get().incrementQuestProgress('revenue', totalVnd);
        EventBus.emit('order-result-recorded', { isPerfect, tip, revenue });
      },

      treatStaffMilkTea: () => {
        const { gold, staffState } = get();
        const cost = 15000;
        if (gold < cost) return false;

        const buffUntil = Date.now() + 60 * 1000; // 60 seconds speed boost
        const restoredStamina = staffState.maxStamina || 100;
        set({
          gold: gold - cost,
          staffStamina: restoredStamina,
          staffState: {
            ...staffState,
            stamina: restoredStamina,
            isExhausted: false,
            speedMultiplier: 1.25, // +25% speed buff
            milkTeaBuffUntil: buffUntil,
          },
        });

        EventBus.emit('staff-treated', { stamina: restoredStamina, buffUntil });
        return true;
      },

      updateStaffStamina: (delta: number) => {
        set((s) => {
          const current = s.staffState.stamina;
          const max = s.staffState.maxStamina || 100;
          const next = Math.max(0, Math.min(max, current + delta));
          const isExhausted = next <= 0;
          const isBuffActive = s.staffState.milkTeaBuffUntil && Date.now() < s.staffState.milkTeaBuffUntil;
          let speedMultiplier = s.staffState.speedMultiplier;
          if (isBuffActive) {
            speedMultiplier = 1.25;
          } else if (isExhausted) {
            speedMultiplier = 0.6;
          } else {
            speedMultiplier = 1.0;
          }
          return {
            staffStamina: next,
            staffState: {
              ...s.staffState,
              stamina: next,
              isExhausted,
              speedMultiplier,
            },
          };
        });
      },

      drainStaffStamina: (amount: number) => {
        const { staffState } = get();
        if (staffState.milkTeaBuffUntil && Date.now() < staffState.milkTeaBuffUntil) {
          return;
        }
        get().updateStaffStamina(-amount);
      },

      updateRoasterySettings: (beans: 'robusta' | 'arabica', roast: RoastLevel) => {
        const baseDiscount = beans === 'robusta' ? 20 : 15;
        const roastBonus = roast === 'MEDIUM' ? 10 : 5;
        const discount = Math.min(30, baseDiscount + roastBonus);

        set((s) => ({
          roastery: {
            ...s.roastery,
            beanType: beans,
            beansType: beans,
            roastLevel: roast,
            supplyDiscountPercent: discount,
          },
        }));

        EventBus.emit('roastery-settings-updated', { beans, roast, discount });
      },

      addSignatureRecipe: (recipe: Omit<SignatureRecipe, 'id'>) => {
        const id = `sig_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const newRecipe: SignatureRecipe = {
          id,
          customName: recipe.customName || 'Món Độc Quyền',
          baseIngredient: recipe.baseIngredient,
          toppingIngredient: recipe.toppingIngredient,
          technique: recipe.technique,
          priceMultiplier: recipe.priceMultiplier ?? 1.35,
          isTrending: recipe.isTrending ?? false,
        };

        set((s) => ({
          signatureRecipes: [...(s.signatureRecipes || []), newRecipe],
        }));

        EventBus.emit('signature-recipe-added', newRecipe);
        return newRecipe;
      },

      unlockTechNode: (nodeId: string) => {
        const { techTree } = get();
        if (techTree.unlockedNodes.includes(nodeId)) return false;

        const cost = TECH_NODE_COSTS[nodeId] ?? 15;
        if (techTree.researchPoints < cost) return false;

        set({
          techTree: {
            ...techTree,
            researchPoints: techTree.researchPoints - cost,
            unlockedNodes: [...techTree.unlockedNodes, nodeId],
          },
        });

        EventBus.emit('tech-node-unlocked', { nodeId, cost });
        return true;
      },

      addResearchPoints: (amount: number) => {
        set((s) => ({
          techTree: {
            ...s.techTree,
            researchPoints: s.techTree.researchPoints + amount,
          },
        }));
      },
    }),
    {
      name: 'tiem-ca-phe-bat-on-save',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        const state = (persistedState as Partial<GameState>) || {};
        if (version === 0 || typeof version !== 'number') {
          // 1. Sync seatStates from existing dirtyTables
          const dirty = Array.isArray(state.dirtyTables) ? state.dirtyTables : [];
          const migratedSeats: SeatState[] = [0, 1, 2, 3].map((idx) => {
            const tableIdx = Math.floor(idx / 2);
            const isDirty = dirty.includes(tableIdx);
            return {
              id: idx,
              index: idx,
              status: isDirty ? ('DIRTY' as TableStatus) : ('EMPTY' as TableStatus),
              customerId: null,
              dirtyDroppedVnd: isDirty ? 1500 : undefined,
              dirtySince: isDirty ? Date.now() : undefined,
            };
          });

          // 2. Backfill dailyReport without data loss
          const oldReport = (state.dailyReport as any) || {};
          const revenue = Number(oldReport.revenue) || 0;
          const tips = Number(oldReport.tips) || 0;
          const cost = Number(oldReport.ingredientCost ?? oldReport.supplyCost) || 0;
          const penalties = Number(oldReport.penalties) || 0;
          const rentCost = Number(oldReport.rentCost) || 0;
          const cupsSold = Number(oldReport.cupsSold) || 0;
          const repEarned = Number(oldReport.reputationEarned) || 0;
          const perfOrders = Number(oldReport.perfectOrdersCount) || 0;
          const stars = Number(oldReport.reviewStars) || 5;

          const migratedReport: DailyReport = {
            dayNumber: Number(state.currentDay) || 1,
            revenue,
            tips,
            supplyCost: cost,
            ingredientCost: cost,
            penalties,
            rentCost,
            netProfit: Number(oldReport.netProfit ?? (revenue + tips - (cost + penalties + rentCost))),
            cupsSold,
            reputationEarned: repEarned,
            perfectOrdersCount: perfOrders,
            reviewStars: stars,
            reviewComment: oldReport.reviewComment || 'Quán bắt đầu ngày mới rộn ràng!',
          };

          return {
            ...state,
            timeOfDay: 'MORNING' as TimeOfDay,
            selectedProvince: 'hcm' as ProvinceId,
            selectedLocationType: 'alley' as SpotType,
            seatStates: migratedSeats,
            inventoryStock: state.inventoryStock || {
              coffeeStock: 100,
              iceStock: 100,
              milkStock: 100,
            },
            branchLocations: state.branchLocations || [],
            provincialLeague: state.provincialLeague || {
              homeProvinceId: 'hcm' as ProvinceId,
              weeklyContributionScore: 0,
              currentRankInProvince: 1,
              provinceTotalScore: 1250,
              claimedWeekendReward: false,
            },
            signatureRecipes: state.signatureRecipes || [],
            techTree: state.techTree || {
              researchPoints: 0,
              unlockedNodes: [],
            },
            roastery: state.roastery || {
              beanType: 'robusta',
              beansType: 'robusta',
              roastLevel: 'MEDIUM' as RoastLevel,
              supplyDiscountPercent: 0,
              autoRoast: false,
            },
            staffState: state.staffState || {
              stamina: 100,
              maxStamina: 100,
              isExhausted: false,
              speedMultiplier: 1.0,
              milkTeaBuffUntil: 0,
            },
            staffStamina: 100,
            dailyReport: migratedReport,
          };
        }
        return state as any;
      },
      merge: (persistedState: unknown, currentState: GameState & GameActions): GameState & GameActions => {
        const p = (persistedState as Partial<GameState>) || {};
        return {
          ...currentState,
          ...p,
          // Deep-merge nested critical objects to guarantee all properties exist
          inventory: {
            ...currentState.inventory,
            ...(p.inventory || {}),
          },
          inventoryStock: {
            ...currentState.inventoryStock,
            ...(p.inventoryStock || {}),
          },
          seatStates: Array.isArray(p.seatStates) && p.seatStates.length > 0
            ? p.seatStates
            : currentState.seatStates,
          dailyReport: {
            ...currentState.dailyReport,
            ...(p.dailyReport || {}),
          },
          provincialLeague: {
            ...currentState.provincialLeague,
            ...(p.provincialLeague || {}),
          },
          techTree: {
            ...currentState.techTree,
            ...(p.techTree || {}),
            unlockedNodes: Array.isArray(p.techTree?.unlockedNodes)
              ? p.techTree.unlockedNodes
              : currentState.techTree.unlockedNodes,
          },
          roastery: {
            ...currentState.roastery,
            ...(p.roastery || {}),
          },
          staffState: {
            ...currentState.staffState,
            ...(p.staffState || {}),
          },
          settings: {
            ...currentState.settings,
            ...(p.settings || {}),
          },
          weatherForecast: p.weatherForecast || currentState.weatherForecast,
          marketNews: p.marketNews || currentState.marketNews,
          staffStamina: typeof p.staffStamina === 'number'
            ? p.staffStamina
            : (p.staffState?.stamina ?? currentState.staffStamina),
          // Sanitize transient UI state on rehydration
          activeBrewing: null as BrewingSession | null,
          activeTab: null as GameState['activeTab'],
          isRenameModalOpen: false,
          isPhotoModeOpen: false,
          isRoadmapModalOpen: false,
        };
      },
    }
  )
);

if (typeof window !== 'undefined') {
  (window as unknown as { useGameStore: typeof useGameStore }).useGameStore = useGameStore;
}
