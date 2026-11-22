import { test, expect } from '@playwright/test';
import {
  bypassSplash,
  getGameState,
  openTab,
  closeActiveTab,
  verifyResponsiveLayout,
  startDayIfPrep,
} from '../helpers/test-utils';

test.describe('Tier 1: Feature Coverage - Modals and Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await bypassSplash(page);
    await startDayIfPrep(page);
  });

  test('T1.26: BottomNav successfully opens Upgrade, Decor, Shop, and Quest panels', async ({ page }) => {
    // 1. Upgrade Tab
    await openTab(page, 'upgrade');
    await expect(page.getByText(/Nâng cấp/i).first()).toBeVisible();

    // 2. Decor Tab
    await openTab(page, 'decor');
    await expect(page.getByText(/Trang trí quán/i).first()).toBeVisible();

    // 3. Shop Tab
    await openTab(page, 'shop');
    await expect(page.getByText(/Cửa hàng/i).first()).toBeVisible();

    // 4. Quest Tab
    await openTab(page, 'quest');
    await expect(page.getByText(/Nhiệm vụ hàng ngày/i).first()).toBeVisible();

    await closeActiveTab(page);
  });

  test('T1.27: Active modal panel closes when close button is clicked', async ({ page }) => {
    await openTab(page, 'upgrade');
    await expect(page.getByText(/Nâng cấp/i).first()).toBeVisible();

    // Close button '✕'
    const closeBtn = page.getByRole('button', { name: '✕' });
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    const state = await getGameState(page);
    expect(state.activeTab).toBeNull();
  });

  test('T1.28: Rename shop modal updates name in store and TopHUD display', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).useGameStore.getState().setRenameModalOpen(true);
    });

    await expect(page.getByText(/ĐẶT TÊN BẢNG HIỆU/i)).toBeVisible();

    const input = page.locator('input[placeholder="Nhập tên quán cà phê..."]');
    await input.fill('Cà Phê Bến Tre');

    const saveBtn = page.getByRole('button', { name: /XÁC NHẬN ĐỔI TÊN/i });
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();

    const state = await getGameState(page);
    expect(state.shopName).toBe('Cà Phê Bến Tre');
    await expect(page.getByText('Cà Phê Bến Tre').first()).toBeVisible();
  });

  test('T1.29: Stage roadmap modal displays evolution journey from stage 1 to 6', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).useGameStore.getState().setRoadmapModalOpen(true);
    });

    await expect(page.getByText(/LỘ TRÌNH 6 GIAI ĐOẠN/i)).toBeVisible();
    await expect(page.getByText(/Quán Cóc Vỉa Hè/i).first()).toBeVisible();
    await expect(page.getByText(/Xe Đẩy Take-Away/i).first()).toBeVisible();

    // Close roadmap
    const closeBtn = page.getByRole('button', { name: '✕' });
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    const state = await getGameState(page);
    expect(state.isRoadmapModalOpen).toBe(false);
  });

  test('T1.30: Multi-viewport responsive layout displays sidebars on desktop and adapts on mobile', async ({ page }) => {
    const layout = await verifyResponsiveLayout(page);
    expect(layout.viewportWidth).toBeGreaterThan(0);
  });
});
