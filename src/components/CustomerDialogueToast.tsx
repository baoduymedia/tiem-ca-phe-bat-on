import { useState, useEffect } from 'react';
import { EventBus } from '../game/EventBus';

export function CustomerDialogueToast() {
  const [speech, setSpeech] = useState<{ name: string; dialogue: string } | null>(
    null
  );

  useEffect(() => {
    const onSpeak = (data: { name: string; dialogue: string }) => {
      setSpeech(data);
      const timer = setTimeout(() => {
        setSpeech((curr) => (curr?.dialogue === data.dialogue ? null : curr));
      }, 4000);
      return () => clearTimeout(timer);
    };

    EventBus.on('customer-speak', onSpeak);
    return () => {
      EventBus.off('customer-speak', onSpeak);
    };
  }, []);

  if (!speech) return null;

  return (
    <div className="absolute bottom-18 left-3 right-3 z-20 pointer-events-none flex justify-center animate-in fade-in slide-in-from-bottom duration-300">
      <div className="bg-[#2D1B0E]/95 border-2 border-[#D4AF37]/70 rounded-2xl px-3.5 py-2 shadow-2xl max-w-[360px] w-full flex items-center gap-2.5 backdrop-blur-sm">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-sm shrink-0 border border-amber-400/50">
          💬
        </div>
        <div className="text-[11px] leading-snug text-[#FFF3D6] flex-1">
          <span className="font-extrabold text-[#FFD700] mr-1.5 uppercase tracking-wide">
            {speech.name}:
          </span>
          <span className="italic font-medium">"{speech.dialogue}"</span>
        </div>
      </div>
    </div>
  );
}
