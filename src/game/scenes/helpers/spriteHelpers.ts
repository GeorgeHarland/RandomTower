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
    }
  );
  scene.load.spritesheet(
    'healEffectSheet',
    'sprites/spellEffects/heal/heal-effect-sprite-sheet.png',
    {
      frameWidth: 128,
      frameHeight: 128,
    }
  );

  scene.load.image('Arrow Rate', 'sprites/powerupIcons/arrow-scope.png');
  scene.load.image('Circle Speed', 'sprites/powerupIcons/magic-swirl.png');
  scene.load.image('Dark Blast', 'sprites/powerupIcons/foamy-disc.png');
  scene.load.image('Fire Blast', 'sprites/powerupIcons/flaming-sheet.png');
  scene.load.image('Ice Spike', 'sprites/powerupIcons/mountaintop.png');
  scene.load.image('Poison Clouds', 'sprites/powerupIcons/foam.png');
  scene.load.image('Regen', 'sprites/powerupIcons/nested-hearts.png');
  scene.load.image('Time Slow', 'sprites/powerupIcons/embrassed-energy.png');
  scene.load.image('Tornado', 'sprites/powerupIcons/tornado.png');

  scene.load.image('circleSprite', 'sprites/spellEffects/circleSprite.png');

  for (let i = 1; i <= 9; i++) {
    scene.load.image(
      `tornadoRepeat${i}`,
      `sprites/spellEffects/wind/strong/windStrongRepeat000${i}.png`
    );
  }

  for (let i = 1; i <= 15; i++) {
    scene.load.image(
      `darkBlastSprite${i}`,
      `sprites/spellEffects/dark/6/1_${i - 1}.png`
    );
  }

  for (let i = 1; i <= 15; i++) {
    scene.load.image(
      `fireBlastSprite${i}`,
      `sprites/spellEffects/fire/1/1_${i - 1}.png`
    );
  }

  for (let i = 1; i <= 4; i++) {
    scene.load.image(
      `poisonStart${i}`,
      `sprites/spellEffects/poison/p${i}.png`
    );
  }

  for (let i = 1; i <= 5; i++) {
    scene.load.image(
      `poisonRepeat${i}`,
      `sprites/spellEffects/poison/pR${i}.png`
    );
  }

  for (let i = 1; i <= 10; i++) {
    scene.load.image(
      `iceSpikeImage${i}`,
      `sprites/spellEffects/ice/VFX 1 Repeatable${i}.png`
    );
  }
  for (let i = 1; i <= 9; i++) {
    scene.load.image(
      `iceExplosionImage${i}`,
      `sprites/spellEffects/ice/weak_ice000${i}.png`
    );
  }
  scene.load.image('icePoolImage', 'sprites/spellEffects/ice/ice_pool2.png');

  scene.load.image('bossSprite', 'sprites/enemies/bossSprite.png');
  scene.load.image('minionSprite', 'sprites/enemies/minionSprite.png');
  scene.load.image('juggernautSprite', 'sprites/enemies/juggernautSprite.png');
};

export const extractTowerFrames = (
  scene: Phaser.Scene
): Phaser.GameObjects.Image[] => {
  const frameNames = scene.textures.get('towerSpriteSheet').getFrameNames();
  const towerSprites: Phaser.GameObjects.Image[] = [];

  for (const frameName of frameNames) {
    const image = scene.add
      .image(0, 0, 'towerSpriteSheet', frameName)
      .setVisible(false);
    towerSprites.push(image);
  }
  return towerSprites;
};
