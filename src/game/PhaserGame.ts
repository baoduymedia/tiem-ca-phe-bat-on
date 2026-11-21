import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { CafeScene } from './scenes/CafeScene';

export function getGameDimensions() {
  const maxW = typeof window !== 'undefined' ? window.innerWidth : 420;
  const maxH = typeof window !== 'undefined' ? window.innerHeight : 840;

  // On Mobile Viewport (< 768px): Fill 100% of device screen
  if (maxW < 768) {
    return { width: maxW, height: maxH };
  }

  // On Desktop / Tablet PC: Centered Retro Arcade Viewport (420 x 746, 9:16 aspect ratio)
  return { width: 420, height: 746 };
}

export function createPhaserGame(
  parent: string | HTMLElement
): Phaser.Game {
  const { width, height } = getGameDimensions();

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
