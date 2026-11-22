import { test, expect } from '@playwright/test';
import { getGameState, setGameState, bypassSplash } from '../helpers/test-utils';

test.describe('Tier 4: Expansion, Decor, and Endgame Progression Loop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await bypassSplash(page);
  });

  test('T4.16: Accumulating 250,000đ and 15 reputation unlocks Stage 2 (Xe Đẩy Take-Away)', async ({ page }) => {
    await setGameState(page, {
      currentStage: 1,
      gold: 300_000,
      reputation: 20,
    });

    const upgraded = await page.evaluate(() => {
      return (window as any).useGameStore.getState().unlockNextStage();
    });
    expect(upgraded).toBe(true);

    const state = await getGameState(page);
    expect(state.currentStage).toBe(2);
    expect(state.gold).toBe(50_000);
  });

  test('T4.17: Stage 2 enables recipe expansion and allows unlocking new drinks', async ({ page }) => {
    await setGameState(page, {
      currentStage: 2,
      gold: 100_000,
      unlockedRecipes: { cf_den: 1, cf_sua: 1 },
    });

    // Unlock cf_muoi
    const unlocked = await page.evaluate(() => {
      return (window as any).useGameStore.getState().unlockRecipe('cf_muoi', 40_000);
    });
    expect(unlocked).toBe(true);

    const state = await getGameState(page);
    expect(state.gold).toBe(60_000);
    expect(state.unlockedRecipes['cf_muoi']).toBe(1);
  });

  test('T4.18: Shop rebranding via RenameShopModal updates shopName across HUD and UI', async ({ page }) => {
    await setGameState(page, {
      isRenameModalOpen: true,
      shopName: 'Tiệm Cà Phê Cũ',
    });

    // Check modal is open
    await expect(page.getByText('ĐẶT TÊN BẢNG HIỆU')).toBeVisible();

    // Type new shop name
    const input = page.locator('input[type="text"]').first();
    await input.fill('Cà Phê Bất Ổn Quận 1');

    // Click confirm
    const confirmBtn = page.getByRole('button', { name: /XÁC NHẬN ĐỔI TÊN/i });
    await confirmBtn.click();

    // Verify modal closed and store updated
    await expect(page.getByText('ĐẶT TÊN BẢNG HIỆU')).not.toBeVisible();
    const state = await getGameState(page);
    expect(state.shopName).toBe('Cà Phê Bất Ổn Quận 1');
    await expect(page.getByText('Cà Phê Bất Ổn Quận 1').first()).toBeVisible();
  });

  test('T4.19: Purchasing and equipping decor items increases reputation and loadout', async ({ page }) => {
    await setGameState(page, {
      gold: 150_000,
      goldenBeans: 15,
      ownedDecor: [],
      equippedDecor: [],
      reputation: 25,
    });

    // Buy 2 decor items
    await page.evaluate(() => {
      const store = (window as any).useGameStore.getState();
      store.buyDecor('den_long_hoi_an', 30_000, 3, 10);
      store.buyDecor('cay_phat_tai', 20_000, 2, 5);
    });

    const state = await getGameState(page);
    expect(state.gold).toBe(100_000); // 150k - 30k - 20k
    expect(state.goldenBeans).toBe(10); // 15 - 3 - 2
    expect(state.ownedDecor).toContain('den_long_hoi_an');
    expect(state.ownedDecor).toContain('cay_phat_tai');
    expect(state.reputation).toBe(40); // 25 + 10 + 5
  });

  test('T4.20: PolaroidPhotoMode snapshot opens, displays shop branding, and closes cleanly', async ({ page }) => {
    await setGameState(page, {
      isPhotoModeOpen: true,
      shopName: 'Cà Phê Bất Ổn Sài Gòn',
      currentDay: 5,
    });

    // Verify modal appears
    await expect(page.getByText('Polaroid Snapshot')).toBeVisible();
    await expect(page.getByText('Cà Phê Bất Ổn Sài Gòn').first()).toBeVisible();

    // Close modal via close button
    const closeBtn = page.getByRole('button', { name: '✕' });
    await closeBtn.click();

    await expect(page.getByText('Polaroid Snapshot')).not.toBeVisible();
    const state = await getGameState(page);
    expect(state.isPhotoModeOpen).toBe(false);
  });
});
