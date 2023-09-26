export const generateTextures = (
  objectCreator: Phaser.GameObjects.GameObjectCreator
) => {
  const bgGraphic = objectCreator.graphics();
  bgGraphic.fillStyle(0x448811, 1);
  bgGraphic.fillRect(0, 0, 200, 200);
  // random grass texture
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * 200;
    const y = Math.random() * 200;
    const w = 1 + Math.random() * 2;
    const h = 1 + Math.random() * 2;
    bgGraphic.fillStyle(0x226600, 1);
    bgGraphic.fillRect(x, y, w, h);
  }
  bgGraphic.generateTexture('bgTexture', 200, 200);

  const towerGraphic = objectCreator.graphics();
  towerGraphic.fillStyle(0x000000, 1);
  towerGraphic.fillRect(0, 0, 40, 40);
  towerGraphic.fillStyle(0x888888, 1);
  towerGraphic.fillRect(2, 2, 36, 36);
  towerGraphic.generateTexture('towerTexture', 40, 40);

  const circleGraphic = objectCreator.graphics();
  circleGraphic.fillStyle(0xffff00, 1);
  circleGraphic.fillCircle(15, 15, 15);
  circleGraphic.generateTexture('circleTexture', 30, 30);

  const enemyGraphic = objectCreator.graphics();
  enemyGraphic.fillStyle(0x000000, 1);
  enemyGraphic.fillRect(0, 0, 10, 10);
  enemyGraphic.fillStyle(0xdd3333, 1);
  enemyGraphic.fillRect(1, 1, 8, 8);
  enemyGraphic.generateTexture('enemyTexture', 10, 10);

  const juggernautGraphic = objectCreator.graphics();
  juggernautGraphic.fillStyle(0x000000, 1);
  juggernautGraphic.fillRect(0, 0, 20, 20);
  juggernautGraphic.fillStyle(0xdd33dd, 1);
  juggernautGraphic.fillRect(1, 1, 18, 18);
  juggernautGraphic.generateTexture('juggernautTexture', 20, 20);

  const arrowGraphic = objectCreator.graphics();
  arrowGraphic.fillStyle(0x000000, 1);
  arrowGraphic.fillRect(0, 0, 12, 3);
  arrowGraphic.generateTexture('arrowTexture', 12, 3);

  const shopBoxTexture = objectCreator.graphics();
  shopBoxTexture.fillStyle(0x000000, 1);
  shopBoxTexture.fillRect(0, 0, 80, 80);
  shopBoxTexture.fillStyle(0xa52a2a, 1);
  shopBoxTexture.fillRect(2, 2, 76, 76);
  shopBoxTexture.generateTexture('shopBoxTexture', 80, 80);
};
