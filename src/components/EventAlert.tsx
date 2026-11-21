import { useState, useEffect } from 'react';
import { EventBus } from '../game/EventBus';

interface ActiveEvent {
  id: string;
  name: string;
  buttonLabel: string;
  alertText: string;
  durationSec: number;
}

export function EventAlert() {
  const [activeEvent, setActiveEvent] = useState<ActiveEvent | null>(null);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const onWarning = (data: { message: string }) => {
      setWarningMsg(data.message);
      setTimeout(() => setWarningMsg(null), 3200);
    };

    const onStarted = (event: ActiveEvent) => {
      setWarningMsg(null);
      setActiveEvent(event);
      setTimeLeft(event.durationSec);
    };

    const onResolved = () => {
      setActiveEvent(null);
    };

    EventBus.on('event-warning', onWarning);
    EventBus.on('event-started', onStarted);
    EventBus.on('event-resolved', onResolved);

    return () => {
      EventBus.off('event-warning', onWarning);
      EventBus.off('event-started', onStarted);
      EventBus.off('event-resolved', onResolved);
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!activeEvent || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeEvent, timeLeft]);

  const handleAction = (viaNeighbor = false) => {
    if (!activeEvent) return;
    EventBus.emit('handle-event-action', { eventId: activeEvent.id, viaNeighbor });
    setActiveEvent(null);
  };

  const getEventIcon = (id: string) => {
    if (id === 'mua_rao') return '🌧️';
    if (id === 'cup_dien') return '⚡';
    if (id === 'thanh_tra_vsattp') return '🔍';
    return '🚨';
  };

  return (
    <>
      {/* Warning Toast */}
      {warningMsg && (
        <div className="absolute top-18 left-4 right-4 z-40 flex justify-center animate-bounce select-none pointer-events-none font-pixel">
          <div className="bg-[#DC2626] text-white text-xs font-bold px-3 py-1.5 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-2">
            <span className="text-sm">🚨</span>
            <span className="tracking-wide uppercase">{warningMsg}</span>
          </div>
        </div>
      )}

      {/* Active Event Alert & Big Button */}
      {activeEvent && (
        <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 select-none font-pixel animate-in zoom-in-95 duration-150">
          <div className="bg-[#24140B] border-4 border-black shadow-[5px_5px_0px_#000] p-4 text-center max-w-[340px] w-full flex flex-col items-center">
            <span className="text-4xl block mb-1 drop-shadow-[2px_2px_0px_#000]">
              {getEventIcon(activeEvent.id)}
            </span>
            <h2 className="text-[#FFD700] font-black text-lg mb-1 tracking-wide uppercase drop-shadow-[1px_1px_0px_#000]">
              {activeEvent.name}
            </h2>
            <p className="text-[#FFF8E7]/90 text-xs mb-3 leading-relaxed font-bold">
              {activeEvent.alertText}
            </p>

            {/* Timer bar */}
            <div className="w-full bg-[#1A0E05] h-3 border-2 border-black mb-3.5 overflow-hidden">
              <div
                className="bg-[#EAB308] h-full transition-all duration-1000"
                style={{
                  width: `${(timeLeft / activeEvent.durationSec) * 100}%`,
                }}
              />
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => handleAction(false)}
              className="w-full py-2.5 pixel-btn pixel-btn-red text-sm font-black uppercase tracking-wider mb-2 cursor-pointer"
            >
              {activeEvent.buttonLabel} ({timeLeft}S)
            </button>

            {/* Solidarity Rescue Option from Cô Bảy (if trật tự đô thị) */}
            {activeEvent.id === 'trat_tu_do_thi' && (
              <button
                onClick={() => handleAction(true)}
                className="w-full py-2 pixel-btn pixel-btn-green text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🏠</span> NÉP HIÊN NHÀ CÔ BẢY (CỨU VIỆN)
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
