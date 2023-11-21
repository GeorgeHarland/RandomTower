import {
  ENEMY_BASE_SPEED,
  TIMESLOW_BASE_COOLDOWN,
  TIMESLOW_LEVELUP_COOLDOWN_MULTIPLIER,
} from '../../../constants';
import GameStageScene from '../../scenes/GameStage';

export default class TimeSlowManager {
  public timeSlow: boolean = false;
  public timeSlowCooldown: number = TIMESLOW_BASE_COOLDOWN;
  public timeSlowTimer: Phaser.Time.TimerEvent | undefined;

  constructor(private scene: GameStageScene) {}

  public levelUp = () => {
    if (this.timeSlowTimer) {
      this.timeSlowCooldown *= TIMESLOW_LEVELUP_COOLDOWN_MULTIPLIER;
    }
    this.spawnTimeSlow();
  };

  public spawnTimeSlow = () => {
    if (this.timeSlowTimer) {
      this.timeSlowTimer.destroy();
    }
    const x: number = this.scene.scale.width / 2;
    const y: number = this.scene.scale.height / 2;
    const timeSlowSprite = this.scene.physics.add.sprite(x, y, '');
    this.timeSlow = true;
    timeSlowSprite.scale = 0.5 * this.scene.gameSpeedScale;
    timeSlowSprite.setData('type', 'timeSlow');
    timeSlowSprite.play('timeSlowAnimation');
    if (this.scene.enemyManager.enemyTimers.spawnminionTimer)
      this.scene.enemyManager.enemyTimers.spawnminionTimer.paused = true;
    if (this.scene.enemyManager.enemyTimers.spawnjuggernautTimer)
      this.scene.enemyManager.enemyTimers.spawnjuggernautTimer.paused = true;
    if (this.scene.enemyManager.enemyTimers.spawnbossTimer)
      this.scene.enemyManager.enemyTimers.spawnbossTimer.paused = true;
    timeSlowSprite.setImmovable(true);
    timeSlowSprite.on('animationcomplete', () => {
      timeSlowSprite.destroy();
      if (this.scene.enemyManager.enemyTimers.spawnminionTimer)
        this.scene.enemyManager.enemyTimers.spawnminionTimer.paused = false;
      if (this.scene.enemyManager.enemyTimers.spawnjuggernautTimer)
        this.scene.enemyManager.enemyTimers.spawnjuggernautTimer.paused = false;
      if (this.scene.enemyManager.enemyTimers.spawnbossTimer)
        this.scene.enemyManager.enemyTimers.spawnbossTimer.paused = false;
      this.timeSlow = false;
      this.timeSlowTimer = this.scene.time.addEvent({
        delay: this.timeSlowCooldown,
        callback: this.spawnTimeSlow,
        callbackScope: this,
        loop: false,
      });
    });
  };

  public updateTimeSlow = () => {
    if (this.timeSlow) this.scene.enemyManager.enemiesCurrentSpeed *= 0.95;
    else if (
      this.scene.enemyManager.enemiesCurrentSpeed <
      ENEMY_BASE_SPEED / 10
    )
      this.scene.enemyManager.enemiesCurrentSpeed = ENEMY_BASE_SPEED / 10;
    else if (this.scene.enemyManager.enemiesCurrentSpeed < ENEMY_BASE_SPEED)
      this.scene.enemyManager.enemiesCurrentSpeed /= 0.95;
    if (this.scene.enemyManager.enemiesCurrentSpeed > ENEMY_BASE_SPEED)
      this.scene.enemyManager.enemiesCurrentSpeed =
        ENEMY_BASE_SPEED * this.scene.gameSpeedScale;
  };
}
