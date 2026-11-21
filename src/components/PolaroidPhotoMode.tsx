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
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-in fade-in duration-200 select-none font-pixel">
      {/* Polaroid Card */}
      <div
        ref={cardRef}
        className="relative w-full max-w-[340px] pixel-box bg-[#FAF7F2] p-3 pb-5 text-[#2D1B0E] flex flex-col items-center"
      >
        {/* Photo Canvas Frame */}
        <div className="w-full aspect-[9/11] bg-black/20 border-2 border-black overflow-hidden relative shadow-inner">
          {snapshotUrl ? (
            <img src={snapshotUrl} alt="Polaroid View" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-stone-600 font-bold">
              Đang chụp ảnh...
            </div>
          )}
        </div>

        {/* Handwritten Bottom Area */}
        <div className="w-full mt-3 px-1 flex items-end justify-between">
          <div>
            <h4 className="font-black text-base text-[#3E2723] uppercase tracking-wide">{shopName}</h4>
            <p className="text-xs font-bold text-[#6F4E37]">
              Ngày {currentDay} • {stageLabels[currentStage]}
            </p>
          </div>

          {/* Red Vintage Stamp */}
          <div className="border-2 border-red-700 bg-red-50 px-2 py-0.5 text-center rotate-3">
            <span className="block text-[10px] font-black text-red-700 uppercase tracking-wider">
              ☕ SÀI GÒN
            </span>
            <span className="block text-[8px] font-bold text-red-800">TIỆM BẤT ỔN</span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="w-full max-w-[340px] flex gap-3 mt-4">
        <button
          onClick={() => setPhotoModeOpen(false)}
          className="flex-1 pixel-btn pixel-btn-wood py-2 text-xs uppercase"
        >
          ✕ Đóng Camera
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 pixel-btn pixel-btn-gold py-2 text-xs uppercase flex items-center justify-center gap-1.5"
        >
          <span>💾</span> TẢI ẢNH
        </button>
      </div>
    </div>
  );
};
