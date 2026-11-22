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
  } = useGameStore();

  const handleToggleSound = () => {
    toggleMute();
    SoundManager.setMuted(!isMuted);
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none select-none pt-2 px-2.5 md:px-4 max-w-[420px] mx-auto w-full transition-all duration-300 font-sans">
      {/* Outer Cozy Wooden HUD Frame */}
      <div className="bg-[#FFF8ED] border-2 border-[#8C6E54] shadow-[0_4px_0_#5D4037] p-2 rounded-2xl pointer-events-auto">
        
        {/* Tier 1: Left Coffee Cup, Center Ribbon Shop Banner, Right Wealth Counters */}
        <div className="flex items-center justify-between gap-2">
          {/* Left Coffee Cup Logo Button */}
          <button
            onClick={() => setRenameModalOpen(true)}
            className="w-10 h-10 rounded-xl bg-[#FAF0E1] border border-[#D8C7B5] flex items-center justify-center shrink-0 text-xl shadow-inner cursor-pointer hover:bg-[#F2ECE1] transition-transform active:scale-95"
            title="Đổi tên quán hoặc đổi chủ quán"
          >
            ☕
          </button>

          {/* Center Ribbon Banner (matching Mockup 1-10) */}
          <div className="flex-1 min-w-0 bg-[#FAF3E7] border border-[#8C6E54] rounded-xl px-2.5 py-1 flex items-center justify-between gap-1 shadow-xs">
            <button
              onClick={() => setRenameModalOpen(true)}
              className="flex items-center gap-1 text-left truncate min-w-0 flex-1 cursor-pointer group"
              title="Nhấn để đổi tên quán"
            >
              <span className="text-[#3E2415] font-serif font-black text-sm tracking-wide truncate group-hover:text-[#E08738] transition-colors">
                {shopName || 'Tiệm Cà Phê Bất Ổn'}
              </span>
              <span className="text-[10px] text-[#8C6E54] opacity-60">✏️</span>
            </button>

            <button
              onClick={() => setRoadmapModalOpen(true)}
              className="px-2 py-0.5 bg-[#E08738] hover:bg-[#ED9445] text-white text-[10px] font-bold uppercase rounded-lg border border-[#A85A1D] shadow-xs active:translate-y-0.5 shrink-0 cursor-pointer transition-all"
              title="Xem bản đồ tiến hóa 6 giai đoạn"
            >
              GĐ {currentStage}
            </button>
          </div>

          {/* Right Wealth Pills (matching Mockup 1-10) */}
          <div className="flex flex-col gap-1 shrink-0">
            <div className="flex items-center gap-1.5">
              {/* Gold Pill */}
              <div className="flex items-center gap-1 font-bold text-[#3E2415] bg-[#FAF0E1] px-2 py-0.5 border border-[#D8C7B5] rounded-lg text-xs leading-none shadow-xs">
                <span className="text-[11px]">🪙</span>
                <span>{formatVND(gold)}</span>
              </div>

              {/* Beans Pill */}
              <div className="flex items-center gap-0.5 font-bold text-[#B45309] bg-[#FAF0E1] px-1.5 py-0.5 border border-[#D8C7B5] rounded-lg text-xs leading-none shadow-xs">
                <span className="text-[11px]">🫘</span>
                <span>{goldenBeans}</span>
              </div>

              {/* Stars Pill */}
              <div className="flex items-center gap-0.5 font-bold text-[#E08738] bg-[#FAF0E1] px-1.5 py-0.5 border border-[#D8C7B5] rounded-lg text-xs leading-none shadow-xs">
                <span className="text-[11px]">⭐</span>
                <span>{reputation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 2: Day Tracker & Quick Stock Indicators */}
        <div className="mt-1.5 pt-1.5 border-t border-[#DECBB9] flex items-center justify-between text-xs">
          {/* Day & Shift Timer */}
          <div className="flex items-center gap-1.5 text-[#6D4C41] font-semibold text-[11px]">
            <span className="font-bold text-[#3E2415]">Ngày {currentDay}</span>
            <span>•</span>
            <span className="text-[#E08738] font-bold">
              {dayPhase === 'OPEN'
                ? `⏱ ${Math.ceil(dayTimeRemainingSec)}s`
                : dayPhase === 'PREP'
                ? 'Sáng sớm'
                : 'Nghỉ ca'}
            </span>
          </div>

          {/* Quick Inventory Stock */}
          <div className="flex items-center gap-2 text-[11px] text-[#3E2415] font-bold">
            <span title="Cà phê bột">☕ {inventory.coffee}</span>
            <span title="Sữa đặc">🥛 {inventory.milk}</span>
            <span title="Đá bi">🧊 {inventory.ice}</span>
            <span title="Trà">🍵 {inventory.tea}</span>
          </div>

          {/* Sound & Photo quick buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPhotoModeOpen(true)}
              className="w-6 h-6 rounded-md bg-[#FAF0E1] hover:bg-[#F2ECE1] border border-[#D8C7B5] flex items-center justify-center text-[10px] cursor-pointer"
              title="Chụp ảnh Polaroid [P]"
            >
              📷
            </button>
            <button
              onClick={handleToggleSound}
              className="w-6 h-6 rounded-md bg-[#FAF0E1] hover:bg-[#F2ECE1] border border-[#D8C7B5] flex items-center justify-center text-[10px] cursor-pointer"
              title={isMuted ? 'Bật âm thanh [M]' : 'Tắt âm thanh [M]'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
