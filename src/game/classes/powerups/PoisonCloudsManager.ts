import {
  POISON_CLOUDS_BASE_AMOUNT,
  POISON_CLOUDS_BASE_COOLDOWN,
  POISON_CLOUDS_BASE_DURATION,
  POISON_CLOUDS_BASE_SCALE,
  POISON_CLOUDS_DAMAGE_FREQUENCY,
  POISON_CLOUDS_LEVELUP_SCALE,
} from '../../../constants';
import GameStageScene from '../../scenes/GameStage';
import { getRandomCoordinatesInBounds } from '../../scenes/helpers/gameHelpers';
import EnemyHealthBar from '../EnemyHealthBar';

export default class PoisonCloudsManager {
  public poisonCloudAmount: number = POISON_CLOUDS_BASE_AMOUNT;
  public poisonCloudScale: number = POISON_CLOUDS_BASE_SCALE;
  public poisonDamageTimer: Phaser.Time.TimerEvent | undefined;
  public poisonSpriteDurationTimer: Phaser.Time.TimerEvent | undefined;
  public poisonSpriteCooldownTimer: Phaser.Time.TimerEvent | undefined;

  constructor(private scene: GameStageScene) {}

  public levelUp = () => {
    if (this.poisonSpriteCooldownTimer) {
      this.poisonCloudAmount++;
      this.poisonCloudScale += POISON_CLOUDS_LEVELUP_SCALE;
    }
    this.spawnPoisonClouds();
    if(!this.poisonDamageTimer) this.startPoisonTimer();
  };

  public spawnPoisonClouds = () => {
    if (this.poisonSpriteCooldownTimer) this.poisonSpriteCooldownTimer.destroy;

    for (let i = 0; i < this.poisonCloudAmount; i++) {
      const { x, y } = getRandomCoordinatesInBounds(this.scene);
      const poisonSprite = this.scene.physics.add.sprite(x, y, 'poisonStart1');
      poisonSprite.scale = this.poisonCloudScale * this.scene.gameSpeedScale;
      poisonSprite.setData('type', 'poisonCloud');
      poisonSprite.setData(
        'id',
        `weapon-${this.scene.powerupManager.weaponCounter++}`
      );
      this.scene.PermanentWeapons?.add(poisonSprite);
      poisonSprite.play('poisonCloudStartAnim');
      poisonSprite.setImmovable(true);
      poisonSprite.setAlpha(0.6);
      this.poisonSpriteDurationTimer = this.scene.time.addEvent({
        delay: POISON_CLOUDS_BASE_DURATION,
        callback: () => this.destroyPoisonCloud(poisonSprite),
        callbackScope: this,
        loop: false,
      });
      poisonSprite.on('animationcomplete', () => {
        poisonSprite.play('poisonCloudRepeatAnim');
      });
    }
  };

  public destroyPoisonCloud = (poisonSprite: Phaser.Physics.Arcade.Sprite) => {
    poisonSprite.destroy();
    if (this.poisonSpriteCooldownTimer)
      this.poisonSpriteCooldownTimer.destroy();
    this.poisonSpriteCooldownTimer = this.scene.time.addEvent({
      delay: POISON_CLOUDS_BASE_COOLDOWN,
      callback: () => this.spawnPoisonClouds(),
      callbackScope: this,
      loop: false,
    });
  };

  public startPoisonTimer = () => {
    this.poisonSpriteCooldownTimer = this.scene.time.addEvent({
      delay: POISON_CLOUDS_DAMAGE_FREQUENCY,
      callback: () => this.handlePoisonDamage(),
      callbackScope: this,
      loop: false,
    });
  }

  public handlePoisonDamage = () => {
    // each enemy
    this.scene.enemyManager.enemies?.children.entries.forEach((enemy) => {
      if(enemy.getData('poisoned') === true) {
        const healthBar = enemy.getData('healthBar') as EnemyHealthBar;
        if (healthBar.currentValue > 1) {
          healthBar.decrease(5);
        } else {
          this.scene.enemyManager.enemyDefeated(enemy as Phaser.Types.Physics.Arcade.GameObjectWithBody);
        }
      }
    });
    this.startPoisonTimer();
  }
}
