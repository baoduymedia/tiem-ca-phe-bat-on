import React, { useState } from 'react';
import { useGameStore, formatVND } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';

export function DailySummaryModal() {
  const { currentDay, gold, dailyReport, loanAmount, repayUncleBa, nextDay } = useGameStore();
  const [hasRepaid, setHasRepaid] = useState(false);

  const totalEarnings = dailyReport.revenue + dailyReport.tips;
  const netProfit = totalEarnings - dailyReport.ingredientCost;
  const canRepay = loanAmount > 0 && gold >= loanAmount;

  const handleRepay = () => {
    const ok = repayUncleBa();
    if (ok) {
      SoundManager.playCoinTing();
      setHasRepaid(true);
    }
  };

  return (
    <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-3 animate-in zoom-in-95 duration-200 select-none font-pixel">
      <div className="w-full max-w-[360px] pixel-box bg-[#F5EEDB] text-[#2D1B0E] p-4 flex flex-col relative">
        {/* Receipt Header */}
        <div className="text-center pb-2 border-b-2 border-dashed border-black/50">
          <span className="pixel-badge bg-[#8B5A2B] text-white mb-1">
            HÓA ĐƠN KẾT TOÁN CA BÁN
          </span>
          <h2 className="font-black text-2xl tracking-wide text-[#3E2111] drop-shadow-[1px_1px_0px_#fff]">
            📜 TỔNG KẾT NGÀY {currentDay}
          </h2>
          <p className="text-[#6F4E37] text-xs font-bold">
            Quán cóc vỉa hè Sài Gòn • Hết ca sáng
          </p>
        </div>

        {/* Bill Rows */}
        <div className="py-2.5 space-y-1.5 text-xs border-b-2 border-dashed border-black/50">
          <div className="flex justify-between items-center">
            <span className="text-[#6F4E37] font-bold flex items-center gap-1.5">
              <span>☕</span> Đồ uống phục vụ:
            </span>
            <span className="font-black text-sm text-[#2D1B0E]">
              {dailyReport.cupsSold} ly
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#6F4E37] font-bold flex items-center gap-1.5">
              <span>🪙</span> Doanh thu bán nước:
            </span>
            <span className="font-black text-sm text-[#1B6622]">
              +{formatVND(dailyReport.revenue)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#6F4E37] font-bold flex items-center gap-1.5">
              <span>✨</span> Tiền tip bo thêm:
            </span>
            <span className="font-black text-sm text-[#B87A0B]">
              +{formatVND(dailyReport.tips)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#6F4E37] font-bold flex items-center gap-1.5">
              <span>📦</span> Chi phí nguyên liệu:
            </span>
            <span className="font-black text-sm text-[#C02626]">
              -{formatVND(dailyReport.ingredientCost)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#6F4E37] font-bold flex items-center gap-1.5">
              <span>⭐</span> Điểm sống ảo nhận:
            </span>
            <span className="font-black text-sm text-[#8B5A2B]">
              +{dailyReport.reputationEarned} ⭐
            </span>
          </div>
        </div>

        {/* Net Profit Banner */}
        <div className="my-2.5 pixel-box-wood text-[#FFE8C2] p-2 text-center">
          <span className="text-[11px] uppercase font-bold text-[#FFD700] tracking-wider block">
            LỢI NHUẬN RÒNG HÔM NAY
          </span>
          <span
            className={`text-2xl font-black tracking-wide ${
              netProfit >= 0 ? 'text-[#FFD700]' : 'text-[#FF6B6B]'
            }`}
          >
            {netProfit >= 0 ? '+' : ''}
            {formatVND(netProfit)}
          </span>
        </div>

        {/* Uncle Ba Loan Repayment Card */}
        {loanAmount > 0 && (
          <div className="mb-2.5 pixel-box bg-[#FFF3CD] border-amber-600 p-2 flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-black text-amber-950 flex items-center gap-1">
                <span>🛵</span> Nợ vốn Chú Ba:
              </span>
              <span className="font-black text-amber-950 text-sm">{formatVND(loanAmount)}</span>
            </div>
            {hasRepaid ? (
              <p className="text-xs text-emerald-800 font-black text-center">
                🎉 Đã hoàn trả! Chú Ba khen: 'Làm ăn sòng phẳng uy tín lắm con!' (+5 ⭐)
              </p>
            ) : (
              <button
                type="button"
                onClick={handleRepay}
                disabled={!canRepay}
                className={`pixel-btn py-1 px-2 text-xs font-black transition-all ${
                  canRepay
                    ? 'pixel-btn-green text-white'
                    : 'opacity-40 bg-stone-400 text-stone-700 cursor-not-allowed'
                }`}
              >
                {canRepay
                  ? `Trả Nợ Chú Ba (${formatVND(loanAmount)}) • +5 ⭐ Uy Tín`
                  : 'Chưa đủ tiền mặt để trả nợ hôm nay'}
              </button>
            )}
          </div>
        )}

        {/* Next Day Button */}
        <button
          onClick={nextDay}
          className="w-full pixel-btn pixel-btn-wood py-2.5 text-[#FFD700] text-sm uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <span>BƯỚC SANG NGÀY {currentDay + 1}</span>
          <span>➔</span>
        </button>
      </div>
    </div>
  );
}
