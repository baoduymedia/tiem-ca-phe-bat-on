import { useEffect, useRef, useCallback } from 'react';
import { createPhaserGame, getGameDimensions } from './game/PhaserGame';
import { TopHUD } from './components/TopHUD';
import { BottomNav } from './components/BottomNav';
import { SplashScreen } from './components/SplashScreen';
import { MenuPanel } from './components/MenuPanel';
import { UpgradePanel } from './components/UpgradePanel';
import { EventAlert } from './components/EventAlert';
import { CustomerDialogueToast } from './components/CustomerDialogueToast';
import { DailyPrepModal } from './components/DailyPrepModal';
import { DailySummaryModal } from './components/DailySummaryModal';
import { CoffeeBrewingModal } from './components/CoffeeBrewingModal';
import { RenameShopModal } from './components/RenameShopModal';
import { PolaroidPhotoMode } from './components/PolaroidPhotoMode';
import { DailyQuestPanel } from './components/DailyQuestPanel';
import { DecorPanel } from './components/DecorPanel';
import { ShopPanel } from './components/ShopPanel';
import { StageRoadmapModal } from './components/StageRoadmapModal';
import { OfflineRewardModal } from './components/OfflineRewardModal';
import { useGameStore, formatVND } from './store/useGameStore';
import { EventBus } from './game/EventBus';
import { SoundManager } from './game/audio/SoundManager';

if (typeof window !== 'undefined') {
  (window as unknown as { EventBus: typeof EventBus; SoundManager: typeof SoundManager }).EventBus = EventBus;
  (window as unknown as { EventBus: typeof EventBus; SoundManager: typeof SoundManager }).SoundManager = SoundManager;
}

export function App() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  const hasCompletedSplash = useGameStore((s) => s.hasCompletedSplash);
  const activeTab = useGameStore((s) => s.activeTab);
  const setActiveTab = useGameStore((s) => s.setActiveTab);
  const dayPhase = useGameStore((s) => s.dayPhase);
  const currentDay = useGameStore((s) => s.currentDay);
  const inventory = useGameStore((s) => s.inventory);
  const dailyReport = useGameStore((s) => s.dailyReport);
  const dirtyTables = useGameStore((s) => s.dirtyTables);
  const activeBrewing = useGameStore((s) => s.activeBrewing);
  const cancelBrewing = useGameStore((s) => s.cancelBrewing);
  const isMuted = useGameStore((s) => s.isMuted);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const updateLastActive = useGameStore((s) => s.updateLastActive);
  const loanAmount = useGameStore((s) => s.loanAmount);
  const marketNews = useGameStore((s) => s.marketNews);
  const dailyQuests = useGameStore((s) => s.dailyQuests);
  const borrowFromUncleBa = useGameStore((s) => s.borrowFromUncleBa);
  const repayUncleBa = useGameStore((s) => s.repayUncleBa);
  const claimQuestReward = useGameStore((s) => s.claimQuestReward);
  const setRenameModalOpen = useGameStore((s) => s.setRenameModalOpen);
  const setPhotoModeOpen = useGameStore((s) => s.setPhotoModeOpen);
  const setRoadmapModalOpen = useGameStore((s) => s.setRoadmapModalOpen);
  const isWidescreenPC = useGameStore((s) => s.isWidescreenPC);
  const toggleWidescreenPC = useGameStore((s) => s.toggleWidescreenPC);

  const updateLastActiveCb = useCallback(() => {
    updateLastActive();
  }, [updateLastActive]);

  useEffect(() => {
    if (hasCompletedSplash && gameContainerRef.current && !gameRef.current) {
      gameRef.current = createPhaserGame(gameContainerRef.current);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [hasCompletedSplash]);

  // Window resize handler: keeps React and Phaser game canvas perfectly in sync
  useEffect(() => {
    const handleResize = () => {
      if (gameRef.current && gameRef.current.scale) {
        const { width, height } = getGameDimensions();
        gameRef.current.scale.resize(width, height);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Periodic offline progress sync
  useEffect(() => {
    updateLastActiveCb();
    const interval = setInterval(updateLastActiveCb, 30_000);
    return () => clearInterval(interval);
  }, [updateLastActiveCb]);

  // Initialize background Lo-Fi audio on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!isMuted) {
        SoundManager.playBGM();
      }
    };
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    return () => window.removeEventListener('pointerdown', handleFirstInteraction);
  }, [isMuted]);

  // PC Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'KeyD') {
        handleCleanTables();
      } else if (e.code === 'Space') {
        e.preventDefault();
        EventBus.emit('hotkey-space');
      } else if (e.code === 'Digit1') {
        setActiveTab(activeTab === 'menu' ? null : 'menu');
      } else if (e.code === 'Digit2') {
        setActiveTab(activeTab === 'upgrade' ? null : 'upgrade');
      } else if (e.code === 'Digit3') {
        setActiveTab(activeTab === 'decor' ? null : 'decor');
      } else if (e.code === 'Digit4') {
        setActiveTab(activeTab === 'shop' ? null : 'shop');
      } else if (e.code === 'Digit5') {
        setActiveTab(activeTab === 'quest' ? null : 'quest');
      } else if (e.code === 'KeyP') {
        setPhotoModeOpen(true);
      } else if (e.code === 'KeyW') {
        toggleWidescreenPC();
      } else if (e.code === 'KeyM') {
        toggleMute();
        SoundManager.setMuted(!isMuted);
      } else if (e.code === 'Escape') {
        if (activeBrewing) cancelBrewing();
        else setActiveTab(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, activeBrewing, setActiveTab, cancelBrewing, isMuted, toggleMute, setPhotoModeOpen]);

  const handleMuteSound = () => {
    toggleMute();
    SoundManager.setMuted(!isMuted);
  };

  const handleCleanTables = () => {
    useGameStore.getState().cleanAllDirtyTables();
    EventBus.emit('clean-all-tables');
  };

  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center bg-[#170C06] text-[#FFF8E7] select-none overflow-hidden relative font-game">
      {/* Warm Ambient Coffeehouse Vintage Encaustic Wall Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#D4A373_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0F0703]/95 via-transparent to-[#0F0703]/80" />

      {/* Decorative Vintage Coffee Vignette Shadows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-yellow-600/10 blur-3xl pointer-events-none" />

      {/* Main Dual-View Cockpit Container */}
      <div className="w-full h-full max-w-[1380px] flex items-center justify-center gap-4 lg:gap-8 p-0 md:px-6 relative z-10 md:py-4 transition-all duration-300">
        
        {/* ================= LEFT COCKPIT: VINTAGE RADIO & MARKET NEWS ================= */}
        {hasCompletedSplash && (
          <aside className="hidden md:flex flex-col gap-3 w-68 lg:w-78 shrink-0 text-xs font-pixel animate-in fade-in duration-200">
            {/* 1. Đài Radio Sài Gòn Xưa - Pixel Cassette Player Style */}
            <div className="bg-[#24140B] border-3 border-black shadow-[4px_4px_0px_#000] p-3 rounded-none">
              <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">📻</span>
                  <div>
                    <h2 className="font-bold text-sm text-[#FFD700] uppercase tracking-wide leading-none">
                      ĐÀI RADIO 99.9 MHZ
                    </h2>
                    <span className="text-xs text-amber-300/70 block leading-none">Sóng FM Sài Gòn Buổi Sớm</span>
                  </div>
                </div>
                <button
                  onClick={handleMuteSound}
                  className="px-2 py-0.5 bg-[#451A03] hover:bg-[#5A2508] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-xs font-bold text-amber-200 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer transition-transform"
                >
                  {isMuted ? '🔇 TẮT' : '🔊 BẬT'}
                </button>
              </div>

              {/* ASMR Sound Sampler Buttons */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  onClick={() => SoundManager.playHonk()}
                  className="px-2 py-1.5 bg-[#3B2211] hover:bg-[#4E2B16] text-amber-200 text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-transform"
                  title="Tiếng còi xe Cub 50cc"
                >
                  <span>🛵</span> CÒI CUB
                </button>
                <button
                  onClick={() => SoundManager.playStreetVendor()}
                  className="px-2 py-1.5 bg-[#3B2211] hover:bg-[#4E2B16] text-amber-200 text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-transform"
                  title="Tiếng loa rao hàng rong"
                >
                  <span>📢</span> TIẾNG RAO
                </button>
                <button
                  onClick={() => SoundManager.playKettleBoil()}
                  className="px-2 py-1.5 bg-[#3B2211] hover:bg-[#4E2B16] text-amber-200 text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-transform"
                  title="Ấm nước sôi bốc khói"
                >
                  <span>🫖</span> NƯỚC SÔI
                </button>
                <button
                  onClick={() => SoundManager.playIceClink()}
                  className="px-2 py-1.5 bg-[#3B2211] hover:bg-[#4E2B16] text-amber-200 text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-transform"
                  title="Xúc đá bi lách cách"
                >
                  <span>🧊</span> XÚC ĐÁ
                </button>
              </div>
            </div>

            {/* 2. Bản Tin Chợ Sài Gòn - Pixel Newspaper Clip */}
            <div className="bg-[#24140B] border-3 border-black shadow-[4px_4px_0px_#000] p-3 rounded-none">
              <div className="flex items-center justify-between border-b-2 border-black pb-1.5 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">📰</span>
                  <h2 className="font-bold text-sm text-[#FFD700] uppercase tracking-wide leading-none">
                    BẢN TIN PHỐ SÀI GÒN
                  </h2>
                </div>
                <span className="text-xs text-amber-400 font-bold">NGÀY {currentDay}</span>
              </div>
              <p className="text-xs text-amber-100 font-semibold mb-2 leading-relaxed">
                {marketNews?.headline || 'Sáng nay nắng đẹp, chợ đầu mối giao thương nhộn nhịp!'}
              </p>
              <div className="pt-1.5 border-t border-black flex items-center justify-between text-xs">
                <span className="text-amber-300/80">Biến động giá chợ:</span>
                <span className={`font-bold ${marketNews && marketNews.multiplier > 1 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {marketNews ? `${marketNews.multiplier > 1 ? '+' : ''}${Math.round((marketNews.multiplier - 1) * 100)}%` : 'Ổn định'}
                </span>
              </div>
            </div>

            {/* 3. Kho Nguyên Liệu & Phím Tắt Nhanh */}
            <div className="bg-[#24140B] border-3 border-black shadow-[4px_4px_0px_#000] p-3 rounded-none">
              <div className="flex items-center justify-between border-b-2 border-black pb-1.5 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">📦</span>
                  <h2 className="font-bold text-sm text-[#FFD700] uppercase tracking-wide leading-none">
                    KHO NGUYÊN LIỆU
                  </h2>
                </div>
                {dirtyTables.length > 0 && (
                  <button
                    onClick={handleCleanTables}
                    className="px-2 py-0.5 bg-[#DC2626] hover:bg-[#EF4444] text-white font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-transform"
                  >
                    🧹 DỌN {dirtyTables.length} BÀN [D]
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <div className="bg-[#1A0E05] p-1.5 border border-black flex items-center justify-between shadow-[1px_1px_0px_#000]">
                  <span className="text-amber-200">☕ Cà phê:</span>
                  <span className="font-bold text-[#FFD700]">{inventory.coffee}</span>
                </div>
                <div className="bg-[#1A0E05] p-1.5 border border-black flex items-center justify-between shadow-[1px_1px_0px_#000]">
                  <span className="text-amber-200">🥛 Sữa đặc:</span>
                  <span className="font-bold text-[#FFD700]">{inventory.milk}</span>
                </div>
                <div className="bg-[#1A0E05] p-1.5 border border-black flex items-center justify-between shadow-[1px_1px_0px_#000]">
                  <span className="text-amber-200">🧊 Đá bi:</span>
                  <span className="font-bold text-[#FFD700]">{inventory.ice}</span>
                </div>
                <div className="bg-[#1A0E05] p-1.5 border border-black flex items-center justify-between shadow-[1px_1px_0px_#000]">
                  <span className="text-amber-200">🍵 Trà xanh:</span>
                  <span className="font-bold text-[#FFD700]">{inventory.tea}</span>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* ================= CENTER: MAIN GAMEPLAY VIEWPORT ================= */}
        <main
          className="relative w-full bg-[#FFF8E7] overflow-hidden flex flex-col shrink-0 md:max-w-[420px] md:h-[96dvh] md:max-h-[890px] md:aspect-[9/16] md:border-4 md:border-black md:shadow-[6px_6px_0px_#000] h-full min-h-[100dvh] md:min-h-0 rounded-none border-0 shadow-none"
        >
          {/* Corner Vintage Screw Accents (Desktop only) */}
          <div className="hidden md:block absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-[#FFD700]/70 border border-amber-950 pointer-events-none z-35 shadow-sm" />
          <div className="hidden md:block absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#FFD700]/70 border border-amber-950 pointer-events-none z-35 shadow-sm" />
          <div className="hidden md:block absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-[#FFD700]/70 border border-amber-950 pointer-events-none z-35 shadow-sm" />
          <div className="hidden md:block absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-[#FFD700]/70 border border-amber-950 pointer-events-none z-35 shadow-sm" />

          {/* Splash Screen */}
          {!hasCompletedSplash && <SplashScreen />}

          {/* Main Gameplay Canvas & Modals */}
          {hasCompletedSplash && (
            <>
              {/* Phaser canvas */}
              <div ref={gameContainerRef} className="absolute inset-0 z-0" />

              {/* Overlays */}
              <TopHUD />
              <CustomerDialogueToast />
              <EventAlert />

              {/* Interactive Hands-on Coffee Bar Station */}
              {activeBrewing && <CoffeeBrewingModal />}

              {/* Bottom Nav Tab Modals */}
              {activeTab === 'menu' && <MenuPanel />}
              {activeTab === 'upgrade' && <UpgradePanel />}
              {activeTab === 'decor' && <DecorPanel />}
              {activeTab === 'shop' && <ShopPanel />}
              {activeTab === 'quest' && <DailyQuestPanel />}

              {/* Daily Shift Modals */}
              {dayPhase === 'PREP' && <DailyPrepModal />}
              {dayPhase === 'SUMMARY' && <DailySummaryModal />}

              {/* Viral & Progression Modals */}
              <RenameShopModal />
              <PolaroidPhotoMode />
              <StageRoadmapModal />
              <OfflineRewardModal />

              {/* Mobile-Exclusive Thumb Quick-Action Button (FAB) for Cleaning Tables */}
              {dirtyTables.length > 0 && (
                <button
                  onClick={handleCleanTables}
                  className="md:hidden absolute bottom-16 right-3 z-40 bg-[#DC2626] hover:bg-[#EF4444] text-white border-2 border-black shadow-[3px_3px_0px_#000] px-3 py-2 flex items-center gap-1.5 font-pixel text-xs font-bold active:translate-x-0.5 active:translate-y-0.5 pointer-events-auto animate-bounce cursor-pointer"
                  title="Chạm dọn bàn nhanh ngón cái"
                >
                  <span className="text-base">🧹</span>
                  <span>DỌN {dirtyTables.length} BÀN</span>
                </button>
              )}

              <BottomNav />
            </>
          )}
        </main>

        {/* ================= RIGHT COCKPIT: SOLIDARITY NETWORK & DAILY QUESTS ================= */}
        {hasCompletedSplash && (
          <aside className="hidden md:flex flex-col gap-3 w-68 lg:w-78 shrink-0 text-xs font-pixel animate-in fade-in duration-200">
            {/* 1. Mạng Lưới Nghĩa Tình Hàng Xóm Sài Gòn */}
            <div className="bg-[#24140B] border-3 border-black shadow-[4px_4px_0px_#000] p-3 rounded-none">
              <div className="flex items-center gap-1.5 border-b-2 border-black pb-1.5 mb-2">
                <span className="text-lg">🤝</span>
                <h2 className="font-bold text-sm text-[#FFD700] uppercase tracking-wide leading-none">
                  NGHĨA TÌNH HÀNG XÓM
                </h2>
              </div>

              {/* Chú Ba Xe Ôm - Thẻ Cứu Trợ Vốn */}
              <div className="bg-[#1A0E05] p-2 border border-black shadow-[1px_1px_0px_#000] mb-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🛵</span>
                    <span className="font-bold text-amber-200 text-xs">CHÚ BA XE ÔM</span>
                  </div>
                  <span className="text-[11px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 font-bold border border-emerald-600">
                    LÃI 0%
                  </span>
                </div>
                {loanAmount > 0 ? (
                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-black">
                    <span className="text-xs text-amber-300 font-bold">NỢ: {formatVND(loanAmount)}</span>
                    <button
                      onClick={() => repayUncleBa()}
                      className="px-2 py-0.5 bg-[#16A34A] hover:bg-[#22C55E] text-white font-bold text-xs border border-black shadow-[1px_1px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                    >
                      TRẢ NỢ (+5⭐)
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-black">
                    <span className="text-xs text-amber-200/80">Sẵn lòng cho vay</span>
                    <button
                      onClick={() => borrowFromUncleBa(50000)}
                      className="px-2 py-0.5 bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1A0E05] font-bold text-xs border border-black shadow-[1px_1px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                    >
                      VAY 50K
                    </button>
                  </div>
                )}
              </div>

              {/* Cô Bảy Tạp Hóa & Bạn Thân */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between bg-[#1A0E05] p-1.5 border border-black shadow-[1px_1px_0px_#000]">
                  <span className="flex items-center gap-1.5 font-bold text-amber-200">
                    <span>🏠</span> Cô Bảy Tạp Hóa
                  </span>
                  <span className="text-emerald-400 font-bold">Nép hiên né phạt</span>
                </div>
                <div className="flex items-center justify-between bg-[#1A0E05] p-1.5 border border-black shadow-[1px_1px_0px_#000]">
                  <span className="flex items-center gap-1.5 font-bold text-amber-200">
                    <span>🏍️</span> Bạn Thân Chạy SH
                  </span>
                  <span className="text-amber-400 font-bold">Phụ dọn cao điểm</span>
                </div>
              </div>
            </div>

            {/* 2. 3 Nhiệm Vụ Hàng Ngày (Daily Quests Mini) */}
            <div className="bg-[#24140B] border-3 border-black shadow-[4px_4px_0px_#000] p-3 rounded-none">
              <div className="flex items-center justify-between border-b-2 border-black pb-1.5 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">📜</span>
                  <h2 className="font-bold text-sm text-[#FFD700] uppercase tracking-wide leading-none">
                    NHIỆM VỤ HÔM NAY
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('quest')}
                  className="text-xs text-amber-400 font-bold hover:underline cursor-pointer"
                >
                  XEM HẾT ▶
                </button>
              </div>

              <div className="space-y-1.5">
                {dailyQuests.slice(0, 2).map((q) => (
                  <div key={q.id} className="bg-[#1A0E05] p-2 border border-black shadow-[1px_1px_0px_#000]">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-amber-100">{q.description}</span>
                      <span className="text-amber-400 font-bold">
                        {q.current}/{q.target}
                      </span>
                    </div>
                    <div className="w-full bg-[#0F0703] h-2.5 border border-black overflow-hidden mb-1">
                      <div
                        className="bg-[#F59E0B] h-full transition-all"
                        style={{ width: `${Math.min(100, (q.current / q.target) * 100)}%` }}
                      />
                    </div>
                    {q.current >= q.target && !q.claimed && (
                      <button
                        onClick={() => claimQuestReward(q.id)}
                        className="w-full py-0.5 bg-[#16A34A] hover:bg-[#22C55E] text-white font-bold text-xs uppercase border border-black shadow-[1px_1px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-transform"
                      >
                        NHẬN +{q.rewardBeans} HẠT VÀNG 🫘
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Phím Tắt Nhanh Tiện Ích */}
            <div className="flex gap-2">
              <button
                onClick={() => setPhotoModeOpen(true)}
                className="flex-1 py-1.5 bg-[#EA580C] hover:bg-[#F97316] active:translate-x-0.5 active:translate-y-0.5 border-2 border-black shadow-[2px_2px_0px_#000] font-bold text-xs text-white uppercase flex items-center justify-center gap-1 cursor-pointer transition-transform"
              >
                <span>📷</span> CHỤP POLAROID [P]
              </button>
              <button
                onClick={() => setRoadmapModalOpen(true)}
                className="flex-1 py-1.5 bg-[#451A03] hover:bg-[#5A2508] active:translate-x-0.5 active:translate-y-0.5 border-2 border-black shadow-[2px_2px_0px_#000] font-bold text-xs text-[#FFD700] uppercase flex items-center justify-center gap-1 cursor-pointer transition-transform"
              >
                <span>🗺️</span> LỘ TRÌNH 6 GĐ
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export default App;
