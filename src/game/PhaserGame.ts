import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { CafeScene } from './scenes/CafeScene';

export function getGameDimensions(isWidescreen: boolean = false) {
  const maxW = typeof window !== 'undefined' ? window.innerWidth : 420;
  const maxH = typeof window !== 'undefined' ? window.innerHeight : 840;

  // On Desktop PC in Widescreen Mode (>= 1024px or explicitly enabled)
  if (isWidescreen || (maxW >= 1024 && isWidescreen !== false)) {
    const targetW = Math.min(maxW - 32, 1180);
    const targetH = Math.min(maxH - 110, 720);
    return { width: Math.round(targetW), height: Math.round(targetH) };
  }

  // On Mobile Viewport (Fill 100% device screen smoothly)
  if (maxW < 768) {
    return { width: maxW, height: maxH };
  }

  // Tablet / Medium screen centered portrait (max 480px width)
  const capW = Math.min(maxW, 460);
  const capH = Math.min(maxH, 920);
  let w = capW;
  let h = Math.round(w * (16 / 9));

  if (h > capH) {
    h = capH;
    w = Math.round(h * (9 / 16));
  }

  return { width: w, height: h };
}

export function createPhaserGame(
  parent: string | HTMLElement,
  isWidescreen: boolean = false
): Phaser.Game {
  const { width, height } = getGameDimensions(isWidescreen);

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width,
    height,
    parent,
    backgroundColor: '#FFF8E7',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, CafeScene],
    render: {
      pixelArt: true,
      antialias: false,
      antialiasGL: false,
      roundPixels: true,
    },
  };

  return new Phaser.Game(config);
}
