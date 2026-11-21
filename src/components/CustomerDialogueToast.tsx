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
    <div className="absolute bottom-18 left-3 right-3 z-20 pointer-events-none flex justify-center animate-in fade-in slide-in-from-bottom duration-200 font-pixel select-none">
      <div className="bg-[#24140B] border-2 border-black shadow-[3px_3px_0px_#000] px-3 py-1.5 max-w-[380px] w-full flex items-center gap-2">
        <div className="w-6 h-6 bg-[#1A0E05] flex items-center justify-center text-xs shrink-0 border border-black">
          💬
        </div>
        <div className="text-xs leading-tight text-[#FFF8E7] flex-1">
          <span className="font-bold text-[#FFD700] mr-1.5 uppercase">
            {speech.name}:
          </span>
          <span className="text-[#FFF8E7]/90 font-semibold">"{speech.dialogue}"</span>
        </div>
      </div>
    </div>
  );
}
