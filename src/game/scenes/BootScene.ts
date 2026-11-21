import Phaser from 'phaser';
import { SPRITES } from '../../data/sprites';
import { EventBus } from '../EventBus';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // 1. Drinks
    this.load.image('phin_ca_phe', SPRITES.drinks.phin_ca_phe);
    this.load.image('cf_sua_da', SPRITES.drinks.cf_sua_da);
    this.load.image('cf_den_da', SPRITES.drinks.cf_den_da);
    this.load.image('tra_da', SPRITES.drinks.tra_da);
    this.load.image('bac_xiu', SPRITES.drinks.bac_xiu);

    // 2. Furniture & Props
    this.load.image('ghe_nhua_do', SPRITES.furniture.ghe_nhua_do);
    this.load.image('ghe_nhua_xanh', SPRITES.furniture.ghe_nhua_xanh);
    this.load.image('ban_nhua_do', SPRITES.furniture.ban_nhua_do);
    this.load.image('bat_che_mua', SPRITES.furniture.bat_che_mua);
    this.load.image('am_nuoc_soi', SPRITES.furniture.am_nuoc_soi);
    this.load.image('thung_da', SPRITES.furniture.thung_da);

    // 3. Customers
    this.load.image('khach_xe_om', SPRITES.customers.khach_xe_om);
    this.load.image('khach_hang_xom', SPRITES.customers.khach_hang_xom);
    this.load.image('khach_shipper', SPRITES.customers.khach_shipper);
    this.load.image('khach_sinh_vien', SPRITES.customers.khach_sinh_vien);
    this.load.image('khach_kol', SPRITES.customers.khach_kol);

    // 4. Pets
    this.load.image('pet_meo_muop', SPRITES.pets.pet_meo_muop);
    this.load.image('pet_cun_vang', SPRITES.pets.pet_cun_vang);

    // 5. Frame Animation Sprite Sheets (2-4 frames)
    this.load.spritesheet('anim_barista_pour', '/assets/sprites/anim_barista_pour.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet('anim_customer_drink', '/assets/sprites/anim_customer_drink.png', {
      frameWidth: 48,
      frameHeight: 64,
    });
    this.load.spritesheet('anim_customer_emotes', '/assets/sprites/anim_customer_emotes.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    // Register global animations
    if (!this.anims.exists('barista-idle')) {
      this.anims.create({
        key: 'barista-idle',
        frames: this.anims.generateFrameNumbers('anim_barista_pour', { frames: [0] }),
        frameRate: 1,
      });
    }

    if (!this.anims.exists('barista-pour')) {
      this.anims.create({
        key: 'barista-pour',
        frames: this.anims.generateFrameNumbers('anim_barista_pour', { start: 1, end: 3 }),
        frameRate: 3,
        repeat: -1,
      });
    }

    if (!this.anims.exists('customer-drink-anim')) {
      this.anims.create({
        key: 'customer-drink-anim',
        frames: this.anims.generateFrameNumbers('anim_customer_drink', { start: 0, end: 3 }),
        frameRate: 2,
        repeat: -1,
      });
    }

    EventBus.emit('boot-complete');
    this.scene.start('CafeScene');
  }
}
