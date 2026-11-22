import { test, expect } from '@playwright/test';
import {
  bypassSplash,
  getGameState,
  setGameState,
  startDayIfPrep,
} from '../helpers/test-utils';

test.describe('Tier 2: Boundary & Corner - Stock Depletion Boundaries', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await bypassSplash(page);
    await startDayIfPrep(page);
  });

  test('T2.1: Exactly zero coffee stock prevents crafting any coffee recipe', async ({ page }) => {
    await setGameState(page, {
      inventory: { coffee: 0, milk: 50, ice: 50, tea: 50 },
    });

    const canBrewDenDa = await page.evaluate(() => {
      return (window as any).useGameStore.getState().hasIngredientsForDrink('cf_den_da');
    });
    const canBrewSuaDa = await page.evaluate(() => {
      return (window as any).useGameStore.getState().hasIngredientsForDrink('cf_sua_da');
    });

    expect(canBrewDenDa).toBe(false);
    expect(canBrewSuaDa).toBe(false);
  });

  test('T2.2: Consuming ingredients at zero stock returns false and does not go negative', async ({ page }) => {
    await setGameState(page, {
      inventory: { coffee: 0, milk: 0, ice: 0, tea: 0 },
    });

    const success = await page.evaluate(() => {
      return (window as any).useGameStore.getState().consumeIngredientsForDrink('cf_den_da');
    });

    expect(success).toBe(false);

    const state = await getGameState(page);
    expect(state.inventory.coffee).toBe(0);
    expect(state.inventory.ice).toBe(0);
  });

  test('T2.3: Partial ingredient sufficiency selectively allows drinks matching available stock', async ({ page }) => {
    // Has coffee (5) and ice (5), but milk is strictly 0
    await setGameState(page, {
      inventory: { coffee: 5, milk: 0, ice: 5, tea: 10 },
    });

    const canBrewDenDa = await page.evaluate(() => {
      return (window as any).useGameStore.getState().hasIngredientsForDrink('cf_den_da');
    });
    const canBrewSuaDa = await page.evaluate(() => {
      return (window as any).useGameStore.getState().hasIngredientsForDrink('cf_sua_da');
    });

    // Cà Phê Đen Đá (no milk needed) should be allowed
    expect(canBrewDenDa).toBe(true);
    // Cà Phê Sữa Đá (needs milk) should be rejected
    expect(canBrewSuaDa).toBe(false);
  });

  test('T2.4: Consuming the final single unit of stock transitions count cleanly to exactly zero', async ({ page }) => {
    await setGameState(page, {
      inventory: { coffee: 1, milk: 1, ice: 1, tea: 5 },
    });

    const success = await page.evaluate(() => {
      return (window as any).useGameStore.getState().consumeIngredientsForDrink('cf_sua_da');
    });

    expect(success).toBe(true);

    const state = await getGameState(page);
    expect(state.inventory.coffee).toBe(0);
    expect(state.inventory.milk).toBe(0);
    expect(state.inventory.ice).toBe(0);

    // Second consecutive attempt must fail
    const secondAttempt = await page.evaluate(() => {
      return (window as any).useGameStore.getState().consumeIngredientsForDrink('cf_sua_da');
    });
    expect(secondAttempt).toBe(false);
  });

  test('T2.5: Rapid repetitive consumption loop halts immediately upon hitting zero inventory', async ({ page }) => {
    await setGameState(page, {
      inventory: { coffee: 3, milk: 10, ice: 10, tea: 10 },
    });

    const results = await page.evaluate(() => {
      const store = (window as any).useGameStore.getState();
      const attempts: boolean[] = [];
      for (let i = 0; i < 6; i++) {
        attempts.push(store.consumeIngredientsForDrink('cf_den_da'));
      }
      return attempts;
    });

    // Exactly 3 succeed, remaining 3 fail
    expect(results).toEqual([true, true, true, false, false, false]);

    const state = await getGameState(page);
    expect(state.inventory.coffee).toBe(0);
  });
});
