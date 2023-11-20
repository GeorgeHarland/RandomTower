import {
  DARKBLAST_BASE_ANGLE_CHANGE,
  DARKBLAST_BASE_COOLDOWN,
  DARKBLAST_LEVELUP_ANGLE_MULTIPLIER,
  DARKBLAST_LEVELUP_COOLDOWN_MULTIPLIER,
} from '../../../constants';
import GameStageScene from '../../scenes/GameStage';

export default class DarkBlastManager {
  public darkBlastAngleChange: number = DARKBLAST_BASE_ANGLE_CHANGE;
  public darkBlastCooldown: number = DARKBLAST_BASE_COOLDOWN;
  public darkBlastDirection: number = 0;
  public darkBlastTimer: Phaser.Time.TimerEvent | undefined;

  public constructor(private scene: GameStageScene) {}

  public levelUp = () => {
    if (this.darkBlastTimer) {
      this.darkBlastCooldown =
        this.darkBlastCooldown * DARKBLAST_LEVELUP_COOLDOWN_MULTIPLIER;
      this.darkBlastAngleChange =
        this.darkBlastAngleChange * DARKBLAST_LEVELUP_ANGLE_MULTIPLIER;
    }
    this.spawnDarkBlast();
  }

  public spawnDarkBlast = () => {
    if (this.darkBlastTimer) {
      this.darkBlastTimer.destroy();
    }
    const x: number = this.scene.scale.width / 2;
    const y: number = this.scene.scale.height / 2;
    const darkBlastSprite = this.scene.physics.add.sprite(
      x,
      y,
      'darkBlastSprite1'
    );
    darkBlastSprite.scale = 2 * this.scene.gameSpeedScale;
    darkBlastSprite.setData('type', 'darkBlast');
    darkBlastSprite.setData(
      'id',
      `weapon-${this.scene.powerupManager.weaponCounter++}`
    );
    darkBlastSprite.play('darkBlastAnimation');

    this.scene.time.delayedCall(1, () => {
      this.scene.physics.velocityFromAngle(
        this.darkBlastDirection,
        200 * this.scene.gameSpeedScale,
        darkBlastSprite.body.velocity
      );
      darkBlastSprite.angle = this.darkBlastDirection;
      if (this.darkBlastDirection + this.darkBlastAngleChange < 360)
        this.darkBlastDirection += this.darkBlastAngleChange;
      else this.darkBlastDirection = 0;
    });

    this.scene.weapons?.add(darkBlastSprite);
    this.darkBlastTimer = this.scene.time.addEvent({
      delay: this.darkBlastCooldown,
      callback: this.spawnDarkBlast,
      callbackScope: this,
      loop: false,
    });
  };
}
