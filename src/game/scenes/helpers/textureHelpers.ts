import { MOBILE_BREAKPOINT } from '../../../constants';
import EnemyHealthBar from '../../classes/EnemyHealthBar';
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

  const arrowGraphic = objectCreator.graphics();
  arrowGraphic.fillStyle(0x000000, 1);
  arrowGraphic.fillRect(0, 0, scene.scale.width / 60, scene.scale.width / 150);
  arrowGraphic.generateTexture('arrowTexture', 12, 3);

  const shopBoxTexture = objectCreator.graphics();
  const shopBoxSize =
    scene.scale.width > MOBILE_BREAKPOINT
      ? scene.scale.width / 10
      : scene.scale.width / 8;
  const bevelSize = shopBoxSize / 18;
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

export const drawHealthBar = (healthBar: EnemyHealthBar) => {
    // black background
    healthBar.fillStyle(0x000000);
    healthBar.fillRect(0, 0, healthBar.scene.scale.width / 10, healthBar.scene.scale.width / 50);
    // red health
    healthBar.fillStyle(0xffffff);
    healthBar.fillRect(2, 2, healthBar.scene.scale.width / 10.5, healthBar.scene.scale.width / 64);
    if (healthBar.currentValue < 30) {
      healthBar.fillStyle(0xff0000);
    } else {
      healthBar.fillStyle(0x00ff00);
    }
    healthBar.fillRect(2, 2, (healthBar.currentValue / healthBar.maxValue) * healthBar.scene.scale.width / 10.5, healthBar.scene.scale.width / 64);
}