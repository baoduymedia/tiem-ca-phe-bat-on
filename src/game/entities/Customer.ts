import Phaser from 'phaser';
import type { CustomerConfig, RecipeConfig } from '../../data/gameData';
import { EventBus } from '../EventBus';

export type CustomerStatus =
  | 'ENTERING'
  | 'WAITING_ORDER'
  | 'WAITING_DRINK'
  | 'DRINKING'
  | 'LEAVING';

export interface CustomerSeat {
  index: number;
  x: number;
  y: number;
  occupied: boolean;
}

export class Customer extends Phaser.GameObjects.Container {
  public config: CustomerConfig;
  public seat: CustomerSeat;
  public status: CustomerStatus = 'ENTERING';
  public orderRecipe: RecipeConfig | null = null;
  public orderQuantity: number = 1;
  public patienceMax: number;
  public patienceCurrent: number;

  private bodyGraphic: Phaser.GameObjects.Graphics;
  private spriteImage?: Phaser.GameObjects.Image;
  private bubbleContainer: Phaser.GameObjects.Container;
  private dialogueText: Phaser.GameObjects.Text;
  private patienceBar: Phaser.GameObjects.Graphics;
  private isDestroyed: boolean = false;
  private walkBounceTween?: Phaser.Tweens.Tween;
  private idleBreathingTween?: Phaser.Tweens.Tween;
  private baseScaleX: number = 1;
  private baseScaleY: number = 1;
  private emoteSprite?: Phaser.GameObjects.Sprite;

  constructor(
    scene: Phaser.Scene,
    config: CustomerConfig,
    seat: CustomerSeat,
    availableRecipes: RecipeConfig[]
  ) {
    // Start slightly off-screen or at ground entrance
    const startX = seat.x < scene.scale.width / 2 ? -50 : scene.scale.width + 50;
    const startY = seat.y + 10;
    super(scene, startX, startY);

    this.config = config;
    this.seat = seat;
    this.patienceMax = config.patienceSec * 1000;
    this.patienceCurrent = this.patienceMax;

    // Pick a favorite recipe or random available recipe (strictly paid beverages, excluding tra_da)
    const paidBeverages = availableRecipes.filter((r) => r.id !== 'tra_da' && r.basePrice > 0);
    const validPool = paidBeverages.length > 0 ? paidBeverages : availableRecipes;
    const matchingRecipes = validPool.filter((r) =>
      config.favoriteRecipes.includes(r.id)
    );
    this.orderRecipe =
      matchingRecipes.length > 0
        ? Phaser.Utils.Array.GetRandom(matchingRecipes)
        : Phaser.Utils.Array.GetRandom(validPool);

    // Quantity
    this.orderQuantity = Phaser.Math.Between(
      config.orderQuantityRange[0],
      config.orderQuantityRange[1]
    );

    // Graphic representation
    this.bodyGraphic = scene.add.graphics();
    this.add(this.bodyGraphic);

    // Customer sprite key mapping (All human recognizable characters, no boards)
    const keyMap: Record<string, string> = {
      xe_om: 'khach_xe_om',
      co_ve_so: 'khach_hang_xom', // Fallback to Co Bay Hang Xom if old save
      hang_xom: 'khach_hang_xom',
      shipper: 'khach_shipper',
      sinh_vien: 'khach_sinh_vien',
      kol: 'khach_kol',
    };
    const spriteKey = keyMap[config.id] || `khach_${config.id}`;

    if (scene.textures.exists(spriteKey)) {
      // Draw subtle shadow under feet
      this.bodyGraphic.fillStyle(0x000000, 0.25);
      this.bodyGraphic.fillEllipse(0, 0, 36, 11);

      this.spriteImage = scene.add.image(0, -32, spriteKey);
      if (config.id === 'xe_om') {
        this.spriteImage.setDisplaySize(64, 74);
      } else if (config.id === 'co_ve_so' || config.id === 'hang_xom') {
        this.spriteImage.setDisplaySize(42, 76);
      } else {
        this.spriteImage.setDisplaySize(38, 76);
      }
      this.baseScaleX = this.spriteImage.scaleX;
      this.baseScaleY = this.spriteImage.scaleY;
      this.add(this.spriteImage);
    } else {
      this.baseScaleX = 1;
      this.baseScaleY = 1;
      this._drawVectorBody();
    }

    // Speech / Order Bubble Container placed neatly above customer head
    // Staggered X and Y offsets to completely prevent overlaps between adjacent seats
    const offsetX = (this.seat.index === 0 || this.seat.index === 2) ? -10 : 10;
    const bubbleOffsetY = this.seat.index % 2 === 0 ? -52 : -68;
    this.bubbleContainer = scene.add.container(offsetX, bubbleOffsetY);
    this.add(this.bubbleContainer);

    // Integrated patience bar inside bubble container
    this.patienceBar = scene.add.graphics();
    this.bubbleContainer.add(this.patienceBar);

    this.dialogueText = scene.add.text(0, 0, '', {
      fontSize: '8px',
      color: '#2D1B0E',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: 78 },
    });
    this.dialogueText.setOrigin(0.5);

    // Interactive hit area
    this.setSize(50, 70);
    this.setInteractive(
      new Phaser.Geom.Rectangle(-25, -60, 50, 70),
      Phaser.Geom.Rectangle.Contains
    );
    this.on('pointerdown', this._handlePointerDown, this);

    scene.add.existing(this);
    this._startWalkingToSeat();
  }

  private _drawVectorBody() {
    const g = this.bodyGraphic;
    g.clear();

    // Archetype color coding
    let color = 0x6f4e37;
    let label = 'Khách';
    if (this.config.id === 'xe_om') {
      color = 0x2e7d32; // green shirt
      label = 'Chú Ba';
    } else if (this.config.id === 'co_ve_so') {
      color = 0x8d6e63; // brown nón lá
      label = 'Cô Tư';
    } else if (this.config.id === 'hang_xom') {
      color = 0x7b1fa2; // purple
      label = 'Cô Bảy';
    }

    // Shadow
    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(0, 0, 32, 10);

    // Body
    g.fillStyle(color, 1);
    g.fillRoundedRect(-14, -40, 28, 38, 6);

    // Head
    g.fillStyle(0xffe0bd, 1);
    g.fillCircle(0, -48, 12);

    // Hat / Hair
    if (this.config.id === 'xe_om') {
      // Helmet (blue)
      g.fillStyle(0x1976d2, 1);
      g.fillCircle(0, -53, 11);
    } else if (this.config.id === 'co_ve_so') {
      // Nón lá (triangle)
      g.fillStyle(0xd7ccc8, 1);
      g.fillTriangle(-18, -48, 0, -66, 18, -48);
    } else {
      // Hair
      g.fillStyle(0x3e2723, 1);
      g.fillCircle(0, -54, 10);
    }

    // Cute face eyes
    g.fillStyle(0x000000, 1);
    g.fillCircle(-4, -48, 1.5);
    g.fillCircle(4, -48, 1.5);

    // Name label
    const nameLabel = this.scene.add.text(0, -10, label, {
      fontSize: '8px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    nameLabel.setOrigin(0.5);
    this.add(nameLabel);
  }

  private _startWalkingToSeat() {
    this.status = 'ENTERING';

    // Footstep bounce tween while walking
    const bounceTarget = this.spriteImage || this.bodyGraphic;
    const baseOffsetY = bounceTarget.y;
    this.walkBounceTween = this.scene.tweens.add({
      targets: bounceTarget,
      y: baseOffsetY - 4,
      yoyo: true,
      duration: 140,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.scene.tweens.add({
      targets: this,
      x: this.seat.x,
      y: this.seat.y,
      duration: 1200,
      ease: 'Power1',
      onComplete: () => {
        if (this.isDestroyed) return;
        // Stop walking bounce
        this.walkBounceTween?.stop();
        bounceTarget.y = baseOffsetY;

        this.status = 'WAITING_ORDER';
        this._startIdleBreathing();
        this._showOrder();
      },
    });
  }

  public showEmote(frameIndex: number) {
    if (this.emoteSprite) this.emoteSprite.destroy();
    if (this.scene && this.scene.textures.exists('anim_customer_emotes')) {
      this.emoteSprite = this.scene.add.sprite(16, -62, 'anim_customer_emotes', frameIndex);
      this.emoteSprite.setDisplaySize(20, 20);
      this.add(this.emoteSprite);
    }
  }

  private _startIdleBreathing() {
    this.idleBreathingTween?.stop();
    if (this.spriteImage) {
      this.spriteImage.setScale(this.baseScaleX, this.baseScaleY);
    } else if (this.bodyGraphic) {
      this.bodyGraphic.setScale(1, 1);
    }
  }

  private _showOrder() {
    if (!this.orderRecipe || this.isDestroyed) return;

    this.status = 'WAITING_DRINK';
    const bg = this.scene.add.graphics();

    // Pixel Art Speech Bubble (Sharp 2px black border with hard block shadow)
    // 1. Black Pixel Drop Shadow
    bg.fillStyle(0x000000, 0.5);
    bg.fillRect(-39, -16, 84, 38);

    // 2. Pixel Cream Box Body
    bg.fillStyle(0xfffbeb, 1);
    bg.fillRect(-42, -19, 84, 38);
    bg.lineStyle(2, 0x1a0e05, 1);
    bg.strokeRect(-42, -19, 84, 38);

    // 3. Pixel Speech Pointer Tail (pointing towards customer)
    bg.fillStyle(0xfffbeb, 1);
    bg.fillTriangle(-4, 19, 4, 19, 0, 24);
    bg.lineStyle(2, 0x1a0e05, 1);
    bg.lineBetween(-4, 19, 0, 24);
    bg.lineBetween(4, 19, 0, 24);

    // 4. Pixel Drink Thumbnail Frame
    bg.fillStyle(0xe5d0ba, 1);
    bg.fillRect(-37, -14, 25, 28);
    bg.lineStyle(1.5, 0x1a0e05, 1);
    bg.strokeRect(-37, -14, 25, 28);

    const elements: Phaser.GameObjects.GameObject[] = [bg];
    const drinkKey = this.orderRecipe.id;

    if (this.scene.textures.exists(drinkKey)) {
      const drinkImg = this.scene.add.image(-24.5, 0, drinkKey);
      drinkImg.setDisplaySize(18, 22);
      elements.push(drinkImg);
    }

    // Short display name (e.g. "CF SỮA ĐÁ", "BẠC XỈU")
    const cleanName = this.orderRecipe.name
      .replace('Cà Phê', 'CF')
      .split(' (')[0]
      .toUpperCase();

    const text = this.scene.add.text(
      drinkKey ? 9 : 0,
      -5,
      cleanName,
      {
        fontFamily: 'VT323, monospace',
        fontSize: '12px',
        color: '#1A0E05',
        fontStyle: 'bold',
        align: 'left',
      }
    );
    text.setOrigin(0.5);
    elements.push(text);

    const tapText = this.scene.add.text(
      drinkKey ? 9 : 0,
      8,
      '▶ PHA NGAY',
      {
        fontFamily: 'VT323, monospace',
        fontSize: '11px',
        color: '#DC2626',
        fontStyle: 'bold',
        align: 'left',
      }
    );
    tapText.setOrigin(0.5);
    elements.push(tapText);

    this.bubbleContainer.removeAll(true);
    this.bubbleContainer.add(elements);

    // Re-attach integrated patience bar inside bubble container
    this.patienceBar = this.scene.add.graphics();
    this.bubbleContainer.add(this.patienceBar);
    this._updatePatienceBar();

    this.bubbleContainer.setSize(84, 38);
    this.bubbleContainer.setInteractive(
      new Phaser.Geom.Rectangle(-42, -19, 84, 38),
      Phaser.Geom.Rectangle.Contains
    );
    this.bubbleContainer.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      pointer.event.stopPropagation();
      this._handlePointerDown();
    });

    // Gentle floating breathing animation for order bubble
    this.scene.tweens.add({
      targets: this.bubbleContainer,
      y: this.bubbleContainer.y - 3,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Random greeting line from dialogues
    if (this.config.dialogues.order.length > 0) {
      const line = Phaser.Utils.Array.GetRandom(this.config.dialogues.order);
      EventBus.emit('customer-speak', {
        name: this.config.name,
        dialogue: line,
      });
    }

    // Small pop-in bounce animation
    this.bubbleContainer.setScale(0);
    this.scene.tweens.add({
      targets: this.bubbleContainer,
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      ease: 'Back.easeOut',
    });
  }

  public _handlePointerDown() {
    this.playTapReaction();

    if (this.status === 'WAITING_DRINK' && this.orderRecipe) {
      EventBus.emit('request-brew', {
        customer: this,
        recipe: this.orderRecipe,
      });
    }
  }

  public playTapReaction() {
    if (this.spriteImage) {
      this.scene.tweens.add({
        targets: this.spriteImage,
        scaleX: this.baseScaleX * 1.08,
        scaleY: this.baseScaleY * 0.92,
        duration: 120,
        yoyo: true,
        ease: 'Back.easeOut',
        onComplete: () => {
          if (this.spriteImage && !this.isDestroyed) {
            this.spriteImage.setScale(this.baseScaleX, this.baseScaleY);
          }
        },
      });
    } else if (this.bodyGraphic) {
      this.scene.tweens.add({
        targets: this.bodyGraphic,
        scaleX: 1.08,
        scaleY: 0.92,
        duration: 120,
        yoyo: true,
        ease: 'Back.easeOut',
        onComplete: () => {
          if (this.bodyGraphic && !this.isDestroyed) {
            this.bodyGraphic.setScale(1, 1);
          }
        },
      });
    }

    // Floating heart / music note
    const icon = Phaser.Utils.Array.GetRandom(['💖', '🎵', '✨']);
    const floatText = this.scene.add.text(0, -50, icon, {
      fontSize: '14px',
    });
    floatText.setOrigin(0.5);
    this.add(floatText);

    this.scene.tweens.add({
      targets: floatText,
      y: -75,
      alpha: { from: 1, to: 0 },
      duration: 900,
      ease: 'Power1',
      onComplete: () => floatText.destroy(),
    });
  }

  public onServed(isSuccess: boolean, tipBonus: boolean = false) {
    if (this.isDestroyed) return;

    if (!isSuccess) {
      this.leaveAngry();
      return;
    }

    this.status = 'DRINKING';
    this.bubbleContainer.removeAll(true);
    this.idleBreathingTween?.stop();
    this.showEmote(1); // Happy face emote

    // Happy celebratory bounce
    const bounceTarget = this.spriteImage || this.bodyGraphic;
    const baseOffsetY = bounceTarget.y;
    this.scene.tweens.add({
      targets: bounceTarget,
      y: baseOffsetY - 12,
      duration: 220,
      yoyo: true,
      repeat: 1,
      ease: 'Back.easeOut',
      onComplete: () => {
        bounceTarget.y = baseOffsetY;
        this._startIdleBreathing();
      },
    });

    // Spawn floating sparkles/coins around customer
    for (let i = 0; i < 3; i++) {
      const sparkle = this.scene.add.text(
        (i - 1) * 16,
        -40,
        tipBonus ? '🪙' : '✨',
        { fontSize: '13px' }
      );
      sparkle.setOrigin(0.5);
      this.add(sparkle);

      this.scene.tweens.add({
        targets: sparkle,
        y: -75 - i * 8,
        x: (i - 1) * 26,
        alpha: { from: 1, to: 0 },
        duration: 1000 + i * 200,
        ease: 'Power1',
        onComplete: () => sparkle.destroy(),
      });
    }

    // Show heart / happy bubble
    const happyText = this.scene.add.text(0, -35, tipBonus ? '💖 TIP!' : '😋 Ngon!', {
      fontSize: '12px',
      color: tipBonus ? '#FFD700' : '#E04F4F',
      fontStyle: 'bold',
    });
    happyText.setOrigin(0.5);
    this.add(happyText);

    this.scene.tweens.add({
      targets: happyText,
      y: -60,
      alpha: 0,
      duration: 1200,
      onComplete: () => happyText.destroy(),
    });

    if (this.config.dialogues.happy.length > 0) {
      const line = Phaser.Utils.Array.GetRandom(this.config.dialogues.happy);
      EventBus.emit('customer-speak', {
        name: this.config.name,
        dialogue: line,
      });
    }

    // Drink for 3 seconds then leave
    this.scene.time.delayedCall(3000, () => {
      this.leaveHappy();
    });
  }

  public leaveAngry() {
    if (this.isDestroyed || this.status === 'LEAVING') return;
    this.status = 'LEAVING';
    this.idleBreathingTween?.stop();
    this.bubbleContainer.removeAll(true);
    this.showEmote(3); // Angry frown emote

    const angryText = this.scene.add.text(0, -35, '💢 Lâu quá!', {
      fontSize: '11px',
      color: '#E04F4F',
      fontStyle: 'bold',
    });
    angryText.setOrigin(0.5);
    this.add(angryText);

    if (this.config.dialogues.angry.length > 0) {
      const line = Phaser.Utils.Array.GetRandom(this.config.dialogues.angry);
      EventBus.emit('customer-speak', {
        name: this.config.name,
        dialogue: line,
      });
    }

    this._walkOut();
  }

  public leaveHappy() {
    if (this.isDestroyed || this.status === 'LEAVING') return;
    this.status = 'LEAVING';
    this.idleBreathingTween?.stop();
    EventBus.emit('customer-finished-drinking', { seatIndex: this.seat.index });
    this._walkOut();
  }

  private _walkOut() {
    this.seat.occupied = false;
    this.idleBreathingTween?.stop();

    const bounceTarget = this.spriteImage || this.bodyGraphic;
    const baseOffsetY = bounceTarget.y;
    this.walkBounceTween = this.scene.tweens.add({
      targets: bounceTarget,
      y: baseOffsetY - 4,
      yoyo: true,
      duration: 140,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    const destX = this.x < this.scene.scale.width / 2 ? -60 : this.scene.scale.width + 60;
    this.scene.tweens.add({
      targets: this,
      x: destX,
      alpha: 0,
      duration: 1500,
      ease: 'Power1',
      onComplete: () => {
        this.destroy();
      },
    });
  }

  update(_time: number, delta: number) {
    if (this.status === 'WAITING_DRINK') {
      this.patienceCurrent -= delta;
      this._updatePatienceBar();

      const patienceRatio = this.patienceCurrent / this.patienceMax;
      const target = this.spriteImage || this.bodyGraphic;

      // Subtle shivering shake & sweat emote when impatient (< 25%)
      if (patienceRatio < 0.25) {
        target.x = (Math.random() - 0.5) * 2;
        if (!this.emoteSprite) {
          this.showEmote(2); // Sweat drop emote
        }
      } else {
        target.x = 0;
      }

      if (this.patienceCurrent <= 0) {
        this.leaveAngry();
      }
    } else {
      if (this.patienceBar && this.patienceBar.active) {
        this.patienceBar.clear();
      }
      const target = this.spriteImage || this.bodyGraphic;
      if (target) target.x = 0;
    }
  }

  private _updatePatienceBar() {
    if (!this.patienceBar || !this.patienceBar.active || this.isDestroyed || this.status !== 'WAITING_DRINK') return;

    const pct = Math.max(0, Math.min(1, this.patienceCurrent / this.patienceMax));
    const barW = 70;
    const barH = 3.5;
    const barX = -35;
    const barY = -16.5;

    this.patienceBar.clear();
    // Integrated bubble track background
    this.patienceBar.fillStyle(0x2d1b0e, 0.25);
    this.patienceBar.fillRoundedRect(barX, barY, barW, barH, 2);

    // Dynamic gradient color: green (>55%), amber (25-55%), red (<25%)
    let color = 0x5c9e54;
    if (pct < 0.25) {
      color = 0xe04f4f;
    } else if (pct < 0.55) {
      color = 0xffd700;
    }

    this.patienceBar.fillStyle(color, 1);
    this.patienceBar.fillRoundedRect(barX, barY, Math.max(3, barW * pct), barH, 2);
  }

  destroy(fromScene?: boolean) {
    this.isDestroyed = true;
    this.seat.occupied = false;
    this.walkBounceTween?.stop();
    this.idleBreathingTween?.stop();
    super.destroy(fromScene);
  }
}
