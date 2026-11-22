import { Page, expect } from '@playwright/test';
import type { GameState } from '../../src/store/useGameStore';

/**
 * Unlocks the Web Audio API context by simulating user interaction.
 */
export async function unlockAudio(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
    if ((window as any).SoundManager) {
      (window as any).SoundManager.playIceClink?.();
    }
  });
}

/**
 * Retrieves the current Zustand store state via window.useGameStore or localStorage fallback.
 */
export async function getGameState(page: Page): Promise<GameState> {
  return await page.evaluate(() => {
    if ((window as any).useGameStore) {
      return (window as any).useGameStore.getState();
    }
    const raw = localStorage.getItem('tiem-ca-phe-bat-on-save');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        return parsed.state;
      } catch (e) {
        console.error('Failed to parse localStorage save', e);
      }
    }
    return null as any;
  });
}

/**
 * Mutates Zustand store state directly for deterministic test scenarios.
 */
export async function setGameState(page: Page, partialState: Partial<GameState>): Promise<void> {
  await page.evaluate((state) => {
    if ((window as any).useGameStore) {
      (window as any).useGameStore.setState(state);
    }
  }, partialState);
}

/**
 * Resets the game state to initial default.
 */
export async function resetGameState(page: Page): Promise<void> {
  await page.evaluate(() => {
    if ((window as any).useGameStore) {
      (window as any).useGameStore.getState().resetGame();
    }
    localStorage.removeItem('tiem-ca-phe-bat-on-save');
  });
}

/**
 * Completes or bypasses the initial splash screen setup.
 */
export async function bypassSplash(
  page: Page,
  shopName: string = 'Tiệm Thử Nghiệm',
  gender: 'MALE' | 'FEMALE' = 'MALE'
): Promise<void> {
  await page.waitForLoadState('domcontentloaded');

  await page.evaluate(({ name, gen }) => {
    if ((window as any).useGameStore) {
      const store = (window as any).useGameStore.getState();
      store.setShopName(name);
      store.setOwnerGender(gen);
      store.completeSplash();
    }
  }, { name: shopName, gen: gender });

  await page.waitForTimeout(50);
}

/**
 * Starts the day shift if the game is currently in PREP phase.
 */
export async function startDayIfPrep(page: Page): Promise<void> {
  await page.evaluate(() => {
    const store = (window as any).useGameStore?.getState();
    if (store && store.dayPhase === 'PREP') {
      store.startDay();
    }
  });
  await page.waitForTimeout(50);
}

/**
 * Opens a specific tab in the bottom navigation.
 */
export async function openTab(
  page: Page,
  tab: 'menu' | 'upgrade' | 'decor' | 'shop' | 'quest'
): Promise<void> {
  await startDayIfPrep(page);
  await setGameState(page, { activeTab: tab });
  await page.waitForTimeout(100);
}

/**
 * Closes any active modal tab.
 */
export async function closeActiveTab(page: Page): Promise<void> {
  await setGameState(page, { activeTab: null });
  await page.waitForTimeout(50);
}

/**
 * Emits an event through the game EventBus.
 */
export async function emitEventBus(page: Page, eventName: string, payload?: any): Promise<void> {
  await page.evaluate(({ name, data }) => {
    if ((window as any).EventBus) {
      (window as any).EventBus.emit(name, data);
    }
  }, { name: eventName, data: payload });
}

/**
 * Verifies responsive layout integrity:
 * - On desktop viewports (>=768px), sidebars (Left Cockpit & Right Cockpit) should exist.
 * - On mobile viewports (<768px), sidebars should be hidden and mobile buttons may appear.
 */
export async function verifyResponsiveLayout(page: Page): Promise<{
  isDesktop: boolean;
  viewportWidth: number;
}> {
  const viewport = page.viewportSize();
  const width = viewport ? viewport.width : 1280;
  const isDesktop = width >= 768;

  if (isDesktop) {
    const radioSidebar = page.getByText(/ĐÀI RADIO/i);
    await expect(radioSidebar.first()).toBeVisible();
  } else {
    const radioSidebar = page.getByText(/ĐÀI RADIO/i);
    await expect(radioSidebar).toBeHidden();
  }

  return { isDesktop, viewportWidth: width };
}
