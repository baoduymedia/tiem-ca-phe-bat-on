import React from 'react';
import { useGameStore, formatVND } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';
import { Coffee, Camera, Volume2, VolumeX, Edit3 } from 'lucide-react';

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
    <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none select-none pt-2 px-2.5 md:px-4 max-w-[420px] mx-auto w-full transition-all duration-300">
      {/* Outer Cozy Wooden/Parchment HUD Frame */}
      <div className="game-panel p-2 pointer-events-auto">
        {/* Tier 1: Left Coffee Logo, Center Ribbon Shop Banner, Right Wealth Counters */}
        <div className="flex items-center justify-between gap-1.5">
          {/* Left Coffee Cup Logo Button */}
          <button
            onClick={() => setRenameModalOpen(true)}
            className="w-10 h-10 rounded-xl bg-[#FAF0E1] border-2 border-[#4A3222] shadow-[0_2px_0_#4A3222] flex items-center justify-center shrink-0 cursor-pointer hover:bg-[#F2ECE1] transition-transform active:scale-95 overflow-hidden p-1"
            title="Đổi tên quán hoặc đổi chủ quán"
          >
            <img
              src="/assets/sprites/phin_ca_phe.png"
              alt="Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <Coffee className="w-5 h-5 text-[#4A3222] hidden only:block" />
          </button>

          {/* Center Ribbon Banner (matching Mockups 1-10) */}
          <div className="flex-1 min-w-0 game-ribbon px-2 py-1 flex items-center justify-between gap-1 shadow-[0_2px_0_#4A3222]">
            <button
              onClick={() => setRenameModalOpen(true)}
              className="flex items-center gap-1 text-left truncate min-w-0 flex-1 cursor-pointer group"
              title="Nhấn để đổi tên quán"
            >
              <span className="text-[#4A3222] font-mali font-bold text-xs md:text-sm tracking-wide truncate group-hover:text-[#E08738] transition-colors">
                {shopName || 'Tiệm Cà Phê Bất Ổn'}
              </span>
              <Edit3 className="w-3 h-3 text-[#4A3222] opacity-60 shrink-0" />
            </button>

            <button
              onClick={() => setRoadmapModalOpen(true)}
              className="game-btn game-btn-gold px-1.5 py-0.5 text-[10px] font-mali font-bold uppercase rounded-lg shrink-0 cursor-pointer"
              title="Xem bản đồ tiến hóa 6 giai đoạn"
            >
              GĐ {currentStage}
            </button>
          </div>

          {/* Right Wealth Pills (matching Mockup 1-10) */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Gold Pill */}
            <div
              className="flex items-center gap-0.5 font-nunito font-extrabold text-[#4A3222] bg-[#FFFDF9] px-1.5 py-0.5 border-2 border-[#4A3222] shadow-[0_2px_0_#4A3222] rounded-lg text-xs leading-none"
              title="Tiền mặt (VNĐ)"
            >
              <span className="text-[11px]">🪙</span>
              <span>{formatVND(gold)}</span>
            </div>

            {/* Beans Pill */}
            <div
              className="flex items-center gap-0.5 font-nunito font-extrabold text-[#B45309] bg-[#FFFDF9] px-1.5 py-0.5 border-2 border-[#4A3222] shadow-[0_2px_0_#4A3222] rounded-lg text-xs leading-none"
              title="Hạt cà phê vàng"
            >
              <span className="text-[11px]">🫘</span>
              <span>{goldenBeans}</span>
            </div>

            {/* Stars Pill */}
            <div
              className="flex items-center gap-0.5 font-nunito font-extrabold text-[#E08738] bg-[#FFFDF9] px-1.5 py-0.5 border-2 border-[#4A3222] shadow-[0_2px_0_#4A3222] rounded-lg text-xs leading-none"
              title="Uy tín quán"
            >
              <span className="text-[11px]">⭐</span>
              <span>{reputation}</span>
            </div>
          </div>
        </div>

        {/* Tier 2: Day Tracker & Quick Stock Indicators */}
        <div className="mt-1.5 pt-1.5 border-t border-[#DECBB9] flex items-center justify-between text-xs">
          {/* Day & Shift Timer */}
          <div className="flex items-center gap-1.5 text-[#6D4C41] font-nunito font-bold text-[11px]">
            <span className="text-[#4A3222] font-mali font-bold">Ngày {currentDay}</span>
            <span>•</span>
            <span className="text-[#E04F4F] font-extrabold">
              {dayPhase === 'OPEN'
                ? `⏱ ${Math.ceil(dayTimeRemainingSec)}s`
                : dayPhase === 'PREP'
                ? 'Sáng sớm'
                : 'Nghỉ ca'}
            </span>
          </div>

          {/* Quick Inventory Stock */}
          <div className="flex items-center gap-2 text-[11px] text-[#4A3222] font-nunito font-extrabold">
            <span title="Cà phê bột">☕ {inventory.coffee}</span>
            <span title="Sữa đặc">🥛 {inventory.milk}</span>
            <span title="Đá bi">🧊 {inventory.ice}</span>
            <span title="Trà">🍵 {inventory.tea}</span>
          </div>

          {/* Sound & Photo quick buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPhotoModeOpen(true)}
              className="w-6 h-6 rounded-md bg-[#FAF0E1] hover:bg-[#F2ECE1] border border-[#4A3222] shadow-[0_1px_0_#4A3222] flex items-center justify-center cursor-pointer transition-transform active:translate-y-0.5"
              title="Chụp ảnh Polaroid [P]"
            >
              <Camera className="w-3.5 h-3.5 text-[#4A3222]" />
            </button>
            <button
              onClick={handleToggleSound}
              className="w-6 h-6 rounded-md bg-[#FAF0E1] hover:bg-[#F2ECE1] border border-[#4A3222] shadow-[0_1px_0_#4A3222] flex items-center justify-center cursor-pointer transition-transform active:translate-y-0.5"
              title={isMuted ? 'Bật âm thanh [M]' : 'Tắt âm thanh [M]'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-[#E04F4F]" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#5C9E54]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
