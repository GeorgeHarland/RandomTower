import {
  ARROW_BASE_RATE,
  ARROW_BASE_SPEED,
  ARROW_RATE_INCREASE,
  CIRCLE_SCALE_MULTIPLIER,
  CIRCLE_SPEED_INCREASE,
  DARKBLAST_BASE_ANGLE_CHANGE,
  DARKBLAST_BASE_COOLDOWN,
  DARKBLAST_LEVELUP_ANGLE_MULTIPLIER,
  DARKBLAST_LEVELUP_COOLDOWN_MULTIPLIER,
  ENEMY_BASE_SPEED,
  FIREBLAST_BASE_ANGLE_CHANGE,
  FIREBLAST_BASE_COOLDOWN,
  FIREBLAST_LEVELUP_ANGLE_MULTIPLIER,
  FIREBLAST_LEVELUP_COOLDOWN_MULTIPLIER,
  ICEPOOL_DURATION,
  ICEPOOL_SIZE_SCALE,
  ICESPIKE_BASE_COOLDOWN,
  ICESPIKE_BASE_SPEED,
  ICESPIKE_LEVELUP_COOLDOWN_MULTIPLIER,
  ICESPIKE_BASE_SIZE_SCALE,
  PowerupRecord,
  REGEN_BASE_COOLDOWN,
  REGEN_BASE_HEAL_AMOUNT,
  REGEN_LEVELUP_COOLDOWN_MULTIPLIER,
  REGEN_LEVELUP_HEAL_INCREASE,
  REGEN_LEVELUP_MAXHP_INCREASE,
  TIMESLOW_BASE_COOLDOWN,
  TIMESLOW_LEVELUP_COOLDOWN_MULTIPLIER,
  ICESPIKE_LEVELUP_POOL_INCREASE,
} from '../../constants';
import GameStageScene from '../scenes/GameStage';
import CircleWeapon from './CircleWeapon';
import Item from './Item';
import ShopBox from './ShopBox';

export default class PowerupManager {
  public arrowRate: number = ARROW_BASE_RATE;
  public darkBlastAngleChange: number = DARKBLAST_BASE_ANGLE_CHANGE;
  public darkBlastCooldown: number = DARKBLAST_BASE_COOLDOWN;
  public darkBlastDirection: number = 0;
  public fireBlastAngleChange: number = FIREBLAST_BASE_ANGLE_CHANGE;
  public fireBlastCooldown: number = FIREBLAST_BASE_COOLDOWN;
  public fireBlastDirection: number = 180;
  public icePoolSizeScale: number = ICESPIKE_BASE_SIZE_SCALE;
  public iceSpikeCooldown: number = ICESPIKE_BASE_COOLDOWN;
  public regenAmount: number = REGEN_BASE_HEAL_AMOUNT;
  public regenCooldown: number = REGEN_BASE_COOLDOWN;
  public timeSlow: boolean = false;
  public timeSlowCooldown: number = TIMESLOW_BASE_COOLDOWN;
  public weaponCounter: number = 0;

  public spawnArrowTimer: Phaser.Time.TimerEvent | undefined;
  public darkBlastTimer: Phaser.Time.TimerEvent | undefined;
  public fireBlastTimer: Phaser.Time.TimerEvent | undefined;
  public icePoolTimer: Phaser.Time.TimerEvent | undefined;
  public iceSpikeTimer: Phaser.Time.TimerEvent | undefined;
  public regenTimer: Phaser.Time.TimerEvent | undefined;
  public timeSlowTimer: Phaser.Time.TimerEvent | undefined;
  
  public constructor(private scene: GameStageScene) {}
  
  public addPowerup = (item: Item) => {
    switch (item.powerup) {
      case 'Arrow Rate':
        this.arrowRate += item.cost * ARROW_RATE_INCREASE;
        this.spawnArrow();
        break;
      case 'Circle Speed':
        this.scene.circleWeapons?.children.entries.forEach((circle) => {
          const weaponCircle = circle as CircleWeapon;
          weaponCircle.circleSpeed +=
            CIRCLE_SPEED_INCREASE * this.scene.gameSpeedScale;
          const currentX = weaponCircle.x;
          const currentY = weaponCircle.y;
          weaponCircle.scaleX *= CIRCLE_SCALE_MULTIPLIER;
          weaponCircle.scaleY *= CIRCLE_SCALE_MULTIPLIER;
          weaponCircle.x = currentX;
          weaponCircle.y = currentY;
        });
        break;
        case 'Dark Blast':
          if (this.darkBlastTimer) {
            this.darkBlastCooldown =
            this.darkBlastCooldown * DARKBLAST_LEVELUP_COOLDOWN_MULTIPLIER;
            this.darkBlastAngleChange =
            this.darkBlastAngleChange * DARKBLAST_LEVELUP_ANGLE_MULTIPLIER;
        }
        this.spawnDarkBlast();
        break;
      case 'Fire Blast':
        if (this.fireBlastTimer) {
          this.fireBlastCooldown =
            this.fireBlastCooldown * FIREBLAST_LEVELUP_COOLDOWN_MULTIPLIER;
          this.fireBlastAngleChange =
            this.fireBlastAngleChange * FIREBLAST_LEVELUP_ANGLE_MULTIPLIER;
        }
        this.spawnFireBlast();
        break;
      case 'Ice Spike':
        if (this.iceSpikeTimer) {
          this.iceSpikeCooldown = this.iceSpikeCooldown * ICESPIKE_LEVELUP_COOLDOWN_MULTIPLIER;
          this.icePoolSizeScale += ICESPIKE_LEVELUP_POOL_INCREASE;
        }
        this.spawnIceSpike();
        break;
      case 'Regen':
        this.scene.playerTower.maxHp += REGEN_LEVELUP_MAXHP_INCREASE;
        if (this.regenTimer) {
          this.regenCooldown *= REGEN_LEVELUP_COOLDOWN_MULTIPLIER;
          this.regenAmount += REGEN_LEVELUP_HEAL_INCREASE;
        }
        this.spawnRegen();
        break;
      case 'Time Slow':
        if (this.timeSlowTimer) {
          this.timeSlowCooldown *= TIMESLOW_LEVELUP_COOLDOWN_MULTIPLIER;
        }
        this.spawnTimeSlow();
        break;
      case 'Tornado':
        this.spawnTornado();
        break;
      default:
        break;
      }
  };
  
  public initShopBoxes = () => {
    this.scene.shopBoxes?.children.entries.forEach((box, index) => {
      const shopBox = box as ShopBox;
      if (shopBox.getItem() === null) {
        if (this.scene.elapsedSeconds > 1)
        (shopBox as ShopBox).addItem(
            (shopBox as ShopBox).generateRandomItem()
          );
        else if (index === 0)
          shopBox.addItem(
            new Item(
              shopBox.scene,
              0,
              0,
              'item0',
              'Arrow Rate',
              PowerupRecord['Arrow Rate'],
              10
            )
          );
        else if (index === 1)
          shopBox.addItem(
            new Item(
              shopBox.scene,
              0,
              0,
              'item0',
              'Circle Speed',
              PowerupRecord['Circle Speed'],
              10
            )
          );
        else if (index === 2)
          shopBox.addItem(
            new Item(
              shopBox.scene,
              0,
              0,
              'item0',
              'Tornado',
              PowerupRecord['Tornado'],
              8
            )
          );
      }
      if (shopBox.getItem != null) {
        this.scene.generatedItems.push((shopBox.getItem() as Item).powerup);
      }
    });
  };
  
  public spawnArrow = () => {
    if (this.scene.tower) {
      const x: number = this.scene.scale.width / 2;
      const y: number = this.scene.scale.height / 2;

      const arrow = this.scene.physics.add.sprite(x, y, 'arrowTexture');
      arrow.setData('id', `weapon-${this.weaponCounter++}`);

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
        this.scene.physics.velocityFromAngle(angle, ARROW_BASE_SPEED * this.scene.gameSpeedScale, arrow.body.velocity);
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
    darkBlastSprite.setData('id', `weapon-${this.weaponCounter++}`);
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
    fireBlastSprite.setData('id', `weapon-${this.weaponCounter++}`);
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

  public spawnIceSpike = () => {
    if (this.iceSpikeTimer) {
      this.iceSpikeTimer.destroy();
    }
    if(this.scene.tower){
    const x: number = this.scene.scale.width / 2;
    const y: number = this.scene.scale.height / 2;
    const iceSpikeSprite = this.scene.physics.add.sprite(
      x,
      y,
      'iceSpikeImage1'
    );
    iceSpikeSprite.scale = this.icePoolSizeScale * this.scene.gameSpeedScale;
    iceSpikeSprite.setData('type', 'iceSpike');
    iceSpikeSprite.setData('id', `weapon-${this.weaponCounter++}`);
    iceSpikeSprite.play('iceSpikeAnimation');
    iceSpikeSprite.body.setImmovable(true)

    const closestJuggernaut = this.scene.enemyManager.getClosestEnemy(
      this.scene.tower, 'juggernaut'
    );
    const closestEnemy = this.scene.enemyManager.getClosestEnemy(this.scene.tower)

    // prioritize nearest juggernaut -> then any other enemy -> then random direction
    this.scene.time.delayedCall(1, () => {
      if (closestJuggernaut) {
        this.scene.physics.moveToObject(
          iceSpikeSprite,
          closestJuggernaut,
          ICESPIKE_BASE_SPEED * this.scene.gameSpeedScale
        );
        iceSpikeSprite.angle = Phaser.Math.RadToDeg(Math.atan2(closestJuggernaut.y - iceSpikeSprite.y, closestJuggernaut.x - iceSpikeSprite.x));
      } else if (closestEnemy) {
        this.scene.physics.moveToObject(
          iceSpikeSprite,
          closestEnemy,
          ICESPIKE_BASE_SPEED * this.scene.gameSpeedScale
        );
        iceSpikeSprite.angle = Phaser.Math.RadToDeg(Math.atan2(closestEnemy.y - iceSpikeSprite.y, closestEnemy.x - iceSpikeSprite.x));
      } else {
        const angle = Phaser.Math.Between(0, 360);
        this.scene.physics.velocityFromAngle(angle, ICESPIKE_BASE_SPEED * this.scene.gameSpeedScale, iceSpikeSprite.body.velocity);
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
    // spawn effect + add boom to permanent weapons
    const icePoolSprite = this.scene.physics.add.sprite(
      x,
      y,
      'icePoolImage'
    );
    icePoolSprite.scale = ICEPOOL_SIZE_SCALE * this.scene.gameSpeedScale;
    icePoolSprite.setDepth(-0.1);
    icePoolSprite.setData('type', 'icePool');
    // icePoolImage
    // spawn pool
    // timer for pool to disappear
    this.scene.terrainEffects?.add(icePoolSprite);
    this.icePoolTimer = this.scene.time.addEvent({
      delay: ICEPOOL_DURATION,
      callback: (() => icePoolSprite.destroy()),
      callbackScope: this,
      loop: false,
    });
  }

  public spawnRegen = () => {
    if (this.regenTimer) {
      this.regenTimer.destroy();
    }
    const x: number = this.scene.scale.width / 2;
    const y: number = this.scene.scale.height / 2.3;
    const regenSprite = this.scene.physics.add.sprite(x, y, 'regen');
    regenSprite.scale = 1.2 * this.scene.gameSpeedScale;
    regenSprite.setData('type', 'regen');
    regenSprite.play('regenAnimation');
    regenSprite.setImmovable(true);
    if (
      this.scene.playerTower.currentHp + this.regenAmount >=
      this.scene.playerTower.maxHp
    )
      this.scene.playerTower.currentHp = this.scene.playerTower.maxHp;
    else this.scene.playerTower.currentHp += this.regenAmount;
    if (this.scene.playerTower.currentHp > this.scene.playerTower.maxHp)
      this.scene.playerTower.currentHp === this.scene.playerTower.maxHp;
    regenSprite.on('animationcomplete', () => {
      regenSprite.destroy();
      this.regenTimer = this.scene.time.addEvent({
        delay: this.regenCooldown,
        callback: this.spawnRegen,
        callbackScope: this,
        loop: false,
      });
    });
  };

  public spawnTimeSlow = () => {
    if (this.timeSlowTimer) {
      this.timeSlowTimer.destroy();
    }
    const x: number = this.scene.scale.width / 2;
    const y: number = this.scene.scale.height / 2;
    const timeSlowSprite = this.scene.physics.add.sprite(
      x,
      y,
      'timeSlowTexture'
    );
    this.timeSlow = true;
    timeSlowSprite.scale = 0.5 * this.scene.gameSpeedScale;
    timeSlowSprite.setData('type', 'timeSlow');
    timeSlowSprite.play('timeSlowAnimation');
    if (this.scene.enemyManager.spawnEnemyTimer)
      this.scene.enemyManager.spawnEnemyTimer.paused = true;
    if (this.scene.enemyManager.spawnJuggernautTimer)
      this.scene.enemyManager.spawnJuggernautTimer.paused = true;
    timeSlowSprite.setImmovable(true);
    timeSlowSprite.on('animationcomplete', () => {
      timeSlowSprite.destroy();
      if (this.scene.enemyManager.spawnEnemyTimer)
        this.scene.enemyManager.spawnEnemyTimer.paused = false;
      if (this.scene.enemyManager.spawnJuggernautTimer)
        this.scene.enemyManager.spawnJuggernautTimer.paused = false;
      this.timeSlow = false;
      this.timeSlowTimer = this.scene.time.addEvent({
        delay: this.timeSlowCooldown,
        callback: this.spawnTimeSlow,
        callbackScope: this,
        loop: false,
      });
    });
  };

  public spawnTornado = () => {
    const x: number = this.scene.scale.width * Math.random();
    const y: number = this.scene.scale.height * Math.random();
    const tornadoSprite = this.scene.physics.add.sprite(x, y, 'tornadoRepeat1');
    tornadoSprite.scale = 0.2 * this.scene.gameSpeedScale;
    tornadoSprite.setData('type', 'tornado');
    tornadoSprite.setData('id', `weapon-${this.weaponCounter++}`);
    this.scene.PermanentWeapons?.add(tornadoSprite);
    tornadoSprite.play('tornadoAnimation');
    tornadoSprite.setImmovable(true);
  };

  public updateTimeSlow = () => {
    if (this.timeSlow) this.scene.enemyManager.enemiesCurrentSpeed *= 0.95;
    else if (this.scene.enemyManager.enemiesCurrentSpeed < ENEMY_BASE_SPEED / 10)
      this.scene.enemyManager.enemiesCurrentSpeed = ENEMY_BASE_SPEED / 10;
    else if (this.scene.enemyManager.enemiesCurrentSpeed < ENEMY_BASE_SPEED)
      this.scene.enemyManager.enemiesCurrentSpeed /= 0.95;
    if (this.scene.enemyManager.enemiesCurrentSpeed > ENEMY_BASE_SPEED)
      this.scene.enemyManager.enemiesCurrentSpeed =
        ENEMY_BASE_SPEED * this.scene.gameSpeedScale;
  };
}
