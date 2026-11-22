import { test, expect } from '@playwright/test';
import { getGameState, setGameState, bypassSplash } from '../helpers/test-utils';

test.describe('Tier 2: Invalid Actions and Rejection Boundaries', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await bypassSplash(page);
  });

  test('T2.21: unlockRecipe returns false and retains gold when balance is insufficient', async ({ page }) => {
    await setGameState(page, {
      gold: 5_000,
      unlockedRecipes: { cf_den: 1 },
    });

    // Attempt to unlock cf_sua which costs 50,000đ with only 5,000đ
    const result = await page.evaluate(() => {
      return (window as any).useGameStore.getState().unlockRecipe('cf_sua', 50_000);
    });

    expect(result).toBe(false);
    const state = await getGameState(page);
    expect(state.gold).toBe(5_000);
    expect(state.unlockedRecipes['cf_sua']).toBeUndefined();
  });

  test('T2.22: unlockRecipe returns false when recipe is already unlocked', async ({ page }) => {
    await setGameState(page, {
      gold: 200_000,
      unlockedRecipes: { cf_den: 1, cf_sua: 1 },
    });

    // Attempt to unlock cf_sua again
    const result = await page.evaluate(() => {
      return (window as any).useGameStore.getState().unlockRecipe('cf_sua', 50_000);
    });

    expect(result).toBe(false);
    const state = await getGameState(page);
    expect(state.gold).toBe(200_000); // Gold not deducted
  });

  test('T2.23: upgradeRecipe returns false when gold is less than upgrade cost', async ({ page }) => {
    await setGameState(page, {
      gold: 10_000,
      unlockedRecipes: { cf_den: 1 },
    });

    // Attempt to upgrade cf_den with 30,000đ cost
    const result = await page.evaluate(() => {
      return (window as any).useGameStore.getState().upgradeRecipe('cf_den', 30_000);
    });

    expect(result).toBe(false);
    const state = await getGameState(page);
    expect(state.gold).toBe(10_000);
    expect(state.unlockedRecipes['cf_den']).toBe(1);
  });

  test('T2.24: cleanTable on an already clean table returns 0 and does not alter store state', async ({ page }) => {
    await setGameState(page, {
      gold: 50_000,
      dirtyTables: [],
      seatStates: [
        { index: 0, status: 'EMPTY', customerId: null },
        { index: 1, status: 'EMPTY', customerId: null },
      ],
    });

    const tipEarned = await page.evaluate(() => {
      return (window as any).useGameStore.getState().cleanTable(0);
    });

    expect(tipEarned).toBe(0);
    const state = await getGameState(page);
    expect(state.gold).toBe(50_000);
    expect(state.dirtyTables).toEqual([]);
    expect(state.seatStates[0].status).toBe('EMPTY');
  });

  test('T2.25: cancelBrewing safely closes manual brewing modal without inventory deduction', async ({ page }) => {
    await setGameState(page, {
      dayPhase: 'OPEN',
      inventory: { robusta: 10, condensed_milk: 5, ice: 10 },
      activeBrewing: {
        recipeId: 'cf_sua',
        recipeName: 'Cà Phê Sữa Đá',
        customerName: 'Anh Ba',
        customerSeatIndex: 0,
        price: 15000,
      },
    });

    // Verify modal is visible
    await expect(page.getByText('TRẠM PHA CHẾ ASMR')).toBeVisible();

    // Click cancel button on the modal
    const closeBtn = page.locator('button[title="Hủy pha chế"]');
    await closeBtn.click();

    // Verify activeBrewing is null and modal disappears
    const state = await getGameState(page);
    expect(state.activeBrewing).toBeNull();
    await expect(page.getByText('TRẠM PHA CHẾ ASMR')).not.toBeVisible();
    expect(state.inventory.robusta).toBe(10);
    expect(state.inventory.condensed_milk).toBe(5);
  });
});
