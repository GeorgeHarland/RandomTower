import { TORNADO_BASE_SHAKE_AMOUNT } from "../../../constants";
import GameStageScene from "../../scenes/GameStage";
import { getRandomCoordinatesInBounds } from "../../scenes/helpers/gameHelpers";

export default class TornadoManager {
  constructor(private scene: GameStageScene) {}

  public spawnTornado = () => {
    const { x, y } = getRandomCoordinatesInBounds(this.scene);

    const tornadoSprite = this.scene.physics.add.sprite(x, y, 'tornadoRepeat1');
    tornadoSprite.scale = 0.2 * this.scene.gameSpeedScale;
    tornadoSprite.setData('type', 'tornado');
    tornadoSprite.setData('id', `weapon-${this.scene.powerupManager.weaponCounter++}`);
    this.scene.PermanentWeapons?.add(tornadoSprite);
    tornadoSprite.play('tornadoAnimation');
    tornadoSprite.setImmovable(true);
  };

  public moveTornado = (tornadoWeapon: Phaser.Physics.Arcade.Sprite) => {
    const dir = Math.random();
    if (dir < 0.25) tornadoWeapon.x += TORNADO_BASE_SHAKE_AMOUNT;
    if (dir >= 0.25 && dir < 0.5)
      tornadoWeapon.x -= TORNADO_BASE_SHAKE_AMOUNT;
    if (dir >= 0.5 && dir < 0.75)
      tornadoWeapon.y += TORNADO_BASE_SHAKE_AMOUNT;
    if (dir >= 0.75) tornadoWeapon.y -= TORNADO_BASE_SHAKE_AMOUNT;
    tornadoWeapon.x = Phaser.Math.Clamp(
      tornadoWeapon.x,
      0,
      this.scene.scale.width
    );
    tornadoWeapon.y = Phaser.Math.Clamp(
      tornadoWeapon.y,
      0,
      this.scene.scale.height
    );
  }
}