import React, { useState, useEffect, useRef } from 'react';
import { useGameStore, formatVND } from '../store/useGameStore';
import { EventBus } from '../game/EventBus';
import { SoundManager } from '../game/audio/SoundManager';

export const CoffeeBrewingModal: React.FC = () => {
  const activeBrewing = useGameStore((s) => s.activeBrewing);
  const finishManualBrewing = useGameStore((s) => s.finishManualBrewing);
  const cancelBrewing = useGameStore((s) => s.cancelBrewing);
  const recordDrinkSale = useGameStore((s) => s.recordDrinkSale);
  const addGold = useGameStore((s) => s.addGold);
  const addReputation = useGameStore((s) => s.addReputation);

  // Steps: 0: Rót nước sôi phin, 1: Rót sữa đặc Ông Thọ, 2: Xúc đá bi, 3: Khuấy bọt, 4: Hoàn tất
  const [step, setStep] = useState<number>(0);
  const [waterGauge, setWaterGauge] = useState<number>(0);
  const [isPouringWater, setIsPouringWater] = useState<boolean>(false);
  const [milkPoured, setMilkPoured] = useState<number>(0);
  const [iceCubes, setIceCubes] = useState<number>(0);
  const [stirCount, setStirCount] = useState<number>(0);
  const [rating, setRating] = useState<'PERFECT' | 'GOOD'>('GOOD');

  const pourIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset state on open
    setStep(0);
    setWaterGauge(0);
    setIsPouringWater(false);
    setMilkPoured(0);
    setIceCubes(0);
    setStirCount(0);
    setRating('GOOD');
  }, [activeBrewing]);

  if (!activeBrewing) return null;

  const needsMilk = activeBrewing.recipeId === 'cf_sua_da' || activeBrewing.recipeId === 'bac_xiu';
  const isBacXiu = activeBrewing.recipeId === 'bac_xiu';
  const targetMilk = isBacXiu ? 3 : 2;

  // Step 1: Hold to pour boiling water
  const handleStartPourWater = () => {
    setIsPouringWater(true);
    SoundManager.playBoilingWater();
    pourIntervalRef.current = window.setInterval(() => {
      setWaterGauge((prev) => {
        if (prev >= 100) {
          clearInterval(pourIntervalRef.current!);
          return 100;
        }
        return prev + 2.5;
      });
    }, 45);
  };

  const handleStopPourWater = () => {
    setIsPouringWater(false);
    SoundManager.playCoffeeDrip();
    if (pourIntervalRef.current) {
      clearInterval(pourIntervalRef.current);
      pourIntervalRef.current = null;
    }

    // Check if water in optimal extraction zone (65% - 95%)
    if (waterGauge >= 65 && waterGauge <= 95) {
      setRating('PERFECT');
    }

    // Advance to next step
    setTimeout(() => {
      setStep(needsMilk ? 1 : 2);
    }, 450);
  };

  // Step 2: Pour condensed milk
  const handleAddMilk = () => {
    const next = milkPoured + 1;
    setMilkPoured(next);
    SoundManager.playCoffeeDrip();
    if (next >= targetMilk) {
      setTimeout(() => setStep(2), 350);
    }
  };

  // Step 3: Add ice cubes
  const handleAddIce = () => {
    const next = iceCubes + 1;
    setIceCubes(next);
    SoundManager.playIceClink();
    if (next >= 3) {
      setTimeout(() => setStep(3), 350);
    }
  };

  // Step 4: Stir foam
  const handleStir = () => {
    const next = stirCount + 1;
    setStirCount(next);
    SoundManager.playSpoonStir();
    if (next >= 5) {
      setStep(4);
    }
  };

  // Finish manual brew
  const handleDeliverDrink = (isFast = false) => {
    const isPerfect = !isFast && rating === 'PERFECT';
    const basePrice = activeBrewing.price;
    const bonusTip = isPerfect ? Math.round(basePrice * 0.5) : Math.round(basePrice * 0.15);
    const totalEarned = basePrice + bonusTip;
    const repEarned = isPerfect ? 4 : 2;

    addGold(totalEarned);
    addReputation(repEarned);
    recordDrinkSale(basePrice, bonusTip, repEarned);
    SoundManager.playCoinTing();

    // Notify Phaser CafeScene to serve customer
    EventBus.emit('manual-brew-completed', {
      seatIndex: activeBrewing.customerSeatIndex,
      recipeId: activeBrewing.recipeId,
      isPerfect,
      totalEarned,
    });

    finishManualBrewing();
  };

  // Visual layer calculations
  const milkHeightPx = needsMilk ? Math.min(32, (milkPoured / targetMilk) * 32) : 0;
  const coffeeHeightPx = Math.min(46, (waterGauge / 100) * 46);
  const foamHeightPx = Math.min(16, (stirCount / 5) * 16);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-3 animate-in fade-in duration-200 select-none font-pixel">
      <div className="relative w-full max-w-[400px] pixel-box-wood text-[#FFE8C2] p-4 flex flex-col items-center">
        {/* Top Header */}
        <div className="w-full flex items-center justify-between border-b-2 border-black/40 pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-2xl drop-shadow-[2px_2px_0px_#000]">☕</span>
            <div>
              <h3 className="font-black text-sm text-[#FFD700] uppercase tracking-wide drop-shadow-[1px_1px_0px_#000]">
                Trạm Pha Chế ASMR Sài Gòn
              </h3>
              <p className="text-xs text-[#FFE8C2]/80 font-bold">
                Khách đợi: <strong className="text-[#FF8A8A]">{activeBrewing.customerName}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => cancelBrewing()}
            className="pixel-btn pixel-btn-red w-7 h-7 flex items-center justify-center text-xs"
            title="Hủy pha chế"
          >
            ✕
          </button>
        </div>

        {/* Current Drink Badge */}
        <div className="w-full pixel-box bg-[#1A0E05] px-3 py-1.5 flex items-center justify-between mb-2.5">
          <span className="text-sm font-black text-[#FFE8C2]">{activeBrewing.recipeName}</span>
          <span className="text-sm font-black text-[#FFD700]">{formatVND(activeBrewing.price)}</span>
        </div>

        {/* Step Progression Pills */}
        <div className="w-full grid grid-cols-4 gap-1.5 mb-2.5 text-xs font-black text-center">
          <div className={`py-1 border-2 border-black shadow-[2px_2px_0px_#000] ${step >= 0 ? 'bg-[#5C9E54] text-white' : 'bg-[#3A2213] text-[#FFE8C2]/50'}`}>
            1. Nước sôi
          </div>
          <div className={`py-1 border-2 border-black shadow-[2px_2px_0px_#000] ${needsMilk ? (step >= 1 ? 'bg-[#5C9E54] text-white' : 'bg-[#3A2213] text-[#FFE8C2]/50') : 'opacity-30 bg-[#25150C] text-stone-500'}`}>
            2. Sữa đặc
          </div>
          <div className={`py-1 border-2 border-black shadow-[2px_2px_0px_#000] ${step >= 2 ? 'bg-[#5C9E54] text-white' : 'bg-[#3A2213] text-[#FFE8C2]/50'}`}>
            3. Đá bi
          </div>
          <div className={`py-1 border-2 border-black shadow-[2px_2px_0px_#000] ${step >= 3 ? 'bg-[#5C9E54] text-white' : 'bg-[#3A2213] text-[#FFE8C2]/50'}`}>
            4. Khuấy
          </div>
        </div>

        {/* Interactive Workspace Container with Visual Liquid Layers */}
        <div className="w-full h-56 pixel-box bg-[#28150A] relative flex flex-row items-center justify-between p-3 overflow-hidden mb-3 gap-3">
          
          {/* LEFT: Vietnamese Fluted Glass Container (Ly Thủy Tinh Khía Sọc) */}
          <div className="flex flex-col items-center justify-center shrink-0 w-28 h-full relative">
            {/* Aluminum Drip Phin on top of glass */}
            <div className="relative z-10 flex flex-col items-center mb-1">
              <div className="w-16 h-3 bg-stone-300 border-2 border-black" />
              <div className="w-12 h-6 bg-stone-400 border-x-2 border-b-2 border-black flex items-center justify-center">
                <span className="text-[9px] font-black text-stone-900 tracking-tighter">PHIN NHÔM</span>
              </div>
              {/* Coffee Drip Steam Animation */}
              {isPouringWater && (
                <div className="absolute -top-4 text-xs animate-bounce">♨️</div>
              )}
            </div>

            {/* Glass Cup Body with Ribbed Fluting */}
            <div className="w-20 h-32 border-2 border-black bg-white/10 backdrop-blur-xs relative overflow-hidden flex flex-col justify-end shadow-inner">
              {/* Glass vertical flutes lines */}
              <div className="absolute inset-0 pointer-events-none flex justify-around opacity-30">
                <div className="w-[1px] h-full bg-white" />
                <div className="w-[1px] h-full bg-white" />
                <div className="w-[1px] h-full bg-white" />
                <div className="w-[1px] h-full bg-white" />
              </div>

              {/* Liquid Layer 4: Bọt sữa Cream Micro-foam (Top Layer) */}
              {foamHeightPx > 0 && (
                <div
                  className="w-full bg-[#D4A373] border-b-2 border-black/40 transition-all duration-200 relative overflow-hidden"
                  style={{ height: `${foamHeightPx}px` }}
                >
                  <div className="absolute inset-0 flex justify-around items-center opacity-40">
                    <span className="text-[7px]">🫧</span>
                    <span className="text-[7px]">🫧</span>
                  </div>
                </div>
              )}

              {/* Liquid Layer 3: Floating Ice Cubes */}
              {iceCubes > 0 && (
                <div className="absolute top-8 left-1 right-1 flex justify-center gap-1 z-10 pointer-events-none">
                  {Array.from({ length: iceCubes }).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-4 h-4 bg-sky-200 border-2 border-black shadow-sm animate-bounce"
                      style={{ animationDelay: `${idx * 150}ms` }}
                    />
                  ))}
                </div>
              )}

              {/* Liquid Layer 2: Rich Robusta Coffee Layer */}
              {coffeeHeightPx > 0 && (
                <div
                  className="w-full bg-[#3B1E08] transition-all duration-150 relative border-t border-black/30"
                  style={{ height: `${coffeeHeightPx}px` }}
                >
                  {isPouringWater && (
                    <div className="w-full h-1 bg-amber-400/70 animate-pulse" />
                  )}
                </div>
              )}

              {/* Liquid Layer 1: Condensed Milk Layer (Bottom) */}
              {milkHeightPx > 0 && (
                <div
                  className="w-full bg-[#FFFDF5] border-t-2 border-black/40 transition-all duration-200"
                  style={{ height: `${milkHeightPx}px` }}
                />
              )}
            </div>
            <div className="w-16 h-2 bg-stone-900 border-2 border-black mt-0.5" />
          </div>

          {/* RIGHT: Step Interaction & Vintage Extraction Gauge */}
          <div className="flex-1 h-full flex flex-col items-center justify-center">

            {/* STEP 0: NƯỚC SÔI PHIN & VINTAGE GAUGE */}
            {step === 0 && (
              <div className="w-full flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-3xl transition-transform ${isPouringWater ? '-rotate-20 scale-110' : ''}`}>
                    🫖
                  </span>
                  <div className="text-left">
                    <span className="text-xs font-black uppercase text-[#FFD700] block leading-tight">
                      Châm Nước Sôi Phin
                    </span>
                    <span className="text-[10px] font-bold text-[#A3E635]">
                      Chuẩn Vị: 65% – 95%
                    </span>
                  </div>
                </div>

                {/* Pixel Gauge Meter */}
                <div className="w-full pixel-box bg-[#150A05] p-2 mb-2">
                  <div className="flex justify-between text-[10px] font-black text-[#D4A373] mb-1">
                    <span>0%</span>
                    <span className="text-[#A3E635]">★ 65%</span>
                    <span className="text-[#A3E635]">95% ★</span>
                    <span>100%</span>
                  </div>
                  {/* Gauge Bar Track */}
                  <div className="w-full h-4 bg-black border-2 border-black relative overflow-hidden">
                    {/* Glowing Perfect Zone */}
                    <div className="absolute left-[65%] w-[30%] h-full bg-[#2EB8AC]/40 border-x-2 border-[#2EB8AC]" />
                    {/* Needle Fill Bar */}
                    <div
                      className={`h-full transition-all duration-75 ${
                        waterGauge >= 65 && waterGauge <= 95
                          ? 'bg-[#5C9E54]'
                          : 'bg-[#E06D28]'
                      }`}
                      style={{ width: `${waterGauge}%` }}
                    />
                  </div>
                  <div className="text-xs font-black text-center mt-1 text-[#FFE8C2]">
                    {waterGauge >= 65 && waterGauge <= 95 ? (
                      <span className="text-[#A3E635] animate-pulse">🌟 CHUẨN VỊ SÀI GÒN! (PERFECT)</span>
                    ) : waterGauge > 95 ? (
                      <span className="text-[#FF6B6B]">⚠️ Nước sôi hơi nhiều!</span>
                    ) : (
                      <span>Mức nước sôi: {Math.round(waterGauge)}%</span>
                    )}
                  </div>
                </div>

                {/* Tactile Hold Button */}
                <button
                  onMouseDown={handleStartPourWater}
                  onMouseUp={handleStopPourWater}
                  onTouchStart={handleStartPourWater}
                  onTouchEnd={handleStopPourWater}
                  className="w-full pixel-btn pixel-btn-wood py-2 text-xs uppercase text-[#FFD700]"
                >
                  {isPouringWater ? 'ĐANG CHÂM NƯỚC SÔI...' : 'GIỮ ĐỂ CHÂM NƯỚC SÔI 🫖'}
                </button>
              </div>
            )}

            {/* STEP 1: SỮA ĐẶC ÔNG THỌ */}
            {step === 1 && needsMilk && (
              <div className="w-full flex flex-col items-center text-center">
                <span className="text-3xl animate-bounce mb-1">🥛</span>
                <p className="text-sm font-black text-[#FFE8C2] mb-0.5">
                  Sữa Đặc Ông Thọ
                </p>
                <p className="text-xs text-[#FFE8C2]/80 mb-2">
                  Đã rót: <strong className="text-[#FFD700] text-sm">{milkPoured} / {targetMilk} muỗng</strong>
                </p>
                <button
                  onClick={handleAddMilk}
                  className="w-full pixel-btn pixel-btn-gold py-2 text-xs uppercase"
                >
                  🥄 MÚC SỮA ĐẶC VÀO LY
                </button>
              </div>
            )}

            {/* STEP 2: XÚC ĐÁ BI */}
            {step === 2 && (
              <div className="w-full flex flex-col items-center text-center">
                <span className="text-3xl mb-1 animate-pulse">🧊</span>
                <p className="text-sm font-black text-[#FFE8C2] mb-0.5">
                  Đá Bi Mát Lạnh
                </p>
                <p className="text-xs text-[#FFE8C2]/80 mb-2">
                  Đã xúc: <strong className="text-[#4CE0D2] text-sm">{iceCubes} / 3 xẻng đá</strong>
                </p>
                <button
                  onClick={handleAddIce}
                  className="w-full pixel-btn pixel-btn-teal py-2 text-xs uppercase"
                >
                  🧊 XÚC ĐÁ BI VÀO LY
                </button>
              </div>
            )}

            {/* STEP 3: KHUẤY BỌT CÀ PHÊ */}
            {step === 3 && (
              <div className="w-full flex flex-col items-center text-center">
                <span className="text-3xl mb-1 animate-spin">🌀</span>
                <p className="text-sm font-black text-[#FFE8C2] mb-0.5">
                  Khuấy Bọt Bồng Bềnh
                </p>
                <p className="text-xs text-[#FFE8C2]/80 mb-2">
                  Vòng khuấy: <strong className="text-[#FFD700] text-sm">{stirCount} / 5 vòng</strong>
                </p>
                <button
                  onClick={handleStir}
                  className="w-full pixel-btn pixel-btn-wood py-2 text-xs uppercase text-[#FFD700]"
                >
                  🌀 KHUẤY ĐỀU CÀ PHÊ
                </button>
              </div>
            )}

            {/* STEP 4: HOÀN TẤT & CELEBRATION */}
            {step === 4 && (
              <div className="w-full flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
                <span className="text-3xl mb-1">🎉🥤✨</span>
                <h4 className="text-sm font-black text-[#FFD700] tracking-wide">
                  {rating === 'PERFECT' ? '🌟 CHUẨN VỊ SÀI GÒN! 🌟' : '👍 PHA XONG THƠM LỪNG!'}
                </h4>
                <div className="pixel-box bg-[#150A05] p-2 my-2 text-xs text-[#FFE8C2] w-full">
                  {rating === 'PERFECT' ? (
                    <span className="text-[#A3E635]">
                      ★ Nước sôi hoàn hảo! +50% Tip và +4⭐ sống ảo!
                    </span>
                  ) : (
                    <span>
                      Hương vị đậm đà thơm ngát, khách rất thích!
                    </span>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex items-center gap-2">
          {step === 4 ? (
            <button
              onClick={() => handleDeliverDrink(false)}
              className="w-full pixel-btn pixel-btn-green py-2.5 text-xs uppercase tracking-wide flex items-center justify-center gap-2"
            >
              <span>🚚</span> TRAO LY CHO KHÁCH & NHẬN TIỀN
            </button>
          ) : (
            <button
              onClick={() => handleDeliverDrink(true)}
              className="w-full pixel-btn pixel-btn-wood py-2 text-xs uppercase text-[#FFE8C2]/90 flex items-center justify-center gap-1.5"
            >
              <span>⚡</span> Pha Nhanh Tự Động (Bỏ qua thao tác)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
