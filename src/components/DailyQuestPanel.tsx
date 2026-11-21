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
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none font-pixel">
      <div className="w-full max-w-[380px] bg-[#24140B] border-4 border-black shadow-[4px_4px_0px_#000] p-3 flex flex-col max-h-[82vh] overflow-hidden">
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b-2 border-black pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <div>
              <h3 className="font-bold text-base text-[#FFD700] uppercase tracking-wide leading-none">
                NHIỆM VỤ HÔM NAY
              </h3>
              <p className="text-xs text-[#D4A373] mt-0.5 leading-none">
                Ngày {currentDay} • Thưởng Hạt Cà Phê Vàng 🫘
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab(null)}
            className="w-7 h-7 flex items-center justify-center bg-[#DC2626] hover:bg-[#EF4444] text-white text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer transition-transform"
          >
            ✕
          </button>
        </div>

        {/* Quests List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {dailyQuests.map((quest) => {
            const isCompleted = quest.current >= quest.target;
            const progressPct = Math.min(100, Math.round((quest.current / quest.target) * 100));

            return (
              <div
                key={quest.id}
                className="bg-[#2D180C] border-2 border-black shadow-[2px_2px_0px_#000] p-2.5 flex flex-col gap-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#FFF8E7] leading-tight">{quest.description}</h4>
                    <span className="text-xs text-[#D4A373]">
                      Tiến độ: {quest.current.toLocaleString('vi-VN')} / {quest.target.toLocaleString('vi-VN')}
                    </span>
                  </div>
                  {/* Reward Badge */}
                  <span className="px-2 py-0.5 bg-[#F59E0B] border border-black text-xs font-bold text-[#1A0E05] flex items-center gap-1 shrink-0">
                    🫘 +{quest.rewardBeans}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-[#1A0E05] border border-black overflow-hidden relative">
                  <div
                    className="h-full bg-[#F59E0B] transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {/* Claim Button */}
                <div className="flex justify-end pt-0.5">
                  {quest.claimed ? (
                    <span className="text-xs font-bold text-[#4ADE80] flex items-center gap-1">
                      ✓ ĐÃ NHẬN THƯỞNG
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleClaim(quest.id)}
                      className="px-3 py-1 bg-[#16A34A] hover:bg-[#22C55E] active:translate-x-0.5 active:translate-y-0.5 text-white font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1 cursor-pointer"
                    >
                      <span>🎁</span> NHẬN {quest.rewardBeans} HẠT VÀNG
                    </button>
                  ) : (
                    <span className="text-xs text-stone-400">
                      Đang thực hiện ({progressPct}%)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-2.5 pt-1.5 border-t border-black flex justify-center">
          <p className="text-xs text-[#D4A373] text-center">
            Mẹo: Dùng Hạt Vàng 🫘 để mở khóa linh vật tự động & mua đồ trang trí độc quyền!
          </p>
        </div>
      </div>
    </div>
  );
};
