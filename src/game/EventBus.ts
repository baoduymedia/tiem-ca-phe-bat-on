import Phaser from 'phaser';

/**
 * EventBus — cầu nối sự kiện giữa Phaser và React.
 * Phaser scene emit event → React component lắng nghe qua EventBus.on()
 * React component emit event → Phaser scene lắng nghe qua EventBus.on()
 */
export const EventBus = new Phaser.Events.EventEmitter();
