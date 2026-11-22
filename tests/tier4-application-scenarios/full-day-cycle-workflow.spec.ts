import { test, expect } from '@playwright/test';
import { getGameState, setGameState, bypassSplash } from '../helpers/test-utils';

test.describe('Tier 4: Full Day Cycle Workflow (06:00 to 22:00)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await bypassSplash(page);
  });

  test('T4.1: DailyPrepModal opens on PREP phase and transitions to OPEN via start button', async ({ page }) => {
    await setGameState(page, {
      currentDay: 1,
      dayPhase: 'PREP',
    });

    const startBtn = page.getByRole('button', { name: /BẮT ĐẦU MỞ QUÁN NGAY!/i });
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    const state = await getGameState(page);
    expect(state.dayPhase).toBe('OPEN');
    await expect(startBtn).not.toBeVisible();
  });

  test('T4.2: OPEN phase enables customer order brewing and tracks beverage sales', async ({ page }) => {
    await setGameState(page, {
      currentDay: 1,
      dayPhase: 'OPEN',
      gold: 50_000,
      inventory: { coffee: 5, milk: 5, ice: 5, tea: 5 },
    });

    // Simulate serving a Cà Phê Sữa Đá order
    const consumed = await page.evaluate(() => {
      const store = (window as any).useGameStore.getState();
      const ok = store.consumeIngredientsForDrink('cf_sua_da');
      if (ok) {
        store.recordDrinkSale(15_000, 2_000, 1);
        store.addGold(17_000);
      }
      return ok;
    });

    expect(consumed).toBe(true);
    const state = await getGameState(page);
    expect(state.gold).toBe(67_000);
    expect(state.dailyReport.cupsSold).toBe(1);
    expect(state.dailyReport.revenue).toBe(15_000);
    expect(state.dailyReport.tips).toBe(2_000);
  });

  test('T4.3: Dirty tables collect tips and reset seat statuses to EMPTY upon cleaning', async ({ page }) => {
    await setGameState(page, {
      dayPhase: 'OPEN',
      gold: 50_000,
      dirtyTables: [0],
      seatStates: [
        { index: 0, status: 'DIRTY', customerId: null },
        { index: 1, status: 'DIRTY', customerId: null },
      ],
    });

    const tipsEarned = await page.evaluate(() => {
      return (window as any).useGameStore.getState().cleanTable(0);
    });

    expect(tipsEarned).toBeGreaterThan(0);
    const state = await getGameState(page);
    expect(state.gold).toBe(50_000 + tipsEarned);
    expect(state.dirtyTables).toEqual([]);
    expect(state.seatStates[0].status).toBe('EMPTY');
    expect(state.seatStates[1].status).toBe('EMPTY');
  });

  test('T4.4: Day timer reaching cutoff automatically invokes SUMMARY phase', async ({ page }) => {
    await setGameState(page, {
      currentDay: 1,
      dayPhase: 'OPEN',
      dayTimeRemainingSec: 1,
    });

    await page.evaluate(() => {
      (window as any).useGameStore.getState().tickDayTimer(5);
    });

    const state = await getGameState(page);
    expect(state.dayPhase).toBe('SUMMARY');
    expect(state.dayTimeRemainingSec).toBe(0);
    await expect(page.getByText(/HÓA ĐƠN KẾT TOÁN CA BÁN/i)).toBeVisible();
  });

  test('T4.5: DailySummaryModal displays report stats and transitions to next day on button click', async ({ page }) => {
    await setGameState(page, {
      currentDay: 1,
      dayPhase: 'SUMMARY',
      gold: 150_000,
      dailyReport: {
        dayNumber: 1,
        revenue: 120_000,
        tips: 15_000,
        cupsSold: 8,
        supplyCost: 30_000,
        ingredientCost: 30_000,
        penalties: 0,
        rentCost: 0,
        netProfit: 105_000,
        perfectOrdersCount: 6,
        reputationEarned: 8,
        reviewStars: 5,
        reviewComment: 'Khách rất hài lòng với chất lượng đồ uống!',
      },
    });

    // Check modal displays summary text
    await expect(page.getByText(/HÓA ĐƠN KẾT TOÁN CA BÁN/i)).toBeVisible();
    await expect(page.getByText('120.000đ')).toBeVisible();

    // Click next day button
    const nextDayBtn = page.getByRole('button', { name: /BƯỚC SANG NGÀY 2/i });
    await expect(nextDayBtn).toBeVisible();
    await nextDayBtn.click();

    const state = await getGameState(page);
    expect(state.currentDay).toBe(2);
    expect(state.dayPhase).toBe('PREP');
    await expect(page.getByText(/HÓA ĐƠN KẾT TOÁN CA BÁN/i)).not.toBeVisible();
  });
});
