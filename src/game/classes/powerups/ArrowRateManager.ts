import { ARROW_BASE_RATE, ARROW_BASE_SPEED, ARROW_RATE_INCREASE } from "../../../constants";
import GameStageScene from "../../scenes/GameStage";

export default class ArrowRateManager {
  public arrowRate: number = ARROW_BASE_RATE;
  public spawnArrowTimer: Phaser.Time.TimerEvent | undefined;

  constructor(private scene: GameStageScene) {}

  public levelUp = () => {
    this.arrowRate += this.arrowRate + ARROW_RATE_INCREASE;
    this.spawnArrow();
  }

  public spawnArrow = () => {
    if (this.scene.tower) {
      const x: number = this.scene.scale.width / 2;
      const y: number = this.scene.scale.height / 2;

      const arrow = this.scene.physics.add.sprite(x, y, 'arrowTexture');
      arrow.setData('id', `weapon-${this.scene.powerupManager.weaponCounter++}`);
      arrow.scale = Math.max(1 * this.scene.gameSpeedScale, 0.6);

      this.scene.weapons?.add(arrow);

      const closestEnemy = this.scene.enemyManager.getClosestEnemy(
        this.scene.tower
      );
      if (closestEnemy) {
        this.scene.physics.moveToObject(
          arrow,
          closestEnemy,
          ARROW_BASE_SPEED * this.scene.gameSpeedScale
        );
      } else {
        const angle = Phaser.Math.Between(0, 360);
        this.scene.physics.velocityFromAngle(
          angle,
          ARROW_BASE_SPEED * this.scene.gameSpeedScale,
          arrow.body.velocity
        );
      }

      this.updateArrowTimer();
    }
  };

  public updateArrowTimer = () => {
    if (this.spawnArrowTimer) {
      this.spawnArrowTimer.destroy();
    }
    this.spawnArrowTimer = this.scene.time.addEvent({
      delay: 1000 / this.arrowRate,
      callback: this.spawnArrow,
      callbackScope: this,
      loop: true,
    });
  };
} 