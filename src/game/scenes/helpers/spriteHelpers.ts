declare var require: any; // to allow require.context

export const loadSprites = (scene: Phaser.Scene): void => {
  scene.load.spritesheet('towerSpriteSheet', 'sprites/tower.png', {
    frameWidth: 64,
    frameHeight: 128,
  });
  scene.load.spritesheet('timeSlowAnimationSheet', 'sprites/spellEffects/time/pipo-btleffect214_480.png', {
    frameWidth: 480,
    frameHeight: 480,
  });

  scene.load.image('arrowRate', 'sprites/powerupIcons/arrow-scope.png');
  // scene.load.image('aura', 'sprites/powerupIcons/aura.png');
  // scene.load.image('bladeDrag', 'sprites/powerupIcons/blade-drag.png');
  // scene.load.image('clawSlashes', 'sprites/powerupIcons/claw-slashes.png');
  // scene.load.image(
  //   'crossedAirFlows',
  //   'sprites/powerupIcons/crossed-air-flows.png',
  // );
  // scene.load.image('eggDefense', 'sprites/powerupIcons/egg-defense.png');
  // scene.load.image(
  //   'electricalCrescent',
  //   'sprites/powerupIcons/electrical-crescent.png',
  // );
  // scene.load.image(
  //   'embrassedEnergy',
  //   'sprites/powerupIcons/embrassed-energy.png',
  // );
  // scene.load.image('eyestalk', 'sprites/powerupIcons/eyestalk.png');
  scene.load.image('circleSpeed', 'sprites/powerupIcons/magic-swirl.png');
  scene.load.image('timeSlow', 'sprites/powerupIcons/aura.png');
  scene.load.image('tornado', 'sprites/powerupIcons/tornado.png');

  for (let i = 1; i <= 9; i++) {
    scene.load.image(
      `tornadoRepeat${i}`,
      `sprites/spellEffects/wind/strong/windStrongRepeat000${i}.png`,
    );
  }
};

export const extractSpriteFrames = (
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
