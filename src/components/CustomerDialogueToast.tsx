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
    <div className="absolute bottom-20 left-4 right-4 z-20 pointer-events-none flex justify-center animate-in fade-in slide-in-from-bottom duration-200 select-none">
      <div className="bg-[#4E342E]/95 text-[#FFF9EF] border-2 border-[#3E2415] shadow-md rounded-2xl px-3.5 py-2 max-w-[380px] w-full flex items-center gap-2.5 backdrop-blur-xs">
        <div className="w-7 h-7 bg-[#FFF9EF] text-[#5D4037] rounded-full flex items-center justify-center text-xs shrink-0 shadow-xs border border-[#3E2415]/20">
          💬
        </div>
        <div className="text-xs leading-tight text-[#FFF9EF] flex-1">
          <span className="font-bold text-[#F4C447] mr-1.5 uppercase tracking-wide">
            {speech.name}:
          </span>
          <span className="font-medium text-[#FFFDF9]/95">"{speech.dialogue}"</span>
        </div>
      </div>
    </div>
  );
}
