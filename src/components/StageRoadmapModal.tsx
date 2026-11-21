import React from 'react';
import { useGameStore, formatVND } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';

interface StageInfo {
  stage: number;
  name: string;
  subtitle: string;
  chapter: string;
  goldReq: number;
  repReq: number;
  desc: string;
  icon: string;
}

const STAGES: StageInfo[] = [
  {
    stage: 1,
    name: 'Quán Cóc Vỉa Hè',
    subtitle: 'Khởi nghiệp vỉa hè Sài Gòn',
    chapter: 'Chương 1: 60 Ngàn & 4 Ghế Nhựa',
    goldReq: 0,
    repReq: 0,
    desc: 'Bắt đầu từ vỉa hè góc phố với vài chiếc ghế nhựa, phin nhôm nhỏ giọt và ấm nước sôi.',
    icon: '🪑',
  },
  {
    stage: 2,
    name: 'Xe Đẩy Take-Away',
    subtitle: 'Cơn sốt cà phê mang đi',
    chapter: 'Chương 2: Sóng Gió Trật Tự & Anh Shipper',
    goldReq: 250000,
    repReq: 15,
    desc: 'Nâng cấp xe đẩy lưu động có mái che, mở khóa khách Shipper đặt đơn combo nhanh.',
    icon: '🛵',
  },
  {
    stage: 3,
    name: 'Kiosk Chung Cư / Đại Học',
    subtitle: 'Không gian máy lạnh tiện ích',
    chapter: 'Chương 3: Sinh Viên Chạy Deadline',
    goldReq: 1200000,
    repReq: 50,
    desc: 'Mặt bằng kiosk có máy lạnh, ổ cắm điện, sinh viên chạy deadline ngồi thâu đêm.',
    icon: '🏢',
  },
  {
    stage: 4,
    name: 'Nhà Phố 2 Tầng Cổ Điển',
    subtitle: 'Quán Flagship góc ngã tư',
    chapter: 'Chương 4: Góc Sống Ảo & KOL Check-in',
    goldReq: 6000000,
    repReq: 150,
    desc: 'Biệt thự cổ kính 2 tầng, ban công hoa giấy rực rỡ, thu hút Reviewer & TikToker.',
    icon: '🏡',
  },
  {
    stage: 5,
    name: 'Xưởng Rang Xay & Bếp Trung Tâm',
    subtitle: 'Cung ứng cà phê hạt mộc',
    chapter: 'Chương 5: Chuỗi Nhượng Quyền Toàn Quốc',
    goldReq: 30000000,
    repReq: 400,
    desc: 'Dây chuyền máy rang hiện đại, cung cấp hạt Robusta & Arabica độc quyền.',
    icon: '🏭',
  },
  {
    stage: 6,
    name: 'Đế Chế Toàn Cầu',
    subtitle: 'Vươn tầm thế giới',
    chapter: 'Chương 6: Hương Vị Việt Ra Thế Giới',
    goldReq: 150000000,
    repReq: 1000,
    desc: 'Cà Phê Phin Sài Gòn có mặt tại Tokyo, Paris, New York, khẳng định vị thế cà phê Việt.',
    icon: '🌏',
  },
];

export const StageRoadmapModal: React.FC = () => {
  const isRoadmapModalOpen = useGameStore((s) => s.isRoadmapModalOpen);
  const setRoadmapModalOpen = useGameStore((s) => s.setRoadmapModalOpen);
  const currentStage = useGameStore((s) => s.currentStage);
  const gold = useGameStore((s) => s.gold);
  const reputation = useGameStore((s) => s.reputation);
  const unlockNextStage = useGameStore((s) => s.unlockNextStage);

  if (!isRoadmapModalOpen) return null;

  const nextStageInfo = STAGES.find((s) => s.stage === currentStage + 1);
  const canLevelUp =
    nextStageInfo && gold >= nextStageInfo.goldReq && reputation >= nextStageInfo.repReq;

  const handleLevelUp = () => {
    const success = unlockNextStage();
    if (success) {
      SoundManager.playCoinTing();
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-3 animate-in fade-in duration-200 select-none font-pixel">
      <div className="w-full max-w-[390px] pixel-box-wood text-[#FFE8C2] p-4 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b-2 border-black/40 pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-2xl drop-shadow-[2px_2px_0px_#000]">🗺️</span>
            <div>
              <h3 className="font-black text-sm text-[#FFD700] uppercase tracking-wide drop-shadow-[1px_1px_0px_#000]">
                Lộ Trình Khởi Nghiệp 6 Giai Đoạn
              </h3>
              <p className="text-xs text-[#FFE8C2]/70">Từ Vỉa Hè Đến Chuỗi Đế Chế Toàn Cầu</p>
            </div>
          </div>
          <button
            onClick={() => setRoadmapModalOpen(false)}
            className="pixel-btn pixel-btn-red w-7 h-7 flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        {/* Timeline List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {STAGES.map((stg) => {
            const isUnlocked = currentStage >= stg.stage;
            const isCurrent = currentStage === stg.stage;

            return (
              <div
                key={stg.stage}
                className={`pixel-box p-3 transition-all relative ${
                  isCurrent
                    ? 'bg-[#3D2314] border-[#FFD700]'
                    : isUnlocked
                    ? 'bg-[#1F2D18] border-[#437A22]'
                    : 'bg-[#1D130C] border-stone-800 opacity-60'
                }`}
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl shrink-0 p-1 bg-black/40 border border-black">
                      {stg.icon}
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-[#FFE8C2] uppercase">
                        Giai đoạn {stg.stage}: {stg.name}
                      </h4>
                      <span className="text-[10px] font-bold text-[#FFD700] block">
                        {stg.chapter}
                      </span>
                    </div>
                  </div>
                  {isCurrent ? (
                    <span className="pixel-badge bg-[#E8C547] text-[#2D1B0E]">
                      ĐANG Ở ĐÂY
                    </span>
                  ) : isUnlocked ? (
                    <span className="pixel-badge bg-[#5C9E54] text-white">
                      ✓ ĐÃ MỞ
                    </span>
                  ) : (
                    <span className="pixel-badge bg-stone-700 text-stone-300">
                      🔒 KHÓA
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#FFE8C2]/80 leading-relaxed mb-2">
                  {stg.desc}
                </p>

                {/* Requirements (for locked stages) */}
                {!isUnlocked && (
                  <div className="flex items-center justify-between text-xs bg-black/40 p-1.5 border border-black/60">
                    <span className="text-[#FFE8C2]/60 font-bold uppercase">Yêu cầu:</span>
                    <span className={gold >= stg.goldReq ? 'text-[#5C9E54] font-black' : 'text-[#FFE8C2]/50'}>
                      🪙 {formatVND(stg.goldReq)}
                    </span>
                    <span className={reputation >= stg.repReq ? 'text-[#FFD700] font-black' : 'text-[#FFE8C2]/50'}>
                      ⭐ {stg.repReq} Sao
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Level Up Button (if next stage reachable) */}
        {nextStageInfo && (
          <div className="pt-2.5 mt-2 border-t-2 border-black/40">
            <button
              onClick={handleLevelUp}
              disabled={!canLevelUp}
              className={`w-full pixel-btn py-2.5 text-xs uppercase tracking-wide flex items-center justify-center gap-2 ${
                canLevelUp
                  ? 'pixel-btn-green animate-pulse text-white'
                  : 'bg-stone-800 text-stone-500 border-stone-900 cursor-not-allowed opacity-50'
              }`}
            >
              <span>🚀</span>
              <span>
                {canLevelUp
                  ? `NÂNG CẤP LÊN GIAI ĐOẠN ${nextStageInfo.stage} NGAY!`
                  : `CẦN THÊM VỐN HOẶC SAO ĐỂ LÊN GIAI ĐOẠN ${nextStageInfo.stage}`}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
