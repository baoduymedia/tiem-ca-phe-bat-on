import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';

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
    <div className="absolute inset-0 z-40 flex items-center justify-center cozy-modal-backdrop p-3 select-none font-sans">
      <div className="w-full max-w-[390px] cozy-card p-4 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header Ribbon (matching Mockup 5) */}
        <div className="w-full flex items-center justify-between border-b-2 border-[#D8C7B5] pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-2xl bg-[#FAF0E1] border border-[#D8C7B5] flex items-center justify-center text-lg">
              📜
            </span>
            <div>
              <h3 className="font-serif font-black text-base text-[#3E2415] tracking-wide leading-none">
                Nhiệm vụ hàng ngày
              </h3>
              <p className="text-[11px] text-[#8C6E54] mt-1 font-semibold leading-none">
                Ngày {currentDay} • Thưởng Hạt Cà Phê Vàng 🫘
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab(null)}
            className="w-8 h-8 rounded-full bg-[#FAF0E1] hover:bg-[#EADDC9] text-[#5D4037] text-sm font-black border border-[#DECBB9] flex items-center justify-center cursor-pointer transition-colors"
            title="Đóng bảng"
          >
            ✕
          </button>
        </div>

        {/* Quests List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {dailyQuests.map((quest, index) => {
            const isCompleted = quest.current >= quest.target;
            const progressPct = Math.min(100, Math.round((quest.current / quest.target) * 100));

            // Matching Mockup 5 mascots: 1: Mèo mướp vàng, 2: Cún ngủ, 3: Chú Ba / Shipper
            const mascotIcon = index === 0 ? '🐱' : index === 1 ? '🐶' : '🛵';
            const mascotLabel = index === 0 ? 'Mèo Mướp' : index === 1 ? 'Cún Vàng' : 'Giao Hàng';

            return (
              <div
                key={quest.id}
                className="cozy-card-inner p-3 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2.5">
                  {/* Left mascot avatar */}
                  <div className="w-12 h-12 rounded-xl bg-[#FAF0E1] border border-[#D8C7B5] flex flex-col items-center justify-center shrink-0">
                    <span className="text-xl">{mascotIcon}</span>
                    <span className="text-[8px] text-[#8C6E54] font-bold mt-0.5">{mascotLabel}</span>
                  </div>

                  {/* Center Quest Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs font-bold text-[#3E2415] truncate">
                        {quest.description}
                      </h4>
                      <span className="text-[11px] text-[#8C6E54] font-bold shrink-0">
                        {quest.current}/{quest.target}
                      </span>
                    </div>

                    {/* Progress Bar (matching Mockup 5: dark brown track with warm caramel fill) */}
                    <div className="w-full h-2.5 bg-[#422615] rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-[#E08738] rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Reward & Button */}
                <div className="flex items-center justify-between pt-1 border-t border-[#F0E4D5]">
                  <span className="flex items-center gap-1 text-xs font-bold text-[#B45309]">
                    <span>🫘</span>
                    <span>+{quest.rewardBeans} Đậu</span>
                  </span>

                  <div>
                    {quest.claimed ? (
                      <span className="text-[11px] font-bold text-[#4E8A47] flex items-center gap-1">
                        ✓ ĐÃ NHẬN
                      </span>
                    ) : isCompleted ? (
                      <button
                        onClick={() => handleClaim(quest.id)}
                        className="py-1 px-3 cozy-btn-gold text-xs font-bold flex items-center gap-1"
                      >
                        <span>🎁</span> NHẬN
                      </button>
                    ) : (
                      <button
                        disabled
                        className="py-1 px-3 cozy-btn-gray text-xs font-bold opacity-80 cursor-not-allowed"
                      >
                        Đang tiến hành
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-2 border-t border-[#D8C7B5] text-center">
          <p className="text-[11px] text-[#8C6E54] font-semibold">
            Mẹo: Dùng Hạt Vàng 🫘 để mở khóa decor và tăng tốc pha chế!
          </p>
        </div>
      </div>
    </div>
  );
};
