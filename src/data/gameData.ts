import rawData from './tiem_ca_phe_bat_on_game_data.json';

// Re-export typed game data
export const gameData = rawData;

export type StageId = 1 | 2 | 3 | 4 | 5 | 6;

export interface StageConfig {
  id: number;
  key: string;
  name: string;
  isMvp: boolean;
  unlockCondition?: { gold: number; reputation: number };
  nextStageRequirement?: { gold: number; reputation: number };
  milestoneUpgrade?: {
    id: string;
    name: string;
    cost: number;
    effect: string;
  };
  maxSeats?: number;
  shipperQueueSlots?: number;
  features?: string[];
  comingSoon?: boolean;
}

export interface RecipeConfig {
  id: string;
  name: string;
  stage: number;
  category: string;
  basePrice: number;
  brewTimeSec: number;
  unlockCost: number;
  reputationGain: number;
  asmrSfx: string;
  isHot: boolean;
  description: string;
  autoPickup?: boolean;
}

export interface CustomerConfig {
  id: string;
  name: string;
  minStage: number;
  patienceSec: number;
  tipChance: number;
  tipMultiplier: number;
  orderQuantityRange: [number, number];
  favoriteRecipes: string[];
  dialogues: {
    order: string[];
    waiting: string[];
    happy: string[];
    angry: string[];
  };
}

export interface UpgradeConfig {
  id: string;
  name: string;
  stage: number;
  baseCost: number;
  maxLevel: number;
  effect: string;
}

export interface RandomEventConfig {
  id: string;
  name: string;
  minStage: number;
  maxStage: number;
  warningSec: number;
  reactionWindowSec: number;
  buttonLabel: string;
  alertText: string;
  successEffect: string;
  failPenalty: string;
}

export const getStages = (): StageConfig[] => gameData.stages as unknown as StageConfig[];
export const getRecipes = (): RecipeConfig[] => gameData.recipes as unknown as RecipeConfig[];
export const getRecipesByStage = (stage: number): RecipeConfig[] =>
  getRecipes().filter((r) => r.stage <= stage && r.id !== 'tra_da');
export const getCustomers = (): CustomerConfig[] =>
  gameData.customers as unknown as CustomerConfig[];
export const getUpgrades = (): UpgradeConfig[] =>
  gameData.upgrades as unknown as UpgradeConfig[];
export const getRandomEvents = (): RandomEventConfig[] =>
  gameData.randomEvents as unknown as RandomEventConfig[];
export const getFormulas = () => gameData.meta.formulas;

/** Tính giá bán theo level món: Math.round(BasePrice * (1 + 0.15 * (level - 1))) */
export function calcDrinkPrice(basePrice: number, level: number): number {
  return Math.round(basePrice * (1 + 0.15 * Math.max(0, level - 1)));
}

/** Tính chi phí nâng cấp: Math.round(BaseCost * Math.pow(1.18, level - 1)) */
export function calcUpgradeCost(baseCost: number, level: number): number {
  return Math.round(baseCost * Math.pow(1.18, Math.max(0, level - 1)));
}
