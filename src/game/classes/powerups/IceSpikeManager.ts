import {
  ICEPOOL_BASE_SIZE_SCALE,
  ICEPOOL_DURATION,
  ICESPIKE_BASE_COOLDOWN,
  ICESPIKE_BASE_SIZE_SCALE,
  ICESPIKE_BASE_SPEED,
  ICESPIKE_LEVELUP_COOLDOWN_MULTIPLIER,
  ICESPIKE_LEVELUP_POOL_INCREASE,
} from '../../../constants';
import GameStageScene from '../../scenes/GameStage';

export default class IceSpikeManager {
  public icePoolSizeScale: number = ICEPOOL_BASE_SIZE_SCALE;
  public iceSpikeCooldown: number = ICESPIKE_BASE_COOLDOWN;
  public icePoolTimer: Phaser.Time.TimerEvent | undefined;
  public iceSpikeTimer: Phaser.Time.TimerEvent | undefined;

  constructor(private scene: GameStageScene) {}

  public levelUp = () => {
    if (this.iceSpikeTimer) {
      this.iceSpikeCooldown =
        this.iceSpikeCooldown * ICESPIKE_LEVELUP_COOLDOWN_MULTIPLIER;
      this.icePoolSizeScale += ICESPIKE_LEVELUP_POOL_INCREASE;
    }
    this.spawnIceSpike();
  };

  public spawnIceSpike = () => {
    if (this.iceSpikeTimer) {
      this.iceSpikeTimer.destroy();
    }
    if (this.scene.tower) {
      const x: number = this.scene.scale.width / 2;
      const y: number = this.scene.scale.height / 2;
      const iceSpikeSprite = this.scene.physics.add.sprite(
        x,
        y,
        'iceSpikeImage1'
      );
      iceSpikeSprite.scale =
        ICESPIKE_BASE_SIZE_SCALE * this.scene.gameSpeedScale;
      iceSpikeSprite.setData('type', 'iceSpike');
      iceSpikeSprite.setData(
        'id',
        `weapon-${this.scene.powerupManager.weaponCounter++}`
      );
      iceSpikeSprite.play('iceSpikeAnimation');
      iceSpikeSprite.body.setImmovable(true);

      const closestJuggernaut = this.scene.enemyManager.getClosestEnemy(
        this.scene.tower,
        'juggernaut'
      );
      const closestEnemy = this.scene.enemyManager.getClosestEnemy(
        this.scene.tower
      );

      // prioritize nearest juggernaut -> then any other enemy -> then random direction
      this.scene.time.delayedCall(1, () => {
        if (closestJuggernaut) {
          this.scene.physics.moveToObject(
            iceSpikeSprite,
            closestJuggernaut,
            ICESPIKE_BASE_SPEED * this.scene.gameSpeedScale
          );
          iceSpikeSprite.angle = Phaser.Math.RadToDeg(
            Math.atan2(
              closestJuggernaut.y - iceSpikeSprite.y,
              closestJuggernaut.x - iceSpikeSprite.x
            )
          );
        } else if (closestEnemy) {
          this.scene.physics.moveToObject(
            iceSpikeSprite,
            closestEnemy,
            ICESPIKE_BASE_SPEED * this.scene.gameSpeedScale
          );
          iceSpikeSprite.angle = Phaser.Math.RadToDeg(
            Math.atan2(
              closestEnemy.y - iceSpikeSprite.y,
              closestEnemy.x - iceSpikeSprite.x
            )
          );
        } else {
          const angle = Phaser.Math.Between(0, 360);
          this.scene.physics.velocityFromAngle(
            angle,
            ICESPIKE_BASE_SPEED * this.scene.gameSpeedScale,
            iceSpikeSprite.body.velocity
          );
          iceSpikeSprite.angle = angle;
        }
      });

      this.scene.PermanentWeapons?.add(iceSpikeSprite);
      this.iceSpikeTimer = this.scene.time.addEvent({
        delay: this.iceSpikeCooldown,
        callback: this.spawnIceSpike,
        callbackScope: this,
        loop: false,
      });
    }
  };

  public spawnIceSpikeExplosion = (x: number, y: number) => {
    const iceExplosionSprite = this.scene.physics.add.sprite(
      x,
      y,
      'iceExplosionImage1'
    );
    iceExplosionSprite.scale =
      this.icePoolSizeScale * this.scene.gameSpeedScale;
    iceExplosionSprite.setData('type', 'iceExplosion');
    iceExplosionSprite.setData(
      'id',
      `weapon-${this.scene.powerupManager.weaponCounter++}`
    );
    iceExplosionSprite.play('iceExplosionAnimation');
    iceExplosionSprite.body.setImmovable(true);
    this.scene.PermanentWeapons?.add(iceExplosionSprite);

    const icePoolSprite = this.scene.physics.add.sprite(x, y, 'icePoolImage');
    icePoolSprite.scale = this.icePoolSizeScale * this.scene.gameSpeedScale;
    icePoolSprite.setDepth(-0.9);
    icePoolSprite.setData('type', 'icePool');
    this.scene.terrainEffects?.add(icePoolSprite);
    this.icePoolTimer = this.scene.time.addEvent({
      delay: ICEPOOL_DURATION,
      callback: () => icePoolSprite.destroy(),
      callbackScope: this,
      loop: false,
    });
    iceExplosionSprite.on('animationcomplete', () => {
      iceExplosionSprite.destroy();
    });
  };
}
