import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { EventBus } from '../game/EventBus';

const SUGGESTIONS = [
  'Cà Phê Nợ Môn',
  'Tiệm Nước Mất Ngủ',
  'Quán Cóc Bất Ổn',
  'Bạc Xỉu Cột Điện',
  'Góc Phố Thơ Mộng',
  'Cà Phê Vỉa Hè 90s',
];

export const RenameShopModal: React.FC = () => {
  const shopName = useGameStore((s) => s.shopName);
  const setShopName = useGameStore((s) => s.setShopName);
  const ownerGender = useGameStore((s) => s.ownerGender);
  const setOwnerGender = useGameStore((s) => s.setOwnerGender);
  const isRenameModalOpen = useGameStore((s) => s.isRenameModalOpen);
  const setRenameModalOpen = useGameStore((s) => s.setRenameModalOpen);

  const [inputName, setInputName] = useState<string>(shopName);

  if (!isRenameModalOpen) return null;

  const handleSave = () => {
    const trimmed = inputName.trim();
    if (!trimmed) return;
    setShopName(trimmed);
    EventBus.emit('shop-name-updated', trimmed);
    setRenameModalOpen(false);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center cozy-modal-backdrop p-3 select-none font-sans animate-in zoom-in-95 duration-150">
      <div className="w-full max-w-[360px] cozy-card p-4 flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b-2 border-[#D8C7B5] pb-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-8 h-8 rounded-xl bg-[#FAF0E1] border border-[#D8C7B5] flex items-center justify-center text-base">
              🏷️
            </span>
            <div>
              <h3 className="font-serif font-black text-sm text-[#3E2415] tracking-wide leading-none">
                ĐẶT TÊN BẢNG HIỆU
              </h3>
              <p className="text-[11px] text-[#8C6E54] mt-0.5 leading-none">Hiển thị trực tiếp lên bảng hiệu quán</p>
            </div>
          </div>
          <button
            onClick={() => setRenameModalOpen(false)}
            className="w-7 h-7 rounded-full bg-[#FAF0E1] hover:bg-[#EADDC9] text-[#5D4037] text-xs font-black border border-[#DECBB9] flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Input */}
        <div className="w-full mb-2.5">
          <label className="block text-xs font-bold text-[#8C6E54] mb-1">
            Tên quán của bạn:
          </label>
          <input
            type="text"
            value={inputName}
            maxLength={26}
            onChange={(e) => setInputName(e.target.value)}
            className="w-full px-3 py-2 bg-[#FFFDF9] border-2 border-[#D8C7B5] rounded-xl text-[#3E2415] text-sm font-bold outline-none shadow-inner"
            placeholder="Nhập tên quán cà phê..."
          />
        </div>

        {/* Suggestions */}
        <div className="w-full mb-2.5">
          <span className="text-[11px] text-[#8C6E54] font-bold block mb-1">
            💡 Gợi ý tên hài hước Sài Gòn:
          </span>
          <div className="flex flex-wrap gap-1">
            {SUGGESTIONS.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => setInputName(sug)}
                className="text-[11px] font-bold px-2 py-0.5 bg-[#FAF0E1] hover:bg-[#F2ECE1] text-[#3E2415] border border-[#D8C7B5] rounded-lg shadow-2xs active:scale-95 cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Owner Character Selection */}
        <div className="w-full mb-3 pt-2 border-t border-[#D8C7B5]">
          <label className="block text-xs font-bold text-[#8C6E54] mb-1.5">
            CHỌN CHỦ QUÁN ĐỨNG PHA CHẾ:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setOwnerGender('MALE')}
              className={`p-2 rounded-2xl flex flex-col items-center justify-center border-2 cursor-pointer transition-all ${
                ownerGender === 'MALE'
                  ? 'bg-[#FAF0E1] border-[#E08738] text-[#3E2415] shadow-xs ring-2 ring-[#E08738]'
                  : 'bg-[#FFFDF9] hover:bg-[#FAF0E1] border-[#D8C7B5] text-[#8C6E54]'
              }`}
            >
              <img src="/assets/sprites/chu_quan_nam.png" alt="Anh Ba" className="w-10 h-16 object-contain mb-1" />
              <span className="text-xs font-bold text-[#3E2415]">👨 Anh Ba (Nam)</span>
              <span className="text-[10px] text-[#8C6E54]">Khởi nghiệp nhiệt huyết</span>
            </button>

            <button
              type="button"
              onClick={() => setOwnerGender('FEMALE')}
              className={`p-2 rounded-2xl flex flex-col items-center justify-center border-2 cursor-pointer transition-all ${
                ownerGender === 'FEMALE'
                  ? 'bg-[#FAF0E1] border-[#E08738] text-[#3E2415] shadow-xs ring-2 ring-[#E08738]'
                  : 'bg-[#FFFDF9] hover:bg-[#FAF0E1] border-[#D8C7B5] text-[#8C6E54]'
              }`}
            >
              <img src="/assets/sprites/chu_quan_nu.png" alt="Chị Bảy" className="w-10 h-16 object-contain mb-1" />
              <span className="text-xs font-bold text-[#3E2415]">👩 Chị Bảy (Nữ)</span>
              <span className="text-[10px] text-[#8C6E54]">Duyên dáng, khéo tay</span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full flex gap-2">
          <button
            onClick={() => setRenameModalOpen(false)}
            className="flex-1 py-2 cozy-btn-wood text-xs uppercase"
          >
            HỦY
          </button>
          <button
            onClick={handleSave}
            disabled={!inputName.trim()}
            className="flex-1 py-2 cozy-btn-green text-xs uppercase disabled:opacity-50"
          >
            XÁC NHẬN ĐỔI TÊN
          </button>
        </div>
      </div>
    </div>
  );
};
