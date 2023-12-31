import {
  POISON_CLOUDS_BASE_AMOUNT,
  POISON_CLOUDS_BASE_COOLDOWN,
  POISON_CLOUDS_BASE_DURATION,
  POISON_CLOUDS_BASE_SCALE,
  POISON_CLOUDS_LEVELUP_SCALE,
} from '../../../constants';
import GameStageScene from '../../scenes/GameStage';
import { getRandomCoordinatesInBounds } from '../../scenes/helpers/gameHelpers';

export default class PoisonCloudsManager {
  public poisonCloudAmount: number = POISON_CLOUDS_BASE_AMOUNT;
  public poisonCloudScale: number = POISON_CLOUDS_BASE_SCALE;
  public poisonSpriteDurationTimer: Phaser.Time.TimerEvent | undefined;
  public poisonSpriteCooldownTimer: Phaser.Time.TimerEvent | undefined;

  constructor(private scene: GameStageScene) {}

  public levelUp = () => {
    if (this.poisonSpriteCooldownTimer) {
      this.poisonCloudAmount++;
      this.poisonCloudScale += POISON_CLOUDS_LEVELUP_SCALE;
    }
    this.spawnPoisonClouds();
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
}
