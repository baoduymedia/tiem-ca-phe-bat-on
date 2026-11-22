import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';
import { X, ScrollText } from 'lucide-react';

export const DailyQuestPanel: React.FC = () => {
  const activeTab = useGameStore((s) => s.activeTab);
  const setActiveTab = useGameStore((s) => s.setActiveTab);
  const currentDay = useGameStore((s) => s.currentDay);
  const dailyQuests = useGameStore((s) => s.dailyQuests);
  const claimQuestReward = useGameStore((s) => s.claimQuestReward);

  if (activeTab !== 'quest') return null;

  const handleClaim = (questId: string) => {
    const ok = claimQuestReward(questId);
    if (ok) {
      SoundManager.playCoinTing();
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#170C06]/80 backdrop-blur-xs p-3 select-none font-sans">
      <div className="w-full max-w-[390px] game-panel p-4 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header Ribbon (matching Mockup 9) */}
        <div className="w-full flex items-center justify-between border-b-2 border-[#4A3222]/20 pb-2.5 mb-3">
          <div className="game-ribbon px-3 py-1 flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-[#F4A236]" />
            <div>
              <h3 className="font-mali font-bold text-sm md:text-base text-[#4A3222] tracking-wide leading-none">
                Nhiệm vụ hàng ngày
              </h3>
              <p className="text-[10px] text-[#7A543A] font-nunito mt-0.5 font-bold leading-none">
                Ngày {currentDay} • Thưởng Hạt Cà Phê Vàng 🫘
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab(null)}
            className="w-8 h-8 rounded-full game-btn game-btn-red flex items-center justify-center cursor-pointer transition-transform"
            title="Đóng bảng"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Quests List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {dailyQuests.map((quest, index) => {
            const isCompleted = quest.current >= quest.target;
            const progressPct = Math.min(100, Math.round((quest.current / quest.target) * 100));

            // Matching Mockup 9 mascots: 1: Mèo mướp, 2: Cún ngủ, 3: Shipper
            const mascotSprite =
              index === 0
                ? '/assets/sprites/pet_meo_muop.png'
                : index === 1
                ? '/assets/sprites/pet_cun_vang.png'
                : '/assets/sprites/khach_shipper.png';

            const mascotLabel = index === 0 ? 'Mèo mướp' : index === 1 ? 'Cún vàng' : 'Giao hàng';

            return (
              <div
                key={quest.id}
                className="game-card p-3 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2.5">
                  {/* Left mascot avatar */}
                  <div className="w-12 h-12 rounded-xl bg-[#FAF0E1] border-2 border-[#4A3222] flex flex-col items-center justify-center shrink-0 p-1">
                    <img
                      src={mascotSprite}
                      alt={mascotLabel}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Center Quest Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs font-mali font-bold text-[#4A3222] truncate">
                        {quest.description}
                      </h4>
                      <span className="text-[11px] font-nunito font-extrabold text-[#7A543A] shrink-0">
                        {quest.current}/{quest.target}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 game-bar-track">
                      <div
                        className="game-bar-fill transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Reward & Claim Section */}
                <div className="flex items-center justify-between pt-1 border-t border-[#4A3222]/15">
                  <div className="flex items-center gap-1 text-xs font-nunito font-extrabold text-[#B45309]">
                    <span>🫘</span>
                    <span>+{quest.rewardBeans || 2} Đậu Vàng</span>
                  </div>

                  {quest.claimed ? (
                    <span className="px-2.5 py-1 text-[11px] font-nunito font-bold text-stone-500 bg-stone-100 rounded-lg border border-stone-300">
                      ✓ Đã nhận
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleClaim(quest.id)}
                      className="px-3 py-1 game-btn game-btn-gold text-xs font-mali font-bold rounded-xl"
                    >
                      Nhận thưởng
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 text-[11px] font-nunito font-bold text-[#7A543A] bg-[#FAF0E1] rounded-lg border border-[#4A3222]/30">
                      Đang làm ({progressPct}%)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
