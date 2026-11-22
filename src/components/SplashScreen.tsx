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
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#170C06] font-sans select-none p-4">
      {/* Background Pixel Coffee Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#D4A373_2px,transparent_2px)] [background-size:20px_20px]" />

      <div className="relative z-10 flex flex-col items-center max-w-[360px] w-full cozy-card p-6 text-center animate-in zoom-in-95 duration-200">
        {step === 'intro' ? (
          <>
            {/* Logo Frame */}
            <div className="w-20 h-20 bg-[#FAF0E1] border-2 border-[#D8C7B5] rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <span className="text-4xl">☕</span>
            </div>

            <h1 className="text-[#3E2415] font-serif text-2xl font-bold leading-tight mb-1">
              Tiệm Cà Phê
              <br />
              <span className="text-[#E08738] text-3xl font-black">Bất Ổn</span>
            </h1>
            <p className="text-[#8C6E54] text-xs mb-4 font-semibold uppercase tracking-wider">
              TỪ VỈA HÈ ĐẾN ĐẾ CHẾ CAFE SÀI GÒN!
            </p>

            {/* Feature Bullets */}
            <div className="space-y-2 mb-5 w-full text-left">
              {[
                { icon: '🪑', text: 'Bắt đầu từ quán cóc 4 ghế nhựa vỉa hè', bg: '#FAF0E1' },
                { icon: '☕', text: 'Pha cà phê phin ASMR chuẩn vị Sài Gòn', bg: '#FAF0E1' },
                { icon: '🏢', text: 'Vượt bão giá, mở chuỗi kiosk 6 giai đoạn', bg: '#FAF0E1' },
              ].map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-2 bg-[#FFFDF9] border border-[#DECBB9] rounded-2xl shadow-xs"
                >
                  <span className="text-lg">{f.icon}</span>
                  <span className="text-[#3E2415] text-xs font-bold">{f.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleStart}
              className="w-full py-3 cozy-btn-orange text-base uppercase flex items-center justify-center gap-1.5"
            >
              <span>BẮT ĐẦU KHỞI NGHIỆP! ▶</span>
            </button>
          </>
        ) : (
          <>
            {/* Mockup 2: Cute shop name greeting with signboard */}
            <p className="text-xs text-[#8C6E54] font-bold mb-2">
              Chào mừng đến với tiệm!<br />Hãy đặt tên cho quán của bạn nhé!
            </p>

            {/* Wooden signboard illustration */}
            <div className="my-2 p-3 bg-[#422615] border-2 border-[#24140B] rounded-2xl shadow-md w-full flex flex-col items-center justify-center">
              <div className="text-[10px] text-amber-300 font-bold tracking-widest uppercase mb-0.5">
                ✦ BẢNG HIỆU GỖ ✦
              </div>
              <div className="text-[#FFF8E7] font-serif font-black text-lg">
                {name.trim() || 'Tiệm Cà Phê Bất Ổn'}
              </div>
            </div>

            <div className="w-full my-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tiệm Cà Phê Bất Ổn"
                maxLength={24}
                className="w-full bg-[#FFFDF9] border-2 border-[#D8C7B5] rounded-xl p-2.5 text-[#3E2415] text-center text-sm font-bold placeholder:text-stone-400 outline-none shadow-inner"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStart();
                }}
              />
              <p className="text-stone-400 text-[11px] mt-1">
                {name.length}/24 ký tự — Enter để mở quán
              </p>
            </div>

            <button
              onClick={handleStart}
              className="w-full py-3 cozy-btn-orange text-base uppercase flex items-center justify-center gap-1.5 mb-3"
            >
              <span>MỞ QUÁN NGAY! ☕</span>
            </button>

            {/* Sleeping Pets Illustration at bottom (matching Mockup 2) */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-[#DECBB9] text-xs text-[#8C6E54]">
              <span>🐱</span>
              <span className="font-semibold text-[11px]">Mèo Mướp & Cún Vàng đang canh quán giúp bạn</span>
              <span>🐶</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
