import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Sparkles } from 'lucide-react';

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
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#170C06]/85 backdrop-blur-xs select-none p-4">
      {/* Background Cozy Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#D4A373_2px,transparent_2px)] [background-size:20px_20px]" />

      <div className="relative z-10 flex flex-col items-center max-w-[360px] w-full game-panel p-5 text-center animate-in zoom-in-95 duration-200">
        {step === 'intro' ? (
          <>
            {/* Logo Frame */}
            <div className="w-20 h-20 bg-[#FAF0E1] border-[2.5px] border-[#4A3222] shadow-[0_3px_0_#4A3222] rounded-3xl flex items-center justify-center mx-auto mb-3 p-2">
              <img
                src="/assets/sprites/phin_ca_phe.png"
                alt="Phin cà phê"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-3xl hidden only:block">☕</span>
            </div>

            <h1 className="text-[#4A3222] font-mali text-2xl font-bold leading-tight mb-1">
              Tiệm Cà Phê
              <br />
              <span className="text-[#F4A236] text-3xl font-black drop-shadow-[0_2px_0_#4A3222]">
                Bất Ổn
              </span>
            </h1>
            <p className="text-[#7A543A] font-nunito text-xs mb-4 font-bold uppercase tracking-wider">
              TỪ VỈA HÈ ĐẾN ĐẾ CHẾ CAFE SÀI GÒN!
            </p>

            {/* Feature Bullets */}
            <div className="space-y-2 mb-5 w-full text-left">
              {[
                {
                  sprite: '/assets/sprites/ghe_nhua_do.png',
                  text: 'Bắt đầu từ quán cóc 4 ghế nhựa vỉa hè',
                },
                {
                  sprite: '/assets/sprites/cf_sua_da.png',
                  text: 'Pha cà phê phin ASMR chuẩn vị Sài Gòn',
                },
                {
                  icon: <Sparkles className="w-5 h-5 text-[#5C9E54]" />,
                  text: 'Vượt bão giá, mở chuỗi kiosk 6 giai đoạn',
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-2 bg-[#FFFDF9] border-2 border-[#4A3222] shadow-[0_2px_0_#4A3222] rounded-xl"
                >
                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    {f.sprite ? (
                      <img src={f.sprite} alt="" className="w-full h-full object-contain" />
                    ) : (
                      f.icon
                    )}
                  </div>
                  <span className="text-[#4A3222] font-nunito text-xs font-bold">{f.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleStart}
              className="w-full py-3 game-btn game-btn-gold text-base uppercase flex items-center justify-center gap-1.5 rounded-xl font-mali font-bold"
            >
              <span>BẮT ĐẦU KHỞI NGHIỆP! ▶</span>
            </button>
          </>
        ) : (
          <>
            {/* Mockup 2: Cute shop name greeting with signboard */}
            <p className="text-xs text-[#7A543A] font-mali font-bold mb-3">
              Chào mừng đến với tiệm!
              <br />
              Hãy đặt tên cho quán của bạn nhé!
            </p>

            {/* Wooden signboard illustration */}
            <div className="my-2 p-3 bg-[#4A3222] border-[3px] border-[#2E1D13] shadow-[0_4px_0_#2E1D13] rounded-2xl w-full flex flex-col items-center justify-center relative overflow-hidden">
              <div className="text-[10px] text-[#FDE68A] font-nunito font-extrabold tracking-widest uppercase mb-0.5">
                ✦ BẢNG HIỆU GỖ ✦
              </div>
              <div className="text-[#FFF8E7] font-mali font-bold text-lg md:text-xl">
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
                className="w-full bg-[#FFFDF9] border-[2.5px] border-[#4A3222] shadow-inner rounded-xl p-2.5 text-[#4A3222] text-center font-mali font-bold text-base placeholder:text-stone-400 outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStart();
                }}
              />
              <p className="text-[#7A543A] font-nunito text-[11px] mt-1 font-bold">
                {name.length}/24 ký tự — Enter để mở quán
              </p>
            </div>

            <button
              onClick={handleStart}
              className="w-full py-3 game-btn game-btn-gold text-base uppercase flex items-center justify-center gap-1.5 mb-4 rounded-xl font-mali font-bold"
            >
              <span>Bắt đầu</span>
            </button>

            {/* Sleeping Pets Illustration at bottom (matching Mockup 2) */}
            <div className="flex items-center justify-center gap-4 pt-3 border-t-2 border-[#4A3222]/20 w-full">
              <div className="w-12 h-12 shrink-0">
                <img
                  src="/assets/sprites/pet_meo_muop.png"
                  alt="Mèo Mướp"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-mali text-xs text-[#7A543A] font-bold">
                Mèo Mướp & Cún Vàng
              </span>
              <div className="w-12 h-12 shrink-0">
                <img
                  src="/assets/sprites/pet_cun_vang.png"
                  alt="Cún Vàng"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
