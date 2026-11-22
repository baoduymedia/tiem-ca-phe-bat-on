import { useEffect, useRef, useCallback } from 'react';
import { createPhaserGame, getGameDimensions } from './game/PhaserGame';
import { TopHUD } from './components/TopHUD';
import { SubHudBar } from './components/SubHudBar';
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
import { VietnamMapModal } from './components/VietnamMapModal';
import { ProvincialLeagueModal } from './components/ProvincialLeagueModal';
import { StaffPanel } from './components/StaffPanel';
import { RndAndRoasteryModal } from './components/RndAndRoasteryModal';
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
  const isVietnamMapOpen = useGameStore((s) => s.isVietnamMapOpen);
  const setVietnamMapOpen = useGameStore((s) => s.setVietnamMapOpen);
  const isProvincialLeagueOpen = useGameStore((s) => s.isProvincialLeagueOpen);
  const setProvincialLeagueOpen = useGameStore((s) => s.setProvincialLeagueOpen);
  const isStaffPanelOpen = useGameStore((s) => s.isStaffPanelOpen);
  const setStaffPanelOpen = useGameStore((s) => s.setStaffPanelOpen);
  const isRndModalOpen = useGameStore((s) => s.isRndModalOpen);
  const setRndModalOpen = useGameStore((s) => s.setRndModalOpen);
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
          <aside className="hidden md:flex flex-col gap-3 w-68 lg:w-76 shrink-0 text-xs font-sans animate-in fade-in duration-200">
            {/* 1. Đài Radio Sài Gòn Xưa - Cozy Tape Style */}
            <div className="bg-[#FFF8ED] border-2 border-[#4A3222] shadow-[0_4px_0_#4A3222] p-3 rounded-2xl text-[#4A3222]">
              <div className="flex items-center justify-between border-b border-[#D8C7B5] pb-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">📻</span>
                  <div>
                    <h2 className="font-serif font-black text-sm text-[#4A3222] uppercase tracking-wide leading-none">
                      ĐÀI RADIO 99.9 MHZ
                    </h2>
                    <span className="text-[10px] text-[#8C6E54] block leading-none font-semibold">Sóng FM Sài Gòn Buổi Sớm</span>
                  </div>
                </div>
                <button
                  onClick={handleMuteSound}
                  className="px-2 py-0.5 bg-[#FAF0E1] hover:bg-[#F2ECE1] active:translate-y-0.5 text-xs font-bold text-[#4A3222] border border-[#4A3222] rounded-lg shadow-2xs cursor-pointer transition-transform"
                >
                  {isMuted ? '🔇 TẮT' : '🔊 BẬT'}
                </button>
              </div>

              {/* ASMR Sound Sampler Buttons */}
              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <button
                  onClick={() => SoundManager.playHonk()}
                  className="px-2 py-1.5 bg-[#FAF0E1] hover:bg-[#F2ECE1] text-[#4A3222] text-xs font-bold border border-[#D8C7B5] rounded-xl flex items-center justify-center gap-1 cursor-pointer active:translate-y-0.5 shadow-2xs transition-transform"
                  title="Tiếng còi xe Cub 50cc"
                >
                  <span>🛵</span> CÒI CUB
                </button>
                <button
                  onClick={() => SoundManager.playStreetVendor()}
                  className="px-2 py-1.5 bg-[#FAF0E1] hover:bg-[#F2ECE1] text-[#4A3222] text-xs font-bold border border-[#D8C7B5] rounded-xl flex items-center justify-center gap-1 cursor-pointer active:translate-y-0.5 shadow-2xs transition-transform"
                  title="Tiếng loa rao hàng rong"
                >
                  <span>📢</span> TIẾNG RAO
                </button>
                <button
                  onClick={() => SoundManager.playKettleBoil()}
                  className="px-2 py-1.5 bg-[#FAF0E1] hover:bg-[#F2ECE1] text-[#4A3222] text-xs font-bold border border-[#D8C7B5] rounded-xl flex items-center justify-center gap-1 cursor-pointer active:translate-y-0.5 shadow-2xs transition-transform"
                  title="Ấm nước sôi bốc khói"
                >
                  <span>🫖</span> NƯỚC SÔI
                </button>
                <button
                  onClick={() => SoundManager.playIceClink()}
                  className="px-2 py-1.5 bg-[#FAF0E1] hover:bg-[#F2ECE1] text-[#4A3222] text-xs font-bold border border-[#D8C7B5] rounded-xl flex items-center justify-center gap-1 cursor-pointer active:translate-y-0.5 shadow-2xs transition-transform"
                  title="Xúc đá bi lách cách"
                >
                  <span>🧊</span> XÚC ĐÁ
                </button>
              </div>
            </div>

            {/* 2. Bản Tin Chợ Sài Gòn - Vintage Newspaper Style */}
            <div className="bg-[#FFF8ED] border-2 border-[#4A3222] shadow-[0_4px_0_#4A3222] p-3 rounded-2xl text-[#4A3222]">
              <div className="flex items-center justify-between border-b border-[#D8C7B5] pb-1.5 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">📰</span>
                  <h2 className="font-serif font-black text-sm text-[#4A3222] uppercase tracking-wide leading-none">
                    BẢN TIN PHỐ SÀI GÒN
                  </h2>
                </div>
                <span className="text-xs text-[#E08738] font-bold">NGÀY {currentDay}</span>
              </div>
              <p className="text-xs text-[#5D4037] font-semibold mb-2 leading-relaxed bg-[#FAF0E1] p-2 rounded-xl border border-[#DECBB9]">
                {marketNews?.headline || 'Sáng nay nắng đẹp, chợ đầu mối giao thương nhộn nhịp!'}
              </p>
              <div className="pt-1.5 border-t border-[#D8C7B5] flex items-center justify-between text-xs">
                <span className="text-[#8C6E54] font-semibold">Biến động giá chợ:</span>
                <span className={`font-black ${marketNews && marketNews.multiplier > 1 ? 'text-red-600' : 'text-emerald-700'}`}>
                  {marketNews ? `${marketNews.multiplier > 1 ? '+' : ''}${Math.round((marketNews.multiplier - 1) * 100)}%` : 'Ổn định'}
                </span>
              </div>
            </div>

            {/* 3. Kho Nguyên Liệu & Phím Tắt Nhanh */}
            <div className="bg-[#FFF8ED] border-2 border-[#4A3222] shadow-[0_4px_0_#4A3222] p-3 rounded-2xl text-[#4A3222]">
              <div className="flex items-center justify-between border-b border-[#D8C7B5] pb-1.5 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">📦</span>
                  <h2 className="font-serif font-black text-sm text-[#4A3222] uppercase tracking-wide leading-none">
                    KHO NGUYÊN LIỆU
                  </h2>
                </div>
                {dirtyTables.length > 0 && (
                  <button
                    onClick={handleCleanTables}
                    className="px-2 py-0.5 bg-[#E04F4F] hover:bg-[#C93B3B] text-white font-bold text-xs border border-[#4A3222] rounded-lg shadow-2xs cursor-pointer active:translate-y-0.5 transition-transform"
                  >
                    🧹 DỌN {dirtyTables.length} BÀN [D]
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <div className="bg-[#FAF0E1] p-1.5 border border-[#D8C7B5] rounded-xl flex items-center justify-between">
                  <span className="text-[#8C6E54] font-semibold">☕ Cà phê:</span>
                  <span className="font-black text-[#4A3222]">{inventory.coffee}</span>
                </div>
                <div className="bg-[#FAF0E1] p-1.5 border border-[#D8C7B5] rounded-xl flex items-center justify-between">
                  <span className="text-[#8C6E54] font-semibold">🥛 Sữa đặc:</span>
                  <span className="font-black text-[#4A3222]">{inventory.milk}</span>
                </div>
                <div className="bg-[#FAF0E1] p-1.5 border border-[#D8C7B5] rounded-xl flex items-center justify-between">
                  <span className="text-[#8C6E54] font-semibold">🧊 Đá bi:</span>
                  <span className="font-black text-[#4A3222]">{inventory.ice}</span>
                </div>
                <div className="bg-[#FAF0E1] p-1.5 border border-[#D8C7B5] rounded-xl flex items-center justify-between">
                  <span className="text-[#8C6E54] font-semibold">🍵 Trà xanh:</span>
                  <span className="font-black text-[#4A3222]">{inventory.tea}</span>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* ================= CENTER: MAIN GAMEPLAY VIEWPORT ================= */}
        <main
          className="relative w-full bg-[#FFF8E7] overflow-hidden flex flex-col shrink-0 md:max-w-[420px] md:h-[96dvh] md:max-h-[890px] md:aspect-[9/16] md:border-3 md:border-[#4A3222] md:shadow-[0_8px_0_#4A3222] md:rounded-3xl h-full min-h-[100dvh] md:min-h-0 rounded-none border-0 shadow-none"
        >

          {/* Splash Screen */}
          {!hasCompletedSplash && <SplashScreen />}

          {/* Main Gameplay Canvas & Modals */}
          {hasCompletedSplash && (
            <>
              {/* Phaser canvas */}
              <div ref={gameContainerRef} className="absolute inset-0 z-0" />

              {/* Overlays */}
              <TopHUD />
              <SubHudBar />
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
              {isVietnamMapOpen && <VietnamMapModal onClose={() => setVietnamMapOpen(false)} />}
              {isProvincialLeagueOpen && (
                <ProvincialLeagueModal onClose={() => setProvincialLeagueOpen(false)} />
              )}
              {isStaffPanelOpen && <StaffPanel onClose={() => setStaffPanelOpen(false)} />}
              {isRndModalOpen && <RndAndRoasteryModal onClose={() => setRndModalOpen(false)} />}

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
          <aside className="hidden md:flex flex-col gap-3 w-68 lg:w-76 shrink-0 text-xs font-sans animate-in fade-in duration-200">
            {/* 1. Mạng Lưới Nghĩa Tình Hàng Xóm Sài Gòn */}
            <div className="bg-[#FFF8ED] border-2 border-[#4A3222] shadow-[0_4px_0_#4A3222] p-3 rounded-2xl text-[#4A3222]">
              <div className="flex items-center gap-1.5 border-b border-[#D8C7B5] pb-1.5 mb-2">
                <span className="text-lg">🤝</span>
                <h2 className="font-serif font-black text-sm text-[#4A3222] uppercase tracking-wide leading-none">
                  NGHĨA TÌNH HÀNG XÓM
                </h2>
              </div>

              {/* Chú Ba Xe Ôm - Thẻ Cứu Trợ Vốn */}
              <div className="bg-[#FAF0E1] p-2 border border-[#D8C7B5] rounded-xl shadow-2xs mb-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🛵</span>
                    <span className="font-bold text-[#4A3222] text-xs">CHÚ BA XE ÔM</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 font-bold rounded border border-emerald-300">
                    LÃI 0%
                  </span>
                </div>
                {loanAmount > 0 ? (
                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#DECBB9]">
                    <span className="text-xs text-[#B45309] font-black">NỢ: {formatVND(loanAmount)}</span>
                    <button
                      onClick={() => repayUncleBa()}
                      className="px-2 py-0.5 bg-[#5C9E54] hover:bg-[#4E8B46] text-white font-bold text-xs border border-[#4A3222] rounded-lg shadow-2xs cursor-pointer active:translate-y-0.5"
                    >
                      TRẢ NỢ (+5⭐)
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#DECBB9]">
                    <span className="text-xs text-[#8C6E54] font-semibold">Sẵn lòng cho vay</span>
                    <button
                      onClick={() => borrowFromUncleBa(50000)}
                      className="px-2 py-0.5 bg-[#F59E0B] hover:bg-[#FBBF24] text-[#4A3222] font-black text-xs border border-[#4A3222] rounded-lg shadow-2xs cursor-pointer active:translate-y-0.5"
                    >
                      VAY 50K
                    </button>
                  </div>
                )}
              </div>

              {/* Cô Bảy Tạp Hóa & Bạn Thân */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between bg-[#FAF0E1] p-1.5 border border-[#D8C7B5] rounded-xl shadow-2xs">
                  <span className="flex items-center gap-1.5 font-bold text-[#4A3222]">
                    <span>🏠</span> Cô Bảy Tạp Hóa
                  </span>
                  <span className="text-emerald-700 font-bold">Nép hiên né phạt</span>
                </div>
                <div className="flex items-center justify-between bg-[#FAF0E1] p-1.5 border border-[#D8C7B5] rounded-xl shadow-2xs">
                  <span className="flex items-center gap-1.5 font-bold text-[#4A3222]">
                    <span>🏍️</span> Bạn Thân Chạy SH
                  </span>
                  <span className="text-amber-700 font-bold">Phụ dọn cao điểm</span>
                </div>
              </div>
            </div>

            {/* 2. 3 Nhiệm Vụ Hàng Ngày (Daily Quests Mini) */}
            <div className="bg-[#FFF8ED] border-2 border-[#4A3222] shadow-[0_4px_0_#4A3222] p-3 rounded-2xl text-[#4A3222]">
              <div className="flex items-center justify-between border-b border-[#D8C7B5] pb-1.5 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">📜</span>
                  <h2 className="font-serif font-black text-sm text-[#4A3222] uppercase tracking-wide leading-none">
                    NHIỆM VỤ HÔM NAY
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('quest')}
                  className="text-xs text-[#E08738] font-bold hover:underline cursor-pointer"
                >
                  XEM HẾT ▶
                </button>
              </div>

              <div className="space-y-1.5">
                {dailyQuests.slice(0, 2).map((q) => (
                  <div key={q.id} className="bg-[#FAF0E1] p-2 border border-[#D8C7B5] rounded-xl shadow-2xs">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-[#4A3222]">{q.description}</span>
                      <span className="text-[#B45309] font-black">
                        {q.current}/{q.target}
                      </span>
                    </div>
                    <div className="w-full bg-[#EAE0D3] h-2.5 rounded-full overflow-hidden mb-1 border border-[#D8C7B5]">
                      <div
                        className="bg-[#F59E0B] h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, (q.current / q.target) * 100)}%` }}
                      />
                    </div>
                    {q.current >= q.target && !q.claimed && (
                      <button
                        onClick={() => claimQuestReward(q.id)}
                        className="w-full py-1 bg-[#5C9E54] hover:bg-[#4E8B46] text-white font-black text-xs uppercase rounded-lg border border-[#4A3222] shadow-2xs cursor-pointer active:translate-y-0.5 transition-transform"
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
                className="flex-1 py-2 bg-[#FAF0E1] hover:bg-[#F2ECE1] border-2 border-[#4A3222] shadow-[0_2px_0_#4A3222] rounded-xl font-bold text-xs text-[#4A3222] uppercase flex items-center justify-center gap-1 cursor-pointer active:translate-y-0.5 transition-transform"
              >
                <span>📷</span> POLAROID [P]
              </button>
              <button
                onClick={() => setRoadmapModalOpen(true)}
                className="flex-1 py-2 bg-[#E08738] hover:bg-[#ED9445] border-2 border-[#4A3222] shadow-[0_2px_0_#4A3222] rounded-xl font-bold text-xs text-white uppercase flex items-center justify-center gap-1 cursor-pointer active:translate-y-0.5 transition-transform"
              >
                <span>🗺️</span> 6 GIAI ĐOẠN
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export default App;
