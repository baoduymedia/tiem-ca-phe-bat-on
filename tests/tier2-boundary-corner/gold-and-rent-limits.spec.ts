import { test, expect } from '@playwright/test';
import {
  bypassSplash,
  getGameState,
  setGameState,
  startDayIfPrep,
} from '../helpers/test-utils';

test.describe('Tier 2: Boundary & Corner - Gold and Rent Limits', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await bypassSplash(page);
    await startDayIfPrep(page);
  });

  test('T2.6: spendGold rejects expenditure when amount strictly exceeds current balance', async ({ page }) => {
    await setGameState(page, { gold: 10000 });

    const spendSuccess = await page.evaluate(() => {
      return (window as any).useGameStore.getState().spendGold(15000);
    });

    expect(spendSuccess).toBe(false);

    const state = await getGameState(page);
    expect(state.gold).toBe(10000); // Balance unaffected
  });

  test('T2.7: Uncle Ba 0% interest loan allows borrowing 50k and records debt correctly', async ({ page }) => {
    await setGameState(page, { gold: 5000, loanAmount: 0 });

    // Borrow 50k
    await page.evaluate(() => {
      (window as any).useGameStore.getState().borrowFromUncleBa(50000);
    });

    const state = await getGameState(page);
    expect(state.gold).toBe(55000);
    expect(state.loanAmount).toBe(50000);
  });

  test('T2.8: Repaying Uncle Ba loan requires sufficient gold and awards reputation on payoff', async ({ page }) => {
    // Insufficient gold to repay
    await setGameState(page, { gold: 20000, loanAmount: 50000, reputation: 5 });

    const failedRepay = await page.evaluate(() => {
      return (window as any).useGameStore.getState().repayUncleBa();
    });
    expect(failedRepay).toBe(false);

    let state = await getGameState(page);
    expect(state.loanAmount).toBe(50000);
    expect(state.gold).toBe(20000);

    // Sufficient gold to repay
    await setGameState(page, { gold: 70000, loanAmount: 50000, reputation: 5 });

    const successRepay = await page.evaluate(() => {
      return (window as any).useGameStore.getState().repayUncleBa();
    });
    expect(successRepay).toBe(true);

    state = await getGameState(page);
    expect(state.loanAmount).toBe(0);
    expect(state.gold).toBe(20000);
    expect(state.reputation).toBeGreaterThanOrEqual(10); // +5 rep bonus
  });

  test('T2.9: Large gold amounts format with M/B compact units without precision loss', async ({ page }) => {
    await setGameState(page, { gold: 150000000 });
    await expect(page.getByText('150M').first()).toBeVisible();

    await setGameState(page, { gold: 500000 });
    await expect(page.getByText('500.000đ').first()).toBeVisible();
  });

  test('T2.10: Daily ledger correctly computes negative net profit when expenses exceed sales', async ({ page }) => {
    await setGameState(page, {
      dayPhase: 'SUMMARY',
      dailyReport: {
        revenue: 15000,
        tips: 0,
        ingredientCost: 35000,
        cupsSold: 1,
        reputationEarned: 1,
      },
    });

    // Net profit = 15.000đ - 35.000đ = -20.000đ
    await expect(page.getByText('-20.000đ')).toBeVisible();
  });
});
