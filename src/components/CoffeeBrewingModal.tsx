import React, { useState, useEffect, useRef } from 'react';
import { useGameStore, formatVND } from '../store/useGameStore';
import type { OrderModifier } from '../types/game';
import { EventBus } from '../game/EventBus';
import { SoundManager } from '../game/audio/SoundManager';

export const CoffeeBrewingModal: React.FC = () => {
  const activeBrewing = useGameStore((s) => s.activeBrewing);
  const finishManualBrewing = useGameStore((s) => s.finishManualBrewing);
  const cancelBrewing = useGameStore((s) => s.cancelBrewing);
  const recordDrinkSale = useGameStore((s) => s.recordDrinkSale);
  const addGold = useGameStore((s) => s.addGold);
  const addReputation = useGameStore((s) => s.addReputation);
  const addGoldenBeans = useGameStore((s) => s.addGoldenBeans);

  const modifier: OrderModifier = activeBrewing?.orderModifier || 'normal';

  // Steps: 0: Rót nước sôi, 1: Sữa đặc / đường, 2: Xúc đá bi, 3: Đánh bọt / Lắc, 4: Hoàn tất & Giao
  const [step, setStep] = useState<number>(0);
  const [waterGauge, setWaterGauge] = useState<number>(0);
  const [isPouringWater, setIsPouringWater] = useState<boolean>(false);
  const [milkPoured, setMilkPoured] = useState<number>(0);
  const [iceCubes, setIceCubes] = useState<number>(0);
  const [stirCount, setStirCount] = useState<number>(0);
  const [cupType, setCupType] = useState<'GLASS' | 'PLASTIC'>(
    modifier === 'take_away' ? 'PLASTIC' : 'GLASS'
  );
  const [isChuanGuCelebration, setIsChuanGuCelebration] = useState<boolean>(false);

  const pourIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    setStep(0);
    setWaterGauge(0);
    setIsPouringWater(false);
    setMilkPoured(0);
    setIceCubes(0);
    setStirCount(0);
    setCupType(modifier === 'take_away' ? 'PLASTIC' : 'GLASS');
    setIsChuanGuCelebration(false);
  }, [activeBrewing, modifier]);

  if (!activeBrewing) return null;

  const isNoSugar = modifier === 'no_sugar';
  const isMoreMilk = modifier === 'more_milk';
  const isLessIce = modifier === 'less_ice';
  const isTakeAway = modifier === 'take_away';
  const needsMilk = activeBrewing.recipeId === 'cf_sua_da' || activeBrewing.recipeId === 'bac_xiu' || activeBrewing.recipeId === 'cf_muoi';

  // Target milk counts based on modifier
  const targetMilk = isNoSugar ? 0 : isMoreMilk ? 2 : 1;
  // Target ice counts based on modifier: less_ice requires 1, standard requires 3
  const targetIce = isLessIce ? 1 : 3;

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

    setTimeout(() => {
      // If customer requested no_sugar or drink has no milk, skip directly to ice
      if (!needsMilk || isNoSugar) {
        setStep(2);
      } else {
        setStep(1);
      }
    }, 400);
  };

  // Step 2: Condensed Milk
  const handleAddMilk = () => {
    const next = milkPoured + 1;
    setMilkPoured(next);
    SoundManager.playCoffeeDrip();
    if (next >= targetMilk) {
      setTimeout(() => setStep(2), 350);
    }
  };

  const handleSkipMilk = () => {
    SoundManager.playCoffeeDrip();
    setStep(2);
  };

  // Step 3: Add Ice
  const handleAddIce = () => {
    const next = iceCubes + 1;
    setIceCubes(next);
    SoundManager.playIceClink();
    if (next >= targetIce) {
      setTimeout(() => setStep(3), 350);
    }
  };

  // Step 4: Stir or Shake
  const handleStir = () => {
    const next = stirCount + 1;
    setStirCount(next);
    SoundManager.playSpoonStir();
    if (next >= 3) {
      setStep(4);
    }
  };

  // Evaluate "Chuẩn Gu! ✨"
  const isWaterOptimal = waterGauge >= 60 && waterGauge <= 95;
  const isMilkMatched = isNoSugar ? milkPoured === 0 : isMoreMilk ? milkPoured >= 2 : milkPoured >= 1;
  const isIceMatched = isLessIce ? iceCubes === 1 : iceCubes >= 2;
  const isCupMatched = isTakeAway ? cupType === 'PLASTIC' : true;

  const isChuanGu = isWaterOptimal && isMilkMatched && isIceMatched && isCupMatched;

  const handleDeliverDrink = () => {
    const basePrice = activeBrewing.price;
    // SPEC §1.1 Formula: If 100% matched -> +20% Tip + 1 Reputation + 1 Golden Bean
    const bonusTip = isChuanGu ? Math.round(basePrice * 0.2) : Math.round(basePrice * 0.05);
    const totalEarned = basePrice + bonusTip;
    const repEarned = isChuanGu ? 3 : 1;

    if (isChuanGu) {
      setIsChuanGuCelebration(true);
      SoundManager.playCoinTing();
      addGoldenBeans(1);
      EventBus.emit('customer-speak', {
        name: activeBrewing.customerName,
        dialogue: 'Chuẩn Gu Sài Gòn luôn! Pha đúng ý ghê, bo thêm tiền tip!',
      });
    } else {
      EventBus.emit('customer-speak', {
        name: activeBrewing.customerName,
        dialogue: 'Cảm ơn chủ quán, uống cũng được nhưng lần sau nhớ để ý dặn dò nha!',
      });
    }

    addGold(totalEarned);
    addReputation(repEarned);
    recordDrinkSale(basePrice, bonusTip, repEarned);

    setTimeout(() => {
      EventBus.emit('manual-brew-completed', {
        seatIndex: activeBrewing.customerSeatIndex,
        recipeId: activeBrewing.recipeId,
        isPerfect: isChuanGu,
        totalEarned,
      });
      finishManualBrewing();
    }, isChuanGu ? 900 : 200);
  };

  // Visual layers
  const milkHeightPx = Math.min(32, milkPoured * 16);
  const coffeeHeightPx = Math.min(46, (waterGauge / 100) * 46);
  const foamHeightPx = Math.min(16, (stirCount / 3) * 16);

  return (
    <div className="absolute inset-0 z-50 cozy-modal-backdrop flex items-center justify-center p-3 select-none font-sans animate-in fade-in duration-200">
      <div className="cozy-card w-full max-w-[400px] p-4 flex flex-col items-center text-[#4A3222] border-2 border-[#4A3222] shadow-[0_4px_0_#4A3222] relative overflow-hidden">
        
        {/* Chuẩn Gu! Golden Celebration Flash */}
        {isChuanGuCelebration && (
          <div className="absolute inset-0 bg-amber-300/40 z-30 flex flex-col items-center justify-center animate-in zoom-in-95 pointer-events-none">
            <div className="bg-[#FFF8ED] border-3 border-[#E08738] shadow-[0_6px_0_#4A3222] rounded-2xl p-4 text-center">
              <span className="text-3xl block animate-bounce">✨ 🌟 ✨</span>
              <h3 className="font-serif font-black text-xl text-[#E08738] uppercase tracking-wider">
                CHUẨN GU SÀI GÒN!
              </h3>
              <p className="text-xs font-bold text-[#5C9E54] mt-1">
                +20% TIP ({formatVND(Math.round(activeBrewing.price * 0.2))}) • +1 🫘 ĐẬU VÀNG
              </p>
            </div>
          </div>
        )}

        {/* Ribbon Header */}
        <div className="cozy-ribbon mb-2 text-center w-full relative py-1.5 px-4 shadow-sm border border-[#4A3222]">
          <div className="flex items-center justify-between">
            <span className="text-lg">☕</span>
            <div>
              <span className="font-serif font-black text-sm tracking-wide block leading-none text-[#FFFDF9]">
                TRẠM PHA CHẾ ASMR CHÂN THỰC
              </span>
              <span className="text-[10px] text-[#FFF3D6] font-semibold">
                Khách: {activeBrewing.customerName}
              </span>
            </div>
            <button
              onClick={() => cancelBrewing()}
              className="w-6 h-6 rounded-full bg-[#FAF0E1] hover:bg-[#F2ECE1] text-[#4A3222] font-black flex items-center justify-center text-xs border border-[#4A3222] cursor-pointer"
              title="Hủy pha chế"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Smart Modifier Alert Tag */}
        <div className="w-full bg-[#FAF0E1] border border-[#4A3222] rounded-xl px-3 py-1.5 flex items-center justify-between mb-2 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-[#4A3222]">{activeBrewing.recipeName}</span>
            <span className="text-[10px] font-bold text-[#D97706] bg-[#FFF8ED] px-1.5 py-0.2 rounded border border-[#D8C7B5]">
              {formatVND(activeBrewing.price)}
            </span>
          </div>

          {/* Modifier Pill */}
          <div className="flex items-center gap-1">
            {modifier === 'less_ice' && (
              <span className="px-1.5 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-400 text-[10px] font-bold">
                🧊- Ít đá
              </span>
            )}
            {modifier === 'more_milk' && (
              <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-400 text-[10px] font-bold">
                🥛+ Nhiều sữa
              </span>
            )}
            {modifier === 'take_away' && (
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-400 text-[10px] font-bold">
                🛍️ Mang đi
              </span>
            )}
            {modifier === 'no_sugar' && (
              <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-400 text-[10px] font-bold">
                🚫 Không đường/sữa
              </span>
            )}
            {modifier === 'normal' && (
              <span className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-300 text-[10px] font-bold">
                👍 Chuẩn vị
              </span>
            )}
          </div>
        </div>

        {/* Step Progression Pills */}
        <div className="w-full grid grid-cols-4 gap-1 mb-2 text-[11px] font-bold text-center">
          <div className={`py-1 rounded-lg border transition-all ${step >= 0 ? 'bg-[#5C9E54] text-white border-[#3D6E37] shadow-2xs' : 'bg-[#EAE0D3] text-[#8C6E54] border-[#D8C7B5]'}`}>
            1. Nước sôi phin
          </div>
          <div className={`py-1 rounded-lg border transition-all ${isNoSugar ? 'opacity-40 bg-stone-200 text-stone-500' : step >= 1 ? 'bg-[#5C9E54] text-white border-[#3D6E37] shadow-2xs' : 'bg-[#EAE0D3] text-[#8C6E54] border-[#D8C7B5]'}`}>
            2. Sữa đặc
          </div>
          <div className={`py-1 rounded-lg border transition-all ${step >= 2 ? 'bg-[#5C9E54] text-white border-[#3D6E37] shadow-2xs' : 'bg-[#EAE0D3] text-[#8C6E54] border-[#D8C7B5]'}`}>
            3. Đá bi
          </div>
          <div className={`py-1 rounded-lg border transition-all ${step >= 3 ? 'bg-[#5C9E54] text-white border-[#3D6E37] shadow-2xs' : 'bg-[#EAE0D3] text-[#8C6E54] border-[#D8C7B5]'}`}>
            4. Khuấy đều
          </div>
        </div>

        {/* Interactive Workspace */}
        <div className="w-full h-52 bg-[#2D1B0E] border-2 border-[#4A3222] rounded-xl relative flex flex-row items-center justify-between p-3 overflow-hidden mb-3 gap-3 shadow-inner">
          
          {/* Glass / Plastic Cup Visual */}
          <div className="flex flex-col items-center justify-center shrink-0 w-24 h-full relative">
            {/* Phin nhôm */}
            <div className="relative z-10 flex flex-col items-center mb-0.5">
              <div className="w-14 h-2.5 bg-stone-300 border border-black rounded-t-sm" />
              <div className="w-10 h-5 bg-stone-400 border-x border-b border-black flex items-center justify-center text-[8px] font-bold text-stone-900">
                PHIN
              </div>
              {isPouringWater && <div className="absolute -top-3 text-[10px] animate-bounce">♨️</div>}
            </div>

            {/* Cup Container */}
            <div
              className={`w-18 h-28 border-2 border-stone-800 relative overflow-hidden flex flex-col justify-end shadow-inner ${
                cupType === 'PLASTIC'
                  ? 'bg-amber-100/10 rounded-b-lg border-dashed'
                  : 'bg-white/10 backdrop-blur-2xs rounded-b-md'
              }`}
            >
              {/* Foam layer */}
              {foamHeightPx > 0 && (
                <div
                  className="w-full bg-[#D4A373] border-b border-black/40 transition-all duration-150"
                  style={{ height: `${foamHeightPx}px` }}
                />
              )}

              {/* Floating Ice */}
              {iceCubes > 0 && (
                <div className="absolute top-6 left-1 right-1 flex justify-center gap-1 z-10 pointer-events-none">
                  {Array.from({ length: iceCubes }).map((_, idx) => (
                    <div key={idx} className="w-3.5 h-3.5 bg-sky-200 border border-black rounded-xs shadow-2xs animate-bounce" />
                  ))}
                </div>
              )}

              {/* Coffee layer */}
              {coffeeHeightPx > 0 && (
                <div
                  className="w-full bg-[#3B1E08] transition-all duration-150 relative"
                  style={{ height: `${coffeeHeightPx}px` }}
                />
              )}

              {/* Milk layer */}
              {milkHeightPx > 0 && (
                <div
                  className="w-full bg-[#FFFDF5] border-t border-black/20 transition-all duration-150"
                  style={{ height: `${milkHeightPx}px` }}
                />
              )}
            </div>

            <span className="text-[9px] font-bold text-amber-200 mt-1">
              {cupType === 'PLASTIC' ? '🥤 Ly nhựa mang đi' : '🥛 Ly thủy tinh tại chỗ'}
            </span>
          </div>

          {/* Interactive Step Workspace */}
          <div className="flex-1 h-full flex flex-col items-center justify-center text-center">
            
            {/* STEP 0: NƯỚC SÔI */}
            {step === 0 && (
              <div className="w-full flex flex-col items-center">
                <span className="text-2xl mb-1">🫖</span>
                <span className="text-xs font-black text-[#FFD700] uppercase mb-1">
                  1. Châm Nước Sôi Phin
                </span>
                
                {/* Gauge Meter */}
                <div className="w-full bg-black/60 p-1.5 rounded-lg border border-stone-700 mb-2">
                  <div className="flex justify-between text-[9px] text-amber-200 font-bold mb-0.5">
                    <span>0%</span>
                    <span className="text-emerald-400">★ 60% – 95%</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full h-3.5 bg-black rounded-sm border border-stone-600 relative overflow-hidden">
                    <div className="absolute left-[60%] w-[35%] h-full bg-emerald-500/30 border-x border-emerald-400" />
                    <div
                      className={`h-full transition-all duration-75 ${
                        waterGauge >= 60 && waterGauge <= 95 ? 'bg-[#5C9E54]' : 'bg-[#E08738]'
                      }`}
                      style={{ width: `${waterGauge}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-stone-200 font-bold mt-0.5 block">
                    {waterGauge >= 60 && waterGauge <= 95 ? '✨ Vùng Chiết Xuất Chuẩn Gu!' : `Mức nước: ${Math.round(waterGauge)}%`}
                  </span>
                </div>

                <button
                  onMouseDown={handleStartPourWater}
                  onMouseUp={handleStopPourWater}
                  onTouchStart={handleStartPourWater}
                  onTouchEnd={handleStopPourWater}
                  className="w-full py-2 bg-[#E08738] hover:bg-[#ED9445] text-white text-xs font-black rounded-xl border border-[#4A3222] shadow-[0_2px_0_#4A3222] active:translate-y-0.5 cursor-pointer"
                >
                  {isPouringWater ? 'ĐANG CHÂM NƯỚC SÔI...' : 'GIỮ ĐỂ CHÂM NƯỚC SÔI 🫖'}
                </button>
              </div>
            )}

            {/* STEP 1: SỮA ĐẶC */}
            {step === 1 && (
              <div className="w-full flex flex-col items-center">
                <span className="text-2xl mb-1">🥛</span>
                <span className="text-xs font-black text-[#FFD700] uppercase mb-1">
                  2. Sữa Đặc Ông Thọ
                </span>
                <p className="text-[11px] text-amber-200 mb-2">
                  {isMoreMilk ? 'Khách dặn: Nhiều sữa (2 chạm)' : 'Khách dặn: Mức sữa chuẩn (1 chạm)'}
                </p>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={handleAddMilk}
                    className="flex-1 py-2 bg-[#FAF0E1] hover:bg-[#F2ECE1] text-[#4A3222] text-xs font-black rounded-xl border border-[#4A3222] shadow-[0_2px_0_#4A3222] active:translate-y-0.5 cursor-pointer"
                  >
                    + Múc Sữa Đặc ({milkPoured}/{targetMilk})
                  </button>
                  <button
                    onClick={handleSkipMilk}
                    className="px-2 py-2 bg-stone-600 hover:bg-stone-500 text-white text-[10px] font-bold rounded-xl border border-black cursor-pointer"
                    title="Bỏ qua bước sữa"
                  >
                    Bỏ qua
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ĐÁ BI */}
            {step === 2 && (
              <div className="w-full flex flex-col items-center">
                <span className="text-2xl mb-1">🧊</span>
                <span className="text-xs font-black text-[#FFD700] uppercase mb-1">
                  3. Xúc Đá Bi
                </span>
                <p className="text-[11px] text-sky-200 mb-2">
                  {isLessIce ? 'Khách dặn: Ít đá thôi nha (1 chạm) 🧊-' : 'Khách dặn: Uống đá đầy đủ (2 chạm)'}
                </p>
                <button
                  onClick={handleAddIce}
                  className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-black rounded-xl border border-[#4A3222] shadow-[0_2px_0_#4A3222] active:translate-y-0.5 cursor-pointer"
                >
                  🧊 Xúc Đá Bi ({iceCubes}/{targetIce})
                </button>
              </div>
            )}

            {/* STEP 3: KHUẤY / LẮC SHAKER */}
            {step === 3 && (
              <div className="w-full flex flex-col items-center">
                <span className="text-2xl mb-1">🥄</span>
                <span className="text-xs font-black text-[#FFD700] uppercase mb-1">
                  4. Đánh Bọt / Khuấy Đều
                </span>
                <p className="text-[11px] text-amber-200 mb-2">
                  Khuấy que đánh bọt bồng bềnh thơm béo!
                </p>
                <button
                  onClick={handleStir}
                  className="w-full py-2 bg-[#5C9E54] hover:bg-[#4E8B46] text-white text-xs font-black rounded-xl border border-[#4A3222] shadow-[0_2px_0_#4A3222] active:translate-y-0.5 cursor-pointer"
                >
                  🥄 Khuấy Đều Cà Phê ({stirCount}/3)
                </button>
              </div>
            )}

            {/* STEP 4: GIAO ĐỒ UỐNG */}
            {step === 4 && (
              <div className="w-full flex flex-col items-center animate-in zoom-in-95">
                <span className="text-3xl mb-1">✨</span>
                <span className="text-xs font-black text-[#FFD700] uppercase mb-1">
                  {isChuanGu ? '🌟 ĐẠT CHUẨN GU (+20% TIP)' : 'ĐÃ HOÀN TẤT ĐỒ UỐNG'}
                </span>
                <p className="text-[10px] text-amber-200 mb-2">
                  {isChuanGu ? 'Khớp 100% dặn dò của khách!' : 'Sẵn sàng mang ra bàn phục vụ.'}
                </p>

                {/* Cup packaging toggle for take_away */}
                <div className="flex gap-1 mb-2">
                  <button
                    onClick={() => setCupType('GLASS')}
                    className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${
                      cupType === 'GLASS' ? 'bg-[#FFF8ED] text-[#4A3222] border-[#4A3222]' : 'bg-stone-700 text-stone-300 border-stone-600'
                    }`}
                  >
                    🥛 Tại chỗ
                  </button>
                  <button
                    onClick={() => setCupType('PLASTIC')}
                    className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${
                      cupType === 'PLASTIC' ? 'bg-emerald-100 text-emerald-800 border-emerald-500 font-black' : 'bg-stone-700 text-stone-300 border-stone-600'
                    }`}
                  >
                    🛍️ Mang đi
                  </button>
                </div>

                <button
                  onClick={handleDeliverDrink}
                  className="w-full py-2.5 bg-[#5C9E54] hover:bg-[#4E8B46] text-white text-xs font-black rounded-xl border border-[#4A3222] shadow-[0_3px_0_#4A3222] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>🚀</span>
                  <span>TRAO LY CHO KHÁCH (+{formatVND(activeBrewing.price + (isChuanGu ? Math.round(activeBrewing.price * 0.2) : 0))})</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Footer Action: Fast Auto-Brew fallback */}
        <div className="w-full flex justify-between items-center text-[11px] text-[#8C6E54] pt-1 border-t border-[#D8C7B5]">
          <span>Gợi ý: Khớp dặn dò nhận ngay +20% Tip & 1 🫘</span>
          <button
            onClick={() => handleDeliverDrink()}
            className="text-[10px] font-bold text-[#E08738] hover:underline cursor-pointer"
          >
            Pha Nhanh Tự Động ⏩
          </button>
        </div>
      </div>
    </div>
  );
};
