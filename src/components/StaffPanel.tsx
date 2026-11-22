import React from 'react';
import { useGameStore, formatVND } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';
import { EventBus } from '../game/EventBus';

interface StaffPanelProps {
  onClose: () => void;
}

export const StaffPanel: React.FC<StaffPanelProps> = ({ onClose }) => {
  const {
    staffState,
    gold,
    spendGold,
    treatStaffMilkTea,
    updateStaffStamina,
  } = useGameStore();

  const stamina = staffState?.stamina ?? 85;
  const isBuffed = (staffState?.milkTeaBuffUntil ?? 0) > Date.now();

  const handleTreatMilkTea = () => {
    const cost = 50000;
    if (gold < cost) {
      EventBus.emit('customer-speak', {
        name: 'Nhân Viên',
        dialogue: `Chủ quán ơi, chưa đủ ${formatVND(cost)} để khao trà sữa cả team rồi!`,
      });
      return;
    }

    const ok = treatStaffMilkTea();
    if (ok) {
      SoundManager.playCoinTing();
      EventBus.emit('customer-speak', {
        name: 'Nhân Viên',
        dialogue: 'Cảm ơn chủ quán! Trà sữa full topping hồi 100% năng lượng, làm việc hăng say!',
      });
    }
  };

  const staffList = [
    {
      id: 'barista_1',
      name: 'Bạn Sinh Viên Phụ Quán',
      role: 'Pha chế cơ bản & Chạy bàn',
      avatar: '🧑‍🎓',
      skillLevel: 4,
      dailyWage: 40000,
    },
    {
      id: 'cleaner_1',
      name: 'Cô Tư Dọn Vệ Sinh',
      role: 'Lau dọn bàn ghế & Rửa ly',
      avatar: '👵',
      skillLevel: 6,
      dailyWage: 35000,
    },
    {
      id: 'roaster_1',
      name: 'Bác Thợ Rang Lành Nghề',
      role: 'Xưởng rang xay Robusta/Arabica',
      avatar: '👨‍🍳',
      skillLevel: 5,
      dailyWage: 60000,
    },
    {
      id: 'global_mgr',
      name: 'Quản Lý Song Ngữ',
      role: 'Chi nhánh Tokyo / Seoul / Paris',
      avatar: '👩‍💼',
      skillLevel: 7,
      dailyWage: 120000,
      knowsLanguage: true,
    },
  ];

  return (
    <div className="absolute inset-0 z-50 cozy-modal-backdrop flex items-center justify-center p-3 select-none font-sans animate-in fade-in duration-200">
      <div className="cozy-card w-full max-w-[400px] p-4 flex flex-col text-[#4A3222] border-2 border-[#4A3222] shadow-[0_5px_0_#4A3222] max-h-[92vh] overflow-y-auto">
        
        {/* Header Ribbon */}
        <div className="cozy-ribbon mb-2 text-center w-full relative py-1.5 px-4 shadow-sm border border-[#4A3222]">
          <div className="flex items-center justify-between">
            <span className="text-lg">👥</span>
            <div>
              <span className="font-serif font-black text-sm tracking-wide block leading-none text-[#FFFDF9]">
                QUẢN TRỊ ĐỘI NGŨ NHÂN SỰ
              </span>
              <span className="text-[10px] text-[#FFF3D6] font-semibold">
                Năng lượng & Tay nghề phục vụ
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

        {/* 1. Overall Team Stamina & Milk Tea Buff Banner */}
        <div className="bg-[#FAF0E1] border border-[#4A3222] rounded-xl p-2.5 mb-2.5 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xl">⚡</span>
              <div>
                <span className="text-xs font-black text-[#4A3222] block leading-tight">
                  Thể Lực Toàn Đội (Stamina): {Math.round(stamina)}%
                </span>
                <span className="text-[10px] text-[#8C6E54] font-semibold">
                  {isBuffed ? '✨ Đang kích hoạt Buff Tốc độ +25%!' : 'Khi Stamina thấp, nhân viên pha chậm'}
                </span>
              </div>
            </div>
          </div>

          {/* Stamina Bar Track */}
          <div className="w-full h-3 bg-[#422615] rounded-full overflow-hidden p-0.5 mb-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                stamina > 50
                  ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                  : stamina > 20
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-red-600 to-rose-400 animate-pulse'
              }`}
              style={{ width: `${stamina}%` }}
            />
          </div>

          {/* Khao Trà Sữa Button (SPEC §2 Giai đoạn 4) */}
          <button
            onClick={handleTreatMilkTea}
            className="w-full py-2 bg-[#E08738] hover:bg-[#ED9445] text-white text-xs font-black rounded-xl border border-[#4A3222] shadow-[0_2px_0_#4A3222] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>🧋</span>
            <span>KHAO CẢ TEAM CHẦU TRÀ SỮA (50.000đ)</span>
          </button>
        </div>

        {/* 2. Staff Roster */}
        <span className="text-[11px] font-black uppercase text-[#4A3222] mb-1 block">
          Danh Sách Nhân Viên:
        </span>
        <div className="space-y-1.5 mb-2">
          {staffList.map((member) => (
            <div
              key={member.id}
              className="bg-[#FAF0E1] border border-[#D8C7B5] rounded-xl p-2 flex items-center justify-between shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{member.avatar}</span>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black text-[#4A3222]">
                      {member.name}
                    </span>
                    {member.knowsLanguage && (
                      <span className="text-[9px] bg-sky-100 text-sky-800 border border-sky-300 px-1 rounded font-bold">
                        🌐 Song Ngữ
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#8C6E54] block">
                    {member.role}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-emerald-800 block">
                  Lv.{member.skillLevel}
                </span>
                <span className="text-[10px] text-red-700 font-semibold">
                  {formatVND(member.dailyWage)}/ngày
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-[10px] text-[#8C6E54]">
          💡 Nhân viên tay nghề cao sẽ tự động hỗ trợ dọn bàn và nhận đơn khi quán đông!
        </div>
      </div>
    </div>
  );
};
