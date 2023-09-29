import GameStageScene from '../GameStage';

export const setupAnimations = (scene: GameStageScene) => {
  scene.anims.create({
    key: 'darkBlastAnimation',
    frames: Array.from({ length: 15 }, (_, i) => ({
      key: `darkBlastSprite${i}`,
    })),
    frameRate: 14,
    repeat: -1,
  });
  scene.anims.create({
    key: 'fireBlastAnimation',
    frames: Array.from({ length: 15 }, (_, i) => ({
      key: `fireBlastSprite${i}`,
    })),
    frameRate: 14,
    repeat: -1,
  });
  scene.anims.create({
    key: 'regenAnimation',
    frames: scene.anims.generateFrameNumbers('healEffectSheet', {
      start: 0,
      end: 15,
    }),
    frameRate: 12,
    repeat: 0,
  });
  scene.anims.create({
    key: 'timeSlowAnimation',
    frames: scene.anims.generateFrameNumbers('timeSlowAnimationSheet', {
      start: 0,
      end: 14,
    }),
    frameRate: 12,
    repeat: 1,
  });
  scene.anims.create({
    key: 'tornadoAnimation',
    frames: Array.from({ length: 9 }, (_, i) => ({
      key: `tornadoRepeat${i}`,
    })),
    frameRate: 28,
    repeat: -1,
  });
};

export const setupKeybindings = (scene: GameStageScene) => {
  if (scene.input.keyboard) {
    scene.keyQ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    scene.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    scene.keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    scene.keyU = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
    scene.keyK = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
  }
};
