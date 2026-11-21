import Phaser from 'phaser';
import { getRandomEvents } from '../../data/gameData';
import type { RandomEventConfig } from '../../data/gameData';
import { EventBus } from '../EventBus';

const EXTRA_EVENTS: RandomEventConfig[] = [
  {
    id: 'cup_dien',
    name: '⚡ Cúp Điện Giữa Trưa!',
    warningSec: 0,
    reactionWindowSec: 6,
    buttonLabel: 'QUẠT NAN GIỮ KHÁCH 🪭',
    alertText: 'Trời hầm hập, cúp điện bất chợt! Chạm quạt mát ngay để giữ khách!',
    successEffect: 'Khách cảm kích vì được quạt mát! +20% Tip',
    failPenalty: 'Nóng nực quá, một số khách bỏ về!',
    minStage: 1,
    maxStage: 6,
  },
  {
    id: 'thanh_tra_vsattp',
    name: '🔍 Đoàn Thanh Tra VSATTP!',
    warningSec: 3,
    reactionWindowSec: 5,
    buttonLabel: 'LAU DỌN VỈA HÈ & BÀN 🧹',
    alertText: 'Đoàn kiểm tra an toàn thực phẩm ghé qua! Dọn sạch vỉa hè ngay!',
    successEffect: 'Vỉa hè sạch bóng, đạt chuẩn an toàn! +5 Sao Uy Tín ⭐',
    failPenalty: 'Vỉa hè bừa bộn, bị nhắc nhở phạt 15.000đ!',
    minStage: 1,
    maxStage: 6,
  },
];

export class EventManager {
  private scene: Phaser.Scene;
  private timerEvent?: Phaser.Time.TimerEvent;
  private currentEvent: RandomEventConfig | null = null;
  private eventState: 'IDLE' | 'WARNING' | 'ACTIVE' = 'IDLE';
  private actionTimer?: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this._setupListeners();
    this._startRandomEventLoop();
  }

  private _setupListeners() {
    EventBus.on('handle-event-action', this._onUserAction, this);
  }

  private _startRandomEventLoop() {
    this.timerEvent = this.scene.time.addEvent({
      delay: Phaser.Math.Between(22000, 38000),
      callback: this._triggerRandomEvent,
      callbackScope: this,
      loop: false,
    });
  }

  private _triggerRandomEvent() {
    if (this.eventState !== 'IDLE') return;

    const baseEvents = getRandomEvents().filter((e) => e.minStage <= 1 && e.maxStage >= 1);
    const allEvents = [...baseEvents, ...EXTRA_EVENTS];
    if (allEvents.length === 0) return;

    const selected = Phaser.Utils.Array.GetRandom(allEvents);
    this.currentEvent = selected;

    if (selected.warningSec > 0) {
      this.eventState = 'WARNING';
      const warningTxt =
        selected.id === 'thanh_tra_vsattp'
          ? '📋 Cán bộ phường đang đi kiểm tra tuyến phố...'
          : '🚨 Còi xe trật tự hú từ xa... Chuẩn bị!';

      EventBus.emit('event-warning', {
        id: selected.id,
        name: selected.name,
        durationSec: selected.warningSec,
        message: warningTxt,
      });

      this.scene.time.delayedCall(selected.warningSec * 1000, () => {
        this._activateEventAction(selected);
      });
    } else {
      this._activateEventAction(selected);
    }
  }

  private _activateEventAction(event: RandomEventConfig) {
    this.eventState = 'ACTIVE';

    EventBus.emit('event-started', {
      id: event.id,
      name: event.name,
      buttonLabel: event.buttonLabel,
      alertText: event.alertText,
      durationSec: event.reactionWindowSec,
    });

    this.actionTimer = this.scene.time.delayedCall(
      event.reactionWindowSec * 1000,
      () => {
        this._onEventTimeout();
      }
    );
  }

  private _onUserAction(data: { eventId: string; viaNeighbor?: boolean }) {
    if (this.eventState !== 'ACTIVE' || !this.currentEvent) return;
    if (this.currentEvent.id !== data.eventId) return;

    if (this.actionTimer) {
      this.actionTimer.remove();
    }

    const event = this.currentEvent;
    this.eventState = 'IDLE';
    this.currentEvent = null;

    EventBus.emit('event-resolved', {
      id: event.id,
      success: true,
      viaNeighbor: !!data.viaNeighbor,
      message: data.viaNeighbor
        ? "Cô Bảy Tạp Hóa cho mượn góc hiên né đô thị an toàn!"
        : event.successEffect,
    });

    this._startRandomEventLoop();
  }

  private _onEventTimeout() {
    if (this.eventState !== 'ACTIVE' || !this.currentEvent) return;

    const event = this.currentEvent;
    this.eventState = 'IDLE';
    this.currentEvent = null;

    EventBus.emit('event-resolved', {
      id: event.id,
      success: false,
      message: event.failPenalty,
    });

    this._startRandomEventLoop();
  }

  public destroy() {
    if (this.timerEvent) this.timerEvent.remove();
    if (this.actionTimer) this.actionTimer.remove();
    EventBus.off('handle-event-action', this._onUserAction, this);
  }
}
