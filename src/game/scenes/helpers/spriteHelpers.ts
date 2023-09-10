export const loadSprites = (scene: Phaser.Scene): void => {
  scene.load.spritesheet('towerSpriteSheet', 'sprites/tower.png', {
    frameWidth: 64,
    frameHeight: 128,
  });
  scene.load.spritesheet(
    'timeSlowAnimationSheet',
    'sprites/spellEffects/time/pipo-btleffect214_480.png',
    {
      frameWidth: 480,
      frameHeight: 480,
    },
  );
  scene.load.spritesheet(
    'healEffectSheet',
    'sprites/spellEffects/heal/heal-effect-sprite-sheet.png',
    {
      frameWidth: 128,
      frameHeight: 128,
    },
  );

  scene.load.image('arrowRate', 'sprites/powerupIcons/arrow-scope.png');
  scene.load.image('circleStrength', 'sprites/powerupIcons/magic-swirl.png');
  scene.load.image('darkBlast', 'sprites/powerupIcons/foamy-disc.png');
  scene.load.image('fireBlast', 'sprites/powerupIcons/flaming-sheet.png');
  scene.load.image('regen', 'sprites/powerupIcons/nested-hearts.png');
  scene.load.image('timeSlow', 'sprites/powerupIcons/embrassed-energy.png');
  scene.load.image('tornado', 'sprites/powerupIcons/tornado.png');

  for (let i = 1; i <= 9; i++) {
    scene.load.image(
      `tornadoRepeat${i}`,
      `sprites/spellEffects/wind/strong/windStrongRepeat000${i}.png`,
    );
  }

  for (let i = 1; i <= 15; i++) {
    scene.load.image(
      `darkBlastSprite${i}`,
      `sprites/spellEffects/dark/6/1_${i - 1}.png`,
    );
  }

  for (let i = 1; i <= 15; i++) {
    scene.load.image(
      `fireBlastSprite${i}`,
      `sprites/spellEffects/fire/1/1_${i - 1}.png`,
    );
  }
};

export const extractTowerFrames = (
  scene: Phaser.Scene,
): Phaser.GameObjects.Image[] => {
  const frameNames = scene.textures.get('towerSpriteSheet').getFrameNames();
  const towerSprites = [];

  for (const frameName of frameNames) {
    const frame = scene.textures.getFrame('towerSpriteSheet', frameName);
    const image = scene.add.image(
      frame.x,
      frame.y,
      'towerSpriteSheet',
      frameName,
    );
    towerSprites.push(image);
  }
  return towerSprites;
};
