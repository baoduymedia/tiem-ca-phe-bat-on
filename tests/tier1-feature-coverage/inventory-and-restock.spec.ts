import { test, expect } from '@playwright/test';
import {
  bypassSplash,
  getGameState,
  setGameState,
  startDayIfPrep,
} from '../helpers/test-utils';

test.describe('Tier 1: Feature Coverage - Inventory and Restock', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await bypassSplash(page);
  });

  test('T1.16: Initial inventory quantities are accurately tracked and displayed', async ({ page }) => {
    const state = await getGameState(page);
    expect(state.inventory.coffee).toBeGreaterThanOrEqual(0);
    expect(state.inventory.milk).toBeGreaterThanOrEqual(0);
    expect(state.inventory.ice).toBeGreaterThanOrEqual(0);
    expect(state.inventory.tea).toBeGreaterThanOrEqual(0);

    // Verify indicators in TopHUD or Cockpit
    await expect(page.getByText(new RegExp(`☕ ${state.inventory.coffee}`)).first()).toBeVisible();
    await expect(page.getByText(new RegExp(`🥛 ${state.inventory.milk}`)).first()).toBeVisible();
  });

  test('T1.17: Purchasing ingredients in Prep phase increases stock and deducts gold', async ({ page }) => {
    // Reset to PREP phase with known balance
    await setGameState(page, {
      dayPhase: 'PREP',
      gold: 50000,
      inventory: { coffee: 10, milk: 10, ice: 10, tea: 10 },
      marketNews: { headline: 'Bình ổn giá', type: 'all', multiplier: 1.0 },
    });

    // In Prep modal, click to buy coffee (+10 coffee for 15.000đ)
    const buyCoffeeBtn = page.getByRole('button', { name: /15\.000đ/i }).first();
    await expect(buyCoffeeBtn).toBeVisible();
    await buyCoffeeBtn.click();

    const updated = await getGameState(page);
    expect(updated.inventory.coffee).toBe(20);
    expect(updated.gold).toBe(35000);
  });

  test('T1.18: Market news price multipliers adjust purchase costs dynamically', async ({ page }) => {
    // Test with market price inflation (+35% for milk)
    await setGameState(page, {
      dayPhase: 'PREP',
      gold: 50000,
      inventory: { coffee: 10, milk: 10, ice: 10, tea: 10 },
      marketNews: { headline: 'Bão giá sữa Ông Thọ', type: 'milk', multiplier: 1.35 },
    });

    // Base cost for milk pack is 18.000đ * 1.35 = 24.300đ -> rounded to 24.300đ
    const expectedCost = Math.round(18000 * 1.35);
    const buyMilkBtn = page.getByRole('button', { name: new RegExp(`${expectedCost.toLocaleString('vi-VN')}đ|24\\.300đ`) });
    await expect(buyMilkBtn).toBeVisible();
  });

  test('T1.19: hasIngredientsForDrink returns true when stocked, false when depleted', async ({ page }) => {
    // Set inventory with 0 coffee
    await setGameState(page, {
      inventory: { coffee: 0, milk: 10, ice: 10, tea: 10 },
    });

    const canBrewDenDa = await page.evaluate(() => {
      return (window as any).useGameStore.getState().hasIngredientsForDrink('cf_den_da');
    });
    expect(canBrewDenDa).toBe(false);

    // Replenish coffee
    await setGameState(page, {
      inventory: { coffee: 5, milk: 10, ice: 10, tea: 10 },
    });

    const canBrewNow = await page.evaluate(() => {
      return (window as any).useGameStore.getState().hasIngredientsForDrink('cf_den_da');
    });
    expect(canBrewNow).toBe(true);
  });

  test('T1.20: consumeIngredientsForDrink deducts required portions correctly', async ({ page }) => {
    await setGameState(page, {
      inventory: { coffee: 10, milk: 10, ice: 10, tea: 10 },
    });

    // cf_sua_da requires coffee (1), milk (1), ice (1)
    const success = await page.evaluate(() => {
      return (window as any).useGameStore.getState().consumeIngredientsForDrink('cf_sua_da');
    });
    expect(success).toBe(true);

    const updated = await getGameState(page);
    expect(updated.inventory.coffee).toBe(9);
    expect(updated.inventory.milk).toBe(9);
    expect(updated.inventory.ice).toBe(9);
    expect(updated.inventory.tea).toBe(10);
  });
});
