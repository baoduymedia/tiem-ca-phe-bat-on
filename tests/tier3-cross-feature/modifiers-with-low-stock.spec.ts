import { test, expect } from '@playwright/test';
import { getGameState, setGameState, bypassSplash } from '../helpers/test-utils';

test.describe('Tier 3: Modifiers and Low Stock Combinations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await bypassSplash(page);
  });

  test('T3.1: hasIngredientsForDrink returns false and consume rejects when milk is depleted for cf_sua_da', async ({ page }) => {
    await setGameState(page, {
      inventory: { coffee: 10, milk: 0, ice: 10, tea: 10 },
    });

    const hasIngredients = await page.evaluate(() => {
      return (window as any).useGameStore.getState().hasIngredientsForDrink('cf_sua_da');
    });
    expect(hasIngredients).toBe(false);

    const consumeResult = await page.evaluate(() => {
      return (window as any).useGameStore.getState().consumeIngredientsForDrink('cf_sua_da');
    });
    expect(consumeResult).toBe(false);

    // Ensure inventory remained untouched
    const state = await getGameState(page);
    expect(state.inventory.coffee).toBe(10);
    expect(state.inventory.milk).toBe(0);
    expect(state.inventory.ice).toBe(10);
  });

  test('T3.2: consumeIngredientsForDrink deducts multi-ingredient requirements for cf_sua_da', async ({ page }) => {
    await setGameState(page, {
      inventory: { coffee: 5, milk: 5, ice: 5, tea: 5 },
    });

    const consumeResult = await page.evaluate(() => {
      return (window as any).useGameStore.getState().consumeIngredientsForDrink('cf_sua_da');
    });
    expect(consumeResult).toBe(true);

    const state = await getGameState(page);
    expect(state.inventory.coffee).toBe(4);
    expect(state.inventory.milk).toBe(4);
    expect(state.inventory.ice).toBe(4);
    expect(state.inventory.tea).toBe(5); // untouched
  });

  test('T3.3: In-shift ingredient purchase replenishes stock and unblocks hasIngredientsForDrink', async ({ page }) => {
    await setGameState(page, {
      gold: 50_000,
      inventory: { coffee: 5, milk: 0, ice: 5, tea: 5 },
    });

    // Verify blocked initially
    let hasIngredients = await page.evaluate(() => {
      return (window as any).useGameStore.getState().hasIngredientsForDrink('cf_sua_da');
    });
    expect(hasIngredients).toBe(false);

    // Buy milk: 8 portions for 18,000đ
    const buyResult = await page.evaluate(() => {
      return (window as any).useGameStore.getState().buyIngredient('milk', 8, 18_000);
    });
    expect(buyResult).toBe(true);

    let state = await getGameState(page);
    expect(state.gold).toBe(32_000);
    expect(state.inventory.milk).toBe(8);

    // Now hasIngredientsForDrink unblocked
    hasIngredients = await page.evaluate(() => {
      return (window as any).useGameStore.getState().hasIngredientsForDrink('cf_sua_da');
    });
    expect(hasIngredients).toBe(true);
  });

  test('T3.4: recordDrinkSale records sales revenue and tips into dailyReport and increments quest progress', async ({ page }) => {
    await setGameState(page, {
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
      dailyQuests: [
        {
          id: 'quest_brew_1',
          description: 'Pha 10 ly cà phê cho khách vỉa hè',
          target: 10,
          current: 0,
          claimed: false,
        },
        {
          id: 'quest_revenue_1',
          description: 'Đạt mốc 150.000đ doanh thu trong ngày',
          target: 150000,
          current: 0,
          claimed: false,
        },
      ],
    });

    // Record sale of 15,000đ + 2,000đ tip + 1 rep
    await page.evaluate(() => {
      (window as any).useGameStore.getState().recordDrinkSale(15_000, 2_000, 1);
    });

    const state = await getGameState(page);
    expect(state.dailyReport.revenue).toBe(15_000);
    expect(state.dailyReport.tips).toBe(2_000);
    expect(state.dailyReport.cupsSold).toBe(1);
    expect(state.dailyReport.reputationEarned).toBe(1);

    const brewQuest = state.dailyQuests.find((q: any) => q.id === 'quest_brew_1');
    const revQuest = state.dailyQuests.find((q: any) => q.id === 'quest_revenue_1');
    expect(brewQuest.current).toBe(1);
    expect(revQuest.current).toBe(17_000);
  });

  test('T3.5: Recipe upgrade increments level and persists in unlockedRecipes store', async ({ page }) => {
    await setGameState(page, {
      gold: 100_000,
      unlockedRecipes: { cf_den: 1, cf_sua: 1 },
    });

    const upgraded = await page.evaluate(() => {
      return (window as any).useGameStore.getState().upgradeRecipe('cf_den', 30_000);
    });
    expect(upgraded).toBe(true);

    const state = await getGameState(page);
    expect(state.gold).toBe(70_000);
    expect(state.unlockedRecipes['cf_den']).toBe(2);
  });
});
