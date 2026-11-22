import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';
import { X, Camera, Download, Share2 } from 'lucide-react';

export const PolaroidPhotoMode: React.FC = () => {
  const isPhotoModeOpen = useGameStore((s) => s.isPhotoModeOpen);
  const setPhotoModeOpen = useGameStore((s) => s.setPhotoModeOpen);
  const shopName = useGameStore((s) => s.shopName);
  const currentDay = useGameStore((s) => s.currentDay);
  const currentStage = useGameStore((s) => s.currentStage);

  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const stageLabels: Record<number, string> = {
    1: 'Quán Cóc Vỉa Hè',
    2: 'Xe Đẩy Take-Away',
    3: 'Kiosk Chung Cư',
    4: 'Nhà Phố 2 Tầng',
    5: 'Chuỗi Nhượng Quyền',
    6: 'Đế Chế Toàn Cầu',
  };

  useEffect(() => {
    if (isPhotoModeOpen) {
      SoundManager.playCameraShutter();
      // Capture canvas from Phaser DOM
      const canvas = document.querySelector('canvas');
      if (canvas) {
        try {
          const dataUrl = canvas.toDataURL('image/png');
          setSnapshotUrl(dataUrl);
        } catch (e) {
          console.warn('Canvas snapshot error:', e);
        }
      }
    } else {
      setSnapshotUrl(null);
    }
  }, [isPhotoModeOpen]);

  if (!isPhotoModeOpen) return null;

  const handleDownload = () => {
    if (!snapshotUrl) return;

    // Create an export canvas with polaroid frame
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 600;
    exportCanvas.height = 760;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // 1. Polaroid White Paper Frame
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, 600, 760);

    // Subtle border
    ctx.strokeStyle = '#4A3222';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 592, 752);

    // 2. Draw Snapshot Image
    const img = new Image();
    img.src = snapshotUrl;
    img.onload = () => {
      ctx.drawImage(img, 30, 30, 540, 560);

      // 3. Polaroid Handwritten Caption
      ctx.fillStyle = '#4A3222';
      ctx.font = 'bold 24px Mali, sans-serif';
      ctx.fillText(shopName || 'Tiệm Cà Phê Bất Ổn', 35, 635);

      ctx.fillStyle = '#7A543A';
      ctx.font = '16px Nunito, sans-serif';
      ctx.fillText(
        `Kỷ niệm Ngày thứ ${currentDay} • ${stageLabels[currentStage] || 'Vỉa Hè Sài Gòn'}`,
        35,
        665
      );

      // 4. Red Vintage Saigon Stamp
      ctx.strokeStyle = '#E04F4F';
      ctx.lineWidth = 3;
      ctx.strokeRect(390, 620, 175, 55);

      ctx.fillStyle = '#E04F4F';
      ctx.font = 'bold 14px Nunito, sans-serif';
      ctx.fillText('☕ SÀI GÒN PHỐ', 420, 642);
      ctx.font = '11px Nunito, sans-serif';
      ctx.fillText('TIỆM CÀ PHÊ BẤT ỔN', 405, 660);

      // Trigger download
      const link = document.createElement('a');
      link.download = `polaroid_${shopName.replace(/\s+/g, '_')}_ngay${currentDay}.png`;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    };
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#170C06]/80 backdrop-blur-xs p-3 animate-in fade-in duration-200 select-none font-sans">
      <div className="relative w-full max-w-[340px] game-panel p-4 text-[#4A3222] flex flex-col items-center">
        {/* Header Ribbon */}
        <div className="w-full flex items-center justify-between pb-2 border-b-2 border-[#4A3222]/20 mb-3">
          <div className="game-ribbon px-3 py-1 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-[#4A3222]" />
            <h3 className="font-mali font-bold text-sm md:text-base text-[#4A3222] tracking-wide">
              Ảnh Chụp Kỷ Niệm
            </h3>
          </div>
          <button
            onClick={() => setPhotoModeOpen(false)}
            className="w-7 h-7 rounded-full game-btn game-btn-red flex items-center justify-center cursor-pointer transition-transform"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Polaroid Card */}
        <div
          ref={cardRef}
          className="relative w-full bg-[#FFFDF9] border-[2.5px] border-[#4A3222] shadow-[0_4px_0_#4A3222] rounded-2xl p-3 pb-4 flex flex-col items-center"
        >
          {/* Photo Canvas Frame */}
          <div className="w-full aspect-[4/3] bg-black/10 border-2 border-[#4A3222] rounded-xl overflow-hidden relative shadow-inner">
            {snapshotUrl ? (
              <img src={snapshotUrl} alt="Polaroid View" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-stone-500 font-nunito font-bold">
                Đang chụp ảnh...
              </div>
            )}
          </div>

          {/* Handwritten Caption */}
          <div className="w-full mt-2.5 text-center px-1">
            <h4 className="font-mali font-bold text-base text-[#4A3222]">
              {shopName} – Một Buổi Chiều An Yên
            </h4>
            <p className="text-[11px] font-nunito font-bold text-[#7A543A] mt-0.5">
              Ngày {currentDay} • {stageLabels[currentStage]}
            </p>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="w-full grid grid-cols-2 gap-2 mt-3.5">
          <button
            onClick={handleDownload}
            className="py-2.5 px-2 game-btn game-btn-gold text-xs font-mali font-bold rounded-xl flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Lưu về máy</span>
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: shopName,
                    text: `Ghé quán cà phê vỉa hè ${shopName} ngày ${currentDay}!`,
                    url: window.location.href,
                  })
                  .catch(() => {});
              } else {
                handleDownload();
              }
            }}
            className="py-2.5 px-2 game-btn game-btn-green text-xs font-mali font-bold rounded-xl flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>Chia sẻ Story</span>
          </button>
        </div>
      </div>
    </div>
  );
};
