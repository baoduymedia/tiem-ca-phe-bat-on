import { test, expect } from '@playwright/test';
import { getGameState, setGameState, bypassSplash } from '../helpers/test-utils';

test.describe('Tier 2: Stamina and Resource Limits', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await bypassSplash(page);
  });

  test('T2.16: incrementQuestProgress caps current progress at target without overflowing', async ({ page }) => {
    await setGameState(page, {
      dailyQuests: [
        {
          id: 'quest_brew_1',
          description: 'Pha 10 ly cà phê cho khách vỉa hè',
          target: 10,
          current: 8,
          rewardBeans: 2,
          claimed: false,
        },
      ],
    });

    // Add 5 more brews (8 + 5 = 13, but target is 10)
    await page.evaluate(() => {
      (window as any).useGameStore.getState().incrementQuestProgress('brew', 5);
    });

    const state = await getGameState(page);
    const quest = state.dailyQuests.find((q: any) => q.id === 'quest_brew_1');
    expect(quest.current).toBe(10); // Capped at target
  });

  test('T2.17: claimQuestReward awards golden beans and prevents duplicate claims (idempotence)', async ({ page }) => {
    await setGameState(page, {
      goldenBeans: 10,
      dailyQuests: [
        {
          id: 'quest_brew_1',
          description: 'Pha 10 ly cà phê cho khách vỉa hè',
          target: 10,
          current: 10,
          rewardBeans: 5,
          claimed: false,
        },
      ],
    });

    // First claim should succeed
    const firstClaim = await page.evaluate(() => {
      return (window as any).useGameStore.getState().claimQuestReward('quest_brew_1');
    });
    expect(firstClaim).toBe(true);

    let state = await getGameState(page);
    expect(state.goldenBeans).toBe(15);
    expect(state.dailyQuests[0].claimed).toBe(true);

    // Second claim should fail and not award more beans
    const secondClaim = await page.evaluate(() => {
      return (window as any).useGameStore.getState().claimQuestReward('quest_brew_1');
    });
    expect(secondClaim).toBe(false);

    state = await getGameState(page);
    expect(state.goldenBeans).toBe(15);
  });

  test('T2.18: claimQuestReward rejects if quest target has not been reached', async ({ page }) => {
    await setGameState(page, {
      goldenBeans: 5,
      dailyQuests: [
        {
          id: 'quest_brew_1',
          description: 'Pha 10 ly cà phê cho khách vỉa hè',
          target: 10,
          current: 9, // Not reached yet
          rewardBeans: 5,
          claimed: false,
        },
      ],
    });

    const claimResult = await page.evaluate(() => {
      return (window as any).useGameStore.getState().claimQuestReward('quest_brew_1');
    });
    expect(claimResult).toBe(false);

    const state = await getGameState(page);
    expect(state.goldenBeans).toBe(5);
    expect(state.dailyQuests[0].claimed).toBe(false);
  });

  test('T2.19: Reputation accumulation updates store correctly and supports stage upgrade requirements', async ({ page }) => {
    // Stage 1 -> 2 requirement: gold 250,000đ, rep 15
    await setGameState(page, { currentStage: 1, reputation: 10, gold: 500_000 });

    // Attempting upgrade now should fail because reputation (10) < 15
    let upgradeResult = await page.evaluate(() => {
      return (window as any).useGameStore.getState().unlockNextStage();
    });
    expect(upgradeResult).toBe(false);

    // Add reputation
    await page.evaluate(() => {
      (window as any).useGameStore.getState().addReputation(10);
    });

    let state = await getGameState(page);
    expect(state.reputation).toBe(20);

    // Now upgrade succeeds
    upgradeResult = await page.evaluate(() => {
      return (window as any).useGameStore.getState().unlockNextStage();
    });
    expect(upgradeResult).toBe(true);

    state = await getGameState(page);
    expect(state.currentStage).toBe(2);
    expect(state.gold).toBe(250_000); // 500_000 - 250_000
  });

  test('T2.20: Weather forecasts cycle within valid weather types across multiple days', async ({ page }) => {
    const validWeathers = ['sunny', 'rainy', 'patrol'];

    for (let day = 1; day <= 5; day++) {
      await setGameState(page, { currentDay: day, dayPhase: 'SUMMARY' });
      await page.evaluate(() => (window as any).useGameStore.getState().nextDay());

      const state = await getGameState(page);
      expect(state.weatherForecast).toBeDefined();
      expect(validWeathers).toContain(state.weatherForecast.type);
    }
  });
});
