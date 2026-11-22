import { useGameStore, formatVND } from '../store/useGameStore';
import type { Inventory } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';

interface ItemConfig {
  type: keyof Inventory;
  name: string;
  icon: string;
  packSize: number;
  cost: number;
  desc: string;
}

const ITEMS: ItemConfig[] = [
  {
    type: 'coffee',
    name: 'Bột Robusta',
    icon: '☕',
    packSize: 10,
    cost: 15000,
    desc: 'Cà phê Đen, Sữa Đá, Bạc Xỉu.',
  },
  {
    type: 'milk',
    name: 'Sữa Đặc Ông Thọ',
    icon: '🥛',
    packSize: 8,
    cost: 18000,
    desc: 'Béo ngậy cho Cà Phê Sữa & Bạc Xỉu.',
  },
  {
    type: 'ice',
    name: 'Đá Bi Tinh Khiết',
    icon: '🧊',
    packSize: 20,
    cost: 8000,
    desc: 'Mát lạnh sảng khoái vỉa hè.',
  },
  {
    type: 'tea',
    name: 'Trà Lài / Trà Bắc',
    icon: '🍵',
    packSize: 15,
    cost: 10000,
    desc: 'Nấu ấm trà đá mời khách chờ.',
  },
];

export function DailyPrepModal() {
  const {
    currentDay,
    gold,
    inventory,
    weatherForecast,
    marketNews,
    loanAmount,
    borrowFromUncleBa,
    buyIngredient,
    startDay,
  } = useGameStore();

  return (
    <div className="absolute inset-0 z-40 cozy-modal-backdrop flex flex-col items-center justify-center p-3 animate-in fade-in duration-200 select-none font-sans">
      <div className="w-full max-w-[390px] cozy-card p-4 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="text-center pb-2.5 border-b-2 border-[#D8C7B5]">
          <span className="py-0.5 px-3 bg-[#FAF0E1] text-[#E08738] border border-[#DECBB9] rounded-full text-[11px] font-bold mb-1 inline-block">
            GIAI ĐOẠN CHUẨN BỊ
          </span>
          <h2 className="text-[#3E2415] font-serif font-black text-xl tracking-wide">
            ☀️ Bình Minh — Ngày {currentDay}
          </h2>
          <p className="text-[#8C6E54] text-xs font-semibold mt-0.5">
            Xem tin thị trường, chuẩn bị vốn & sắm nguyên liệu!
          </p>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto pr-1 space-y-2.5 mt-2.5 flex-1">
          {/* Market News Banner (Biến Động Chợ Đầu Mối) */}
          {marketNews && (
            <div className="cozy-card-inner p-2.5">
              <span className="text-xs font-bold text-[#B45309] block mb-0.5 tracking-wide">
                📢 {marketNews.headline}
              </span>
              {marketNews.multiplier !== 1.0 && (
                <span className="text-[11px] font-bold text-[#E08738]">
                  {marketNews.multiplier > 1.0
                    ? `⚠️ Giá tăng +${Math.round((marketNews.multiplier - 1) * 100)}%`
                    : `🎉 Trợ giá giảm -${Math.round((1 - marketNews.multiplier) * 100)}%`}
                </span>
              )}
            </div>
          )}

          {/* Weather Forecast Banner */}
          <div className="cozy-card-inner p-2.5 flex items-start gap-2.5">
            <div className="text-2xl mt-0.5 shrink-0">
              {weatherForecast.type === 'sunny'
                ? '☀️'
                : weatherForecast.type === 'rainy'
                ? '🌧️'
                : '🚨'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[#3E2415] font-bold text-xs uppercase tracking-wide">
                {weatherForecast.title}
              </h4>
              <p className="text-[#8C6E54] text-[11px] font-semibold mt-0.5 leading-snug">
                {weatherForecast.desc}
              </p>
            </div>
          </div>

          {/* Solidarity Rescue: Chú Ba Xe Ôm Cho Vay Vốn */}
          <div className="cozy-card-inner bg-[#F1F8F1] border-[#B7DFB9] p-2.5 flex items-start gap-2.5">
            <span className="text-2xl shrink-0 mt-0.5">🛵</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-[#2E7D32] font-black text-xs uppercase tracking-wide">
                  Chú Ba Xe Ôm Trợ Vốn
                </h4>
                {loanAmount > 0 && (
                  <span className="text-xs text-[#B45309] font-black">
                    Nợ: {formatVND(loanAmount)}
                  </span>
                )}
              </div>
              <p className="text-[#4E6B4E] text-[11px] font-semibold mt-0.5 leading-snug">
                {loanAmount > 0
                  ? "Chú Ba: 'Cứ lo buôn bán cho tốt nghen con, cuối ngày gửi lại chú!'"
                  : "Chú Ba: 'Kẹt vốn hả con? Chú cho mượn 50.000đ xoay vòng 0% lãi nghen!'"}
              </p>
              {loanAmount === 0 && (
                <button
                  type="button"
                  onClick={() => {
                    borrowFromUncleBa(50000);
                    SoundManager.playCoinTing();
                  }}
                  className="mt-1.5 py-1 px-3 cozy-btn-green text-[11px] flex items-center gap-1.5"
                >
                  <span>🤝</span> MƯỢN 50.000đ (0% LÃI)
                </button>
              )}
            </div>
          </div>

          {/* Current Capital Status */}
          <div className="cozy-card-inner flex justify-between items-center px-3 py-2 text-xs">
            <span className="text-[#8C6E54] font-bold uppercase">Vốn hiện có:</span>
            <span className="text-[#E08738] font-black text-base">{formatVND(gold)}</span>
          </div>

          {/* Ingredients Purchase List */}
          <div className="space-y-1.5">
            {ITEMS.map((item) => {
              const currentStock = inventory[item.type];
              const isAffected =
                marketNews && (marketNews.type === item.type || marketNews.type === 'all');
              const finalCost = isAffected
                ? Math.round(item.cost * (marketNews?.multiplier || 1.0))
                : item.cost;
              const canAfford = gold >= finalCost;

              return (
                <div
                  key={item.type}
                  className="cozy-card-inner p-2 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-xl shrink-0 p-1 bg-[#FAF0E1] border border-[#D8C7B5] rounded-lg">
                      {item.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between pr-1">
                        <h5 className="text-[#3E2415] font-bold text-xs truncate">
                          {item.name}
                        </h5>
                        <span className="text-[#0D9488] font-black text-xs">
                          Kho: {currentStock}
                        </span>
                      </div>
                      <p className="text-[#8C6E54] text-[10px] truncate font-semibold">
                        +{item.packSize} phần {isAffected && marketNews.multiplier > 1.0 && '• Bão giá'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => buyIngredient(item.type, item.packSize, finalCost)}
                    disabled={!canAfford}
                    className={`py-1 px-3 text-xs font-black shrink-0 rounded-xl transition-all ${
                      canAfford ? 'cozy-btn-orange' : 'cozy-btn-gray opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {formatVND(finalCost)}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Start Day Button */}
        <div className="pt-2.5 mt-2 border-t-2 border-[#D8C7B5]">
          <button
            onClick={startDay}
            className="w-full py-3 cozy-btn-green text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span>☕</span>
            <span>BẮT ĐẦU MỞ QUÁN NGAY!</span>
          </button>
        </div>
      </div>
    </div>
  );
}
