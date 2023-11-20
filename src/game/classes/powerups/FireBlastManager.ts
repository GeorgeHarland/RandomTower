import { FIREBLAST_BASE_ANGLE_CHANGE, FIREBLAST_BASE_COOLDOWN, FIREBLAST_LEVELUP_ANGLE_MULTIPLIER, FIREBLAST_LEVELUP_COOLDOWN_MULTIPLIER } from "../../../constants";
import GameStageScene from "../../scenes/GameStage";

export default class FireBlastManager {
  public fireBlastAngleChange: number = FIREBLAST_BASE_ANGLE_CHANGE;
  public fireBlastCooldown: number = FIREBLAST_BASE_COOLDOWN;
  public fireBlastDirection: number = 180;
  public fireBlastTimer: Phaser.Time.TimerEvent | undefined;

  constructor(private scene: GameStageScene) {}

  public levelup = () => {
    if (this.fireBlastTimer) {
      this.fireBlastCooldown =
        this.fireBlastCooldown * FIREBLAST_LEVELUP_COOLDOWN_MULTIPLIER;
      this.fireBlastAngleChange =
        this.fireBlastAngleChange * FIREBLAST_LEVELUP_ANGLE_MULTIPLIER;
    }
    this.spawnFireBlast();
  }

  public spawnFireBlast = () => {
    if (this.fireBlastTimer) {
      this.fireBlastTimer.destroy();
    }
    const x: number = this.scene.scale.width / 2;
    const y: number = this.scene.scale.height / 2;
    const fireBlastSprite = this.scene.physics.add.sprite(
      x,
      y,
      'fireBlastSprite1'
    );
    fireBlastSprite.scale = 2 * this.scene.gameSpeedScale;
    fireBlastSprite.setData('type', 'fireBlast');
    fireBlastSprite.setData('id', `weapon-${this.scene.powerupManager.weaponCounter++}`);
    fireBlastSprite.play('fireBlastAnimation');

    this.scene.time.delayedCall(1, () => {
      this.scene.physics.velocityFromAngle(
        this.fireBlastDirection,
        200 * this.scene.gameSpeedScale,
        fireBlastSprite.body.velocity
      );
      fireBlastSprite.angle = this.fireBlastDirection;
      if (this.fireBlastDirection - this.fireBlastAngleChange > 0)
        this.fireBlastDirection -= this.fireBlastAngleChange;
      else this.fireBlastDirection = 360;
    });

    this.scene.weapons?.add(fireBlastSprite);
    this.fireBlastTimer = this.scene.time.addEvent({
      delay: this.fireBlastCooldown,
      callback: this.spawnFireBlast,
      callbackScope: this,
      loop: false,
    });
  };
}