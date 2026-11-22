import { test, expect } from '@playwright/test';
import { getGameState, setGameState, bypassSplash } from '../helpers/test-utils';

test.describe('Tier 3: Day Transition During Action and Financial Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await bypassSplash(page);
  });

  test('T3.6: Shift timer reaching 0 triggers automatic transition to SUMMARY phase', async ({ page }) => {
    await setGameState(page, {
      dayPhase: 'OPEN',
      dayTimeRemainingSec: 1,
    });

    const shiftEnded = await page.evaluate(() => {
      return (window as any).useGameStore.getState().tickDayTimer(2);
    });
    expect(shiftEnded).toBe(true);

    const state = await getGameState(page);
    expect(state.dayTimeRemainingSec).toBe(0);
    expect(state.dayPhase).toBe('SUMMARY');
    expect(state.timeOfDay).toBe('EVENING');
  });

  test('T3.7: Outstanding Uncle Ba loan persists across nextDay transition without interest penalty', async ({ page }) => {
    await setGameState(page, {
      gold: 20_000,
      loanAmount: 0,
      currentDay: 1,
      dayPhase: 'SUMMARY',
    });

    // Borrow 50,000đ from Uncle Ba
    await page.evaluate(() => {
      (window as any).useGameStore.getState().borrowFromUncleBa(50_000);
    });

    let state = await getGameState(page);
    expect(state.gold).toBe(70_000);
    expect(state.loanAmount).toBe(50_000);

    // Transition to Day 2
    await page.evaluate(() => {
      (window as any).useGameStore.getState().nextDay();
    });

    state = await getGameState(page);
    expect(state.currentDay).toBe(2);
    expect(state.dayPhase).toBe('PREP');
    expect(state.loanAmount).toBe(50_000); // 0% interest, loan persists exact 50k
  });

  test('T3.8: Repaying Uncle Ba loan deducts principal, clears debt, and boosts reputation (+5)', async ({ page }) => {
    await setGameState(page, {
      gold: 100_000,
      loanAmount: 50_000,
      reputation: 15,
    });

    const repaid = await page.evaluate(() => {
      return (window as any).useGameStore.getState().repayUncleBa();
    });
    expect(repaid).toBe(true);

    const state = await getGameState(page);
    expect(state.gold).toBe(50_000);
    expect(state.loanAmount).toBe(0);
    expect(state.reputation).toBe(20); // +5 stars
  });

  test('T3.9: nextDay transition increments day and resets daily quests while keeping total gold', async ({ page }) => {
    await setGameState(page, {
      currentDay: 3,
      dayPhase: 'SUMMARY',
      gold: 350_000,
    });

    await page.evaluate(() => {
      (window as any).useGameStore.getState().nextDay();
    });

    const state = await getGameState(page);
    expect(state.currentDay).toBe(4);
    expect(state.dayPhase).toBe('PREP');
    expect(state.gold).toBe(350_000);
    expect(state.dailyQuests.length).toBeGreaterThanOrEqual(3);
    expect(state.dailyQuests[0].id).toBe('quest_brew_4');
  });

  test('T3.10: Day start resets dailyReport figures for new shift', async ({ page }) => {
    await setGameState(page, {
      currentDay: 2,
      dayPhase: 'PREP',
      dailyReport: {
        dayNumber: 1,
        revenue: 250_000,
        tips: 30_000,
        cupsSold: 15,
        supplyCost: 50_000,
        ingredientCost: 50_000,
        penalties: 0,
        rentCost: 20_000,
        netProfit: 210_000,
        perfectOrdersCount: 12,
        reputationEarned: 10,
        reviewStars: 5,
        reviewComment: 'Tuyệt vời',
      },
    });

    await page.evaluate(() => {
      (window as any).useGameStore.getState().startDay();
    });

    const state = await getGameState(page);
    expect(state.dayPhase).toBe('OPEN');
    expect(state.dailyReport.dayNumber).toBe(2);
    expect(state.dailyReport.revenue).toBe(0);
    expect(state.dailyReport.cupsSold).toBe(0);
    expect(state.dailyReport.tips).toBe(0);
  });
});
