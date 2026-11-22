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
    <div className="cozy-modal-backdrop z-50">
      <div className="cozy-card w-full max-w-[390px] p-4 flex flex-col max-h-[88vh] text-[#5D4037]">
        {/* Ribbon Header */}
        <div className="cozy-ribbon mb-2 text-center relative py-1.5 px-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-lg">🗺️</span>
            <span className="font-bold text-sm tracking-wide">LỘ TRÌNH 6 GIAI ĐOẠN</span>
            <button
              onClick={() => setRoadmapModalOpen(false)}
              className="w-6 h-6 rounded-full bg-[#EFE3D3] hover:bg-[#E5D4C0] text-[#5D4037] font-bold flex items-center justify-center text-xs border border-[#D8C7B5] cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Timeline List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {STAGES.map((stg) => {
            const isUnlocked = currentStage >= stg.stage;
            const isCurrent = currentStage === stg.stage;

            return (
              <div
                key={stg.stage}
                className={`cozy-card-inner p-3 transition-all relative ${
                  isCurrent
                    ? 'border-2 border-[#E08738] bg-[#FFF8EB]'
                    : isUnlocked
                    ? 'border border-[#739E7A] bg-[#F4F9F4]'
                    : 'border border-[#D8C7B5]/60 bg-[#F2EDE4]/60 opacity-60'
                }`}
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl shrink-0 p-1.5 bg-[#FFF9EF] rounded-xl border border-[#D8C7B5]">
                      {stg.icon}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#3E2415] uppercase">
                        GĐ {stg.stage}: {stg.name}
                      </h4>
                      <span className="text-[10px] font-semibold text-[#8C6E54] block">
                        {stg.chapter}
                      </span>
                    </div>
                  </div>
                  {isCurrent ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F4C447] text-[#3E2415] border border-[#DEAC2B]">
                      ĐANG Ở ĐÂY
                    </span>
                  ) : isUnlocked ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#739E7A] text-white">
                      ✓ ĐÃ MỞ
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D8C7B5] text-[#5D4037]">
                      🔒 KHÓA
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#5D4037]/90 leading-relaxed mb-2 font-medium">
                  {stg.desc}
                </p>

                {/* Requirements (for locked stages) */}
                {!isUnlocked && (
                  <div className="flex items-center justify-between text-xs bg-[#FAF5ED] p-2 rounded-xl border border-[#DECBB9]">
                    <span className="text-[#8C6E54] font-bold text-[10px] uppercase">Yêu cầu:</span>
                    <span className={gold >= stg.goldReq ? 'text-[#3E7B45] font-bold' : 'text-[#8C6E54]'}>
                      🪙 {formatVND(stg.goldReq)}
                    </span>
                    <span className={reputation >= stg.repReq ? 'text-[#D97706] font-bold' : 'text-[#8C6E54]'}>
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
          <div className="pt-2.5 mt-2 border-t border-[#D8C7B5]">
            <button
              onClick={handleLevelUp}
              disabled={!canLevelUp}
              className={`w-full py-2.5 text-xs uppercase tracking-wide flex items-center justify-center gap-2 rounded-2xl font-bold cursor-pointer transition-all ${
                canLevelUp
                  ? 'cozy-btn-green animate-pulse'
                  : 'bg-[#D8C7B5] text-[#8C6E54] cursor-not-allowed opacity-60'
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
