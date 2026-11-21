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
    <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-3 animate-in fade-in duration-200 select-none font-pixel">
      <div className="w-full max-w-[380px] pixel-box-wood text-[#FFE8C2] p-4 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="text-center pb-2 border-b-2 border-black/40">
          <span className="pixel-badge bg-[#E8C547] text-[#2D1B0E] mb-1">
            GIAI ĐOẠN CHUẨN BỊ
          </span>
          <h2 className="text-[#FFD700] font-black text-xl tracking-wide drop-shadow-[2px_2px_0px_#000]">
            ☀️ Bình Minh — Ngày {currentDay}
          </h2>
          <p className="text-[#FFE8C2]/70 text-xs mt-0.5">
            Xem tin thị trường, chuẩn bị vốn & sắm nguyên liệu!
          </p>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto pr-1 space-y-2 mt-2 flex-1">
          {/* Market News Banner (Biến Động Chợ Đầu Mối) */}
          {marketNews && (
            <div className="pixel-box bg-[#382012] p-2.5">
              <span className="text-xs font-black uppercase text-[#FFD700] block mb-0.5 tracking-wider">
                📢 {marketNews.headline}
              </span>
              {marketNews.multiplier !== 1.0 && (
                <span className="text-[11px] font-bold text-amber-300">
                  {marketNews.multiplier > 1.0
                    ? `⚠️ Giá tăng +${Math.round((marketNews.multiplier - 1) * 100)}%`
                    : `🎉 Trợ giá giảm -${Math.round((1 - marketNews.multiplier) * 100)}%`}
                </span>
              )}
            </div>
          )}

          {/* Weather Forecast Banner */}
          <div className="pixel-box bg-[#2E180C] p-2.5 flex items-start gap-2.5">
            <div className="text-2xl mt-0.5 shrink-0">
              {weatherForecast.type === 'sunny'
                ? '☀️'
                : weatherForecast.type === 'rainy'
                ? '🌧️'
                : '🚨'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[#FFD700] font-black text-xs uppercase tracking-wide">
                {weatherForecast.title}
              </h4>
              <p className="text-[#FFE8C2]/80 text-[11px] mt-0.5 leading-snug">
                {weatherForecast.desc}
              </p>
            </div>
          </div>

          {/* Solidarity Rescue: Chú Ba Xe Ôm Cho Vay Vốn */}
          <div className="pixel-box bg-[#1A2E16] border-[#437A22] p-2.5 flex items-start gap-2.5">
            <span className="text-2xl shrink-0 mt-0.5">🛵</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-[#A3E635] font-black text-xs uppercase tracking-wide">
                  Chú Ba Xe Ôm Trợ Vốn
                </h4>
                {loanAmount > 0 && (
                  <span className="text-xs text-amber-300 font-black">
                    Nợ: {formatVND(loanAmount)}
                  </span>
                )}
              </div>
              <p className="text-[#FFE8C2]/80 text-[11px] mt-0.5 leading-snug">
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
                  className="mt-1.5 pixel-btn pixel-btn-green py-1 px-2.5 text-[11px] flex items-center gap-1.5"
                >
                  <span>🤝</span> MƯỢN 50.000đ (0% LÃI)
                </button>
              )}
            </div>
          </div>

          {/* Current Capital Status */}
          <div className="pixel-box bg-[#1C0F08] flex justify-between items-center px-3 py-1.5 text-xs">
            <span className="text-[#FFE8C2]/80 font-bold uppercase">Vốn hiện có:</span>
            <span className="text-[#FFD700] font-black text-base">{formatVND(gold)}</span>
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
                  className="pixel-box bg-[#2B170B] p-2 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-xl shrink-0 p-1 bg-[#150A05] border-2 border-black">
                      {item.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between pr-1">
                        <h5 className="text-[#FFE8C2] font-black text-xs truncate">
                          {item.name}
                        </h5>
                        <span className="text-[#4CE0D2] font-black text-xs">
                          Kho: {currentStock}
                        </span>
                      </div>
                      <p className="text-[#FFE8C2]/60 text-[10px] truncate">
                        +{item.packSize} phần {isAffected && marketNews.multiplier > 1.0 && '• Bão giá'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => buyIngredient(item.type, item.packSize, finalCost)}
                    disabled={!canAfford}
                    className={`pixel-btn py-1 px-2.5 text-xs font-black shrink-0 ${
                      canAfford ? 'pixel-btn-gold' : 'opacity-40 cursor-not-allowed bg-stone-700 text-stone-400'
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
        <div className="pt-2.5 mt-2 border-t-2 border-black/40">
          <button
            onClick={startDay}
            className="w-full pixel-btn pixel-btn-green py-2.5 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span>☕</span>
            <span>BẮT ĐẦU MỞ QUÁN NGAY!</span>
          </button>
        </div>
      </div>
    </div>
  );
}
