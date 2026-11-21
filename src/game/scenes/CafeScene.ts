import Phaser from 'phaser';
import { Customer } from '../entities/Customer';
import type { CustomerSeat } from '../entities/Customer';
import { EventManager } from '../entities/EventManager';
import {
  getCustomers,
  getRecipesByStage,
} from '../../data/gameData';
import type { RecipeConfig } from '../../data/gameData';
import { useGameStore, formatVND } from '../../store/useGameStore';
import { EventBus } from '../EventBus';
import { SoundManager } from '../audio/SoundManager';

export class CafeScene extends Phaser.Scene {
  private seats: CustomerSeat[] = [];
  private customers: Customer[] = [];
  private customerSpawnTimer?: Phaser.Time.TimerEvent;
  private eventManager?: EventManager;

  // Visual layers
  private skyLayer!: Phaser.GameObjects.Graphics;
  private rainLayer?: Phaser.GameObjects.Graphics;
  private isRaining: boolean = false;
  private rainDrops: { x: number; y: number; speed: number; len: number }[] = [];

  // Counter & Props
  private counterX: number = 0;
  private counterY: number = 0;
  private isBrewing: boolean = false;
  private barista?: Phaser.GameObjects.Sprite;
  private steamParticles: Phaser.GameObjects.Graphics[] = [];
  private lastFriendHelpCheck: number = 0;

  constructor() {
    super({ key: 'CafeScene' });
  }

  preload() {
    const sprites = [
      { key: 'phin_ca_phe', path: '/assets/sprites/phin_ca_phe.png' },
      { key: 'cf_sua_da', path: '/assets/sprites/cf_sua_da.png' },
      { key: 'cf_den_da', path: '/assets/sprites/cf_den_da.png' },
      { key: 'tra_da', path: '/assets/sprites/tra_da.png' },
      { key: 'bac_xiu', path: '/assets/sprites/bac_xiu.png' },
      { key: 'ghe_nhua_do', path: '/assets/sprites/ghe_nhua_do.png' },
      { key: 'ghe_nhua_xanh', path: '/assets/sprites/ghe_nhua_xanh.png' },
      { key: 'ban_nhua_do', path: '/assets/sprites/ban_nhua_do.png' },
      { key: 'bat_che_mua', path: '/assets/sprites/bat_che_mua.png' },
      { key: 'am_nuoc_soi', path: '/assets/sprites/am_nuoc_soi.png' },
      { key: 'thung_da', path: '/assets/sprites/thung_da.png' },
      { key: 'pet_cun_vang', path: '/assets/sprites/pet_cun_vang.png' },
      { key: 'pet_meo_muop', path: '/assets/sprites/pet_meo_muop.png' },
      { key: 'khach_xe_om', path: '/assets/sprites/khach_xe_om.png' },
      { key: 'khach_hang_xom', path: '/assets/sprites/khach_hang_xom.png' },
      { key: 'khach_shipper', path: '/assets/sprites/khach_shipper.png' },
      { key: 'khach_sinh_vien', path: '/assets/sprites/khach_sinh_vien.png' },
      { key: 'khach_kol', path: '/assets/sprites/khach_kol.png' },
    ];

    sprites.forEach((s) => {
      this.load.image(s.key, s.path);
    });
  }

  create() {
    const { width, height } = this.scale;
    // Balanced street sidewalk golden ratio: ground starts at 46% height
    this.counterX = width * 0.50;
    this.counterY = height * 0.51;

    this._drawBackground();
    this._initSeats();
    this._drawFurniture();
    this._drawCoffeeStand();
    this._drawPets();

    this.eventManager = new EventManager(this);
    this._setupEventBusListeners();
    this._startCustomerSpawner();
    this._startStaffAutomationTimer();

    EventBus.emit('scene-ready', 'CafeScene');
  }

  private _drawBackground() {
    const { width, height } = this.scale;
    const groundY = height * 0.46;

    // 1. Warm early morning Saigon sky layer
    this.skyLayer = this.add.graphics();
    this._renderSky(false);

    // Subtle morning sun glow
    const sun = this.add.graphics();
    sun.fillStyle(0xfff3a1, 0.4);
    sun.fillCircle(width * 0.82, height * 0.08, 38);
    sun.fillStyle(0xfffae6, 0.7);
    sun.fillCircle(width * 0.82, height * 0.08, 22);

    // Floating fluffy clouds
    this._drawCloud(width * 0.18, height * 0.05, 0.9);
    this._drawCloud(width * 0.65, height * 0.08, 0.7);

    // Flying birds in distant sky
    this._drawFlappingBirds(width * 0.35, height * 0.07);

    // 2. Saigon Colonial Townhouse Facade (Tường vàng cổ, cửa sổ lá sách xanh rêu)
    this._drawSaigonTownhouse();

    // 3. Sidewalk layer (Vỉa hè lát gạch bông hoa văn cổ điển)
    const ground = this.add.graphics();
    const sidewalkHeight = height * 0.28;

    // Sidewalk base pavement
    ground.fillStyle(0xf0dfc4, 1);
    ground.fillRect(0, groundY, width, sidewalkHeight);

    // Encaustic vintage tile grid pattern
    ground.lineStyle(1, 0xdbbe95, 0.5);
    for (let x = 0; x < width; x += 16) {
      ground.lineBetween(x, groundY, x, groundY + sidewalkHeight);
    }
    for (let y = groundY; y < groundY + sidewalkHeight; y += 14) {
      ground.lineBetween(0, y, width, y);
    }

    // Concrete curb border (Bờ lề vỉa hè 3D)
    ground.fillStyle(0x998974, 1);
    ground.fillRect(0, groundY + sidewalkHeight - 4, width, 5);
    ground.fillStyle(0x5c5043, 1);
    ground.fillRect(0, groundY + sidewalkHeight + 1, width, 3);

    // 4. Asphalt Street (Lòng đường Sài Gòn)
    const roadHeight = height * 0.14;
    ground.fillStyle(0x2d2b29, 1);
    ground.fillRect(0, groundY + sidewalkHeight + 4, width, roadHeight);

    // Dashed center traffic lane lines
    ground.fillStyle(0xe5dcba, 0.7);
    for (let rx = 0; rx < width; rx += 45) {
      ground.fillRect(rx, groundY + sidewalkHeight + 22, 24, 3);
    }

    // Street gutter drain grate
    ground.fillStyle(0x1a1918, 0.8);
    ground.fillRect(width * 0.04, groundY + sidewalkHeight + 6, 28, 6);
    ground.lineStyle(1, 0x4a4744, 1);
    for (let gx = width * 0.04 + 4; gx < width * 0.04 + 28; gx += 5) {
      ground.lineBetween(gx, groundY + sidewalkHeight + 6, gx, groundY + sidewalkHeight + 12);
    }

    // Big shade tree on far left edge
    this._drawTree(width * 0.06, groundY + 4);

    // Warm sidewalk ambient light pool
    this._drawSidewalkAmbientGlow();

    // Overhead electric wires with sparrows sitting
    this._drawOverheadWires();

    // Cozy vintage bistro fairy lights string
    this._drawFairyLights();

    // Ambient street traffic (Cub 50cc, bicycle, cyclo)
    this._startAmbientTraffic();
  }

  private _drawSidewalkAmbientGlow() {
    const { width, height } = this.scale;
    const groundY = height * 0.46;
    const glow = this.add.graphics();

    // Warm ambient light pool illuminating the sidewalk cafe seating area
    glow.fillStyle(0xfff3a1, 0.12);
    glow.fillEllipse(width * 0.5, groundY + 45, width * 0.85, 65);
    glow.fillStyle(0xfff8d6, 0.08);
    glow.fillEllipse(width * 0.5, groundY + 35, width * 0.6, 45);
  }

  private _drawFairyLights() {
    const { width, height } = this.scale;
    const g = this.add.graphics();
    g.lineStyle(1.2, 0x3d3126, 0.6);

    // Curved wire from tree to cafe awning to right balcony
    const points = [
      { x: width * 0.06, y: height * 0.38 },
      { x: width * 0.26, y: height * 0.42 },
      { x: width * 0.50, y: height * 0.44 },
      { x: width * 0.74, y: height * 0.42 },
      { x: width * 0.94, y: height * 0.38 },
    ];

    for (let i = 0; i < points.length - 1; i++) {
      g.lineBetween(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
    }

    // Glowing warm fairy bulb lights
    const bulbs: Phaser.GameObjects.Graphics[] = [];
    [0.10, 0.18, 0.27, 0.38, 0.50, 0.62, 0.73, 0.84, 0.91].forEach((ratio, idx) => {
      const bx = width * ratio;
      // Approximate sag height
      const by = height * 0.40 + Math.sin(ratio * Math.PI) * (height * 0.04);

      const bulb = this.add.graphics();
      // Socket
      bulb.fillStyle(0x3e2723, 1);
      bulb.fillRect(bx - 1.5, by - 3, 3, 3);
      // Bulb outer warm halo
      bulb.fillStyle(0xfff3a1, 0.4);
      bulb.fillCircle(bx, by + 3, 6);
      // Bulb core
      bulb.fillStyle(0xfffde7, 0.95);
      bulb.fillCircle(bx, by + 2.5, 3);

      bulbs.push(bulb);

      // Subtle breathing twinkle tween
      this.tweens.add({
        targets: bulb,
        alpha: { from: 0.75, to: 1 },
        duration: 1200 + idx * 180,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });
  }

  private _drawSaigonTownhouse() {
    const { width, height } = this.scale;
    const groundY = height * 0.46;
    const g = this.add.graphics();

    // French-Colonial ochre yellow wall
    g.fillStyle(0xe8c576, 1);
    g.fillRect(0, height * 0.12, width, groundY - height * 0.12);

    // Wall age weathering strips (vết phong rêu hoài niệm)
    g.fillStyle(0xd6ad56, 0.35);
    g.fillRect(0, height * 0.18, width, 5);
    g.fillRect(0, height * 0.32, width, 4);

    // French Louvered Shutter Windows (Cửa sổ lá sách xanh ngọc lam)
    const windowY = height * 0.20;
    [-0.12, 0.26, 0.64].forEach((offsetRatio) => {
      const wx = width * offsetRatio + 52;
      // Window frame
      g.fillStyle(0x274e37, 1);
      g.fillRoundedRect(wx - 17, windowY, 34, 46, 3);
      // Window recess
      g.fillStyle(0x13261a, 1);
      g.fillRect(wx - 14, windowY + 3, 28, 40);
      // Louvers slats
      g.fillStyle(0x356849, 1);
      for (let ly = windowY + 6; ly < windowY + 40; ly += 5) {
        g.fillRect(wx - 13, ly, 26, 2);
      }
    });

    // Art Nouveau French Balcony with Bougainvillea Trellis (Hoa giấy hồng rực rỡ)
    const bougainvillea = this.add.graphics();
    bougainvillea.fillStyle(0x2e7d32, 0.95);
    for (let i = 0; i < 32; i++) {
      const bx = width * 0.03 + i * 13 + (i % 3) * 4;
      const by = height * 0.11 + (i % 4) * 6 + Math.sin(i) * 5;
      bougainvillea.fillCircle(bx, by, 7.5);
    }
    const flowerColors = [0xe91e63, 0xff4081, 0xf06292, 0xff80ab];
    for (let i = 0; i < 40; i++) {
      const color = flowerColors[i % flowerColors.length];
      bougainvillea.fillStyle(color, 0.98);
      const fx = width * 0.02 + i * 11 + (i % 2) * 5;
      const fy = height * 0.12 + (i % 5) * 6 + Math.cos(i) * 6;
      bougainvillea.fillCircle(fx, fy, 4.5);
    }

    // Vintage Wooden Cafe Signboard (Bảng hiệu gỗ sồi khắc tên quán)
    const signBox = this.add.graphics();
    const signX = width * 0.18;
    const signY = height * 0.13;
    const signW = width * 0.64;
    const signH = 28;

    // Wooden background
    signBox.fillStyle(0x422615, 0.98);
    signBox.fillRoundedRect(signX, signY, signW, signH, 5);
    // Gold frame border
    signBox.lineStyle(2, 0xd4af37, 1);
    signBox.strokeRoundedRect(signX, signY, signW, signH, 5);

    // Vintage corner screws
    signBox.fillStyle(0xd4af37, 1);
    signBox.fillCircle(signX + 4, signY + 4, 1.8);
    signBox.fillCircle(signX + signW - 4, signY + 4, 1.8);
    signBox.fillCircle(signX + 4, signY + signH - 4, 1.8);
    signBox.fillCircle(signX + signW - 4, signY + signH - 4, 1.8);

    const store = useGameStore.getState();
    const signText = this.add.text(
      width * 0.5,
      signY + signH / 2,
      `☕ ${store.shopName.toUpperCase()}`,
      {
        fontSize: '11px',
        color: '#FFD700',
        stroke: '#1A0E05',
        strokeThickness: 2.5,
        fontStyle: 'bold',
        align: 'center',
      }
    );
    signText.setOrigin(0.5);

    // Interactive: click signboard opens rename modal
    signBox.setInteractive(
      new Phaser.Geom.Rectangle(signX, signY, signW, signH),
      Phaser.Geom.Rectangle.Contains
    );
    signBox.on('pointerdown', () => {
      SoundManager.playStreetChime();
      useGameStore.getState().setRenameModalOpen(true);
    });

    // Listen for shop name updates to refresh sign
    EventBus.on('shop-name-updated', (newName: string) => {
      if (signText && signText.scene) {
        signText.setText(`☕ ${newName.toUpperCase()}`);
      }
    });
  }

  private _drawOverheadWires() {
    const { width, height } = this.scale;
    const wireG = this.add.graphics();
    wireG.lineStyle(1.2, 0x2d2d2d, 0.45);

    // Wire 1 with subtle sag
    wireG.lineBetween(0, height * 0.13, width * 0.5, height * 0.16);
    wireG.lineBetween(width * 0.5, height * 0.16, width, height * 0.12);

    // Wire 2 with subtle sag
    wireG.lineBetween(0, height * 0.15, width * 0.45, height * 0.18);
    wireG.lineBetween(width * 0.45, height * 0.18, width, height * 0.14);

    // Little cute sparrows sitting on wire
    [0.32, 0.36, 0.72].forEach((xRatio) => {
      const sx = width * xRatio;
      const sy = height * 0.15 + (xRatio === 0.72 ? -2 : 0);
      wireG.fillStyle(0x5c4033, 1);
      wireG.fillCircle(sx, sy, 2.5);
      wireG.fillCircle(sx + 2, sy - 1.5, 1.8);
    });
  }

  private _drawFlappingBirds(startX: number, startY: number) {
    const bird = this.add.graphics();
    bird.lineStyle(1.2, 0x3d3d3d, 0.6);
    bird.beginPath();
    bird.arc(-4, 0, 4, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(360), false);
    bird.arc(4, 0, 4, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(360), false);
    bird.strokePath();

    bird.x = startX;
    bird.y = startY;

    this.tweens.add({
      targets: bird,
      x: this.scale.width + 40,
      y: startY - 15,
      duration: 18000,
      repeat: -1,
      ease: 'Linear',
    });
  }

  private _renderSky(isDarkRain: boolean) {
    const { width, height } = this.scale;
    this.skyLayer.clear();
    const groundY = height * 0.46;

    const topColor = isDarkRain ? 0x475c6c : 0x64b5f6;
    const botColor = isDarkRain ? 0x2b3842 : 0xffecb3;

    const steps = 18;
    const stepH = groundY / steps;
    for (let i = 0; i < steps; i++) {
      const ratio = i / steps;
      const r = Math.round(
        ((topColor >> 16) & 0xff) * (1 - ratio) +
          ((botColor >> 16) & 0xff) * ratio
      );
      const g = Math.round(
        ((topColor >> 8) & 0xff) * (1 - ratio) +
          ((botColor >> 8) & 0xff) * ratio
      );
      const b = Math.round(
        (topColor & 0xff) * (1 - ratio) + (botColor & 0xff) * ratio
      );
      const color = (r << 16) | (g << 8) | b;
      this.skyLayer.fillStyle(color, 1);
      this.skyLayer.fillRect(0, i * stepH, width, stepH + 1);
    }
  }

  private _drawCloud(x: number, y: number, scale: number) {
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 0.88);
    g.fillCircle(x, y, 16 * scale);
    g.fillCircle(x + 12 * scale, y - 5 * scale, 13 * scale);
    g.fillCircle(x + 24 * scale, y, 14 * scale);
    g.fillCircle(x - 10 * scale, y + 2 * scale, 11 * scale);
    g.fillRoundedRect(x - 14 * scale, y - 2 * scale, 48 * scale, 15 * scale, 8 * scale);

    this.tweens.add({
      targets: g,
      x: 35,
      duration: 14000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private _drawTree(x: number, bottomY: number) {
    const g = this.add.graphics();
    // Trunk
    g.fillStyle(0x5c4033, 1);
    g.fillRect(x - 6, bottomY - 75, 12, 75);

    // Foliage canopy
    g.fillStyle(0x2e7d32, 0.95);
    g.fillCircle(x, bottomY - 95, 36);
    g.fillCircle(x - 18, bottomY - 78, 26);
    g.fillCircle(x + 18, bottomY - 78, 26);

    // Leaves highlights
    g.fillStyle(0x43a047, 0.85);
    g.fillCircle(x - 8, bottomY - 100, 16);
    g.fillCircle(x + 10, bottomY - 94, 18);
  }

  private _startAmbientTraffic() {
    this.time.addEvent({
      delay: Phaser.Math.Between(5500, 9500),
      loop: true,
      callback: () => {
        const { width, height } = this.scale;
        const groundY = height * 0.46;
        const roadY = groundY + height * 0.28 + 24;

        const bike = this.add.graphics();
        // Honda Cub green / blue
        bike.fillStyle(0x1b5e20, 0.95);
        bike.fillRoundedRect(0, 0, 26, 8, 2);
        // Black wheels
        bike.fillStyle(0x111111, 1);
        bike.fillCircle(4, 9, 4.5);
        bike.fillCircle(22, 9, 4.5);
        // Wheel hub
        bike.fillStyle(0xcccccc, 1);
        bike.fillCircle(4, 9, 1.5);
        bike.fillCircle(22, 9, 1.5);
        // Driver head with helmet
        bike.fillStyle(0xffd54f, 1);
        bike.fillCircle(13, -5, 4.5);
        bike.fillStyle(0x1976d2, 1);
        bike.fillCircle(13, -7, 4);
        // Delivery rack box
        bike.fillStyle(0x8d6e63, 1);
        bike.fillRect(20, -4, 9, 8);

        bike.x = -50;
        bike.y = roadY;
        SoundManager.playHonk();

        this.tweens.add({
          targets: bike,
          x: width + 60,
          duration: 3400,
          ease: 'Linear',
          onUpdate: () => {
            if (Math.random() < 0.15) {
              const puff = this.add.circle(bike.x - 4, roadY + 8, Phaser.Math.Between(1.5, 3), 0xcccccc, 0.5);
              this.tweens.add({
                targets: puff,
                y: roadY + 2,
                alpha: 0,
                duration: 400,
                onComplete: () => puff.destroy(),
              });
            }
          },
          onComplete: () => bike.destroy(),
        });
      },
    });
  }

  private _initSeats() {
    const { width, height } = this.scale;
    const groundY = height * 0.46;

    // Perfectly balanced 4 seats flanking 2 tables on sidewalk:
    // Left Table at 0.26 (seats: 0.17 and 0.35)
    // Right Table at 0.74 (seats: 0.65 and 0.83)
    // Counter stays centered at 0.50
    this.seats = [
      { index: 0, x: width * 0.17, y: groundY + 22, occupied: false },
      { index: 1, x: width * 0.35, y: groundY + 22, occupied: false },
      { index: 2, x: width * 0.65, y: groundY + 22, occupied: false },
      { index: 3, x: width * 0.83, y: groundY + 22, occupied: false },
    ];
  }

  private _drawFurniture() {
    const { width, height } = this.scale;
    const groundY = height * 0.46;

    // Draw plastic chairs for each seat
    this.seats.forEach((seat, i) => {
      const isRed = i % 2 === 0;
      const spriteKey = isRed ? 'ghe_nhua_do' : 'ghe_nhua_xanh';
      if (this.textures.exists(spriteKey)) {
        this.add.image(seat.x, seat.y - 8, spriteKey).setDisplaySize(32, 42);
      }
    });

    // Left Table (Table 0)
    const table0X = width * 0.26;
    const table0Y = groundY + 20;
    if (this.textures.exists('ban_nhua_do')) {
      const t0 = this.add.image(table0X, table0Y, 'ban_nhua_do').setDisplaySize(44, 34);
      t0.setInteractive().on('pointerdown', () => this._handleCleanTable(0));
    }
    // Right Table (Table 1)
    const table1X = width * 0.74;
    const table1Y = groundY + 20;
    if (this.textures.exists('ban_nhua_do')) {
      const t1 = this.add.image(table1X, table1Y, 'ban_nhua_do').setDisplaySize(44, 34);
      t1.setInteractive().on('pointerdown', () => this._handleCleanTable(1));
    }
  }

  private _handleCleanTable(tableIndex: number) {
    const store = useGameStore.getState();
    const tip = store.cleanTable(tableIndex);
    if (tip > 0) {
      const { width, height } = this.scale;
      const groundY = height * 0.46;
      const tx = tableIndex === 0 ? width * 0.26 : width * 0.74;
      this._spawnFloatingCoin(tx, groundY, tip, true);
      this._spawnBannerNotice(`✨ Đã dọn bàn! Nhận thêm ${formatVND(tip)} Tip!`);
    }
  }

  private _drawCoffeeStand() {
    const x = this.counterX;
    const y = this.counterY;
    const g = this.add.graphics();

    // Striped Awning (Mái che bạt sọc đỏ - trắng)
    g.fillStyle(0xd32f2f, 1);
    g.fillRect(x - 64, y - 68, 128, 8);
    for (let i = 0; i < 8; i++) {
      const color = i % 2 === 0 ? 0xd32f2f : 0xffffff;
      g.fillStyle(color, 0.98);
      g.fillTriangle(
        x - 64 + i * 16,
        y - 60,
        x - 64 + (i + 1) * 16,
        y - 60,
        x - 64 + i * 16 + 8,
        y - 48
      );
    }

    // Barista behind counter
    if (this.textures.exists('anim_barista_pour')) {
      this.barista = this.add.sprite(x, y - 48, 'anim_barista_pour', 0);
      this.barista.setDisplaySize(44, 44);
      this.barista.play('barista-idle');
    }

    // Wooden counter front
    g.fillStyle(0x5d4037, 1);
    g.fillRoundedRect(x - 50, y - 36, 100, 42, 5);
    g.fillStyle(0x795548, 1);
    g.fillRoundedRect(x - 53, y - 40, 106, 7, 3);

    // Aluminum Phin on counter with continuous drip
    if (this.textures.exists('phin_ca_phe')) {
      const phin = this.add.image(x, y - 54, 'phin_ca_phe').setDisplaySize(30, 44);
      phin.setInteractive();

      // Tap on phin speeds up dripping and awards tiny sparkle
      phin.on('pointerdown', () => {
        SoundManager.playWaterPour();
        this._spawnBannerNotice('☕ Châm thêm nước sôi! Phin chảy đều tay.');
        this.tweens.add({
          targets: phin,
          scaleX: phin.scaleX * 1.15,
          scaleY: phin.scaleY * 0.9,
          duration: 90,
          yoyo: true,
        });
      });

      const drip = this.add.circle(x, y - 41, 1.8, 0x3e2723, 0.95);
      this.tweens.add({
        targets: drip,
        y: y - 31,
        alpha: { from: 1, to: 0.2 },
        duration: 850,
        repeat: -1,
        ease: 'Quad.easeIn',
      });
    }

    // Boiling kettle on left
    if (this.textures.exists('am_nuoc_soi')) {
      const kettle = this.add.image(x - 34, y - 48, 'am_nuoc_soi').setDisplaySize(28, 32);
      kettle.setInteractive();

      // Tap on kettle gives boiling sound and puffs steam
      kettle.on('pointerdown', () => {
        SoundManager.playKettleBoil();
        this._spawnSteamPuff(x - 34, y - 62);
      });
    }

    // Red ice bucket on right
    if (this.textures.exists('thung_da')) {
      const iceBucket = this.add.image(x + 34, y - 48, 'thung_da').setDisplaySize(30, 32);
      iceBucket.setInteractive();
      iceBucket.on('pointerdown', () => {
        SoundManager.playIceClink();
        this._spawnBannerNotice('🧊 Đá bi già lạnh buốt!');
      });
    }

    // Ambient continuous steam rising gently from kettle and phin
    this.time.addEvent({
      delay: 1800,
      loop: true,
      callback: () => {
        this._spawnSteamPuff(x - 34, y - 62);
        this._spawnSteamPuff(x, y - 68);
      },
    });
  }

  private _spawnSteamPuff(x: number, y: number) {
    for (let i = 0; i < 4; i++) {
      const steam = this.add.circle(
        x + Phaser.Math.Between(-4, 4),
        y,
        Phaser.Math.Between(2, 4),
        0xffffff,
        0.7
      );
      this.tweens.add({
        targets: steam,
        y: y - Phaser.Math.Between(18, 28),
        x: steam.x + Phaser.Math.Between(-8, 8),
        alpha: 0,
        scale: 1.8,
        duration: Phaser.Math.Between(700, 1100),
        onComplete: () => steam.destroy(),
      });
    }
  }

  private _drawPets() {
    const { width, height } = this.scale;
    const groundY = height * 0.46;

    // Sleeping dog on far right sidewalk
    if (this.textures.exists('pet_cun_vang')) {
      const dog = this.add.image(width * 0.88, groundY + 44, 'pet_cun_vang');
      dog.setDisplaySize(50, 32);
      dog.setInteractive();

      dog.on('pointerdown', () => {
        this.tweens.add({
          targets: dog,
          scaleX: dog.scaleX * 1.15,
          scaleY: dog.scaleY * 0.88,
          duration: 100,
          yoyo: true,
          onComplete: () => {
            const bark = this.add.text(dog.x, dog.y - 18, '🐶 Gâu! ❤️', {
              fontSize: '11px',
              color: '#FFD700',
              fontStyle: 'bold',
            }).setOrigin(0.5);
            this.tweens.add({
              targets: bark,
              y: bark.y - 18,
              alpha: 0,
              duration: 900,
              onComplete: () => bark.destroy(),
            });
            // 20% chance to grant 1 Golden Bean!
            if (Math.random() < 0.25) {
              useGameStore.getState().addGoldenBeans(1);
              this._spawnBannerNotice('✨ Cún cưng đào được 1 Hạt Cà Phê Vàng 🫘!');
            }
          },
        });
      });
    }

    // Cat sitting on left
    if (this.textures.exists('pet_meo_muop')) {
      const cat = this.add.image(width * 0.14, groundY + 44, 'pet_meo_muop');
      cat.setDisplaySize(38, 42);
      cat.setInteractive();

      cat.on('pointerdown', () => {
        this.tweens.add({
          targets: cat,
          scaleX: cat.scaleX * 1.15,
          scaleY: cat.scaleY * 0.88,
          duration: 100,
          yoyo: true,
          onComplete: () => {
            const meow = this.add.text(cat.x, cat.y - 18, '🐱 Meo~ ❤️', {
              fontSize: '11px',
              color: '#FF7675',
              fontStyle: 'bold',
            }).setOrigin(0.5);
            this.tweens.add({
              targets: meow,
              y: meow.y - 18,
              alpha: 0,
              duration: 900,
              onComplete: () => meow.destroy(),
            });
          },
        });
      });
    }
  }

  private _startCustomerSpawner() {
    this.customerSpawnTimer = this.time.addEvent({
      delay: 3500,
      loop: true,
      callback: () => {
        const store = useGameStore.getState();
        if (store.dayPhase !== 'OPEN') return;
        this._trySpawnCustomer();
      },
    });
  }

  private _startStaffAutomationTimer() {
    this.time.addEvent({
      delay: 2200,
      loop: true,
      callback: () => {
        const store = useGameStore.getState();
        if (store.dayPhase !== 'OPEN') return;

        // 1. Barista Apprentice Auto-Brew
        const baristaLvl = store.upgrades['staff_barista_1'] || 0;
        if (baristaLvl > 0 && !this.isBrewing) {
          const waitingCust = this.customers.find((c) => c.status === 'WAITING_DRINK');
          if (waitingCust && waitingCust.orderRecipe) {
            const recipeId = waitingCust.orderRecipe.id;
            if (store.hasIngredientsForDrink(recipeId)) {
              store.consumeIngredientsForDrink(recipeId);
              const basePrice = waitingCust.orderRecipe.basePrice;
              const bonusTip = Math.round(basePrice * 0.2);
              const totalEarned = basePrice + bonusTip;
              const repEarned = 2;

              store.addGold(totalEarned);
              store.addReputation(repEarned);
              store.recordDrinkSale(basePrice, bonusTip, repEarned);
              SoundManager.playCoinTing();

              this._handleManualBrewCompleted({
                seatIndex: waitingCust.seat.index,
                recipeId,
                isPerfect: true,
                totalEarned,
              });
              this._spawnBannerNotice(`☕ Bạn phụ quán vừa auto pha 1 ly ${waitingCust.orderRecipe.name}!`);
            }
          }
        }

        // 2. Cat Shipper Auto-Clean Tables
        const catShipperLvl = store.upgrades['staff_cat_shipper'] || 0;
        if (catShipperLvl > 0 && store.dirtyTables.length > 0) {
          this._handleCleanAllTables();
          this._spawnBannerNotice('🐱 Mèo Mướp chăm chỉ vừa dọn sạch bàn ghế!');
        }
      },
    });
  }

  private _trySpawnCustomer() {
    const emptySeat = this.seats.find((s) => !s.occupied);
    if (!emptySeat) return;

    const store = useGameStore.getState();
    const availableCustomers = getCustomers().filter(
      (c) => c.minStage <= store.currentStage && c.id !== 'co_ve_so'
    );
    if (availableCustomers.length === 0) return;

    const config = Phaser.Utils.Array.GetRandom(availableCustomers);
    const stageRecipes = getRecipesByStage(store.currentStage);
    // Customer order pool strictly selects from unlockedRecipes, completely excluding tra_da and non-chargeable items
    const unlockedIds = Object.keys(store.unlockedRecipes || {});
    const availableRecipes = stageRecipes.filter(
      (r) => unlockedIds.includes(r.id) && r.id !== 'tra_da' && r.basePrice > 0
    );
    const validRecipes =
      availableRecipes.length > 0
        ? availableRecipes
        : stageRecipes.filter((r) => r.id !== 'tra_da' && r.basePrice > 0);

    emptySeat.occupied = true;
    const customer = new Customer(this, config, emptySeat, validRecipes);
    this.customers.push(customer);
  }

  private _setupEventBusListeners() {
    EventBus.on('request-brew', this._handleRequestBrew, this);
    EventBus.on('manual-brew-completed', this._handleManualBrewCompleted, this);
    EventBus.on('customer-finished-drinking', this._handleCustomerFinished, this);
    EventBus.on('event-started', this._onEventStarted, this);
    EventBus.on('event-resolved', this._onEventResolved, this);
    EventBus.on('clean-all-tables', this._handleCleanAllTables, this);
    EventBus.on('hotkey-space', () => {
      const waitingCust = this.customers.find((c) => c.status === 'WAITING_DRINK');
      if (waitingCust) {
        waitingCust._handlePointerDown();
      } else if (useGameStore.getState().dirtyTables.length > 0) {
        this._handleCleanAllTables();
      }
    });
  }

  private _handleRequestBrew(data: { customer: Customer; recipe: RecipeConfig }) {
    if (this.isBrewing) return;

    const store = useGameStore.getState();
    if (!store.hasIngredientsForDrink(data.recipe.id)) {
      this._spawnBannerNotice('⚠️ Hết nguyên liệu! Vui lòng mua thêm trong ca sau.');
      EventBus.emit('customer-speak', {
        name: 'Nhân viên',
        dialogue: 'Dạ quán tạm hết nguyên liệu cho món này rồi ạ!',
      });
      return;
    }

    // Deduct ingredients immediately
    store.consumeIngredientsForDrink(data.recipe.id);

    // Open Interactive Hands-on Coffee Bar Station Modal
    store.startManualBrewing({
      customerSeatIndex: data.customer.seat.index,
      customerName: data.customer.config.name,
      recipeId: data.recipe.id,
      recipeName: data.recipe.name,
      price: data.recipe.basePrice,
    });
  }

  private _handleManualBrewCompleted(data: {
    seatIndex: number;
    recipeId: string;
    isPerfect: boolean;
    totalEarned: number;
  }) {
    const targetCustomer = this.customers.find(
      (c) => c.seat.index === data.seatIndex && c.status === 'WAITING_DRINK'
    );
    if (!targetCustomer) return;

    // Barista pours animation
    if (this.barista && this.anims.exists('barista-pour')) {
      this.barista.play('barista-pour');
      this.time.delayedCall(1200, () => {
        if (this.barista && this.anims.exists('barista-idle')) {
          this.barista.play('barista-idle');
        }
      });
    }

    // Flying drink cup animation to customer
    const spriteKey = this.textures.exists(data.recipeId) ? data.recipeId : 'cf_sua_da';
    const flyingCup = this.add.image(this.counterX, this.counterY - 48, spriteKey);
    flyingCup.setDisplaySize(24, 30);

    this.tweens.add({
      targets: flyingCup,
      x: targetCustomer.x,
      y: targetCustomer.y - 25,
      duration: 350,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        flyingCup.destroy();
        this._spawnFloatingCoin(targetCustomer.x, targetCustomer.y - 40, data.totalEarned, data.isPerfect);
        targetCustomer.onServed(true, data.isPerfect);
      },
    });
  }

  private _handleCustomerFinished(data: { seatIndex: number }) {
    const tableIndex = data.seatIndex <= 1 ? 0 : 1;
    useGameStore.getState().addDirtyTable(tableIndex);
  }

  private _handleCleanAllTables() {
    const totalTip = useGameStore.getState().cleanAllDirtyTables();
    if (totalTip > 0) {
      const { width, height } = this.scale;
      this._spawnFloatingCoin(width * 0.5, height * 0.48, totalTip, true);
      this._spawnBannerNotice(`🧹 Đã dọn sạch tất cả bàn! +${formatVND(totalTip)} Tip!`);
    }
  }

  private _spawnFloatingCoin(x: number, y: number, amount: number, isTip: boolean) {
    SoundManager.playCoinTing();
    const textStr = `+${formatVND(amount)}${isTip ? ' ✨' : ''}`;
    const coinText = this.add.text(x, y, textStr, {
      fontSize: isTip ? '12px' : '11px',
      color: isTip ? '#FFD700' : '#FFF3D6',
      stroke: '#2D1B0E',
      strokeThickness: 3,
      fontStyle: 'bold',
    });
    coinText.setOrigin(0.5);

    this.tweens.add({
      targets: coinText,
      y: y - 45,
      alpha: { from: 1, to: 0 },
      duration: 1400,
      ease: 'Power1',
      onComplete: () => coinText.destroy(),
    });
  }

  private _onEventStarted(event: { id: string }) {
    if (event.id === 'mua_rao') {
      this.isRaining = true;
      this._renderSky(true);
      if (!this.rainLayer) this.rainLayer = this.add.graphics();
      this.rainDrops = [];
      const { width, height } = this.scale;
      for (let i = 0; i < 45; i++) {
        this.rainDrops.push({
          x: Phaser.Math.Between(0, width),
          y: Phaser.Math.Between(0, height),
          speed: Phaser.Math.Between(10, 18),
          len: Phaser.Math.Between(12, 22),
        });
      }
    }
  }

  private _onEventResolved(result: { id: string; success: boolean; viaNeighbor?: boolean }) {
    const store = useGameStore.getState();

    if (result.id === 'mua_rao') {
      this.isRaining = false;
      this._renderSky(false);
      this.rainLayer?.clear();

      if (result.success) {
        store.setRainTipBoost(30);
        this._spawnBannerNotice('🌈 Đã căng bạt che mưa! +30% Tip');
      } else {
        this.customers.forEach((c) => c.leaveAngry());
        this._spawnBannerNotice('🌧️ Mưa ướt, khách chạy trú hết!');
      }
    } else if (result.id === 'trat_tu_do_thi') {
      if (result.viaNeighbor) {
        this._spawnBannerNotice('🏠 Cô Bảy cho nép hiên nhà! Thoát phạt 100%!');
      } else if (result.success) {
        store.addGold(10000);
        this._spawnBannerNotice('👮 Thu ghế kịp thời! Thưởng trật tự +10.000đ');
      } else {
        const fine = Math.min(50000, Math.round(store.gold * 0.15));
        store.spendGold(fine);
        this._spawnBannerNotice(`⚠️ Bị phạt ${formatVND(fine)} do lấn chiếm!`);
      }
    } else if (result.id === 'cup_dien') {
      if (result.success) {
        store.setRainTipBoost(25);
        this._spawnBannerNotice('🪭 Quạt nan Cô Tư mát rượi! Khách thích thú +25% Tip');
      } else {
        this._spawnBannerNotice('😓 Cúp điện oi bức! Khách lắc đầu rời đi');
      }
    } else if (result.id === 'thanh_tra_vsattp') {
      if (result.success) {
        store.addReputation(5);
        this._spawnBannerNotice('🏆 Vỉa hè sạch bong! Đạt chuẩn VSATTP +5 ⭐ Uy Tín!');
      } else {
        store.spendGold(15000);
        this._spawnBannerNotice('⚠️ Bị nhắc nhở vệ sinh! Đóng phạt 15.000đ');
      }
    }
  }

  private _spawnBannerNotice(msg: string) {
    const { width, height } = this.scale;
    const banner = this.add.text(width * 0.5, height * 0.36, msg, {
      fontSize: '11px',
      color: '#FFF3D6',
      backgroundColor: '#2D1B0Eee',
      padding: { x: 10, y: 5 },
      fontStyle: 'bold',
      align: 'center',
    });
    banner.setOrigin(0.5);

    this.tweens.add({
      targets: banner,
      alpha: { from: 1, to: 0 },
      y: banner.y - 20,
      delay: 2400,
      duration: 800,
      onComplete: () => banner.destroy(),
    });
  }

  update(time: number, delta: number) {
    this.customers = this.customers.filter((c) => c.scene !== undefined);
    this.customers.forEach((c) => c.update(time, delta));

    if (this.isRaining && this.rainLayer) {
      this.rainLayer.clear();
      this.rainLayer.lineStyle(1.5, 0x90caf9, 0.7);
      const { width, height } = this.scale;

      this.rainDrops.forEach((drop) => {
        this.rainLayer!.lineBetween(drop.x, drop.y, drop.x - 3, drop.y + drop.len);
        drop.y += drop.speed;
        drop.x -= 1;
        if (drop.y > height) {
          drop.y = -10;
          drop.x = Phaser.Math.Between(0, width);
        }
      });
    }

    const store = useGameStore.getState();
    const now = Date.now();

    // Check Friend Helper automation during peak hours
    if (store.friendHelperActiveUntil && store.friendHelperActiveUntil > now) {
      if (store.dirtyTables.length > 0) {
        const tip = store.cleanAllDirtyTables();
        if (tip > 0) {
          this._spawnBannerNotice(`🛵 Bạn thân dọn sạch bàn! Thu thêm ${formatVND(tip)} Tip!`);
        }
      }
    } else if (
      this.customers.length >= 3 &&
      store.dayPhase === 'OPEN' &&
      now - this.lastFriendHelpCheck > 45000
    ) {
      this.lastFriendHelpCheck = now;
      // 30% chance friend drives by to help
      if (Math.random() < 0.35) {
        store.activateFriendHelper(25);
        this._spawnBannerNotice('🛵 Bạn thân ghé phụ quán 25s! Tự động dọn bàn.');
        EventBus.emit('customer-speak', {
          name: 'Bạn Thân',
          dialogue: 'Thấy quán đông quá, tui tạt qua phụ bưng bê dọn bàn cho nè!',
        });
      }
    }

    // Check Barista Staff Automation (Stage 2: staff_barista_1)
    const baristaLevel = store.upgrades['staff_barista_1'] || 0;
    if (baristaLevel > 0 && !this.isBrewing && store.dayPhase === 'OPEN') {
      const waitingCustomer = this.customers.find(
        (c) => c.status === 'WAITING_DRINK' && c.orderRecipe
      );
      if (waitingCustomer && waitingCustomer.orderRecipe) {
        if (store.hasIngredientsForDrink(waitingCustomer.orderRecipe.id)) {
          // 40% chance per frame check to auto-serve
          if (Math.random() < 0.02) {
            store.consumeIngredientsForDrink(waitingCustomer.orderRecipe.id);
            const recipe = waitingCustomer.orderRecipe;
            const earned = Math.round(recipe.basePrice * (1 + (store.rainTipBoostUntil > now ? 0.3 : 0)));
            store.recordDrinkSale(recipe.basePrice, earned - recipe.basePrice, recipe.reputationGain);
            store.incrementQuestProgress('brew', 1);
            store.incrementQuestProgress('revenue', earned);

            this._handleManualBrewCompleted({
              seatIndex: waitingCustomer.seat.index,
              recipeId: recipe.id,
              isPerfect: false,
              totalEarned: earned,
            });
            this._spawnBannerNotice(`🧑‍🍳 Barista phụ quán tự pha ${recipe.name}!`);
          }
        }
      }
    }

    if (store.dayPhase === 'OPEN') {
      const isEnded = store.tickDayTimer(delta / 1000);
      if (isEnded) {
        this._spawnBannerNotice('🔔 HẾT GIỜ BÁN HÔM NAY!');
        this.customers.forEach((c) => {
          if (c.status !== 'DRINKING') c.leaveHappy();
        });
      }
    }
  }

  destroy() {
    if (this.customerSpawnTimer) this.customerSpawnTimer.remove();
    this.eventManager?.destroy();
    EventBus.off('request-brew', this._handleRequestBrew, this);
    EventBus.off('manual-brew-completed', this._handleManualBrewCompleted, this);
    EventBus.off('customer-finished-drinking', this._handleCustomerFinished, this);
    EventBus.off('event-started', this._onEventStarted, this);
    EventBus.off('event-resolved', this._onEventResolved, this);
    EventBus.off('clean-all-tables', this._handleCleanAllTables, this);
  }
}
