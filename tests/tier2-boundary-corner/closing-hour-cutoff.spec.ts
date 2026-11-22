import { test, expect } from '@playwright/test';
import {
  bypassSplash,
  getGameState,
  setGameState,
  startDayIfPrep,
} from '../helpers/test-utils';

test.describe('Tier 2: Boundary & Corner - Closing Hour Cutoff', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await bypassSplash(page);
  });

  test('T2.11: tickDayTimer is inactive during PREP and SUMMARY phases', async ({ page }) => {
    // 1. In PREP phase
    await setGameState(page, { dayPhase: 'PREP', dayTimeRemainingSec: 75 });
    const tickedInPrep = await page.evaluate(() => {
      return (window as any).useGameStore.getState().tickDayTimer(10);
    });
    expect(tickedInPrep).toBe(false);
    let state = await getGameState(page);
    expect(state.dayTimeRemainingSec).toBe(75);

    // 2. In SUMMARY phase
    await setGameState(page, { dayPhase: 'SUMMARY', dayTimeRemainingSec: 0 });
    const tickedInSummary = await page.evaluate(() => {
      return (window as any).useGameStore.getState().tickDayTimer(10);
    });
    expect(tickedInSummary).toBe(false);
    state = await getGameState(page);
    expect(state.dayTimeRemainingSec).toBe(0);
  });

  test('T2.12: Timer reaching exactly 0 seconds triggers instant shift closing', async ({ page }) => {
    await startDayIfPrep(page);
    await setGameState(page, { dayPhase: 'OPEN', dayTimeRemainingSec: 5 });

    const dayEnded = await page.evaluate(() => {
      return (window as any).useGameStore.getState().tickDayTimer(5);
    });

    expect(dayEnded).toBe(true);

    const state = await getGameState(page);
    expect(state.dayTimeRemainingSec).toBe(0);
    expect(state.dayPhase).toBe('SUMMARY');
  });

  test('T2.13: Delta exceeding remaining seconds clamps timer to 0 without underflow', async ({ page }) => {
    await startDayIfPrep(page);
    await setGameState(page, { dayPhase: 'OPEN', dayTimeRemainingSec: 3 });

    // Tick by 60 seconds (far exceeding 3s)
    const dayEnded = await page.evaluate(() => {
      return (window as any).useGameStore.getState().tickDayTimer(60);
    });

    expect(dayEnded).toBe(true);

    const state = await getGameState(page);
    expect(state.dayTimeRemainingSec).toBe(0);
    expect(state.dayPhase).toBe('SUMMARY');
  });

  test('T2.14: nextDay transition increments day and resets timer to default duration', async ({ page }) => {
    await setGameState(page, { currentDay: 2, dayPhase: 'SUMMARY', dayTimeRemainingSec: 0 });

    await page.evaluate(() => {
      (window as any).useGameStore.getState().nextDay();
    });

    const state = await getGameState(page);
    expect(state.currentDay).toBe(3);
    expect(state.dayPhase).toBe('PREP');
    expect(state.dayTimeRemainingSec).toBe(210);
  });

  test('T2.15: Weather forecast and market news cycle smoothly on consecutive day transitions', async ({ page }) => {
    await setGameState(page, { currentDay: 1, dayPhase: 'SUMMARY' });

    // Transition Day 1 -> 2
    await page.evaluate(() => (window as any).useGameStore.getState().nextDay());
    let state = await getGameState(page);
    expect(state.weatherForecast).toBeDefined();
    expect(state.marketNews).toBeDefined();
    const weatherDay2 = state.weatherForecast.type;

    // Transition Day 2 -> 3
    await page.evaluate(() => (window as any).useGameStore.getState().nextDay());
    state = await getGameState(page);
    expect(state.currentDay).toBe(3);
    expect(state.weatherForecast.type).toBeDefined();
  });
});
