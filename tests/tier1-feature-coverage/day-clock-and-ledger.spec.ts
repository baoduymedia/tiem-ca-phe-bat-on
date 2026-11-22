import { test, expect } from '@playwright/test';
import {
  bypassSplash,
  getGameState,
  setGameState,
  startDayIfPrep,
} from '../helpers/test-utils';

test.describe('Tier 1: Feature Coverage - Day Clock and Ledger', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await bypassSplash(page);
  });

  test('T1.21: Day cycle phases transition correctly between PREP, OPEN, and SUMMARY', async ({ page }) => {
    // 1. Initial phase is PREP
    await setGameState(page, { dayPhase: 'PREP' });
    let state = await getGameState(page);
    expect(state.dayPhase).toBe('PREP');
    await expect(page.getByText(/GIAI ĐOẠN CHUẨN BỊ/i)).toBeVisible();

    // 2. Start day -> OPEN
    await startDayIfPrep(page);
    state = await getGameState(page);
    expect(state.dayPhase).toBe('OPEN');

    // 3. End day -> SUMMARY
    await page.evaluate(() => (window as any).useGameStore.getState().endDay());
    state = await getGameState(page);
    expect(state.dayPhase).toBe('SUMMARY');
    await expect(page.getByText(/HÓA ĐƠN KẾT TOÁN CA BÁN/i)).toBeVisible();
  });

  test('T1.22: DailyPrepModal renders weather forecast and launches shift', async ({ page }) => {
    await setGameState(page, {
      dayPhase: 'PREP',
      weatherForecast: {
        type: 'sunny',
        title: '☀️ Nắng Ráo Sài Gòn',
        desc: 'Thời tiết ấm áp, khách chuộng gọi Cà Phê Sữa Đá.',
      },
    });

    await expect(page.getByText(/Nắng Ráo Sài Gòn/i)).toBeVisible();
    await expect(page.getByText(/Thời tiết ấm áp/i)).toBeVisible();

    const startBtn = page.getByRole('button', { name: /BẮT ĐẦU MỞ QUÁN NGAY/i });
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    const state = await getGameState(page);
    expect(state.dayPhase).toBe('OPEN');
  });

  test('T1.23: Day timer counts down during OPEN phase', async ({ page }) => {
    await startDayIfPrep(page);
    await setGameState(page, { dayPhase: 'OPEN', dayTimeRemainingSec: 75 });

    // Tick timer forward by 10s
    await page.evaluate(() => {
      (window as any).useGameStore.getState().tickDayTimer(10);
    });

    const state = await getGameState(page);
    expect(state.dayTimeRemainingSec).toBeCloseTo(65, 0);
    expect(state.dayPhase).toBe('OPEN');
  });

  test('T1.24: Timer expiring at 0 seconds triggers SUMMARY ledger phase', async ({ page }) => {
    await startDayIfPrep(page);
    await setGameState(page, { dayPhase: 'OPEN', dayTimeRemainingSec: 2 });

    // Tick remaining seconds
    const dayEnded = await page.evaluate(() => {
      return (window as any).useGameStore.getState().tickDayTimer(5);
    });

    expect(dayEnded).toBe(true);

    const state = await getGameState(page);
    expect(state.dayTimeRemainingSec).toBe(0);
    expect(state.dayPhase).toBe('SUMMARY');

    // Summary modal receipt header is visible
    await expect(page.getByText(/Tổng Kết Ngày/i)).toBeVisible();
  });

  test('T1.25: Daily summary calculates net profit and next day button advances day', async ({ page }) => {
    await setGameState(page, {
      currentDay: 1,
      dayPhase: 'SUMMARY',
      dailyReport: {
        revenue: 80000,
        tips: 12000,
        ingredientCost: 20000,
        cupsSold: 6,
        reputationEarned: 5,
      },
    });

    // Net profit = 80000 + 12000 - 20000 = +72.000đ
    await expect(page.getByText(/\+72\.000đ/)).toBeVisible();
    await expect(page.getByText(/6 ly/)).toBeVisible();

    // Click next day button
    const nextDayBtn = page.getByRole('button', { name: /BƯỚC SANG NGÀY 2/i });
    await expect(nextDayBtn).toBeVisible();
    await nextDayBtn.click();

    const state = await getGameState(page);
    expect(state.currentDay).toBe(2);
    expect(state.dayPhase).toBe('PREP');
  });
});
