import { test, expect } from '@playwright/test';
import {
  bypassSplash,
  getGameState,
  startDayIfPrep,
} from '../helpers/test-utils';

test.describe('Tier 1: Feature Coverage - Brewing and Modifiers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await bypassSplash(page);
    await startDayIfPrep(page);
  });

  test('T1.6: Starting manual brewing session opens the brewing station modal', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).useGameStore.getState().startManualBrewing({
        customerSeatIndex: 0,
        customerName: 'Anh Hùng Giao Hàng',
        recipeId: 'cf_sua_da',
        recipeName: 'Cà Phê Sữa Đá',
        price: 15000,
      });
    });

    await expect(page.getByText(/TRẠM PHA CHẾ ASMR/i)).toBeVisible();
    await expect(page.getByText(/Anh Hùng Giao Hàng/i)).toBeVisible();
    await expect(page.getByText('Cà Phê Sữa Đá').first()).toBeVisible();
  });

  test('T1.7: Boiling water extraction step updates gauge and advances step', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).useGameStore.getState().startManualBrewing({
        customerSeatIndex: 1,
        customerName: 'Chị Mai Văn Phòng',
        recipeId: 'cf_den_da',
        recipeName: 'Cà Phê Phin Đen Đá',
        price: 12000,
      });
    });

    await expect(page.getByText(/1\. Nước sôi/i)).toBeVisible();

    const pourWaterBtn = page.getByRole('button', { name: /CHÂM NƯỚC SÔI/i });
    await expect(pourWaterBtn).toBeVisible();

    // Trigger hold action to fill water
    const box = await pourWaterBtn.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(300);
      await page.mouse.up();
    } else {
      await pourWaterBtn.dispatchEvent('mousedown');
      await page.waitForTimeout(300);
      await pourWaterBtn.dispatchEvent('mouseup');
    }

    // Advances to step 2 (ice) for cf_den_da
    await expect(page.getByText(/3\. Đá bi/i)).toBeVisible({ timeout: 3000 });
  });

  test('T1.8: Condensed milk pouring step requires multiple clicks for milk drinks', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).useGameStore.getState().startManualBrewing({
        customerSeatIndex: 2,
        customerName: 'Cô Lan Giáo Viên',
        recipeId: 'cf_sua_da',
        recipeName: 'Cà Phê Sữa Đá',
        price: 15000,
      });
    });

    // Pour water to reach milk step
    const pourWaterBtn = page.getByRole('button', { name: /CHÂM NƯỚC SÔI/i });
    const box = await pourWaterBtn.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(300);
      await page.mouse.up();
    } else {
      await pourWaterBtn.dispatchEvent('mousedown');
      await page.waitForTimeout(300);
      await pourWaterBtn.dispatchEvent('mouseup');
    }

    // Step 1: Sữa đặc button
    const addMilkBtn = page.getByRole('button', { name: /MÚC SỮA ĐẶC/i });
    await expect(addMilkBtn).toBeVisible({ timeout: 3000 });
    await addMilkBtn.click();
    await addMilkBtn.click();

    // Advances to ice step
    await expect(page.getByRole('button', { name: /XÚC ĐÁ BI/i })).toBeVisible({ timeout: 3000 });
  });

  test('T1.9: Stirring coffee creates foam and leads to delivery completion', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).useGameStore.getState().startManualBrewing({
        customerSeatIndex: 0,
        customerName: 'Bác Ba Tổ Trưởng',
        recipeId: 'cf_den_da',
        recipeName: 'Cà Phê Phin Đen Đá',
        price: 12000,
      });
    });

    // Rapid water
    const pourWaterBtn = page.getByRole('button', { name: /CHÂM NƯỚC SÔI/i });
    const box = await pourWaterBtn.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(200);
      await page.mouse.up();
    } else {
      await pourWaterBtn.dispatchEvent('mousedown');
      await page.waitForTimeout(200);
      await pourWaterBtn.dispatchEvent('mouseup');
    }

    // Ice cubes
    const addIceBtn = page.getByRole('button', { name: /XÚC ĐÁ BI/i });
    await expect(addIceBtn).toBeVisible({ timeout: 5000 });
    for (let i = 0; i < 3; i++) {
      if (await addIceBtn.isVisible()) {
        await addIceBtn.click();
        await page.waitForTimeout(100);
      }
    }

    // Stir
    const stirBtn = page.getByRole('button', { name: /KHUẤY ĐỀU CÀ PHÊ/i });
    await expect(stirBtn).toBeVisible({ timeout: 5000 });
    for (let i = 0; i < 5; i++) {
      if (await stirBtn.isVisible()) {
        await stirBtn.click();
        await page.waitForTimeout(100);
      }
    }

    // Final deliver button
    const deliverBtn = page.getByRole('button', { name: /TRAO LY CHO KHÁCH/i });
    await expect(deliverBtn).toBeVisible({ timeout: 5000 });
  });

  test('T1.10: Delivering completed drink credits gold, reputation, and daily report', async ({ page }) => {
    const initial = await getGameState(page);

    await page.evaluate(() => {
      (window as any).useGameStore.getState().startManualBrewing({
        customerSeatIndex: 3,
        customerName: 'Chú Sáu Xe Lôi',
        recipeId: 'cf_den_da',
        recipeName: 'Cà Phê Phin Đen Đá',
        price: 15000,
      });
    });

    const fastDeliverBtn = page.getByRole('button', { name: /Pha Nhanh Tự Động/i });
    await expect(fastDeliverBtn).toBeVisible();
    await fastDeliverBtn.click();

    await expect(page.getByText(/TRẠM PHA CHẾ ASMR/i)).toBeHidden();

    const updated = await getGameState(page);
    expect(updated.gold).toBeGreaterThan(initial.gold);
    expect(updated.reputation).toBeGreaterThan(initial.reputation);
    expect(updated.dailyReport.cupsSold).toBe(initial.dailyReport.cupsSold + 1);
    expect(updated.activeBrewing).toBeNull();
  });
});
