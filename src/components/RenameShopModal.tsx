import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { EventBus } from '../game/EventBus';
import { X, Tag } from 'lucide-react';

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
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#170C06]/80 backdrop-blur-xs p-3 select-none font-sans animate-in zoom-in-95 duration-150">
      <div className="w-full max-w-[360px] game-panel p-4 flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b-2 border-[#4A3222]/20 pb-2 mb-2.5">
          <div className="game-ribbon px-3 py-1 flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-[#4A3222]" />
            <div>
              <h3 className="font-mali font-bold text-sm text-[#4A3222] tracking-wide leading-none">
                ĐẶT TÊN BẢNG HIỆU
              </h3>
              <p className="text-[10px] text-[#7A543A] font-nunito font-bold mt-0.5 leading-none">
                Hiển thị trực tiếp lên bảng hiệu quán
              </p>
            </div>
          </div>
          <button
            onClick={() => setRenameModalOpen(false)}
            className="w-7 h-7 rounded-full game-btn game-btn-red flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Input */}
        <div className="w-full mb-2.5">
          <label className="block text-xs font-mali font-bold text-[#7A543A] mb-1">
            Tên quán của bạn:
          </label>
          <input
            type="text"
            value={inputName}
            maxLength={26}
            onChange={(e) => setInputName(e.target.value)}
            className="w-full px-3 py-2 bg-[#FFFDF9] border-[2.5px] border-[#4A3222] shadow-inner rounded-xl text-[#4A3222] font-mali font-bold text-sm outline-none"
            placeholder="Nhập tên quán cà phê..."
          />
        </div>

        {/* Suggestions */}
        <div className="w-full mb-2.5">
          <span className="text-[11px] text-[#7A543A] font-mali font-bold block mb-1">
            💡 Gợi ý tên hài hước Sài Gòn:
          </span>
          <div className="flex flex-wrap gap-1">
            {SUGGESTIONS.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => setInputName(sug)}
                className="text-[11px] font-mali font-bold px-2 py-0.5 game-btn game-btn-cream rounded-lg cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Owner Character Selection */}
        <div className="w-full mb-3 pt-2 border-t border-[#4A3222]/20">
          <label className="block text-xs font-mali font-bold text-[#7A543A] mb-1.5">
            CHỌN CHỦ QUÁN ĐỨNG PHA CHẾ:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setOwnerGender('MALE')}
              className={`p-2 rounded-2xl flex flex-col items-center justify-center border-[2.5px] cursor-pointer transition-all ${
                ownerGender === 'MALE'
                  ? 'bg-[#FAF0E1] border-[#4A3222] shadow-[0_3px_0_#4A3222] ring-2 ring-[#F4A236]'
                  : 'bg-[#FFFDF9] hover:bg-[#FAF0E1] border-[#4A3222]/40 shadow-none'
              }`}
            >
              <img
                src="/assets/sprites/chu_quan_nam.png"
                alt="Anh Ba"
                className="w-10 h-16 object-contain mb-1"
              />
              <span className="text-xs font-mali font-bold text-[#4A3222]">👨 Anh Ba (Nam)</span>
              <span className="text-[10px] font-nunito font-bold text-[#7A543A]">
                Khởi nghiệp nhiệt huyết
              </span>
            </button>

            <button
              type="button"
              onClick={() => setOwnerGender('FEMALE')}
              className={`p-2 rounded-2xl flex flex-col items-center justify-center border-[2.5px] cursor-pointer transition-all ${
                ownerGender === 'FEMALE'
                  ? 'bg-[#FAF0E1] border-[#4A3222] shadow-[0_3px_0_#4A3222] ring-2 ring-[#F4A236]'
                  : 'bg-[#FFFDF9] hover:bg-[#FAF0E1] border-[#4A3222]/40 shadow-none'
              }`}
            >
              <img
                src="/assets/sprites/chu_quan_nu.png"
                alt="Chị Bảy"
                className="w-10 h-16 object-contain mb-1"
              />
              <span className="text-xs font-mali font-bold text-[#4A3222]">👩 Chị Bảy (Nữ)</span>
              <span className="text-[10px] font-nunito font-bold text-[#7A543A]">
                Duyên dáng, khéo tay
              </span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full flex gap-2">
          <button
            onClick={() => setRenameModalOpen(false)}
            className="flex-1 py-2 game-btn game-btn-cream text-xs font-mali font-bold uppercase rounded-xl"
          >
            HỦY
          </button>
          <button
            onClick={handleSave}
            disabled={!inputName.trim()}
            className="flex-1 py-2 game-btn game-btn-green text-xs font-mali font-bold uppercase rounded-xl disabled:opacity-50"
          >
            LƯU BẢNG HIỆU
          </button>
        </div>
      </div>
    </div>
  );
};
