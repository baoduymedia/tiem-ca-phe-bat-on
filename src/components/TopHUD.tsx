import { useGameStore, formatVND } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';

export function TopHUD() {
  const {
    shopName,
    gold,
    goldenBeans,
    reputation,
    currentStage,
    currentDay,
    dayPhase,
    dayTimeRemainingSec,
    inventory,
    isMuted,
    toggleMute,
    setRenameModalOpen,
    setPhotoModeOpen,
    setRoadmapModalOpen,
    isWidescreenPC,
    toggleWidescreenPC,
  } = useGameStore();

  const handleToggleSound = () => {
    toggleMute();
    SoundManager.setMuted(!isMuted);
  };

  return (
    <div className={`absolute top-0 left-0 right-0 z-30 pointer-events-none select-none pt-1.5 px-2 md:px-4 ${isWidescreenPC ? 'md:max-w-[1140px]' : 'max-w-[420px]'} mx-auto w-full transition-all duration-300 font-pixel`}>
      {/* Outer Pixel Wooden HUD Frame with Solid Black Border and Hard Drop Shadow */}
      <div className="bg-[#2D180C] border-2 border-black shadow-[3px_3px_0px_#000] p-1.5 rounded-none">
        
        {/* Tier 1: Day Badge, Shop Signboard & Action Buttons */}
        <div className="flex items-center justify-between gap-1.5">
          {/* Day & Shift Pixel Badge */}
          <div className="bg-[#1A0E05] border-2 border-black shadow-[1.5px_1.5px_0px_#000] px-2 py-0.5 flex items-center gap-1 shrink-0 pointer-events-auto h-7">
            <span className="text-xs">📅</span>
            <div className="flex flex-col -space-y-1">
              <span className="text-[#FFD700] text-sm font-bold tracking-wider leading-none">
                NGÀY {currentDay}
              </span>
              <span className="text-[#FFF8E7]/80 text-[11px] leading-none">
                {dayPhase === 'OPEN'
                  ? `⏱${Math.ceil(dayTimeRemainingSec)}S`
                  : dayPhase === 'PREP'
                  ? 'SÁNG SỚM'
                  : 'NGHỈ CA'}
              </span>
            </div>
          </div>

          {/* Center Pixel Brass Signboard */}
          <div className="flex-1 min-w-0 bg-[#3E2413] border-2 border-black shadow-[1.5px_1.5px_0px_#000] px-2 py-0.5 flex items-center justify-between gap-1.5 pointer-events-auto h-7">
            <button
              onClick={() => setRenameModalOpen(true)}
              className="flex items-center gap-1.5 text-left group cursor-pointer truncate min-w-0 flex-1 hover:text-[#FFD700] transition-colors"
              title="Đổi tên quán của bạn"
            >
              <span className="text-xs shrink-0">☕</span>
              <span className="text-[#FFF8E7] text-sm font-bold tracking-wide truncate group-hover:text-[#FFD700] leading-none">
                {shopName || 'TIỆM CÀ PHÊ BẤT ỔN'}
              </span>
              <span className="text-[10px] text-amber-400 opacity-70 group-hover:opacity-100 shrink-0">✏️</span>
            </button>

            <button
              onClick={() => setRoadmapModalOpen(true)}
              className="px-2 py-0.5 bg-[#EA580C] hover:bg-[#F97316] text-[#FFF8E7] text-xs font-bold uppercase border border-black shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shrink-0 cursor-pointer transition-transform"
              title="Xem bản đồ tiến hóa 6 giai đoạn"
            >
              GĐ {currentStage} ▶
            </button>
          </div>

          {/* Quick Retro Pixel Action Buttons */}
          <div className="flex items-center gap-1 shrink-0 pointer-events-auto">
            {/* Desktop Screen Switcher Toggle (Visible on MD screens) */}
            <button
              onClick={() => toggleWidescreenPC()}
              className="hidden md:flex px-2 h-7 bg-[#451A03] hover:bg-[#5A2508] border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none items-center justify-center text-xs font-bold text-[#FFD700] transition-transform cursor-pointer gap-1"
              title={isWidescreenPC ? 'Chuyển sang khung điện thoại [W]' : 'Mở rộng màn ảnh rộng PC [W]'}
            >
              <span>{isWidescreenPC ? '📱 ĐT [W]' : '🖥️ PC [W]'}</span>
            </button>

            <button
              onClick={() => setPhotoModeOpen(true)}
              className="w-7 md:w-auto md:px-2 h-7 bg-[#451A03] hover:bg-[#5A2508] border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center text-xs text-[#FFF8E7] transition-transform cursor-pointer gap-1"
              title="Chụp ảnh thiệp Polaroid kỷ niệm [P]"
            >
              <span>📷</span>
              <span className="hidden md:inline text-[10px] text-amber-300 font-bold">[P]</span>
            </button>
            <button
              onClick={handleToggleSound}
              className="w-7 md:w-auto md:px-2 h-7 bg-[#451A03] hover:bg-[#5A2508] border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center text-xs text-[#FFF8E7] transition-transform cursor-pointer gap-1"
              title={isMuted ? 'Bật âm thanh [M]' : 'Tắt âm thanh [M]'}
            >
              <span>{isMuted ? '🔇' : '🔊'}</span>
              <span className="hidden md:inline text-[10px] text-amber-300 font-bold">[M]</span>
            </button>
          </div>
        </div>

        {/* Tier 2: Wealth Counters & Quick Stock Pills */}
        <div className="mt-1 pt-1 border-t-2 border-black flex items-center justify-between pointer-events-auto">
          {/* Wealth: Gold, Beans, Stars */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 font-bold text-[#FFD700] bg-[#1A0E05] px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000] text-sm leading-none">
              <span className="text-xs">🪙</span>
              <span className="tracking-wide">{formatVND(gold)}</span>
            </div>

            <div className="flex items-center gap-1 font-bold text-[#F59E0B] bg-[#1A0E05] px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_#000] text-sm leading-none">
              <span className="text-xs">🫘</span>
              <span>{goldenBeans}</span>
            </div>

            <div className="flex items-center gap-1 font-bold text-amber-300 bg-[#1A0E05] px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_#000] text-sm leading-none">
              <span className="text-xs">⭐</span>
              <span>{reputation}</span>
            </div>
          </div>

          {/* Quick Inventory Stock Indicators */}
          <div className="flex items-center gap-1 text-xs text-[#FFF8E7] font-bold bg-[#1A0E05] px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
            <span title="Cà phê bột">☕{inventory.coffee}</span>
            <span className="opacity-30">•</span>
            <span title="Sữa đặc Ông Thọ">🥛{inventory.milk}</span>
            <span className="opacity-30">•</span>
            <span title="Đá bi lạnh">🧊{inventory.ice}</span>
            <span className="opacity-30">•</span>
            <span title="Trà xanh">🍵{inventory.tea}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
