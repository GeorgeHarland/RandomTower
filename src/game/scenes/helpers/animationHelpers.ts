import GameStageScene from '../GameStage';

export const setupAnimations = (scene: GameStageScene) => {
  scene.anims.create({
    key: 'circleAnimation',
    frames: Array.from({ length: 1 }, () => ({
      // key: `circleSprite${i}`,
      key: 'circleSprite',
    })),
    frameRate: 14,
    repeat: -1,
  });
  scene.anims.create({
    key: 'darkBlastAnimation',
    frames: Array.from({ length: 15 }, (_, i) => ({
      key: `darkBlastSprite${i + 1}`,
    })),
    frameRate: 14,
    repeat: -1,
  });
  scene.anims.create({
    key: 'fireBlastAnimation',
    frames: Array.from({ length: 15 }, (_, i) => ({
      key: `fireBlastSprite${i + 1}`,
    })),
    frameRate: 14,
    repeat: -1,
  });
  scene.anims.create({
    key: 'poisonCloudStartAnim',
    frames: Array.from({ length: 4 }, (_, i) => ({
      key: `poisonStart${i + 1}`,
    })),
    frameRate: 8,
    repeat: 0,
  });
  scene.anims.create({
    key: 'poisonCloudRepeatAnim',
    frames: Array.from({ length: 5 }, (_, i) => ({
      key: `poisonRepeat${i + 1}`,
    })),
    frameRate: 8,
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
      key: `tornadoRepeat${i + 1}`,
    })),
    frameRate: 28,
    repeat: -1,
  });
  scene.anims.create({
    key: 'iceSpikeAnimation',
    frames: Array.from({ length: 9 }, (_, i) => ({
      key: `iceSpikeImage${i + 1}`,
    })),
    frameRate: 28,
    repeat: -1,
  });
  scene.anims.create({
    key: 'iceExplosionAnimation',
    frames: Array.from({ length: 9 }, (_, i) => ({
      key: `iceExplosionImage${i + 1}`,
    })),
    frameRate: 18,
    repeat: 0,
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
