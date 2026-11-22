import { useState, useEffect } from 'react';
import { useGameStore, formatVND } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';

export function OfflineRewardModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [offlineMinutes, setOfflineMinutes] = useState(0);
  const [earnedGold, setEarnedGold] = useState(0);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(3);

  const lastActiveTimestamp = useGameStore((s) => s.lastActiveTimestamp);
  const currentStage = useGameStore((s) => s.currentStage);
  const addGold = useGameStore((s) => s.addGold);
  const updateLastActive = useGameStore((s) => s.updateLastActive);
  const hasCompletedSplash = useGameStore((s) => s.hasCompletedSplash);

  useEffect(() => {
    if (!hasCompletedSplash || !lastActiveTimestamp) return;

    const now = Date.now();
    const diffMs = now - lastActiveTimestamp;
    const diffMinutes = Math.floor(diffMs / 60000);

    // Only show if player was away for at least 3 minutes
    if (diffMinutes >= 3) {
      // Capped at 240 minutes (4 hours)
      const cappedMinutes = Math.min(240, diffMinutes);
      // Base rate: 350đ per minute per stage level
      const baseEarned = Math.round(cappedMinutes * 380 * (currentStage === 1 ? 1 : 1.6));

      setOfflineMinutes(cappedMinutes);
      setEarnedGold(baseEarned);
      setIsOpen(true);
    }
  }, [hasCompletedSplash, lastActiveTimestamp, currentStage]);

  if (!isOpen) return null;

  const handleClaimRegular = () => {
    SoundManager.playCoinTing();
    addGold(earnedGold);
    updateLastActive();
    setIsOpen(false);
  };

  const handleClaimDouble = () => {
    setIsWatchingAd(true);
    setAdCountdown(3);

    const timer = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsWatchingAd(false);
          SoundManager.playCoinTing();
          addGold(earnedGold * 2);
          updateLastActive();
          setIsOpen(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const hours = Math.floor(offlineMinutes / 60);
  const minutes = offlineMinutes % 60;
  const awayTimeString = hours > 0 ? `${hours} Giờ ${minutes} Phút` : `${minutes} Phút`;

  return (
    <div className="absolute inset-0 z-50 cozy-modal-backdrop flex items-center justify-center p-4 select-none font-sans">
      <div className="w-full max-w-[340px] cozy-card p-5 text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Decorative corner leaves / paper accent */}
        <div className="absolute top-2 left-3 text-xs opacity-40">🌿</div>
        <div className="absolute top-2 right-3 text-xs opacity-40">🌿</div>

        {/* Title */}
        <h2 className="text-[#3E2415] font-serif font-bold text-xl tracking-wide mt-1">
          Hũ Tiền Ngoại Tuyến
        </h2>

        {/* Away Time Frame */}
        <div className="mt-2 py-1 px-3 bg-[#FAF3E7] border border-[#DECBB9] rounded-xl inline-block text-xs font-semibold text-[#6D4C41]">
          Bạn đã đi vắng: <span className="font-bold text-[#E08738]">{awayTimeString}</span>
        </div>

        {/* Ceramic jar with coins illustration */}
        <div className="my-3 flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-[#FAF0E1] border-2 border-[#D8C7B5] rounded-full flex items-center justify-center text-5xl shadow-inner relative">
            🏺
            <span className="absolute -top-1 -right-1 text-lg">✨</span>
            <span className="absolute bottom-1 right-2 text-base">🪙</span>
          </div>
        </div>

        {/* Total revenue */}
        <div className="mb-4">
          <span className="text-xs uppercase tracking-wider font-bold text-[#8C6E54] block">
            Tổng Thu Nhập
          </span>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="w-5 h-5 rounded-full bg-[#F4C447] text-[#3E2415] font-bold text-xs flex items-center justify-center border border-[#B88E28]">
              đ
            </span>
            <span className="text-2xl font-black text-[#3E2415] tracking-tight">
              {formatVND(earnedGold)}
            </span>
          </div>
        </div>

        {/* Claim Buttons or Simulated Ad Player */}
        {isWatchingAd ? (
          <div className="py-3 px-4 bg-[#FAF0E1] border-2 border-[#D8C7B5] rounded-2xl">
            <div className="text-xl">📺</div>
            <p className="text-xs text-[#6D4C41] font-bold mt-1">
              Đang phát clip giới thiệu Sài Gòn xưa...
            </p>
            <div className="mt-1 text-xl font-black text-[#E08738]">
              {adCountdown}s
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {/* Regular Claim Button (Green, matching Mockup 1) */}
            <button
              onClick={handleClaimRegular}
              className="py-2.5 px-2 cozy-btn-green text-sm flex items-center justify-center gap-1"
            >
              <span>Nhận (x1)</span>
            </button>

            {/* Double Claim Button (Honey Gold, matching Mockup 1) */}
            <button
              onClick={handleClaimDouble}
              className="py-2.5 px-2 cozy-btn-gold text-xs flex items-center justify-center gap-1 leading-tight text-center"
            >
              <span>Xem Quảng Cáo (x2) 🎬</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
