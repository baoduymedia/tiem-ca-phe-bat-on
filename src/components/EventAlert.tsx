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
        <div className="absolute top-20 left-4 right-4 z-40 flex justify-center animate-bounce select-none pointer-events-none">
          <div className="bg-[#E04F4F] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-2xl border-2 border-[#FFF3D6]/40 flex items-center gap-2">
            <span>🚨</span>
            <span>{warningMsg}</span>
          </div>
        </div>
      )}

      {/* Active Event Alert & Big Button */}
      {activeEvent && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 select-none">
          <div className="bg-[#2D1B0E] border-3 border-[#FFD700] rounded-3xl p-5 text-center max-w-xs w-full shadow-2xl animate-pulse flex flex-col items-center">
            <span className="text-4xl block mb-1">
              {getEventIcon(activeEvent.id)}
            </span>
            <h2 className="text-[#FFF3D6] font-black text-base mb-1 tracking-wide">
              {activeEvent.name}
            </h2>
            <p className="text-[#FFF3D6]/85 text-[11px] mb-3 leading-relaxed">
              {activeEvent.alertText}
            </p>

            {/* Timer bar */}
            <div className="w-full bg-[#6F4E37] h-2.5 rounded-full overflow-hidden mb-4 border border-black/40">
              <div
                className="bg-[#FFD700] h-full transition-all duration-1000"
                style={{
                  width: `${(timeLeft / activeEvent.durationSec) * 100}%`,
                }}
              />
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => handleAction(false)}
              className="w-full py-3 bg-gradient-to-b from-[#E04F4F] to-[#B82E2E] hover:brightness-110 active:scale-95 text-white font-black rounded-xl text-sm shadow-xl transition-all cursor-pointer border border-white/20 mb-2"
            >
              {activeEvent.buttonLabel} ({timeLeft}s)
            </button>

            {/* Solidarity Rescue Option from Cô Bảy (if trật tự đô thị) */}
            {activeEvent.id === 'trat_tu_do_thi' && (
              <button
                onClick={() => handleAction(true)}
                className="w-full py-2 bg-gradient-to-b from-[#27AE60] to-[#1E824C] hover:brightness-110 active:scale-95 text-white font-bold rounded-xl text-xs shadow-md border border-emerald-400 flex items-center justify-center gap-1.5 cursor-pointer"
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
