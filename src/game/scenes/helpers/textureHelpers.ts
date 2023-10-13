import GameStageScene from '../GameStage';

export const generateTextures = (scene: GameStageScene) => {
  const objectCreator = scene.make;
  // initial light green background
  const bgGraphic = objectCreator.graphics();
  bgGraphic.fillStyle(0x448811, 1);
  bgGraphic.fillRect(0, 0, scene.scale.width, scene.scale.height);
  // random darker grass dotted about
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * 200;
    const y = Math.random() * 200;
    const w = 1 + Math.random() * 2;
    const h = 1 + Math.random() * 2;
    bgGraphic.fillStyle(0x226600, 1);
    bgGraphic.fillRect(x, y, w, h);
  }
  bgGraphic.generateTexture('bgTexture', 200, 200);

  const circleGraphic = objectCreator.graphics();
  circleGraphic.fillStyle(0xffff00, 1);
  const circleSize = scene.scale.width / 22;
  circleGraphic.fillCircle(circleSize / 2, circleSize / 2, circleSize / 2);
  circleGraphic.generateTexture('circleTexture', circleSize, circleSize);

  const enemyGraphic = objectCreator.graphics();
  enemyGraphic.fillStyle(0x000000, 1);
  const enemySize = scene.scale.width / 80;
  const enemyPadding = scene.scale.width > 700 ? enemySize / 12 : enemySize / 6;
  enemyGraphic.fillRect(0, 0, enemySize, enemySize);
  enemyGraphic.fillStyle(0xdd3333, 1);
  enemyGraphic.fillRect(
    enemyPadding,
    enemyPadding,
    enemySize - enemyPadding * 2,
    enemySize - enemyPadding * 2
  );
  enemyGraphic.generateTexture('enemyTexture', enemySize, enemySize);

  const juggernautGraphic = objectCreator.graphics();
  juggernautGraphic.fillStyle(0x000000, 1);
  const juggernautSize = scene.scale.width / 40;
  const juggernautPadding =
    scene.scale.width > 700 ? juggernautSize / 12 : juggernautSize / 6;
  juggernautGraphic.fillRect(0, 0, juggernautSize, juggernautSize);
  juggernautGraphic.fillStyle(0xdd33dd, 1);
  juggernautGraphic.fillRect(
    juggernautPadding,
    juggernautPadding,
    juggernautSize - juggernautPadding * 2,
    juggernautSize - juggernautPadding * 2
  );
  juggernautGraphic.generateTexture(
    'juggernautTexture',
    juggernautSize,
    juggernautSize
  );

  const arrowGraphic = objectCreator.graphics();
  arrowGraphic.fillStyle(0x000000, 1);
  arrowGraphic.fillRect(0, 0, scene.scale.width / 60, scene.scale.width / 150);
  arrowGraphic.generateTexture('arrowTexture', 12, 3);

  const shopBoxTexture = objectCreator.graphics();
  const shopBoxSize = scene.scale.width / 10;
  const bevelSize =
    scene.scale.width > 700 ? shopBoxSize / 18 : shopBoxSize / 22;
  shopBoxTexture.fillStyle(0xa52a2a, 1);
  shopBoxTexture.fillRect(0, 0, shopBoxSize, shopBoxSize);

  // top bevel
  shopBoxTexture.fillStyle(0xc03a3a, 1);
  shopBoxTexture.fillRect(0, 0, shopBoxSize, bevelSize); // top
  shopBoxTexture.fillRect(0, 0, bevelSize, shopBoxSize); // left
  // bottom bevel
  shopBoxTexture.fillStyle(0x790c0c, 1);
  shopBoxTexture.fillRect(0, shopBoxSize - bevelSize, shopBoxSize, bevelSize); // bottom
  shopBoxTexture.fillRect(shopBoxSize - bevelSize, 0, bevelSize, shopBoxSize); // right
  // inner box
  shopBoxTexture.fillStyle(0x941919, 1);
  shopBoxTexture.fillRect(
    bevelSize,
    bevelSize,
    shopBoxSize - 2 * bevelSize,
    shopBoxSize - 2 * bevelSize
  );

  shopBoxTexture.generateTexture('shopBoxTexture', shopBoxSize, shopBoxSize);
};
