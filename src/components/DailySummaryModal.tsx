import React, { useState } from 'react';
import { useGameStore, formatVND } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';

export function DailySummaryModal() {
  const { currentDay, currentStage, gold, dailyReport, loanAmount, repayUncleBa, nextDay } =
    useGameStore();
  const [hasRepaid, setHasRepaid] = useState(false);

  const supplyCost = dailyReport.supplyCost || dailyReport.ingredientCost || 0;
  const rentCost = dailyReport.rentCost || (currentStage === 1 ? 0 : currentStage === 2 ? 30000 : 120000);
  const penalties = dailyReport.penalties || 0;
  const totalIncome = dailyReport.revenue + dailyReport.tips;
  const totalExpense = supplyCost + rentCost + penalties;
  const netProfit = totalIncome - totalExpense;

  const canRepay = loanAmount > 0 && gold >= loanAmount;

  const handleRepay = () => {
    const ok = repayUncleBa();
    if (ok) {
      SoundManager.playCoinTing();
      setHasRepaid(true);
    }
  };

  // Stage labels
  const stageNames: Record<number, string> = {
    1: 'Quán Cóc Vỉa Hè (0đ mặt bằng)',
    2: 'Booth Take-Away (30k/ngày)',
    3: 'Quán Nhỏ Trong Hẻm (120k/ngày)',
    4: 'Chuỗi Cửa Hàng Đa Tỉnh',
    5: 'Xưởng Rang Xay & R&D',
    6: 'Tập Đoàn Cà Phê Toàn Cầu',
  };

  return (
    <div className="absolute inset-0 z-40 cozy-modal-backdrop flex flex-col items-center justify-center p-3 animate-in zoom-in-95 duration-200 select-none font-sans">
      <div className="w-full max-w-[390px] cozy-card text-[#4A3222] border-2 border-[#4A3222] shadow-[0_5px_0_#4A3222] p-4 flex flex-col relative max-h-[92vh] overflow-y-auto">
        
        {/* Receipt Header */}
        <div className="text-center pb-2 border-b-2 border-dashed border-[#D8C7B5]">
          <span className="py-0.5 px-3 bg-[#FAF0E1] text-[#E08738] border border-[#DECBB9] rounded-full text-[10px] font-black uppercase tracking-wider mb-1 inline-block">
            SỔ THU CHI P&L CUỐI NGÀY (22:00)
          </span>
          <h2 className="font-serif font-black text-xl tracking-wide text-[#4A3222]">
            📜 Quyết Toán Ngày {currentDay}
          </h2>
          <p className="text-[#8C6E54] text-[11px] font-semibold">
            {stageNames[currentStage] || 'Tiệm Cà Phê Bất Ổn'}
          </p>
        </div>

        {/* Financial Line Items (Thu - Chi) */}
        <div className="py-2 space-y-1.5 text-xs border-b-2 border-dashed border-[#D8C7B5]">
          {/* Revenue */}
          <div className="flex justify-between items-center">
            <span className="text-[#8C6E54] font-semibold flex items-center gap-1.5">
              <span>☕</span> Đồ uống phục vụ ({dailyReport.cupsSold} ly):
            </span>
            <span className="font-black text-sm text-[#2E7D32]">
              +{formatVND(dailyReport.revenue)}
            </span>
          </div>

          {/* Tips */}
          <div className="flex justify-between items-center">
            <span className="text-[#8C6E54] font-semibold flex items-center gap-1.5">
              <span>✨</span> Tiền tip Chuẩn Gu ({dailyReport.perfectOrdersCount || 0} ly):
            </span>
            <span className="font-black text-sm text-[#B45309]">
              +{formatVND(dailyReport.tips)}
            </span>
          </div>

          {/* Supply Cost */}
          <div className="flex justify-between items-center">
            <span className="text-[#8C6E54] font-semibold flex items-center gap-1.5">
              <span>📦</span> Tiền nhập kho nguyên liệu:
            </span>
            <span className="font-black text-sm text-[#C02626]">
              -{formatVND(supplyCost)}
            </span>
          </div>

          {/* Rent & Fixed Cost */}
          {rentCost > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-[#8C6E54] font-semibold flex items-center gap-1.5">
                <span>🏠</span> Thuê mặt bằng & điện nước:
              </span>
              <span className="font-black text-sm text-[#C02626]">
                -{formatVND(rentCost)}
              </span>
            </div>
          )}

          {/* Penalties if any */}
          {penalties > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-[#8C6E54] font-semibold flex items-center gap-1.5">
                <span>🚨</span> Phạt trật tự đô thị:
              </span>
              <span className="font-black text-sm text-red-700">
                -{formatVND(penalties)}
              </span>
            </div>
          )}

          {/* Reputation */}
          <div className="flex justify-between items-center pt-0.5">
            <span className="text-[#8C6E54] font-semibold flex items-center gap-1.5">
              <span>⭐</span> Điểm Sống Ảo tích lũy:
            </span>
            <span className="font-black text-sm text-[#E08738]">
              +{dailyReport.reputationEarned || 2} ⭐
            </span>
          </div>
        </div>

        {/* Net Profit Banner */}
        <div className="my-2 bg-[#FAF0E1] border border-[#4A3222] rounded-xl p-2 text-center shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#8C6E54] tracking-wider block">
            LỢI NHUẬN RÒNG HÔM NAY (NET PROFIT)
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

        {/* Customer Review Card (SPEC §1.4) */}
        <div className="mb-2 bg-[#FAF5ED] border border-[#D8C7B5] rounded-xl p-2.5 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#4A3222] flex items-center gap-1">
              <span>💬</span> Đánh giá khách hàng:
            </span>
            <span className="text-amber-500 font-bold">
              {'★'.repeat(dailyReport.reviewStars || (netProfit >= 0 ? 5 : 3))}
              {'☆'.repeat(5 - (dailyReport.reviewStars || (netProfit >= 0 ? 5 : 3)))}
            </span>
          </div>
          <p className="text-[11px] text-[#5D4037] italic bg-[#FFF8ED] p-1.5 rounded-lg border border-[#EAE0D3]">
            "{dailyReport.reviewComment ||
              (netProfit >= 0
                ? 'Cà phê thơm béo, ngồi vỉa hè ngắm đường phố Sài Gòn rất chill!'
                : 'Hôm nay đông khách mà phục vụ hơi chậm nha, cố gắng lên!')}"
          </p>
        </div>

        {/* Uncle Ba Loan Repayment Card */}
        {(loanAmount > 0 || hasRepaid) && (
          <div className="mb-2 bg-[#FAF0E1] border border-[#4A3222] rounded-xl p-2 flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#4A3222] flex items-center gap-1">
                <span>🛵</span> Nợ vốn Chú Ba Xe Ôm:
              </span>
              <span className="font-black text-[#B45309] text-xs">{formatVND(loanAmount)}</span>
            </div>
            {hasRepaid ? (
              <p className="text-[11px] text-[#2E7D32] font-black text-center">
                🎉 Đã hoàn trả! Chú Ba khen: 'Làm ăn sòng phẳng uy tín lắm con!' (+5 ⭐)
              </p>
            ) : (
              <button
                type="button"
                onClick={handleRepay}
                disabled={!canRepay}
                className={`py-1 px-2 text-[11px] font-bold rounded-lg border border-[#4A3222] transition-all ${
                  canRepay
                    ? 'bg-[#5C9E54] hover:bg-[#4E8B46] text-white cursor-pointer'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                {canRepay
                  ? `Trả Nợ Chú Ba (${formatVND(loanAmount)}) • +5 ⭐ Uy Tín`
                  : 'Chưa đủ tiền mặt để trả nợ hôm nay'}
              </button>
            )}
          </div>
        )}

        {/* Action Button: Next Day */}
        <div className="pt-1">
          <button
            onClick={nextDay}
            className="w-full py-2.5 bg-[#5C9E54] hover:bg-[#4E8B46] text-white text-xs font-black uppercase tracking-wider rounded-xl border border-[#4A3222] shadow-[0_3px_0_#4A3222] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>BƯỚC SANG NGÀY {currentDay + 1}</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
