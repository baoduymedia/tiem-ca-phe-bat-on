import React, { useState } from 'react';
import { useGameStore, formatVND } from '../store/useGameStore';
import {
  TECH_NODE_COSTS,
  type RoastLevel,
  type SignatureRecipe,
} from '../types/game';
import { SoundManager } from '../game/audio/SoundManager';
import { EventBus } from '../game/EventBus';

interface RndAndRoasteryModalProps {
  onClose: () => void;
}

export const RndAndRoasteryModal: React.FC<RndAndRoasteryModalProps> = ({ onClose }) => {
  const {
    currentStage,
    gold,
    goldenBeans,
    spendGold,
    addGoldenBeans,
    addReputation,
    roastery,
    updateRoasterySettings,
    signatureRecipes,
    addSignatureRecipe,
    techTree,
    unlockTechNode,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<'roastery' | 'lab' | 'tech' | 'global'>('roastery');

  // Roastery state
  const [selectedBean, setSelectedBean] = useState<'robusta' | 'arabica'>(
    roastery?.beanType || 'robusta'
  );
  const [selectedRoast, setSelectedRoast] = useState<RoastLevel>(
    roastery?.roastLevel || 'MEDIUM'
  );

  // Recipe Lab state
  const [customDrinkName, setCustomDrinkName] = useState<string>('Trà Mãng Cầu Giã Tay');
  const [baseIngredient, setBaseIngredient] = useState<string>('Cốt Cà Phê Phin Đậm');
  const [toppingIngredient, setToppingIngredient] = useState<string>('Kem Muối Béo');
  const [technique, setTechnique] = useState<string>('Lắc Shaker Đá Bi');

  const handleSaveRoastery = () => {
    updateRoasterySettings(selectedBean, selectedRoast);
    SoundManager.playCoinTing();
    EventBus.emit('customer-speak', {
      name: 'Bác Thợ Rang',
      dialogue: `Mẻ rang ${selectedBean.toUpperCase()} (${selectedRoast}) hoàn tất! Giảm ngay 35% chi phí kho toàn chuỗi!`,
    });
  };

  const handleCreateSignature = () => {
    if (!customDrinkName.trim()) return;

    const newRecipe = addSignatureRecipe({
      customName: customDrinkName.trim(),
      baseIngredient,
      toppingIngredient,
      technique,
      priceMultiplier: 1.6,
      isTrending: true,
    });

    SoundManager.playCoinTing();
    addReputation(25);
    EventBus.emit('customer-speak', {
      name: 'Chuyên Gia R&D',
      dialogue: `Tuyệt phẩm "${newRecipe.customName}" ra đời! Đang lên Hot Trend TikTok toàn quốc!`,
    });
  };

  const handleUnlockTech = (nodeId: string) => {
    const cost = TECH_NODE_COSTS[nodeId] || 15;
    if (goldenBeans < cost) {
      EventBus.emit('customer-speak', {
        name: 'Giám Đốc Công Nghệ',
        dialogue: `Chưa đủ Hạt Cà Phê Vàng để nghiên cứu! Cần ${cost} 🫘.`,
      });
      return;
    }

    const ok = unlockTechNode(nodeId);
    if (ok) {
      SoundManager.playCoinTing();
      EventBus.emit('customer-speak', {
        name: 'Giám Đốc Công Nghệ',
        dialogue: `Đã mở khóa công nghệ mới: ${nodeId}! Hiệu quả quán tăng vọt!`,
      });
    }
  };

  const techNodes = [
    {
      id: 'qr_order',
      title: 'Quét Mã QR Tại Bàn',
      desc: 'Khách tự gọi món qua điện thoại, giảm tải 100% nhân viên chạy bàn.',
      icon: '📱',
      cost: 10,
    },
    {
      id: 'espresso_machine',
      title: 'Máy Pha Espresso Áp Suất',
      desc: 'Tốc độ pha đồ uống nhanh gấp đôi, phục vụ giờ cao điểm không lo trễ.',
      icon: '⚡',
      cost: 25,
    },
    {
      id: 'auto_restock',
      title: 'ERP Kho Tự Động',
      desc: 'Tự động gọi mối nạp kho khi nguyên liệu chạm ngưỡng dưới 20%.',
      icon: '🤖',
      cost: 50,
    },
    {
      id: 'cold_brew_export',
      title: 'Dây Chuyền Cold Brew Đóng Chai',
      desc: 'Bán lẻ cà phê đóng chai xuất khẩu, mang lại doanh thu thụ động liên tục.',
      icon: '🍾',
      cost: 60,
    },
  ];

  const globalCities = [
    {
      id: 'tokyo',
      name: 'Tokyo (Shinjuku)',
      flag: '🇯🇵',
      currency: '¥',
      dailyProfit: 180000,
      desc: 'Giới trẻ Nhật Bản mê mẩn set cà phê phin Việt Nam truyền thống.',
    },
    {
      id: 'seoul',
      name: 'Seoul (Gangnam)',
      flag: '🇰🇷',
      currency: '₩',
      dailyProfit: 165000,
      desc: 'Cà phê muối béo ngậy tạo cơn sốt check-in trên Instagram Hàn Quốc.',
    },
    {
      id: 'paris',
      name: 'Paris (Quận 1)',
      flag: '🇫🇷',
      currency: '€',
      dailyProfit: 220000,
      desc: 'Combo Bánh Mì Que & Phin Nhôm bán đắt như tôm tươi bên bờ sông Seine.',
    },
    {
      id: 'newyork',
      name: 'New York (Manhattan)',
      flag: '🇺🇸',
      currency: '$',
      dailyProfit: 350000,
      desc: 'Robusta Đắk Lắk đậm đà chinh phục dân tài chính phố Wall.',
    },
  ];

  return (
    <div className="absolute inset-0 z-50 cozy-modal-backdrop flex items-center justify-center p-3 select-none font-sans animate-in fade-in duration-200">
      <div className="cozy-card w-full max-w-[420px] p-4 flex flex-col text-[#4A3222] border-2 border-[#4A3222] shadow-[0_5px_0_#4A3222] max-h-[92vh] overflow-y-auto">
        
        {/* Header Ribbon */}
        <div className="cozy-ribbon mb-2 text-center w-full relative py-1.5 px-4 shadow-sm border border-[#4A3222]">
          <div className="flex items-center justify-between">
            <span className="text-lg">🔬</span>
            <div>
              <span className="font-serif font-black text-sm tracking-wide block leading-none text-[#FFFDF9]">
                XƯỞNG RANG XAY & PHÒNG R&D
              </span>
              <span className="text-[10px] text-[#FFF3D6] font-semibold">
                Giai đoạn 5 & 6: Chuỗi cung ứng & Toàn cầu
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

        {/* 4 Feature Tabs */}
        <div className="grid grid-cols-4 gap-1 mb-2.5">
          <button
            onClick={() => setActiveTab('roastery')}
            className={`py-1.5 rounded-xl border text-[10px] font-black cursor-pointer transition-all ${
              activeTab === 'roastery'
                ? 'bg-[#E08738] text-white border-[#4A3222] shadow-xs'
                : 'bg-[#FAF0E1] text-[#4A3222] border-[#D8C7B5]'
            }`}
          >
            🔥 Xưởng Rang
          </button>
          <button
            onClick={() => setActiveTab('lab')}
            className={`py-1.5 rounded-xl border text-[10px] font-black cursor-pointer transition-all ${
              activeTab === 'lab'
                ? 'bg-[#E08738] text-white border-[#4A3222] shadow-xs'
                : 'bg-[#FAF0E1] text-[#4A3222] border-[#D8C7B5]'
            }`}
          >
            🧪 Sáng Tạo
          </button>
          <button
            onClick={() => setActiveTab('tech')}
            className={`py-1.5 rounded-xl border text-[10px] font-black cursor-pointer transition-all ${
              activeTab === 'tech'
                ? 'bg-[#E08738] text-white border-[#4A3222] shadow-xs'
                : 'bg-[#FAF0E1] text-[#4A3222] border-[#D8C7B5]'
            }`}
          >
            💡 Công Nghệ
          </button>
          <button
            onClick={() => setActiveTab('global')}
            className={`py-1.5 rounded-xl border text-[10px] font-black cursor-pointer transition-all ${
              activeTab === 'global'
                ? 'bg-[#E08738] text-white border-[#4A3222] shadow-xs'
                : 'bg-[#FAF0E1] text-[#4A3222] border-[#D8C7B5]'
            }`}
          >
            🌐 Quốc Tế
          </button>
        </div>

        {/* TAB 1: XƯỞNG RANG XAY */}
        {activeTab === 'roastery' && (
          <div className="space-y-2">
            <div className="bg-[#FAF0E1] border border-[#4A3222] rounded-xl p-2.5 shadow-2xs">
              <span className="text-xs font-black text-[#4A3222] block mb-1">
                1. Chọn Nguồn Nông Sản Hạt:
              </span>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={() => setSelectedBean('robusta')}
                  className={`p-2 rounded-xl border text-left cursor-pointer ${
                    selectedBean === 'robusta'
                      ? 'bg-[#FFF8ED] border-2 border-[#E08738] shadow-xs'
                      : 'bg-[#FAF0E1] border-[#D8C7B5]'
                  }`}
                >
                  <span className="text-xs font-bold text-[#4A3222] block">
                    Robusta Buôn Ma Thuột
                  </span>
                  <span className="text-[10px] text-[#8C6E54] block">
                    Đậm đà, hàm lượng caffeine cao, giá vốn hạt tối ưu.
                  </span>
                </button>
                <button
                  onClick={() => setSelectedBean('arabica')}
                  className={`p-2 rounded-xl border text-left cursor-pointer ${
                    selectedBean === 'arabica'
                      ? 'bg-[#FFF8ED] border-2 border-[#E08738] shadow-xs'
                      : 'bg-[#FAF0E1] border-[#D8C7B5]'
                  }`}
                >
                  <span className="text-xs font-bold text-[#4A3222] block">
                    Arabica Cầu Đất (Đà Lạt)
                  </span>
                  <span className="text-[10px] text-[#8C6E54] block">
                    Hương hoa quả thanh tao, chua nhẹ quý phái, giá bán cao.
                  </span>
                </button>
              </div>

              <span className="text-xs font-black text-[#4A3222] block mb-1">
                2. Độ Rang (Roast Profile):
              </span>
              <div className="grid grid-cols-3 gap-1.5 mb-2">
                {(['LIGHT', 'MEDIUM', 'DARK'] as RoastLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedRoast(lvl)}
                    className={`py-1.5 rounded-lg border text-center text-[10px] font-black cursor-pointer ${
                      selectedRoast === lvl
                        ? 'bg-[#4A3222] text-[#FFF8ED] border-black shadow-xs'
                        : 'bg-[#FAF0E1] text-[#4A3222] border-[#D8C7B5]'
                    }`}
                  >
                    {lvl === 'LIGHT' ? 'Rang Sáng' : lvl === 'MEDIUM' ? 'Rang Vừa' : 'Rang Đậm'}
                  </button>
                ))}
              </div>

              <div className="bg-[#FFF8ED] border border-[#EAE0D3] p-2 rounded-lg text-[10px] text-[#5D4037] mb-2">
                🎉 <strong>Đặc quyền tự chủ xưởng rang:</strong> Giảm ngay <strong>35% chi phí nhập kho</strong> cho toàn bộ chi nhánh vỉa hè & quán hẻm!
              </div>

              <button
                onClick={handleSaveRoastery}
                className="w-full py-2 bg-[#5C9E54] hover:bg-[#4E8B46] text-white text-xs font-black uppercase rounded-xl border border-[#4A3222] shadow-[0_2px_0_#4A3222] active:translate-y-0.5 cursor-pointer"
              >
                Cung Ứng Toàn Chuỗi (-35% Vốn) 🚀
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: RECIPE LAB */}
        {activeTab === 'lab' && (
          <div className="space-y-2">
            <div className="bg-[#FAF0E1] border border-[#4A3222] rounded-xl p-2.5 shadow-2xs">
              <span className="text-xs font-black text-[#4A3222] block mb-1">
                Sáng Tạo Món Độc Quyền (Signature Recipe):
              </span>

              <div className="space-y-1.5 mb-2">
                <div>
                  <label className="text-[10px] font-bold text-[#8C6E54] block">
                    Tên món Hot Trend:
                  </label>
                  <input
                    type="text"
                    value={customDrinkName}
                    onChange={(e) => setCustomDrinkName(e.target.value)}
                    className="w-full bg-[#FFF8ED] border border-[#4A3222] rounded-lg p-1.5 text-xs font-black text-[#4A3222]"
                    placeholder="VD: Trà Mãng Cầu Giã Tay..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-1 text-[10px]">
                  <div>
                    <label className="font-bold text-[#8C6E54] block">Cốt nền:</label>
                    <select
                      value={baseIngredient}
                      onChange={(e) => setBaseIngredient(e.target.value)}
                      className="w-full bg-[#FFF8ED] border border-[#D8C7B5] rounded p-1 text-[10px]"
                    >
                      <option>Cốt Phin Đậm</option>
                      <option>Trà Lài Ủ Lạnh</option>
                      <option>Nước Dừa Xiêm</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-[#8C6E54] block">Topping:</label>
                    <select
                      value={toppingIngredient}
                      onChange={(e) => setToppingIngredient(e.target.value)}
                      className="w-full bg-[#FFF8ED] border border-[#D8C7B5] rounded p-1 text-[10px]"
                    >
                      <option>Kem Muối Béo</option>
                      <option>Thạch Phin Giòn</option>
                      <option>Trái Cây Tươi</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-[#8C6E54] block">Kỹ thuật:</label>
                    <select
                      value={technique}
                      onChange={(e) => setTechnique(e.target.value)}
                      className="w-full bg-[#FFF8ED] border border-[#D8C7B5] rounded p-1 text-[10px]"
                    >
                      <option>Lắc Shaker</option>
                      <option>Giã Tay 100%</option>
                      <option>Đánh Bọt Kem</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreateSignature}
                className="w-full py-2 bg-[#E08738] hover:bg-[#ED9445] text-white text-xs font-black uppercase rounded-xl border border-[#4A3222] shadow-[0_2px_0_#4A3222] active:translate-y-0.5 cursor-pointer"
              >
                Tung Ra Thị Trường (Hệ Số Giá ×1.6) ✨
              </button>
            </div>

            {/* List of Created Signatures */}
            {signatureRecipes.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-[#4A3222]">
                  Món Signature Đang Bán:
                </span>
                {signatureRecipes.map((r) => (
                  <div
                    key={r.id}
                    className="bg-[#FFF8ED] border border-[#D8C7B5] rounded-lg p-1.5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-black text-[#4A3222] block">{r.customName}</span>
                      <span className="text-[9px] text-[#8C6E54]">
                        {r.baseIngredient} + {r.toppingIngredient} ({r.technique})
                      </span>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded font-black">
                      Hot Trend 🔥
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TECH TREE */}
        {activeTab === 'tech' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between bg-[#FAF0E1] border border-[#D8C7B5] rounded-xl px-2.5 py-1 text-xs">
              <span className="font-bold text-[#4A3222]">Hạt Cà Phê Vàng sẵn có:</span>
              <span className="font-mono font-black text-amber-800 text-sm">
                🫘 {goldenBeans}
              </span>
            </div>

            {techNodes.map((node) => {
              const isUnlocked = techTree?.unlockedNodes?.includes(node.id);
              return (
                <div
                  key={node.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    isUnlocked
                      ? 'bg-emerald-50 border-emerald-300 opacity-90'
                      : 'bg-[#FAF0E1] border-[#D8C7B5]'
                  }`}
                >
                  <div className="flex items-center gap-2 max-w-[70%]">
                    <span className="text-2xl">{node.icon}</span>
                    <div>
                      <span className="font-black text-[#4A3222] block leading-tight">
                        {node.title}
                      </span>
                      <span className="text-[10px] text-[#8C6E54] block leading-tight">
                        {node.desc}
                      </span>
                    </div>
                  </div>

                  {isUnlocked ? (
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">
                      ✓ ĐÃ MỞ
                    </span>
                  ) : (
                    <button
                      onClick={() => handleUnlockTech(node.id)}
                      className="py-1 px-2.5 bg-[#5C9E54] hover:bg-[#4E8B46] text-white text-[11px] font-black rounded-lg border border-[#4A3222] shadow-2xs active:translate-y-0.5 cursor-pointer"
                    >
                      {node.cost} 🫘 Mở
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 4: GLOBAL CHAIN */}
        {activeTab === 'global' && (
          <div className="space-y-2">
            <div className="bg-[#FAF0E1] border border-[#4A3222] rounded-xl p-2 text-xs">
              <span className="font-serif font-black text-xs text-[#4A3222] block mb-0.5">
                Nhượng Quyền Toàn Cầu (Global Franchise)
              </span>
              <p className="text-[10px] text-[#8C6E54] leading-relaxed">
                Đưa văn hóa Cà phê Phin Việt Nam chinh phục các thủ phủ thời trang & tài chính thế giới!
              </p>
            </div>

            <div className="space-y-1.5">
              {globalCities.map((city) => (
                <div
                  key={city.id}
                  className="bg-[#FAF0E1] border border-[#D8C7B5] rounded-xl p-2.5 flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{city.flag}</span>
                    <div>
                      <span className="text-xs font-black text-[#4A3222] block leading-tight">
                        {city.name}
                      </span>
                      <span className="text-[10px] text-[#8C6E54] block leading-tight">
                        {city.desc}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-black text-emerald-800 block">
                      +{formatVND(city.dailyProfit)}/ngày
                    </span>
                    <span className="text-[9px] bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded font-bold">
                      Đang sinh lời
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
