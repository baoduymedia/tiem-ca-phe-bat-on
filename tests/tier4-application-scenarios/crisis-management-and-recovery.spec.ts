import { test, expect } from '@playwright/test';
import { getGameState, setGameState, bypassSplash } from '../helpers/test-utils';

test.describe('Tier 4: Crisis Management and Uncle Ba Recovery Loop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await bypassSplash(page);
  });

  test('T4.11: Emergency cash crisis (0 gold) overcome by borrowing 50,000đ from Uncle Ba', async ({ page }) => {
    await setGameState(page, {
      gold: 0,
      loanAmount: 0,
      inventory: { coffee: 0, milk: 0, ice: 0, tea: 0 },
    });

    await page.evaluate(() => {
      (window as any).useGameStore.getState().borrowFromUncleBa(50_000);
    });

    const state = await getGameState(page);
    expect(state.gold).toBe(50_000);
    expect(state.loanAmount).toBe(50_000);
  });

  test('T4.12: Borrowed funds allow purchasing emergency supplies to unblock brewing', async ({ page }) => {
    await setGameState(page, {
      gold: 50_000,
      loanAmount: 50_000,
      inventory: { coffee: 0, milk: 0, ice: 0, tea: 0 },
    });

    // Buy coffee: 10 portions for 15,000đ
    const coffeeBought = await page.evaluate(() => {
      return (window as any).useGameStore.getState().buyIngredient('coffee', 10, 15_000);
    });
    // Buy ice: 20 portions for 8,000đ
    const iceBought = await page.evaluate(() => {
      return (window as any).useGameStore.getState().buyIngredient('ice', 20, 8_000);
    });

    expect(coffeeBought).toBe(true);
    expect(iceBought).toBe(true);

    const state = await getGameState(page);
    expect(state.gold).toBe(27_000); // 50,000 - 15,000 - 8,000
    expect(state.inventory.coffee).toBe(10);
    expect(state.inventory.ice).toBe(20);
  });

  test('T4.13: Profitable drinks sales build up cash balance exceeding loan obligations', async ({ page }) => {
    await setGameState(page, {
      gold: 27_000,
      loanAmount: 50_000,
      inventory: { coffee: 10, milk: 0, ice: 20, tea: 0 },
    });

    // Sell 5 black coffees (12k price + 2k tip = 14k each)
    await page.evaluate(() => {
      const store = (window as any).useGameStore.getState();
      for (let i = 0; i < 5; i++) {
        store.consumeIngredientsForDrink('cf_den_da');
        store.recordDrinkSale(12_000, 2_000, 1);
        store.addGold(14_000);
      }
    });

    const state = await getGameState(page);
    expect(state.gold).toBe(97_000); // 27_000 + 70_000 > 50,000 debt
    expect(state.gold).toBeGreaterThan(state.loanAmount);
  });

  test('T4.14: DailySummaryModal enables "Trả Nợ Chú Ba" when cash exceeds debt', async ({ page }) => {
    await setGameState(page, {
      currentDay: 1,
      dayPhase: 'SUMMARY',
      gold: 100_000,
      loanAmount: 50_000,
      reputation: 10,
      dailyReport: {
        dayNumber: 1,
        revenue: 80_000,
        tips: 10_000,
        cupsSold: 6,
        supplyCost: 20_000,
        ingredientCost: 20_000,
        penalties: 0,
        rentCost: 0,
        netProfit: 70_000,
        perfectOrdersCount: 4,
        reputationEarned: 6,
        reviewStars: 5,
        reviewComment: '',
      },
    });

    // Check Uncle Ba repayment button is visible and active
    const repayBtn = page.getByRole('button', { name: /Trả Nợ Chú Ba/i });
    await expect(repayBtn).toBeVisible();
    await expect(repayBtn).toBeEnabled();
  });

  test('T4.15: Executing repayment in DailySummaryModal clears debt and boosts reputation (+5 ⭐)', async ({ page }) => {
    await setGameState(page, {
      currentDay: 1,
      dayPhase: 'SUMMARY',
      gold: 100_000,
      loanAmount: 50_000,
      reputation: 10,
      dailyReport: {
        dayNumber: 1,
        revenue: 80_000,
        tips: 10_000,
        cupsSold: 6,
        supplyCost: 20_000,
        ingredientCost: 20_000,
        penalties: 0,
        rentCost: 0,
        netProfit: 70_000,
        perfectOrdersCount: 4,
        reputationEarned: 6,
        reviewStars: 5,
        reviewComment: '',
      },
    });

    const repayBtn = page.getByRole('button', { name: /Trả Nợ Chú Ba/i });
    await repayBtn.click();

    // Check praise feedback
    await expect(page.getByText(/Đã hoàn trả! Chú Ba khen/i)).toBeVisible();

    const state = await getGameState(page);
    expect(state.gold).toBe(50_000);
    expect(state.loanAmount).toBe(0);
    expect(state.reputation).toBe(15); // 10 + 5
  });
});
