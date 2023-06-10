const generateTextures = (objectCreator: any) => {
  let towerGraphic = objectCreator.graphics();
  towerGraphic.fillStyle(0x0000ff, 1)
  towerGraphic.fillRect(0, 0, 40, 40)
  towerGraphic.generateTexture('towerTexture', 40, 40)

  let circleGraphic = objectCreator.graphics();
  circleGraphic.fillStyle(0xff0000, 1)
  circleGraphic.fillCircle(15, 15, 15)
  circleGraphic.generateTexture('circleTexture', 30, 30)

  let enemyGraphic = objectCreator.graphics();
  enemyGraphic.fillStyle(0x00ff00, 1)
  enemyGraphic.fillRect(0, 0, 10, 10)
  enemyGraphic.generateTexture('enemyTexture', 10, 10)
}

export default generateTextures;
