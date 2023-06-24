declare var require: any; // to allow require.context

export const loadSprites = (scene: Phaser.Scene): void => {
  scene.load.spritesheet('towerSpriteSheet', 'sprites/tower.png', {
    frameWidth: 64,
    frameHeight: 128
  });

  // const images = importAll(require.context('./sprites/powerupicons', false, /\.(png)$/));
  // for(const image of images) {
  //   console.log(image);
  //   const imageName = image.default.replace(/^.*[\\\/]/, '').split('.')[0] + 'Image';
  //   scene.load.image(imageName, image.default);
  // }
}

export const extractSpriteFrames = (scene: Phaser.Scene): Phaser.GameObjects.Image[] => {
  const frameNames = scene.textures.get('towerSpriteSheet').getFrameNames();
  const towerSprites = [];

  for (const frameName of frameNames) {
    const frame = scene.textures.getFrame('towerSpriteSheet', frameName)
    const image = scene.add.image(frame.x, frame.y, 'towerSpriteSheet', frameName);
    towerSprites.push(image)
  }
  return towerSprites;
}

// const importAll = (r: any) => {
//   return r.keys().map(r);
// }
