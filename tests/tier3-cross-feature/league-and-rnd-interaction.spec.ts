import { test, expect } from '@playwright/test';
import { getGameState, setGameState, bypassSplash } from '../helpers/test-utils';

test.describe('Tier 3: League, R&D, and Expansion Progression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await bypassSplash(page);
  });

  test('T3.16: unlockNextStage transitions stage from 1 to 2 when thresholds are met', async ({ page }) => {
    // Stage 1 -> 2 requirement: gold 250,000đ, rep 15
    await setGameState(page, {
      currentStage: 1,
      gold: 300_000,
      reputation: 20,
    });

    const success = await page.evaluate(() => {
      return (window as any).useGameStore.getState().unlockNextStage();
    });
    expect(success).toBe(true);

    const state = await getGameState(page);
    expect(state.currentStage).toBe(2);
    expect(state.gold).toBe(50_000); // 300_000 - 250_000
  });

  test('T3.17: buyDecor adds item to ownedDecor and equippedDecor and awards reputation', async ({ page }) => {
    await setGameState(page, {
      gold: 50_000,
      goldenBeans: 10,
      ownedDecor: [],
      equippedDecor: [],
      reputation: 10,
    });

    const bought = await page.evaluate(() => {
      return (window as any).useGameStore.getState().buyDecor('khang_trai_ban', 20_000, 2, 5);
    });
    expect(bought).toBe(true);

    const state = await getGameState(page);
    expect(state.gold).toBe(30_000);
    expect(state.goldenBeans).toBe(8);
    expect(state.ownedDecor).toContain('khang_trai_ban');
    expect(state.equippedDecor).toContain('khang_trai_ban');
    expect(state.reputation).toBe(15);
  });

  test('T3.18: Audio toggle updates isMuted state and SoundManager volume', async ({ page }) => {
    await setGameState(page, { isMuted: false });

    // Toggle mute
    await page.evaluate(() => {
      (window as any).useGameStore.getState().toggleMute();
    });

    let state = await getGameState(page);
    expect(state.isMuted).toBe(true);

    // Toggle back
    await page.evaluate(() => {
      (window as any).useGameStore.getState().toggleMute();
    });

    state = await getGameState(page);
    expect(state.isMuted).toBe(false);
  });

  test('T3.19: updateRoasterySettings configures bean type and roast profile with discounts', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).useGameStore.getState().updateRoasterySettings('robusta', 'MEDIUM');
    });

    const state = await getGameState(page);
    expect(state.roastery).toBeDefined();
    expect(state.roastery.beanType).toBe('robusta');
    expect(state.roastery.roastLevel).toBe('MEDIUM');
    expect(state.roastery.supplyDiscountPercent).toBe(30);
  });

  test('T3.20: recordOrderResult updates gold, reputation, and provincialLeague weekly score', async ({ page }) => {
    await setGameState(page, {
      gold: 100_000,
      reputation: 10,
      provincialLeague: {
        currentTier: 'BRONZE',
        weeklyContributionScore: 50,
      },
    });

    // Perfect order: 15,000đ revenue + 3,000đ tip
    await page.evaluate(() => {
      (window as any).useGameStore.getState().recordOrderResult(true, 3_000, 15_000);
    });

    const state = await getGameState(page);
    expect(state.gold).toBe(118_000); // 100_000 + 18_000
    expect(state.reputation).toBe(12); // +2 rep for perfect order
    expect(state.dailyReport.cupsSold).toBe(1);
    expect(state.dailyReport.perfectOrdersCount).toBe(1);
    // Weekly score: 50 + 10 (perfect) + 18 (18000/1000) = 78
    expect(state.provincialLeague.weeklyContributionScore).toBe(78);
  });
});
