import { useState, useEffect } from 'react';
import { useGameStore, formatVND } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';
import { Sparkles, Video } from 'lucide-react';

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
      const cappedMinutes = Math.min(240, diffMinutes);
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
    <div className="absolute inset-0 z-50 bg-[#170C06]/80 backdrop-blur-xs flex items-center justify-center p-4 select-none font-sans">
      <div className="w-full max-w-[340px] game-panel p-5 text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Title */}
        <div className="game-ribbon px-3 py-1 inline-block mx-auto mb-2">
          <h2 className="text-[#4A3222] font-mali font-bold text-lg md:text-xl tracking-wide">
            Hũ Tiền Ngoại Tuyến
          </h2>
        </div>

        {/* Away Time Frame */}
        <div className="mt-1 py-1 px-3 bg-[#FAF3E7] border-2 border-[#4A3222] shadow-[0_2px_0_#4A3222] rounded-xl inline-block text-xs font-nunito font-bold text-[#7A543A]">
          Bạn đã đi vắng: <span className="font-extrabold text-[#F4A236]">{awayTimeString}</span>
        </div>

        {/* Ceramic jar with coins illustration */}
        <div className="my-3 flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-[#FAF0E1] border-[2.5px] border-[#4A3222] shadow-[0_3px_0_#4A3222] rounded-3xl flex items-center justify-center text-5xl relative p-2">
            <span className="text-5xl">🏺</span>
            <Sparkles className="w-5 h-5 text-[#F4A236] absolute top-1 right-1" />
            <span className="absolute bottom-1 right-2 text-base">🪙</span>
          </div>
        </div>

        {/* Total revenue */}
        <div className="mb-4">
          <span className="text-xs font-nunito uppercase tracking-wider font-bold text-[#7A543A] block">
            Tổng Thu Nhập
          </span>
          <div className="text-2xl font-nunito font-extrabold text-[#4A3222] flex items-center justify-center gap-1.5 mt-0.5">
            <span>🪙</span>
            <span>{formatVND(earnedGold)}</span>
          </div>
        </div>

        {/* Buttons (matching Mockup 5: Nhận (x1) and Xem Quảng Cáo (x2)) */}
        {isWatchingAd ? (
          <div className="p-3 bg-[#FAF0E1] border-2 border-[#4A3222] rounded-xl text-center">
            <div className="text-xs font-mali font-bold text-[#4A3222] mb-1">
              Đang phát clip tri ân nhà tài trợ...
            </div>
            <div className="text-lg font-nunito font-black text-[#F4A236]">{adCountdown}s</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleClaimRegular}
              className="py-2.5 px-2 rounded-xl text-xs font-mali font-bold game-btn game-btn-green flex items-center justify-center gap-1"
            >
              <span>Nhận (x1)</span>
            </button>

            <button
              onClick={handleClaimDouble}
              className="py-2.5 px-2 rounded-xl text-xs font-mali font-bold game-btn game-btn-gold flex items-center justify-center gap-1"
            >
              <Video className="w-3.5 h-3.5 text-[#4A3222]" />
              <span>Xem QC (x2)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
