import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { SoundManager } from '../game/audio/SoundManager';

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
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 592, 752);

    // 2. Draw Snapshot Image
    const img = new Image();
    img.src = snapshotUrl;
    img.onload = () => {
      ctx.drawImage(img, 30, 30, 540, 560);

      // 3. Polaroid Handwritten Caption
      ctx.fillStyle = '#2D1B0E';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(shopName || 'Tiệm Cà Phê Bất Ổn', 35, 635);

      ctx.fillStyle = '#6F4E37';
      ctx.font = '16px monospace';
      ctx.fillText(`Kỷ niệm Ngày thứ ${currentDay} • ${stageLabels[currentStage] || 'Vỉa Hè Sài Gòn'}`, 35, 665);

      // 4. Red Vintage Saigon Stamp
      ctx.strokeStyle = '#C0392B';
      ctx.lineWidth = 3;
      ctx.strokeRect(390, 620, 175, 55);

      ctx.fillStyle = '#C0392B';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('☕ SÀI GÒN PHỐ', 420, 642);
      ctx.font = '11px monospace';
      ctx.fillText('TIỆM CÀ PHÊ BẤT ỔN', 405, 660);

      // Trigger download
      const link = document.createElement('a');
      link.download = `polaroid_${shopName.replace(/\s+/g, '_')}_ngay${currentDay}.png`;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    };
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center cozy-modal-backdrop p-3 animate-in fade-in duration-200 select-none font-sans">
      <div className="relative w-full max-w-[340px] cozy-card p-4 text-[#3E2415] flex flex-col items-center">
        {/* Header Ribbon (matching Mockup 8) */}
        <div className="w-full flex items-center justify-between pb-2 border-b-2 border-[#D8C7B5] mb-3">
          <h3 className="font-serif font-black text-base text-[#3E2415] tracking-wide">
            Polaroid Snapshot
          </h3>
          <button
            onClick={() => setPhotoModeOpen(false)}
            className="w-8 h-8 rounded-full bg-[#FAF0E1] hover:bg-[#EADDC9] text-[#5D4037] text-sm font-black border border-[#DECBB9] flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Polaroid Card */}
        <div
          ref={cardRef}
          className="relative w-full bg-[#FFFDF9] border-2 border-[#D8C7B5] rounded-2xl p-3 pb-4 text-[#2D1B0E] flex flex-col items-center shadow-md"
        >
          {/* Photo Canvas Frame */}
          <div className="w-full aspect-[4/3] bg-black/10 border border-[#D8C7B5] rounded-xl overflow-hidden relative shadow-inner">
            {snapshotUrl ? (
              <img src={snapshotUrl} alt="Polaroid View" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-stone-500 font-bold">
                Đang chụp ảnh...
              </div>
            )}
          </div>

          {/* Handwritten Caption (matching Mockup 8) */}
          <div className="w-full mt-2.5 text-center px-1">
            <h4 className="font-serif font-bold text-sm text-[#3E2415]">
              {shopName} – Một Buổi Chiều An Yên
            </h4>
            <p className="text-[10px] text-[#8C6E54] font-semibold mt-0.5">
              Ngày {currentDay} • {stageLabels[currentStage]}
            </p>
          </div>
        </div>

        {/* Control Buttons (matching Mockup 8) */}
        <div className="w-full grid grid-cols-2 gap-2 mt-3.5">
          <button
            onClick={handleDownload}
            className="py-2.5 px-2 cozy-btn-orange text-xs flex items-center justify-center gap-1.5"
          >
            <span>📥</span>
            <span>Lưu về máy</span>
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: shopName,
                  text: `Ghé quán cà phê vỉa hè ${shopName} ngày ${currentDay}!`,
                  url: window.location.href,
                }).catch(() => {});
              } else {
                handleDownload();
              }
            }}
            className="py-2.5 px-2 cozy-btn-gold text-xs flex items-center justify-center gap-1.5"
          >
            <span>🔗</span>
            <span>Chia sẻ Story</span>
          </button>
        </div>
      </div>
    </div>
  );
};
