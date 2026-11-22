import React from 'react';
import { useGameStore, formatVND } from '../store/useGameStore';
import { PROVINCE_CONFIGS, type ProvinceId } from '../types/game';
import { SoundManager } from '../game/audio/SoundManager';
import { EventBus } from '../game/EventBus';

interface ProvincialLeagueModalProps {
  onClose: () => void;
}

export const ProvincialLeagueModal: React.FC<ProvincialLeagueModalProps> = ({ onClose }) => {
  const { provincialLeague, selectedProvince, addGoldenBeans, addReputation } = useGameStore();

  const homeProvId: ProvinceId = provincialLeague?.homeProvinceId || selectedProvince || 'hcm';
  const homeProv = PROVINCE_CONFIGS[homeProvId];

  // Mock regional league table
  const rankings = [
    { rank: 1, id: 'hcm', score: 142500, leadName: 'Sài Gòn Phố' },
    { rank: 2, id: 'hanoi', score: 128900, leadName: 'Phố Cổ Cà Phê' },
    { rank: 3, id: 'dalat', score: 98400, leadName: 'Sương Mai Chill' },
    { rank: 4, id: 'hue_danang', score: 87200, leadName: 'Cố Đô Phin Vàng' },
    { rank: 5, id: 'cantho', score: 79600, leadName: 'Tây Đô Hào Sảng' },
  ];

  const handleClaimReward = () => {
    SoundManager.playCoinTing();
    addGoldenBeans(15);
    addReputation(20);
    EventBus.emit('customer-speak', {
      name: 'Ban Tổ Chức Cúp Phin Vàng',
      dialogue: 'Chúc mừng bạn đã nhận thưởng tuần: +15 🫘 Đậu Vàng và Huy hiệu Phin Vàng!',
    });
  };

  return (
    <div className="absolute inset-0 z-50 cozy-modal-backdrop flex items-center justify-center p-3 select-none font-sans animate-in fade-in duration-200">
      <div className="cozy-card w-full max-w-[400px] p-4 flex flex-col text-[#4A3222] border-2 border-[#4A3222] shadow-[0_5px_0_#4A3222] max-h-[92vh] overflow-y-auto">
        
        {/* Header Ribbon */}
        <div className="cozy-ribbon mb-2 text-center w-full relative py-1.5 px-4 shadow-sm border border-[#4A3222]">
          <div className="flex items-center justify-between">
            <span className="text-lg">🏆</span>
            <div>
              <span className="font-serif font-black text-sm tracking-wide block leading-none text-[#FFFDF9]">
                ĐẤU TRƯỜNG "CÚP PHIN VÀNG"
              </span>
              <span className="text-[10px] text-[#FFF3D6] font-semibold">
                Đua Top Tỉnh Thành Toàn Quốc
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full bg-[#FAF0E1] hover:bg-[#F2ECE1] text-[#4A3222] font-black flex items-center justify-center text-xs border border-[#4A3222] cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 1. Player Home Province Contribution Banner */}
        <div className="bg-[#FAF0E1] border border-[#4A3222] rounded-xl p-2.5 mb-2.5 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xl">📍</span>
              <div>
                <span className="text-xs font-black text-[#4A3222] block leading-tight">
                  Tỉnh đại diện: {homeProv.name}
                </span>
                <span className="text-[10px] text-[#8C6E54] font-semibold">
                  Hạng cá nhân: #{provincialLeague?.currentRankInProvince || 4} trong tỉnh
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-[#E08738] text-white text-[10px] font-bold">
              {provincialLeague?.weeklyContributionScore || 120} điểm tuần
            </span>
          </div>

          <p className="text-[10px] text-[#5D4037] leading-tight bg-[#FFF8ED] p-1.5 rounded-lg border border-[#EAE0D3]">
            💡 Mỗi ly nước pha đạt <strong>"Chuẩn Gu! ✨"</strong> sẽ đóng góp +1 điểm danh dự cho tỉnh quê hương của bạn!
          </p>
        </div>

        {/* 2. Provincial Leaderboard */}
        <span className="text-[11px] font-black uppercase text-[#4A3222] mb-1 block">
          Bảng Xếp Hạng Tuần Này:
        </span>
        <div className="space-y-1 mb-2.5">
          {rankings.map((r) => {
            const isHome = r.id === homeProvId;
            return (
              <div
                key={r.id}
                className={`flex items-center justify-between p-2 rounded-xl border text-xs ${
                  isHome
                    ? 'bg-[#FFF8ED] border-2 border-[#E08738] shadow-2xs font-bold'
                    : 'bg-[#FAF0E1] border-[#D8C7B5]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      r.rank === 1
                        ? 'bg-amber-400 text-amber-950'
                        : r.rank === 2
                        ? 'bg-stone-300 text-stone-900'
                        : r.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {r.rank}
                  </span>
                  <div>
                    <span className="text-xs text-[#4A3222] leading-tight block">
                      {PROVINCE_CONFIGS[r.id as ProvinceId]?.name || r.leadName}
                    </span>
                    <span className="text-[9px] text-[#8C6E54]">
                      Đội dẫn đầu: {r.leadName}
                    </span>
                  </div>
                </div>

                <span className="font-mono font-black text-amber-800 text-xs">
                  {r.score.toLocaleString()} đ
                </span>
              </div>
            );
          })}
        </div>

        {/* 3. Mascot Skins & Rewards */}
        <div className="bg-[#FAF0E1] border border-[#4A3222] rounded-xl p-2.5 mb-2.5">
          <span className="text-[11px] font-black text-[#4A3222] block mb-1">
            🎁 Phần Thưởng Tuần & Trang Phục Vùng Miền:
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-center text-[10px]">
            <div className="bg-[#FFF8ED] border border-[#D8C7B5] rounded-lg p-1.5">
              <span className="text-xl block mb-0.5">🐱👒</span>
              <span className="font-bold text-[#4A3222] block">Mèo Mướp Nón Lá</span>
              <span className="text-emerald-700 font-semibold">Tự động dọn bàn</span>
            </div>
            <div className="bg-[#FFF8ED] border border-[#D8C7B5] rounded-lg p-1.5">
              <span className="text-xl block mb-0.5">🐶🧣</span>
              <span className="font-bold text-[#4A3222] block">Cún Khăn Rằn</span>
              <span className="text-amber-700 font-semibold">+10% Khách du lịch</span>
            </div>
          </div>
        </div>

        {/* Claim Reward Button */}
        <button
          onClick={handleClaimReward}
          className="w-full py-2.5 bg-[#5C9E54] hover:bg-[#4E8B46] text-white text-xs font-black uppercase rounded-xl border border-[#4A3222] shadow-[0_3px_0_#4A3222] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>🎁</span>
          <span>NHẬN THƯỞNG ĐÓNG GÓP TUẦN (+15 🫘)</span>
        </button>
      </div>
    </div>
  );
};
