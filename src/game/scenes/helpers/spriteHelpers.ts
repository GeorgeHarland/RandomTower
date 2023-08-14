declare var require: any; // to allow require.context

export const loadSprites = (scene: Phaser.Scene): void => {
  scene.load.spritesheet('towerSpriteSheet', 'sprites/tower.png', {
    frameWidth: 64,
    frameHeight: 128,
  });

  scene.load.image('arrowScope', 'sprites/powerupIcons/arrow-scope.png');
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
