import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';

export function SplashScreen() {
  const { setShopName, completeSplash } = useGameStore();
  const [name, setName] = useState('');
  const [step, setStep] = useState<'intro' | 'name'>('intro');

  const handleStart = () => {
    if (step === 'intro') {
      setStep('name');
      return;
    }
    const finalName = name.trim() || 'Tiệm Cà Phê Bất Ổn';
    setShopName(finalName);
    completeSplash();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#170C06] font-pixel select-none p-4">
      {/* Background Pixel Coffee Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#D4A373_2px,transparent_2px)] [background-size:20px_20px]" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full bg-[#24140B] border-4 border-black shadow-[6px_6px_0px_#000] p-6 text-center">
        {step === 'intro' ? (
          <>
            {/* Logo Frame */}
            <div className="w-20 h-20 bg-[#3E2413] border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mx-auto mb-3">
              <span className="text-5xl">☕</span>
            </div>

            <h1 className="text-[#FFF8E7] text-2xl font-bold leading-none mb-1">
              TIỆM CÀ PHÊ
              <br />
              <span className="text-[#FFD700] text-3xl font-bold">BẤT ỔN</span>
            </h1>
            <p className="text-amber-200/80 text-xs mb-5 uppercase tracking-wider">
              TỪ VỈA HÈ ĐẾN ĐẾ CHẾ CAFE SÀI GÒN!
            </p>

            {/* Feature Bullets */}
            <div className="space-y-2 mb-6 w-full text-left">
              {[
                { icon: '🪑', text: 'Bắt đầu từ quán cóc 4 ghế nhựa', color: '#B91C1C' },
                { icon: '☕', text: 'Pha cà phê phin ASMR chuẩn vị', color: '#92400E' },
                { icon: '🏢', text: 'Vượt bão giá, mở chuỗi kiosk 6 GĐ', color: '#0F766E' },
              ].map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-2 bg-[#1A0E05] border-2 border-black shadow-[2px_2px_0px_#000]"
                >
                  <span className="text-lg">{f.icon}</span>
                  <span className="text-[#FFF8E7] text-xs font-bold">{f.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleStart}
              className="w-full py-3 bg-[#F59E0B] hover:bg-[#FBBF24] active:translate-x-0.5 active:translate-y-0.5 text-[#1A0E05] font-bold text-base uppercase border-3 border-black shadow-[3px_3px_0px_#000] cursor-pointer transition-transform"
            >
              BẮT ĐẦU KHỞI NGHIỆP! ▶
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-[#3E2413] border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mx-auto mb-3">
              <span className="text-4xl">🏷️</span>
            </div>

            <h2 className="text-[#FFD700] text-xl font-bold uppercase mb-1">
              ĐẶT TÊN BẢNG HIỆU
            </h2>
            <p className="text-[#FFF8E7]/70 text-xs mb-4">
              Tên quán sẽ hiển thị trên nóc quán và ảnh Polaroid!
            </p>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tiệm Cà Phê Bất Ổn"
              maxLength={24}
              className="w-full bg-[#1A0E05] border-2 border-black p-2.5 text-[#FFD700] text-center text-sm font-bold placeholder:text-stone-600 outline-none shadow-inner mb-1.5"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleStart();
              }}
            />
            <p className="text-stone-400 text-xs mb-5">
              {name.length}/24 ký tự — Enter để mở quán
            </p>

            <button
              onClick={handleStart}
              className="w-full py-3 bg-[#16A34A] hover:bg-[#22C55E] active:translate-x-0.5 active:translate-y-0.5 text-white font-bold text-base uppercase border-3 border-black shadow-[3px_3px_0px_#000] cursor-pointer transition-transform"
            >
              MỞ QUÁN NGAY! ☕
            </button>
          </>
        )}
      </div>
    </div>
  );
}
