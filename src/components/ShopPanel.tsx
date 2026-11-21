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
    <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 select-none font-pixel animate-in fade-in duration-150">
      {/* Click backdrop to dismiss */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => setActiveTab(null)}
      />

      {/* Modal Container */}
      <div className="relative z-10 bg-[#24140B] border-4 border-black shadow-[4px_4px_0px_#000] p-3.5 max-h-[82vh] flex flex-col max-w-[440px] w-full">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b-2 border-black mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏪</span>
            <div>
              <h2 className="text-[#FFD700] font-bold text-base tracking-wide uppercase leading-none">
                CHỢ PHỐ SÀI GÒN (SHOP)
              </h2>
              <p className="text-xs text-[#D4A373] mt-0.5 leading-none">
                Gói hỗ trợ khởi nghiệp & quà tặng miễn phí mỗi ngày
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab(null)}
            className="w-7 h-7 flex items-center justify-center bg-[#DC2626] hover:bg-[#EF4444] text-white text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer transition-transform"
            title="Đóng bảng"
          >
            ✕
          </button>
        </div>

        {/* Ad Player Simulation */}
        {watchingAdSku ? (
          <div className="my-6 p-4 bg-[#1A0E05] border-2 border-black text-center">
            <span className="text-3xl block mb-2">📺</span>
            <p className="text-sm text-amber-200 font-bold mb-1">
              Đang xem thước phim phóng sự Sài Gòn xưa...
            </p>
            <span className="text-2xl font-black text-[#FFD700] block">{adCountdown}s</span>
          </div>
        ) : (
          /* SKU List */
          <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1 pb-2">
            {skus.map((sku) => {
              const isIap = sku.type === 'iap';
              const isPurchased = purchasedSkus.includes(sku.sku);

              return (
                <div
                  key={sku.sku}
                  className="bg-[#2D180C] border-2 border-black shadow-[2px_2px_0px_#000] p-2.5 flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{isIap ? '🎁' : '🎬'}</span>
                      <h4 className="text-[#FFF8E7] font-bold text-xs uppercase leading-none">
                        {sku.title}
                      </h4>
                    </div>
                    <p className="text-[#D4A373] text-xs mt-1 leading-tight">
                      {sku.reward}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {isIap ? (
                      <button
                        onClick={() => handleBuyIap(sku)}
                        disabled={isPurchased}
                        className={`px-3 py-1.5 text-xs font-bold border-2 uppercase transition-transform cursor-pointer ${
                          isPurchased
                            ? 'bg-stone-800 text-stone-500 border-stone-900 cursor-default'
                            : 'bg-[#16A34A] hover:bg-[#22C55E] text-white border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5'
                        }`}
                      >
                        {isPurchased ? 'ĐÃ MUA' : formatVND(sku.priceVnd)}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleClaimAdReward(sku)}
                        className="px-3 py-1.5 bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1A0E05] font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-transform flex items-center gap-1"
                      >
                        <span>▶</span> MIỄN PHÍ
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-2 pt-2 border-t border-black/40 text-center">
          <p className="text-[11px] text-amber-300/80">
            Mẹo: Xem clip ủng hộ giúp bạn nhận tiền và gọi sóng khách VIP tăng tốc độ bán!
          </p>
        </div>
      </div>
    </div>
  );
};
