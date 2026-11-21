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

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 select-none font-pixel">
      <div className="w-full max-w-[340px] bg-[#24140B] border-4 border-black shadow-[4px_4px_0px_#000] p-4 text-center">
        {/* Header Icon */}
        <div className="w-14 h-14 mx-auto -mt-8 bg-[#F59E0B] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-3xl">
          🏺
        </div>

        <h2 className="text-[#FFD700] font-bold text-base uppercase tracking-wider mt-2.5">
          HŨ TIỀN SAU GIỜ ĐÓNG CỬA
        </h2>
        <p className="text-[#FFF8E7]/80 text-xs mt-1">
          Trong lúc bạn vắng mặt <span className="font-bold text-[#FFD700]">{offlineMinutes} phút</span>, quán vẫn bán đều đặn cho khách quen!
        </p>

        {/* Big Earnings Box */}
        <div className="my-3 p-2.5 bg-[#1A0E05] border-2 border-black shadow-[2px_2px_0px_#000] flex flex-col items-center justify-center">
          <span className="text-xs text-amber-300 uppercase tracking-widest font-bold">
            DOANH THU TÍCH LŨY
          </span>
          <span className="text-2xl font-bold text-[#4ADE80] mt-0.5 tracking-tight">
            +{formatVND(earnedGold)}
          </span>
          <span className="text-xs text-amber-300/70 mt-0.5">
            (Tích lũy tối đa 4 giờ sau khi rời quán)
          </span>
        </div>

        {/* Claim Buttons or Simulated Ad Player */}
        {isWatchingAd ? (
          <div className="py-2.5 px-3 bg-[#1A0E05] border-2 border-black">
            <div className="text-sm">📺</div>
            <p className="text-xs text-amber-200 font-bold mt-1">
              Đang phát clip giới thiệu Sài Gòn xưa...
            </p>
            <div className="mt-1 text-lg font-bold text-[#FFD700]">
              {adCountdown}s
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 mt-2">
            {/* Double Claim Button */}
            <button
              onClick={handleClaimDouble}
              className="w-full py-2 bg-[#F59E0B] hover:bg-[#FBBF24] active:translate-x-0.5 active:translate-y-0.5 text-[#1A0E05] font-bold text-sm uppercase border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer transition-transform"
            >
              <span>🎬</span> NHẬN GẤP ĐÔI: +{formatVND(earnedGold * 2)}
            </button>

            {/* Regular Claim Button */}
            <button
              onClick={handleClaimRegular}
              className="w-full py-1.5 bg-[#451A03] hover:bg-[#5A2508] active:translate-x-0.5 active:translate-y-0.5 text-[#FFF8E7] font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer transition-transform"
            >
              Nhận thường ({formatVND(earnedGold)})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
