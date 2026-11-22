import type { StageId } from '../data/gameData';

// ==========================================
// 1. Base Domain Types & Enums (SPEC Mục 6)
// ==========================================

export type OrderModifier = 'normal' | 'less_ice' | 'more_milk' | 'no_sugar' | 'take_away';

export type TimeOfDay = 'MORNING' | 'NOON' | 'AFTERNOON' | 'EVENING';

export type RoastLevel = 'LIGHT' | 'MEDIUM' | 'DARK';

export type ProvinceId = 'hcm' | 'hanoi' | 'dalat' | 'hue_danang' | 'cantho' | 'global';

export type SpotType = 'university' | 'office' | 'alley' | 'tourist';

export type TableStatus = 'EMPTY' | 'OCCUPIED' | 'DIRTY';

// ==========================================
// 2. Extended State Interfaces (SPEC Mục 6 & SCOPE)
// ==========================================

export interface SeatState {
  id: number;
  index: number;
  status: TableStatus;
  customerId: string | null;
  dirtyDroppedVnd?: number;
  dirtySince?: number;
}

export interface InventoryStock {
  coffeeStock: number; // 0 - 100 (%)
  iceStock: number;    // 0 - 100 (%)
  milkStock: number;   // 0 - 100 (%)
}

export interface BranchLocationState {
  provinceId: ProvinceId;
  spotType: SpotType;
  branchName: string;
  stage: StageId;
  passiveIncomePerMin: number;
  localReputation: number;
}

export interface ProvincialLeagueState {
  homeProvinceId: ProvinceId;
  weeklyContributionScore: number;
  currentRankInProvince: number;
  provinceTotalScore: number;
  claimedWeekendReward: boolean;
}

export interface SignatureRecipe {
  id: string;
  customName: string;
  baseIngredient: string;
  toppingIngredient: string;
  technique: string;
  priceMultiplier: number;
  isTrending: boolean;
}

export interface TechTreeState {
  researchPoints: number;
  unlockedNodes: string[]; // e.g. ['qr_order', 'auto_restock', 'tiktok_ads']
}

export interface RoasteryState {
  beanType: 'robusta' | 'arabica';
  beansType?: 'robusta' | 'arabica'; // alias for backward-compatibility
  roastLevel: RoastLevel;
  supplyDiscountPercent: number;
  autoRoast?: boolean;
}

export interface StaffState {
  stamina: number;         // 0 - 100
  maxStamina: number;      // default 100
  isExhausted: boolean;
  speedMultiplier: number; // 1.0 default, 1.25 when buffed
  milkTeaBuffUntil: number; // timestamp ms
}

/**
 * Extended DailyReport retaining full backward-compatibility with DailySummaryModal.tsx
 * while introducing financial metrics for DailyLedgerModal.tsx
 */
export interface DailyReport {
  dayNumber: number;
  revenue: number;
  tips: number;
  supplyCost: number;
  ingredientCost: number; // Backward-compatibility alias for DailySummaryModal
  penalties: number;
  rentCost?: number;
  netProfit: number;
  cupsSold: number;
  perfectOrdersCount: number;
  reputationEarned: number;
  reviewStars: number;
  reviewComment: string;
}

// ==========================================
// 3. Domain Metadata & Configurations
// ==========================================

export interface OrderModifierConfig {
  id: OrderModifier;
  bubbleText: string;
  ratio: number;
  description: string;
}

export const ORDER_MODIFIER_CONFIGS: Record<OrderModifier, OrderModifierConfig> = {
  normal: {
    id: 'normal',
    bubbleText: 'Bình thường nha',
    ratio: 0.4,
    description: 'Mức sữa 1, Mức đá 2, Ly tại chỗ',
  },
  less_ice: {
    id: 'less_ice',
    bubbleText: 'Ít đá thôi nha',
    ratio: 0.2,
    description: 'Chỉ chạm 1 lần vào thùng đá',
  },
  more_milk: {
    id: 'more_milk',
    bubbleText: 'Nhiều sữa ít cà phê',
    ratio: 0.15,
    description: 'Chạm 2 lần vào hộp sữa đặc',
  },
  no_sugar: {
    id: 'no_sugar',
    bubbleText: 'Đen không đường/sữa',
    ratio: 0.1,
    description: 'Bỏ qua bước thêm sữa/đường',
  },
  take_away: {
    id: 'take_away',
    bubbleText: 'Mang đi bỏ bịch',
    ratio: 0.15,
    description: 'Chọn ly nhựa mang đi thay vì ly thủy tinh',
  },
};

export interface ProvinceConfig {
  id: ProvinceId;
  name: string;
  badge: string;
  flavorProfile: string;
  specialtyRecipeId: string;
  specialtyName: string;
  localChallenge: string;
  customerMultiplier: number;
  rentMultiplier: number;
}

export const PROVINCE_CONFIGS: Record<ProvinceId, ProvinceConfig> = {
  hcm: {
    id: 'hcm',
    name: 'TP. Hồ Chí Minh',
    badge: '65 - Sài Gòn',
    flavorProfile: 'Thích cà phê sữa đá nhiều đá, uống nhanh, đơn Shipper nổ liên tục',
    specialtyRecipeId: 'cf_sua_da_sg',
    specialtyName: 'Cà phê sữa đá Sài Gòn',
    localChallenge: 'Mưa rào bất chợt, kẹt xe giờ cao điểm',
    customerMultiplier: 1.25,
    rentMultiplier: 1.3,
  },
  hanoi: {
    id: 'hanoi',
    name: 'Hà Nội',
    badge: '29 - Hà Nội',
    flavorProfile: 'Thích ngồi vỉa hè/phố cổ, chuộng vị đậm truyền thống, ngồi trò chuyện lâu',
    specialtyRecipeId: 'cf_trung',
    specialtyName: 'Cà phê trứng Phố Cổ',
    localChallenge: 'Trật tự đô thị gắt, gió mùa đông bắc',
    customerMultiplier: 1.1,
    rentMultiplier: 1.2,
  },
  dalat: {
    id: 'dalat',
    name: 'Đà Lạt (Lâm Đồng)',
    badge: '49 - Đà Lạt',
    flavorProfile: 'Khách du lịch & KOL đông, chuộng không gian gỗ chill, chụp ảnh sống ảo',
    specialtyRecipeId: 'cf_arabica_cau_dat',
    specialtyName: 'Cà phê Arabica Cầu Đất',
    localChallenge: 'Sương mù & mưa phùn (cần nâng cấp lò sưởi/đèn ấm)',
    customerMultiplier: 1.15,
    rentMultiplier: 1.0,
  },
  hue_danang: {
    id: 'hue_danang',
    name: 'Huế & Đà Nẵng',
    badge: '75 - Miền Trung',
    flavorProfile: 'Tốc độ sống vừa phải, chuộng vị đậm béo, khách du lịch theo đoàn',
    specialtyRecipeId: 'cf_muoi_hue',
    specialtyName: 'Cà phê muối xứ Huế',
    localChallenge: 'Mùa bão miền Trung (cần gia cố mái che)',
    customerMultiplier: 1.0,
    rentMultiplier: 0.9,
  },
  cantho: {
    id: 'cantho',
    name: 'Cần Thơ & Miền Tây',
    badge: '65 - Tây Đô',
    flavorProfile: 'Khách hào sảng, hay cho tiền tip cao, thích đồ uống ngọt thanh',
    specialtyRecipeId: 'cf_kho_quet',
    specialtyName: 'Cà phê kho quẹt',
    localChallenge: 'Triều cường (kê cao ghế nhựa)',
    customerMultiplier: 1.05,
    rentMultiplier: 0.85,
  },
  global: {
    id: 'global',
    name: 'Global Chain (Tokyo, Seoul, Paris, NY)',
    badge: '00 - Global',
    flavorProfile: 'Khách quốc tế tò mò văn hóa phin Việt',
    specialtyRecipeId: 'phin_viet_set',
    specialtyName: 'Bánh mì que + Phin Việt Set',
    localChallenge: 'Rào cản ngôn ngữ (cần thuê nhân viên biết ngoại ngữ)',
    customerMultiplier: 1.5,
    rentMultiplier: 2.5,
  },
};

export interface SpotConfig {
  id: SpotType;
  name: string;
  desc: string;
  rentPerDay: number;
  customerRateMultiplier: number;
  tipMultiplier: number;
}

export const SPOT_CONFIGS: Record<SpotType, SpotConfig> = {
  university: {
    id: 'university',
    name: 'Cổng Trường Đại Học / Ký Túc Xá',
    desc: 'Giá thuê rẻ, lượng sinh viên cực đông, bán chạy món giá mềm',
    rentPerDay: 25000,
    customerRateMultiplier: 1.35,
    tipMultiplier: 0.9,
  },
  office: {
    id: 'office',
    name: 'Khu Văn Phòng / Ngã Tư Trung Tâm',
    desc: 'Giá thuê cao, bùng nổ giờ sáng & chiều, khách trả nhanh, tip cao',
    rentPerDay: 80000,
    customerRateMultiplier: 1.15,
    tipMultiplier: 1.4,
  },
  alley: {
    id: 'alley',
    name: 'Hẻm Nhỏ Yên Tĩnh / Khu Phố Cổ',
    desc: 'Giá thuê vừa phải, khách ngồi lâu, hút KOL nếu Decor đẹp',
    rentPerDay: 40000,
    customerRateMultiplier: 0.85,
    tipMultiplier: 1.1,
  },
  tourist: {
    id: 'tourist',
    name: 'Điểm Du Lịch / Bờ Hồ / Chợ Đêm',
    desc: 'Doanh thu bùng nổ cuối tuần và lễ tết, gọi combo lớn',
    rentPerDay: 120000,
    customerRateMultiplier: 1.5,
    tipMultiplier: 1.3,
  },
};

export const DEFAULT_DAY_DURATION_SEC = 210; // 3m 30s as per SPEC §4.1

export const RESTOCK_BASE_COSTS: Record<'coffee' | 'ice' | 'milk', number> = {
  coffee: 40000,
  ice: 20000,
  milk: 35000,
};

export const TECH_NODE_COSTS: Record<string, number> = {
  qr_order: 10,
  espresso_machine: 25,
  erp_inventory: 50,
  auto_restock: 50,
  tiktok_ads: 15,
  food_reviewer: 30,
  merch_collection: 45,
  farm_partnership: 20,
  auto_roaster: 35,
  cold_brew_export: 60,
};

/**
 * Calculates TimeOfDay based on elapsed time within the 06:00 - 22:00 day cycle (210s)
 * - 06:00 - 10:30 (Morning): 0% - 28.125% (~59s)
 * - 10:30 - 14:30 (Noon): 28.125% - 53.125% (~52.5s)
 * - 14:30 - 18:00 (Afternoon): 53.125% - 75.0% (~46s)
 * - 18:00 - 22:00 (Evening): 75.0% - 100.0% (~52.5s)
 */
export function calculateTimeOfDay(timeRemainingSec: number, totalDaySec = DEFAULT_DAY_DURATION_SEC): TimeOfDay {
  const elapsed = Math.max(0, totalDaySec - timeRemainingSec);
  const ratio = totalDaySec > 0 ? elapsed / totalDaySec : 0;
  if (ratio < 0.28125) return 'MORNING';
  if (ratio < 0.53125) return 'NOON';
  if (ratio < 0.75) return 'AFTERNOON';
  return 'EVENING';
}
