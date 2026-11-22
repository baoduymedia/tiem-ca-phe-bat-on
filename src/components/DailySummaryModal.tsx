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
    <div className="absolute inset-0 z-40 cozy-modal-backdrop flex flex-col items-center justify-center p-3 animate-in zoom-in-95 duration-200 select-none font-sans">
      <div className="w-full max-w-[360px] cozy-card text-[#3E2415] p-5 flex flex-col relative">
        {/* Receipt Header */}
        <div className="text-center pb-2.5 border-b-2 border-dashed border-[#D8C7B5]">
          <span className="py-0.5 px-3 bg-[#FAF0E1] text-[#E08738] border border-[#DECBB9] rounded-full text-[11px] font-bold mb-1 inline-block">
            HÓA ĐƠN KẾT TOÁN CA BÁN
          </span>
          <h2 className="font-serif font-black text-2xl tracking-wide text-[#3E2415]">
            📜 Tổng Kết Ngày {currentDay}
          </h2>
          <p className="text-[#8C6E54] text-xs font-semibold">
            Quán cóc vỉa hè Sài Gòn • Hết ca sáng
          </p>
        </div>

        {/* Bill Rows */}
        <div className="py-2.5 space-y-1.5 text-xs border-b-2 border-dashed border-[#D8C7B5]">
          <div className="flex justify-between items-center">
            <span className="text-[#8C6E54] font-semibold flex items-center gap-1.5">
              <span>☕</span> Đồ uống phục vụ:
            </span>
            <span className="font-black text-sm text-[#3E2415]">
              {dailyReport.cupsSold} ly
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#8C6E54] font-semibold flex items-center gap-1.5">
              <span>🪙</span> Doanh thu bán nước:
            </span>
            <span className="font-black text-sm text-[#2E7D32]">
              +{formatVND(dailyReport.revenue)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#8C6E54] font-semibold flex items-center gap-1.5">
              <span>✨</span> Tiền tip bo thêm:
            </span>
            <span className="font-black text-sm text-[#B45309]">
              +{formatVND(dailyReport.tips)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#8C6E54] font-semibold flex items-center gap-1.5">
              <span>📦</span> Chi phí nguyên liệu:
            </span>
            <span className="font-black text-sm text-[#C02626]">
              -{formatVND(dailyReport.ingredientCost)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#8C6E54] font-semibold flex items-center gap-1.5">
              <span>⭐</span> Điểm sống ảo nhận:
            </span>
            <span className="font-black text-sm text-[#E08738]">
              +{dailyReport.reputationEarned} ⭐
            </span>
          </div>
        </div>

        {/* Net Profit Banner */}
        <div className="my-2.5 cozy-card-inner p-2.5 text-center bg-[#FAF0E1]">
          <span className="text-[11px] uppercase font-bold text-[#8C6E54] tracking-wider block">
            LỢI NHUẬN RÒNG HÔM NAY
          </span>
          <span
            className={`text-2xl font-black tracking-wide ${
              netProfit >= 0 ? 'text-[#2E7D32]' : 'text-[#C02626]'
            }`}
          >
            {netProfit >= 0 ? '+' : ''}
            {formatVND(netProfit)}
          </span>
        </div>

        {/* Uncle Ba Loan Repayment Card */}
        {loanAmount > 0 && (
          <div className="mb-2.5 cozy-card-inner p-2.5 flex flex-col gap-1.5 text-xs bg-[#FAF0E1]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#8C6E54] flex items-center gap-1">
                <span>🛵</span> Nợ vốn Chú Ba:
              </span>
              <span className="font-black text-[#B45309] text-sm">{formatVND(loanAmount)}</span>
            </div>
            {hasRepaid ? (
              <p className="text-xs text-[#2E7D32] font-black text-center">
                🎉 Đã hoàn trả! Chú Ba khen: 'Làm ăn sòng phẳng uy tín lắm con!' (+5 ⭐)
              </p>
            ) : (
              <button
                type="button"
                onClick={handleRepay}
                disabled={!canRepay}
                className={`py-1.5 px-2 text-xs font-bold rounded-xl transition-all ${
                  canRepay
                    ? 'cozy-btn-green'
                    : 'cozy-btn-gray opacity-50 cursor-not-allowed'
                }`}
              >
                {canRepay
                  ? `Trả Nợ Chú Ba (${formatVND(loanAmount)}) • +5 ⭐ Uy Tín`
                  : 'Chưa đủ tiền mặt để trả nợ hôm nay'}
              </button>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={nextDay}
            className="w-full py-3 cozy-btn-green text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span>BƯỚC SANG NGÀY {currentDay + 1} ➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
