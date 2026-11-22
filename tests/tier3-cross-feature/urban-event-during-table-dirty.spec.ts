import { test, expect } from '@playwright/test';
import { getGameState, setGameState, bypassSplash, emitEventBus } from '../helpers/test-utils';

test.describe('Tier 3: Urban Events and Table Dirty Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await bypassSplash(page);
    await setGameState(page, { dayPhase: 'OPEN' });
  });

  test('T3.11: EventBus event-warning displays warning banner with alert message', async ({ page }) => {
    await emitEventBus(page, 'event-warning', {
      message: 'Chú ý: Đoàn kiểm tra đang tới gần!',
    });

    const warningBanner = page.getByText('CHÚ Ý: ĐOÀN KIỂM TRA ĐANG TỚI GẦN!');
    await expect(warningBanner).toBeVisible();
  });

  test('T3.12: EventBus event-started displays active event modal with title and action button', async ({ page }) => {
    await emitEventBus(page, 'event-started', {
      id: 'trat_tu_do_thi',
      name: 'TRẬT TỰ ĐÔ THỊ ĐI TUẦN',
      buttonLabel: 'THU GỌN BÀN GHẾ',
      alertText: 'Đoàn trật tự đô thị đang đi qua! Nhanh tay thu gọn bàn ghế vỉa hè!',
      durationSec: 10,
    });

    await expect(page.getByText('TRẬT TỰ ĐÔ THỊ ĐI TUẦN')).toBeVisible();
    await expect(page.getByText('Đoàn trật tự đô thị đang đi qua!')).toBeVisible();
    await expect(page.getByRole('button', { name: /THU GỌN BÀN GHẾ/i })).toBeVisible();
  });

  test('T3.13: Primary event button click dispatches handle-event-action and closes modal', async ({ page }) => {
    // Listen for handle-event-action emission
    await page.evaluate(() => {
      (window as any).__lastHandledEvent = null;
      (window as any).EventBus.on('handle-event-action', (payload: any) => {
        (window as any).__lastHandledEvent = payload;
      });
    });

    await emitEventBus(page, 'event-started', {
      id: 'mua_rao',
      name: 'MƯA RÀO BẤT CHỢT',
      buttonLabel: 'KÉO BẠT CHE MƯA',
      alertText: 'Trời đổ cơn mưa rào, kéo bạt để khách không bị ướt!',
      durationSec: 8,
    });

    const actionBtn = page.getByRole('button', { name: /KÉO BẠT CHE MƯA/i });
    await expect(actionBtn).toBeVisible();
    await actionBtn.click();

    // Modal dismissed
    await expect(page.getByText('MƯA RÀO BẤT CHỢT')).not.toBeVisible();

    // Verify event bus payload
    const eventPayload = await page.evaluate(() => (window as any).__lastHandledEvent);
    expect(eventPayload).toEqual({ eventId: 'mua_rao', viaNeighbor: false });
  });

  test('T3.14: trat_tu_do_thi event renders solidarity neighbor rescue button (Cô Bảy)', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).__lastHandledEvent = null;
      (window as any).EventBus.on('handle-event-action', (payload: any) => {
        (window as any).__lastHandledEvent = payload;
      });
    });

    await emitEventBus(page, 'event-started', {
      id: 'trat_tu_do_thi',
      name: 'TRẬT TỰ ĐÔ THỊ ĐI TUẦN',
      buttonLabel: 'THU GỌN BÀN GHẾ',
      alertText: 'Đoàn trật tự đô thị đang đi qua!',
      durationSec: 10,
    });

    const rescueBtn = page.getByRole('button', { name: /NÉP HIÊN NHÀ CÔ BẢY/i });
    await expect(rescueBtn).toBeVisible();
    await rescueBtn.click();

    // Modal dismissed and neighbor rescue recorded
    await expect(page.getByText('TRẬT TỰ ĐÔ THỊ ĐI TUẦN')).not.toBeVisible();
    const eventPayload = await page.evaluate(() => (window as any).__lastHandledEvent);
    expect(eventPayload).toEqual({ eventId: 'trat_tu_do_thi', viaNeighbor: true });
  });

  test('T3.15: Dirty table button updates count and cleanAllDirtyTables resets dirty tables', async ({ page }) => {
    await setGameState(page, {
      dirtyTables: [0, 1],
      seatStates: [
        { index: 0, status: 'DIRTY', customerId: null },
        { index: 1, status: 'DIRTY', customerId: null },
        { index: 2, status: 'DIRTY', customerId: null },
        { index: 3, status: 'DIRTY', customerId: null },
      ],
    });

    // Check button indicator shows 2 tables (visible on either desktop or mobile)
    const cleanBtn = page.locator('button:visible').filter({ hasText: /DỌN 2 BÀN/i });
    await expect(cleanBtn).toBeVisible();

    // Call cleanAllDirtyTables
    const totalTips = await page.evaluate(() => {
      return (window as any).useGameStore.getState().cleanAllDirtyTables();
    });
    expect(totalTips).toBeGreaterThan(0);

    const state = await getGameState(page);
    expect(state.dirtyTables).toEqual([]);
    expect(state.seatStates.every((s: any) => s.status === 'EMPTY')).toBe(true);
  });
});
