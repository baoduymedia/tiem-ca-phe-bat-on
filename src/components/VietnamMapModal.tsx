import React, { useState } from 'react';
import { useGameStore, formatVND } from '../store/useGameStore';
import {
  PROVINCE_CONFIGS,
  SPOT_CONFIGS,
  type ProvinceId,
  type SpotType,
} from '../types/game';
import { SoundManager } from '../game/audio/SoundManager';
import { EventBus } from '../game/EventBus';

interface VietnamMapModalProps {
  onClose: () => void;
}

export const VietnamMapModal: React.FC<VietnamMapModalProps> = () => {
  const {
    currentStage,
    gold,
    spendGold,
    addReputation,
    selectedProvince,
    selectedLocationType,
    setProvince,
    setLocationType,
    branchLocations,
    addBranchLocation,
  } = useGameStore();

  const [activeProvTab, setActiveProvTab] = useState<ProvinceId>(selectedProvince || 'hcm');
  const [chosenSpot, setChosenSpot] = useState<SpotType>(selectedLocationType || 'alley');
  const [isOpen, setIsOpen] = useState<boolean>(true);

  if (!isOpen) return null;

  const currentProvinceConfig = PROVINCE_CONFIGS[activeProvTab];
  const currentSpotConfig = SPOT_CONFIGS[chosenSpot];

  // Check if branch already exists in this province + spot
  const existingBranch = branchLocations.find(
    (b) => b.provinceId === activeProvTab && b.spotType === chosenSpot
  );

  const unlockCost = Math.round(
    currentSpotConfig.rentPerDay * 15 * currentProvinceConfig.rentMultiplier
  );

  const handleOpenBranch = () => {
    if (gold < unlockCost) {
      EventBus.emit('customer-speak', {
        name: 'Trợ Lý Kinh Doanh',
        dialogue: `Chưa đủ vốn mở chi nhánh! Cần tối thiểu ${formatVND(unlockCost)}.`,
      });
      return;
    }

    const success = spendGold(unlockCost);
    if (success) {
      SoundManager.playCoinTing();
      addReputation(15);
      const branchName = `${currentProvinceConfig.name} - ${currentSpotConfig.name}`;
      const passiveIncome = Math.round(
        12000 * currentProvinceConfig.customerMultiplier * currentSpotConfig.tipMultiplier
      );

      addBranchLocation({
        provinceId: activeProvTab,
        spotType: chosenSpot,
        branchName,
        stage: 4,
        passiveIncomePerMin: passiveIncome,
        localReputation: 10,
      });

      EventBus.emit('customer-speak', {
        name: 'Trợ Lý Kinh Doanh',
        dialogue: `Khai trương hồng phát! Chi nhánh ${branchName} bắt đầu sinh lợi nhuận tự động!`,
      });
    }
  };

  const handleSelectActiveLocation = () => {
    setProvince(activeProvTab);
    setLocationType(chosenSpot);
    SoundManager.playIceClink();
    EventBus.emit('customer-speak', {
      name: 'Chủ Quán',
      dialogue: `Đã chuyển vùng vận hành chính về ${currentProvinceConfig.name}!`,
    });
  };

  const provinceList: ProvinceId[] = ['hcm', 'hanoi', 'dalat', 'hue_danang', 'cantho'];
  const spotList: SpotType[] = ['university', 'office', 'alley', 'tourist'];

  return (
    <div className="absolute inset-0 z-50 cozy-modal-backdrop flex items-center justify-center p-3 select-none font-sans animate-in fade-in duration-200">
      <div className="cozy-card w-full max-w-[420px] p-4 flex flex-col text-[#4A3222] border-2 border-[#4A3222] shadow-[0_5px_0_#4A3222] max-h-[92vh] overflow-y-auto">
        
        {/* Header Ribbon */}
        <div className="cozy-ribbon mb-2 text-center w-full relative py-1.5 px-4 shadow-sm border border-[#4A3222]">
          <div className="flex items-center justify-between">
            <span className="text-lg">🗺️</span>
            <div>
              <span className="font-serif font-black text-sm tracking-wide block leading-none text-[#FFFDF9]">
                BẢN ĐỒ VIỆT NAM — CHUỖI ĐA TỈNH
              </span>
              <span className="text-[10px] text-[#FFF3D6] font-semibold">
                Giai đoạn 4: Vươn tầm toàn quốc
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full bg-[#FAF0E1] hover:bg-[#F2ECE1] text-[#4A3222] font-black flex items-center justify-center text-xs border border-[#4A3222] cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 1. Province Selector Horizontal Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-2.5 scrollbar-none">
          {provinceList.map((pId) => {
            const p = PROVINCE_CONFIGS[pId];
            const isSelected = activeProvTab === pId;
            const hasBranch = branchLocations.some((b) => b.provinceId === pId);
            return (
              <button
                key={pId}
                onClick={() => {
                  setActiveProvTab(pId);
                  SoundManager.playIceClink();
                }}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-black whitespace-nowrap flex items-center gap-1 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#E08738] text-white border-[#4A3222] shadow-xs scale-102'
                    : 'bg-[#FAF0E1] text-[#4A3222] border-[#D8C7B5] hover:bg-[#F2ECE1]'
                }`}
              >
                <span>{hasBranch ? '📍' : '○'}</span>
                <span>{p.name.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* 2. Active Province Overview Card */}
        <div className="bg-[#FAF0E1] border border-[#4A3222] rounded-xl p-2.5 mb-2.5 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <div>
              <span className="font-serif font-black text-sm text-[#4A3222] block leading-tight">
                {currentProvinceConfig.name}
              </span>
              <span className="text-[10px] text-[#8C6E54] font-semibold">
                Biển số: {currentProvinceConfig.badge}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-[#5C9E54] text-white text-[10px] font-bold">
              Đặc sản: {currentProvinceConfig.specialtyName}
            </span>
          </div>

          <p className="text-[11px] text-[#5D4037] mb-1.5 leading-relaxed bg-[#FFF8ED] p-1.5 rounded-lg border border-[#EAE0D3]">
            {currentProvinceConfig.flavorProfile}
          </p>

          <div className="flex items-center justify-between text-[10px] font-bold text-[#8C6E54] pt-1 border-t border-[#DECBB9]">
            <span>Khách: ×{currentProvinceConfig.customerMultiplier}</span>
            <span>Hệ số thuê: ×{currentProvinceConfig.rentMultiplier}</span>
            <span className="text-amber-700">Thử thách: {currentProvinceConfig.localChallenge}</span>
          </div>
        </div>

        {/* 3. Spot Type Grid (4 Vị Trí Mặt Bằng) */}
        <span className="text-[11px] font-black uppercase text-[#4A3222] mb-1 block">
          Chọn vị trí mặt bằng tại {currentProvinceConfig.name.split(' (')[0]}:
        </span>
        <div className="grid grid-cols-2 gap-1.5 mb-2.5">
          {spotList.map((sId) => {
            const s = SPOT_CONFIGS[sId];
            const isSelected = chosenSpot === sId;
            const branch = branchLocations.find(
              (b) => b.provinceId === activeProvTab && b.spotType === sId
            );

            return (
              <button
                key={sId}
                onClick={() => setChosenSpot(sId)}
                className={`p-2 rounded-xl border text-left flex flex-col justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#FFF8ED] border-2 border-[#E08738] shadow-xs'
                    : 'bg-[#FAF0E1] border border-[#D8C7B5] hover:bg-[#F2ECE1]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-[11px] text-[#4A3222] truncate leading-tight">
                      {s.name.split(' /')[0]}
                    </span>
                    {branch && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-bold">
                        ĐÃ MỞ
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#8C6E54] line-clamp-2 leading-tight">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-1.5 pt-1 border-t border-[#DECBB9] flex justify-between text-[10px] font-bold">
                  <span className="text-red-700">{formatVND(s.rentPerDay)}/ngày</span>
                  <span className="text-emerald-700">Tip: ×{s.tipMultiplier}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 4. Action Banner */}
        <div className="bg-[#FAF0E1] border border-[#4A3222] rounded-xl p-2.5 flex flex-col gap-2">
          {existingBranch ? (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-emerald-700 block">
                  ✓ ĐÃ SỞ HỮU CHI NHÁNH NÀY
                </span>
                <span className="text-[10px] text-[#8C6E54] font-semibold">
                  Lợi nhuận thụ động: +{formatVND(existingBranch.passiveIncomePerMin)}/phút
                </span>
              </div>
              <button
                onClick={handleSelectActiveLocation}
                className="py-1.5 px-3 bg-[#5C9E54] hover:bg-[#4E8B46] text-white text-[11px] font-bold rounded-lg border border-[#4A3222] cursor-pointer"
              >
                Quản lý tại đây
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-[#4A3222] block">
                  Vốn đầu tư mở chi nhánh:
                </span>
                <span className="text-sm font-black text-[#D97706]">
                  {formatVND(unlockCost)}
                </span>
              </div>
              <button
                onClick={handleOpenBranch}
                className="py-2 px-3.5 bg-[#E08738] hover:bg-[#ED9445] text-white text-xs font-black uppercase rounded-xl border border-[#4A3222] shadow-[0_2.5px_0_#4A3222] active:translate-y-0.5 cursor-pointer"
              >
                Mở Chi Nhánh 🚀
              </button>
            </div>
          )}
        </div>

        {/* Total Branch Stats */}
        <div className="mt-2 text-center text-[11px] text-[#8C6E54] font-semibold">
          Đang vận hành: {branchLocations.length} chi nhánh trên toàn quốc
        </div>
      </div>
    </div>
  );
};
