import React, { useState } from 'react';
import { getShopSkus } from '../data/gameData';
import { useGameStore, formatVND } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';
import { EventBus } from '../game/EventBus';

export const ShopPanel: React.FC = () => {
  const activeTab = useGameStore((s) => s.activeTab);
  const setActiveTab = useGameStore((s) => s.setActiveTab);
  const addGold = useGameStore((s) => s.addGold);
  const addGoldenBeans = useGameStore((s) => s.addGoldenBeans);
  const addReputation = useGameStore((s) => s.addReputation);

  const [watchingAdSku, setWatchingAdSku] = useState<string | null>(null);
  const [adCountdown, setAdCountdown] = useState<number>(3);
  const [purchasedSkus, setPurchasedSkus] = useState<string[]>([]);

  if (activeTab !== 'shop') return null;

  const skus = getShopSkus();

  const handleClaimAdReward = (sku: (typeof skus)[0]) => {
    setWatchingAdSku(sku.sku);
    setAdCountdown(3);

    const timer = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setWatchingAdSku(null);
          SoundManager.playCoinTing();

          if (sku.sku === 'reward_vip_wave') {
            addReputation(10);
            EventBus.emit('customer-speak', {
              name: 'Đoàn Khách VIP',
              dialogue: 'Quán cóc này nổi tiếng quá! Cho tụi mình 5 ly đen đá nhé!',
            });
          } else if (sku.sku === 'reward_offline_x2') {
            addGold(100000);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleBuyIap = (sku: (typeof skus)[0]) => {
    SoundManager.playCoinTing();
    addGold(200000);
    addGoldenBeans(50);
    addReputation(20);
    setPurchasedSkus((prev) => [...prev, sku.sku]);
    EventBus.emit('customer-speak', {
      name: 'Hệ Thống',
      dialogue: 'Chúc mừng bạn đã nhận Gói Khởi Nghiệp! +200k Xu, +50 Hạt Vàng 🫘!',
    });
  };

  return (
    <div className="absolute inset-0 z-50 cozy-modal-backdrop flex items-center justify-center p-3 select-none font-sans animate-in zoom-in-95 duration-150">
      {/* Click backdrop to dismiss */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => setActiveTab(null)}
      />

      {/* Modal Container (matching Mockup 7) */}
      <div className="relative z-10 w-full max-w-[420px] cozy-card p-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-2.5 border-b-2 border-[#D8C7B5] mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-2xl bg-[#FAF0E1] border border-[#D8C7B5] flex items-center justify-center text-lg">
              🧺
            </span>
            <div>
              <h2 className="text-[#3E2415] font-serif font-black text-base tracking-wide leading-none">
                Cửa hàng
              </h2>
              <p className="text-[11px] text-[#8C6E54] font-semibold mt-0.5 leading-none">
                Gói khởi nghiệp, nạp hạt cà phê & quà xem video
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab(null)}
            className="w-8 h-8 rounded-full bg-[#FAF0E1] hover:bg-[#EADDC9] text-[#5D4037] text-sm font-black border border-[#DECBB9] flex items-center justify-center cursor-pointer transition-colors"
            title="Đóng bảng"
          >
            ✕
          </button>
        </div>

        {/* Ad Player Simulation */}
        {watchingAdSku ? (
          <div className="my-6 p-4 bg-[#FAF0E1] border-2 border-[#D8C7B5] rounded-2xl text-center">
            <span className="text-3xl block mb-2">📺</span>
            <p className="text-xs text-[#6D4C41] font-bold mb-1">
              Đang xem thước phim phóng sự Sài Gòn xưa...
            </p>
            <span className="text-2xl font-black text-[#E08738] block">{adCountdown}s</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-1">
            {/* Section 1: Gói Ưu Đãi (matching Mockup 7) */}
            <div>
              <h3 className="text-xs font-bold text-[#8C6E54] uppercase tracking-wider mb-1.5 px-1">
                Gói Ưu Đãi
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="cozy-card-inner p-2.5 flex flex-col items-center justify-between text-center gap-1.5">
                  <span className="text-3xl">☕🪙</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#3E2415]">Gói Khởi Nghiệp</h4>
                    <p className="text-[10px] text-[#8C6E54]">+200k Xu & +50 Đậu</p>
                  </div>
                  <button
                    onClick={() => handleBuyIap(skus[0])}
                    className="w-full py-1.5 cozy-btn-orange text-xs"
                  >
                    22.000 đ
                  </button>
                </div>

                <div className="cozy-card-inner p-2.5 flex flex-col items-center justify-between text-center gap-1.5">
                  <span className="text-3xl">🎟️✨</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#3E2415]">Vé Bỏ Quảng Cáo</h4>
                    <p className="text-[10px] text-[#8C6E54]">Trải nghiệm mượt mà</p>
                  </div>
                  <button
                    onClick={() => handleBuyIap(skus[0])}
                    className="w-full py-1.5 cozy-btn-gold text-xs"
                  >
                    99.000 đ
                  </button>
                </div>
              </div>
            </div>

            {/* Section 2: Nạp Hạt Cà Phê (matching Mockup 7) */}
            <div>
              <h3 className="text-xs font-bold text-[#8C6E54] uppercase tracking-wider mb-1.5 px-1">
                Nạp Hạt Cà Phê
              </h3>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { amount: '60 Hạt', price: '22.000 đ', icon: '🫘' },
                  { amount: '300 Hạt', price: '109.000 đ', icon: '🫘🫘' },
                  { amount: '680 Hạt', price: '219.000 đ', icon: '🫘✨' },
                ].map((pack, i) => (
                  <div
                    key={i}
                    className="cozy-card-inner p-2 flex flex-col items-center justify-between text-center gap-1"
                  >
                    <span className="text-xl">{pack.icon}</span>
                    <span className="text-[11px] font-bold text-[#3E2415]">{pack.amount}</span>
                    <button
                      onClick={() => {
                        SoundManager.playCoinTing();
                        addGoldenBeans(i === 0 ? 60 : i === 1 ? 300 : 680);
                      }}
                      className="w-full py-1 cozy-btn-gold text-[10px]"
                    >
                      {pack.price}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Quảng Cáo Miễn Phí (matching Mockup 7) */}
            <div>
              <h3 className="text-xs font-bold text-[#8C6E54] uppercase tracking-wider mb-1.5 px-1">
                Quảng Cáo Miễn Phí
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="cozy-card-inner p-2.5 flex flex-col items-center justify-between text-center gap-1.5">
                  <span className="text-2xl">🫘</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#3E2415]">Nhận Hạt Miễn Phí</h4>
                    <p className="text-[10px] text-[#8C6E54]">Xem video +5 Hạt</p>
                  </div>
                  <button
                    onClick={() => handleClaimAdReward(skus[1] || skus[0])}
                    className="w-full py-1.5 cozy-btn-green text-xs flex items-center justify-center gap-1"
                  >
                    <span>▶</span> Xem Video
                  </button>
                </div>

                <div className="cozy-card-inner p-2.5 flex flex-col items-center justify-between text-center gap-1.5">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#3E2415]">Tốc Độ Bán Hàng</h4>
                    <p className="text-[10px] text-[#8C6E54]">Gấp đôi khách trong 60s</p>
                  </div>
                  <button
                    onClick={() => handleClaimAdReward(skus[0])}
                    className="w-full py-1.5 cozy-btn-green text-xs flex items-center justify-center gap-1"
                  >
                    <span>▶</span> Xem Video
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-2 pt-2 border-t border-[#D8C7B5] text-center">
          <p className="text-[11px] text-[#8C6E54] font-semibold">
            Mẹo: Xem clip ủng hộ giúp bạn nhận tiền và gọi sóng khách VIP tăng tốc độ bán!
          </p>
        </div>
      </div>
    </div>
  );
};
