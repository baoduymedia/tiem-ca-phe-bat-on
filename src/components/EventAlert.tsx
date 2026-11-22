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
          <div className="bg-[#B91C1C] text-white text-xs font-bold px-3.5 py-2 rounded-2xl shadow-lg border-2 border-[#7F1D1D] flex items-center gap-2">
            <span className="text-base">🚨</span>
            <span className="tracking-wide uppercase font-bold">{warningMsg}</span>
          </div>
        </div>
      )}

      {/* Active Event Alert & Big Button */}
      {activeEvent && (
        <div className="absolute inset-0 z-50 cozy-modal-backdrop flex items-center justify-center p-3 select-none font-sans animate-in zoom-in-95 duration-150">
          <div className="cozy-card p-5 text-center max-w-[340px] w-full flex flex-col items-center animate-in zoom-in-95 duration-150 text-[#5D4037]">
            <span className="text-4xl block mb-2 filter drop-shadow">
              {getEventIcon(activeEvent.id)}
            </span>
            <h2 className="text-[#3E2415] font-black text-base mb-1 tracking-wide uppercase">
              {activeEvent.name}
            </h2>
            <p className="text-[#5D4037]/90 text-xs mb-3 leading-relaxed font-semibold">
              {activeEvent.alertText}
            </p>

            {/* Timer bar */}
            <div className="w-full bg-[#EAE0D3] h-3 rounded-full border border-[#D8C7B5] mb-3.5 overflow-hidden">
              <div
                className="bg-[#E08738] h-full transition-all duration-1000 rounded-full"
                style={{
                  width: `${(timeLeft / activeEvent.durationSec) * 100}%`,
                }}
              />
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => handleAction(false)}
              className="w-full py-2.5 cozy-btn-orange text-xs font-black uppercase tracking-wider mb-2 rounded-2xl cursor-pointer"
            >
              {activeEvent.buttonLabel} ({timeLeft}S)
            </button>

            {/* Solidarity Rescue Option from Cô Bảy (if trật tự đô thị) */}
            {activeEvent.id === 'trat_tu_do_thi' && (
              <button
                onClick={() => handleAction(true)}
                className="w-full py-2 cozy-btn-green text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 rounded-2xl cursor-pointer"
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
