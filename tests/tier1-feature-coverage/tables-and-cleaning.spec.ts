import { test, expect } from '@playwright/test';
import {
  bypassSplash,
  getGameState,
  startDayIfPrep,
} from '../helpers/test-utils';

test.describe('Tier 1: Feature Coverage - Tables and Cleaning', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await bypassSplash(page);
    await startDayIfPrep(page);
  });

  test('T1.11: Adding dirty tables updates store and tracks table indices', async ({ page }) => {
    await page.evaluate(() => {
      const store = (window as any).useGameStore.getState();
      store.updateSeatStatus(0, 'DIRTY');
      store.updateSeatStatus(2, 'DIRTY');
    });

    const state = await getGameState(page);
    expect(state.dirtyTables).toContain(0);
    expect(state.dirtyTables).toContain(1);
    expect(state.dirtyTables.length).toBe(2);
  });

  test('T1.12: Desktop cockpit renders clean table button when tables are dirty', async ({ page }) => {
    const viewport = page.viewportSize();
    const isDesktop = (viewport?.width ?? 1280) >= 768;

    await page.evaluate(() => {
      const store = (window as any).useGameStore.getState();
      store.updateSeatStatus(0, 'DIRTY');
    });

    if (isDesktop) {
      const cleanBtn = page.getByRole('button', { name: /DỌN 1 BÀN/i });
      await expect(cleanBtn).toBeVisible();
    } else {
      const desktopCleanBtn = page.locator('aside').getByRole('button', { name: /DỌN/i });
      await expect(desktopCleanBtn).toBeHidden();
    }
  });

  test('T1.13: Mobile floating action button (FAB) appears only when tables are dirty on mobile', async ({ page }) => {
    const viewport = page.viewportSize();
    const isMobile = (viewport?.width ?? 1280) < 768;

    await page.evaluate(() => {
      const store = (window as any).useGameStore.getState();
      store.updateSeatStatus(0, 'DIRTY');
      store.updateSeatStatus(2, 'DIRTY');
    });

    if (isMobile) {
      const fabBtn = page.locator('main').getByRole('button', { name: /DỌN 2 BÀN/i });
      await expect(fabBtn).toBeVisible();
    } else {
      const fabBtn = page.locator('main').getByRole('button', { name: /DỌN 2 BÀN/i });
      await expect(fabBtn).toBeHidden();
    }
  });

  test('T1.14: Cleaning a single table removes it from list and awards tip', async ({ page }) => {
    await page.evaluate(() => {
      const store = (window as any).useGameStore.getState();
      store.updateSeatStatus(0, 'DIRTY');
      store.updateSeatStatus(2, 'DIRTY');
    });

    const tipEarned = await page.evaluate(() => {
      return (window as any).useGameStore.getState().cleanTable(0);
    });

    expect(tipEarned).toBeGreaterThan(0);

    const state = await getGameState(page);
    expect(state.dirtyTables).not.toContain(0);
    expect(state.dirtyTables).toContain(1);
  });

  test('T1.15: Cleaning all dirty tables simultaneously clears list and collects total tips', async ({ page }) => {
    await page.evaluate(() => {
      const store = (window as any).useGameStore.getState();
      store.updateSeatStatus(0, 'DIRTY');
      store.updateSeatStatus(2, 'DIRTY');
    });

    const viewport = page.viewportSize();
    const isDesktop = (viewport?.width ?? 1280) >= 768;
    const cleanBtn = isDesktop
      ? page.locator('aside').getByRole('button', { name: /DỌN/i })
      : page.locator('main').getByRole('button', { name: /DỌN/i });

    await expect(cleanBtn).toBeVisible();
    await cleanBtn.click({ force: true });

    const state = await getGameState(page);
    expect(state.dirtyTables.length).toBe(0);

    // Verify UI updates: clean button should disappear
    await expect(cleanBtn).toBeHidden();
  });
});
