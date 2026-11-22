import React, { useState } from 'react';
import { getShopSkus } from '../data/gameData';
import { useGameStore, formatVND } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';
import { EventBus } from '../game/EventBus';
import { X, ShoppingBasket, Video } from 'lucide-react';

export const ShopPanel: React.FC = () => {
  const activeTab = useGameStore((s) => s.activeTab);
  const setActiveTab = useGameStore((s) => s.setActiveTab);
  const addGold = useGameStore((s) => s.addGold);
  const addGoldenBeans = useGameStore((s) => s.addGoldenBeans);
  const addReputation = useGameStore((s) => s.addReputation);

  const [watchingAdSku, setWatchingAdSku] = useState<string | null>(null);
  const [adCountdown, setAdCountdown] = useState<number>(3);

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
    EventBus.emit('customer-speak', {
      name: 'Hệ Thống',
      dialogue: 'Chúc mừng bạn đã nhận Gói Khởi Nghiệp! +200k Xu, +50 Hạt Vàng 🫘!',
    });
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#170C06]/80 backdrop-blur-xs flex items-center justify-center p-3 select-none font-sans animate-in zoom-in-95 duration-150">
      {/* Click backdrop to dismiss */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => setActiveTab(null)}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-[420px] game-panel p-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-2.5 border-b-2 border-[#4A3222]/20 mb-2.5">
          <div className="game-ribbon px-3 py-1 flex items-center gap-2">
            <ShoppingBasket className="w-4 h-4 text-[#E04F4F]" />
            <div>
              <h2 className="text-[#4A3222] font-mali font-bold text-sm md:text-base tracking-wide leading-none">
                Cửa hàng tạp hóa
              </h2>
              <p className="text-[10px] text-[#7A543A] font-nunito mt-0.5 font-bold leading-none">
                Gói khởi nghiệp, nạp hạt cà phê & quà xem video
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab(null)}
            className="w-8 h-8 rounded-full game-btn game-btn-red flex items-center justify-center cursor-pointer transition-transform"
            title="Đóng bảng"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Ad Player Simulation */}
        {watchingAdSku ? (
          <div className="my-6 p-4 bg-[#FAF0E1] border-2 border-[#4A3222] shadow-[0_3px_0_#4A3222] rounded-2xl text-center">
            <span className="text-3xl block mb-2">📺</span>
            <p className="text-xs text-[#7A543A] font-mali font-bold mb-1">
              Đang xem thước phim phóng sự Sài Gòn xưa...
            </p>
            <span className="text-2xl font-nunito font-extrabold text-[#F4A236] block">
              {adCountdown}s
            </span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-1">
            {/* Section 1: Gói Ưu Đãi */}
            <div>
              <h3 className="text-xs font-mali font-bold text-[#7A543A] uppercase tracking-wider mb-1.5 px-1">
                Gói Ưu Đãi
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="game-card p-2.5 flex flex-col items-center justify-between text-center gap-1.5">
                  <span className="text-3xl">☕🪙</span>
                  <div>
                    <h4 className="text-xs font-mali font-bold text-[#4A3222]">
                      Gói Khởi Nghiệp
                    </h4>
                    <p className="text-[10px] font-nunito font-bold text-[#7A543A]">
                      +200k Xu & +50 Đậu
                    </p>
                  </div>
                  <button
                    onClick={() => handleBuyIap(skus[0])}
                    className="w-full py-1.5 game-btn game-btn-gold text-xs font-nunito font-extrabold"
                  >
                    22.000 đ
                  </button>
                </div>

                <div className="game-card p-2.5 flex flex-col items-center justify-between text-center gap-1.5">
                  <span className="text-3xl">🎟️✨</span>
                  <div>
                    <h4 className="text-xs font-mali font-bold text-[#4A3222]">
                      Vé Bỏ Quảng Cáo
                    </h4>
                    <p className="text-[10px] font-nunito font-bold text-[#7A543A]">
                      Trải nghiệm mượt mà
                    </p>
                  </div>
                  <button
                    onClick={() => handleBuyIap(skus[0])}
                    className="w-full py-1.5 game-btn game-btn-cream text-xs font-nunito font-extrabold"
                  >
                    99.000 đ
                  </button>
                </div>
              </div>
            </div>

            {/* Section 2: Nạp Hạt Cà Phê */}
            <div>
              <h3 className="text-xs font-mali font-bold text-[#7A543A] uppercase tracking-wider mb-1.5 px-1">
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
                    className="game-card p-2 flex flex-col items-center justify-between text-center gap-1"
                  >
                    <span className="text-xl">{pack.icon}</span>
                    <span className="text-[11px] font-nunito font-extrabold text-[#4A3222]">
                      {pack.amount}
                    </span>
                    <button
                      onClick={() => {
                        SoundManager.playCoinTing();
                        addGoldenBeans(i === 0 ? 60 : i === 1 ? 300 : 680);
                      }}
                      className="w-full py-1 game-btn game-btn-gold text-[10px] font-nunito font-extrabold"
                    >
                      {pack.price}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Quà Xem Video */}
            <div>
              <h3 className="text-xs font-mali font-bold text-[#7A543A] uppercase tracking-wider mb-1.5 px-1">
                Quà Xem Video
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="game-card p-2.5 flex flex-col items-center justify-between text-center gap-1.5">
                  <span className="text-2xl">🫘</span>
                  <div>
                    <h4 className="text-xs font-mali font-bold text-[#4A3222]">
                      Nhận Hạt Miễn Phí
                    </h4>
                    <p className="text-[10px] font-nunito font-bold text-[#7A543A]">
                      Xem video +5 Hạt
                    </p>
                  </div>
                  <button
                    onClick={() => handleClaimAdReward(skus[1] || skus[0])}
                    className="w-full py-1.5 game-btn game-btn-green text-xs flex items-center justify-center gap-1"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Xem Video</span>
                  </button>
                </div>

                <div className="game-card p-2.5 flex flex-col items-center justify-between text-center gap-1.5">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <h4 className="text-xs font-mali font-bold text-[#4A3222]">
                      Tốc Độ Bán Hàng
                    </h4>
                    <p className="text-[10px] font-nunito font-bold text-[#7A543A]">
                      Gấp đôi khách trong 60s
                    </p>
                  </div>
                  <button
                    onClick={() => handleClaimAdReward(skus[0])}
                    className="w-full py-1.5 game-btn game-btn-green text-xs flex items-center justify-center gap-1"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Xem Video</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-2 pt-2 border-t border-[#4A3222]/20 text-center">
          <p className="text-[11px] font-mali text-[#7A543A] font-bold">
            Mẹo: Xem clip ủng hộ giúp bạn nhận tiền và gọi sóng khách VIP tăng tốc độ bán!
          </p>
        </div>
      </div>
    </div>
  );
};
