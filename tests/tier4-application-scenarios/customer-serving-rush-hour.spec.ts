import { test, expect } from '@playwright/test';
import { getGameState, setGameState, bypassSplash } from '../helpers/test-utils';

test.describe('Tier 4: Customer Serving Rush Hour and Quest Completion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await bypassSplash(page);
    await setGameState(page, { dayPhase: 'OPEN' });
  });

  test('T4.6: Continuous order fulfillment increments cupsSold and cumulative revenue', async ({ page }) => {
    await setGameState(page, {
      gold: 50_000,
      inventory: { coffee: 20, milk: 20, ice: 20, tea: 20 },
      dailyReport: {
        dayNumber: 1,
        revenue: 0,
        tips: 0,
        cupsSold: 0,
        supplyCost: 0,
        ingredientCost: 0,
        penalties: 0,
        rentCost: 0,
        netProfit: 0,
        perfectOrdersCount: 0,
        reputationEarned: 0,
        reviewStars: 5,
        reviewComment: '',
      },
    });

    // Serve 3 drinks in sequence
    await page.evaluate(() => {
      const store = (window as any).useGameStore.getState();
      for (let i = 0; i < 3; i++) {
        store.consumeIngredientsForDrink('cf_den_da');
        store.recordDrinkSale(12_000, 1_000, 1);
        store.addGold(13_000);
      }
    });

    const state = await getGameState(page);
    expect(state.gold).toBe(89_000); // 50_000 + 3 * 13_000
    expect(state.dailyReport.cupsSold).toBe(3);
    expect(state.dailyReport.revenue).toBe(36_000);
    expect(state.dailyReport.tips).toBe(3_000);
    expect(state.inventory.coffee).toBe(17);
    expect(state.inventory.ice).toBe(17);
  });

  test('T4.7: Perfect order streaks accumulate higher reputation and perfect order counts', async ({ page }) => {
    await setGameState(page, {
      reputation: 10,
      dailyReport: {
        dayNumber: 1,
        revenue: 0,
        tips: 0,
        cupsSold: 0,
        supplyCost: 0,
        ingredientCost: 0,
        penalties: 0,
        rentCost: 0,
        netProfit: 0,
        perfectOrdersCount: 0,
        reputationEarned: 0,
        reviewStars: 5,
        reviewComment: '',
      },
    });

    // Record 2 perfect orders
    await page.evaluate(() => {
      const store = (window as any).useGameStore.getState();
      store.recordOrderResult(true, 3_000, 15_000);
      store.recordOrderResult(true, 3_000, 15_000);
    });

    const state = await getGameState(page);
    expect(state.reputation).toBe(14); // 10 + 2 + 2
    expect(state.dailyReport.perfectOrdersCount).toBe(2);
    expect(state.dailyReport.cupsSold).toBe(2);
  });

  test('T4.8: Serving 10 cups fulfills quest_brew_1 daily quest', async ({ page }) => {
    await setGameState(page, {
      dailyQuests: [
        {
          id: 'quest_brew_1',
          description: 'Pha 10 ly cà phê cho khách vỉa hè',
          target: 10,
          current: 7,
          rewardBeans: 2,
          claimed: false,
        },
      ],
    });

    // Serve 3 more drinks to reach target 10
    await page.evaluate(() => {
      (window as any).useGameStore.getState().incrementQuestProgress('brew', 3);
    });

    const state = await getGameState(page);
    const quest = state.dailyQuests.find((q: any) => q.id === 'quest_brew_1');
    expect(quest.current).toBe(10);
    expect(quest.current >= quest.target).toBe(true);
  });

  test('T4.9: Daily revenue reaches quest_revenue_1 target threshold', async ({ page }) => {
    await setGameState(page, {
      dailyQuests: [
        {
          id: 'quest_revenue_1',
          description: 'Đạt mốc 150.000đ doanh thu trong ngày',
          target: 150000,
          current: 120000,
          rewardBeans: 3,
          claimed: false,
        },
      ],
    });

    // Record 30,000đ sale
    await page.evaluate(() => {
      (window as any).useGameStore.getState().incrementQuestProgress('revenue', 30_000);
    });

    const state = await getGameState(page);
    const quest = state.dailyQuests.find((q: any) => q.id === 'quest_revenue_1');
    expect(quest.current).toBe(150000);
    expect(quest.current >= quest.target).toBe(true);
  });

  test('T4.10: Claiming completed quests increments golden beans in store and TopHUD', async ({ page }) => {
    await setGameState(page, {
      goldenBeans: 5,
      dailyQuests: [
        {
          id: 'quest_brew_1',
          description: 'Pha 10 ly cà phê cho khách vỉa hè',
          target: 10,
          current: 10,
          rewardBeans: 3,
          claimed: false,
        },
      ],
    });

    const claimed = await page.evaluate(() => {
      return (window as any).useGameStore.getState().claimQuestReward('quest_brew_1');
    });
    expect(claimed).toBe(true);

    const state = await getGameState(page);
    expect(state.goldenBeans).toBe(8);
    expect(state.dailyQuests[0].claimed).toBe(true);

    // Verify golden bean count in TopHUD
    await expect(page.getByText('8').first()).toBeVisible();
  });
});
