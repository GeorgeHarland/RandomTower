const generateTextures = (objectCreator: any) => {
  let bgGraphic = objectCreator.graphics();
  bgGraphic.fillStyle(0x448811, 1)
  bgGraphic.fillRect(0, 0, 200, 200)
  bgGraphic.generateTexture('bgTexture', 200, 200)

  let towerGraphic = objectCreator.graphics();
  towerGraphic.fillStyle(0x000000, 1)
  towerGraphic.fillRect(0, 0, 40, 40)
  towerGraphic.fillStyle(0x888888, 1)
  towerGraphic.fillRect(2, 2, 36, 36)
  towerGraphic.generateTexture('towerTexture', 40, 40)

  let circleGraphic = objectCreator.graphics();
  circleGraphic.fillStyle(0xffff00, 1)
  circleGraphic.fillCircle(15, 15, 15)
  circleGraphic.generateTexture('circleTexture', 30, 30)

  let enemyGraphic = objectCreator.graphics();
  enemyGraphic.fillStyle(0x000000, 1)
  enemyGraphic.fillRect(0, 0, 10, 10)
  enemyGraphic.fillStyle(0xdd3333, 1)
  enemyGraphic.fillRect(1, 1, 8, 8)
  enemyGraphic.generateTexture('enemyTexture', 10, 10)
}

export default generateTextures;
