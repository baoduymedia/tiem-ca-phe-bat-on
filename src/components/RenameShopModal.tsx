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
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none font-pixel">
      <div className="w-full max-w-[360px] bg-[#24140B] border-4 border-black shadow-[4px_4px_0px_#000] p-4 flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b-2 border-black pb-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🏷️</span>
            <div>
              <h3 className="font-bold text-sm text-[#FFD700] uppercase tracking-wide leading-none">
                ĐẶT TÊN BẢNG HIỆU
              </h3>
              <p className="text-xs text-[#D4A373] mt-0.5 leading-none">Hiển thị trực tiếp lên bảng hiệu quán</p>
            </div>
          </div>
          <button
            onClick={() => setRenameModalOpen(false)}
            className="w-7 h-7 flex items-center justify-center bg-[#DC2626] hover:bg-[#EF4444] text-white text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer transition-transform"
          >
            ✕
          </button>
        </div>

        {/* Input */}
        <div className="w-full mb-2.5">
          <label className="block text-xs font-bold text-amber-200 mb-1">
            TÊN QUÁN CỦA BẠN:
          </label>
          <input
            type="text"
            value={inputName}
            maxLength={26}
            onChange={(e) => setInputName(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-[#1A0E05] border-2 border-black text-[#FFD700] text-sm font-bold outline-none shadow-inner"
            placeholder="Nhập tên quán cà phê..."
          />
        </div>

        {/* Suggestions */}
        <div className="w-full mb-2.5">
          <span className="text-xs text-[#D4A373] block mb-1">
            💡 Gợi ý tên hài hước Sài Gòn:
          </span>
          <div className="flex flex-wrap gap-1">
            {SUGGESTIONS.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => setInputName(sug)}
                className="text-xs font-bold px-2 py-0.5 bg-[#3E2413] hover:bg-[#5A351E] text-amber-200 border border-black shadow-[1px_1px_0px_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Owner Character Selection */}
        <div className="w-full mb-3 pt-2 border-t border-black/40">
          <label className="block text-xs font-bold text-amber-200 mb-1.5">
            CHỌN CHỦ QUÁN ĐỨNG PHA CHẾ:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setOwnerGender('MALE')}
              className={`p-2 flex flex-col items-center justify-center border-2 border-black cursor-pointer transition-transform ${
                ownerGender === 'MALE'
                  ? 'bg-[#15803D] text-white shadow-[2px_2px_0px_#000] ring-2 ring-[#FFD700]'
                  : 'bg-[#1A0E05] hover:bg-[#2D180C] text-[#FFF8E7]/70 shadow-[1px_1px_0px_#000]'
              }`}
            >
              <img src="/assets/sprites/chu_quan_nam.png" alt="Anh Ba" className="w-10 h-16 object-contain mb-1" />
              <span className="text-xs font-bold">👨 Anh Ba (Nam)</span>
              <span className="text-[10px] text-amber-300">Khởi nghiệp nhiệt huyết</span>
            </button>

            <button
              type="button"
              onClick={() => setOwnerGender('FEMALE')}
              className={`p-2 flex flex-col items-center justify-center border-2 border-black cursor-pointer transition-transform ${
                ownerGender === 'FEMALE'
                  ? 'bg-[#15803D] text-white shadow-[2px_2px_0px_#000] ring-2 ring-[#FFD700]'
                  : 'bg-[#1A0E05] hover:bg-[#2D180C] text-[#FFF8E7]/70 shadow-[1px_1px_0px_#000]'
              }`}
            >
              <img src="/assets/sprites/chu_quan_nu.png" alt="Chị Bảy" className="w-10 h-16 object-contain mb-1" />
              <span className="text-xs font-bold">👩 Chị Bảy (Nữ)</span>
              <span className="text-[10px] text-amber-300">Duyên dáng, khéo tay</span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full flex gap-2">
          <button
            onClick={() => setRenameModalOpen(false)}
            className="flex-1 py-1.5 bg-[#451A03] hover:bg-[#5A2508] text-[#FFF8E7] text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-transform"
          >
            HỦY
          </button>
          <button
            onClick={handleSave}
            disabled={!inputName.trim()}
            className="flex-1 py-1.5 bg-[#16A34A] hover:bg-[#22C55E] text-white text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-transform disabled:opacity-50"
          >
            XÁC NHẬN ĐỔI TÊN
          </button>
        </div>
      </div>
    </div>
  );
};
