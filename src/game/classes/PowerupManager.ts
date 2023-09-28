import { ARROW_BASE_RATE, ARROW_BASE_SPEED, ARROW_RATE_INCREASE, CIRCLE_SCALE_MULTIPLIER, CIRCLE_SPEED_INCREASE, DARKBLAST_BASE_ANGLE_CHANGE, DARKBLAST_BASE_COOLDOWN, DARKBLAST_LEVELUP_ANGLE_MULTIPLIER, DARKBLAST_LEVELUP_COOLDOWN_MULTIPLIER, FIREBLAST_BASE_ANGLE_CHANGE, FIREBLAST_BASE_COOLDOWN, FIREBLAST_LEVELUP_ANGLE_MULTIPLIER, FIREBLAST_LEVELUP_COOLDOWN_MULTIPLIER, REGEN_BASE_COOLDOWN, REGEN_BASE_HEAL_AMOUNT, REGEN_LEVELUP_COOLDOWN_MULTIPLIER, REGEN_LEVELUP_HEAL_INCREASE, TIMESLOW_BASE_COOLDOWN, TIMESLOW_LEVELUP_COOLDOWN_MULTIPLIER } from "../../constants";
import GameStageScene from "../scenes/GameStage";
import CircleWeapon from "./CircleWeapon";
import Item from "./Item";

export default class PowerupManager {
  public arrowRate: number = ARROW_BASE_RATE;
  public darkBlastAngleChange: number = DARKBLAST_BASE_ANGLE_CHANGE;
  public darkBlastCooldown: number = DARKBLAST_BASE_COOLDOWN;
  public darkBlastDirection: number = 0;
  public fireBlastAngleChange: number = FIREBLAST_BASE_ANGLE_CHANGE;
  public fireBlastCooldown: number = FIREBLAST_BASE_COOLDOWN;
  public fireBlastDirection: number = 180;
  public regenAmount: number = REGEN_BASE_HEAL_AMOUNT;
  public regenCooldown: number = REGEN_BASE_COOLDOWN;
  public timeSlow: boolean = false;
  public timeSlowCooldown: number = TIMESLOW_BASE_COOLDOWN;
  public weaponCounter: number = 0;

  public spawnArrowTimer: Phaser.Time.TimerEvent | undefined;
  public darkBlastTimer: Phaser.Time.TimerEvent | undefined;
  public fireBlastTimer: Phaser.Time.TimerEvent | undefined;
  public regenTimer: Phaser.Time.TimerEvent | undefined;
  public timeSlowTimer: Phaser.Time.TimerEvent | undefined;
  
  constructor(private scene: GameStageScene) { }

  initShopBoxes = () => {
    // Code that populates shopBoxes with items
  }

  spawnArrow = () => {
    if (this.scene.tower) {
      const x = this.scene.tower.x;
      const y = this.scene.tower.y;

      const arrow = this.scene.physics.add.sprite(x, y, 'arrowTexture');
      arrow.setData('id', `weapon-${this.weaponCounter++}`);

      this.scene.weapons?.add(arrow);

      const closestEnemy = this.scene.enemyManager.getClosestEnemy(this.scene.tower);
      if (closestEnemy) {
        this.scene.physics.moveToObject(arrow, closestEnemy, ARROW_BASE_SPEED);
      } else {
        const angle = Phaser.Math.Between(0, 360);
        this.scene.physics.velocityFromAngle(angle, 200, arrow.body.velocity);
      }

      this.updateArrowTimer();
    }
  }

  addPowerup = (item: Item) => {
    switch (item.powerup) {
      case 'arrowRate':
        this.arrowRate += item.cost * ARROW_RATE_INCREASE;
        this.spawnArrow();
        break;
      case 'circleStrength':
        this.scene.circleWeapons?.children.entries.forEach((circle) => {
          const weaponCircle = circle as CircleWeapon;
          weaponCircle.circleSpeed += CIRCLE_SPEED_INCREASE;
          const currentX = weaponCircle.x;
          const currentY = weaponCircle.y;
          weaponCircle.scaleX *= CIRCLE_SCALE_MULTIPLIER;
          weaponCircle.scaleY *= CIRCLE_SCALE_MULTIPLIER;
          weaponCircle.x = currentX;
          weaponCircle.y = currentY;
        });
        break;
      case 'darkBlast':
        if (this.darkBlastTimer) {
          this.darkBlastCooldown =
            this.darkBlastCooldown * DARKBLAST_LEVELUP_COOLDOWN_MULTIPLIER;
          this.darkBlastAngleChange =
            this.darkBlastAngleChange * DARKBLAST_LEVELUP_ANGLE_MULTIPLIER;
        }
        this.spawnDarkBlast();
        break;
      case 'fireBlast':
        if (this.fireBlastTimer) {
          this.fireBlastCooldown =
            this.fireBlastCooldown * FIREBLAST_LEVELUP_COOLDOWN_MULTIPLIER;
          this.fireBlastAngleChange =
            this.fireBlastAngleChange * FIREBLAST_LEVELUP_ANGLE_MULTIPLIER;
        }
        this.spawnFireBlast();
        break;
      case 'regen':
        this.scene.playerTower.maxHp += 5;
        if (this.regenTimer) {
          this.regenCooldown *= REGEN_LEVELUP_COOLDOWN_MULTIPLIER;
          this.regenAmount += REGEN_LEVELUP_HEAL_INCREASE;
        }
        this.spawnRegen();
        break;
      case 'timeSlow':
        if (this.timeSlowTimer) {
          this.timeSlowCooldown *= TIMESLOW_LEVELUP_COOLDOWN_MULTIPLIER;
        }
        this.spawnTimeSlow();
        break;
      case 'tornado':
        this.spawnTornado();
        break;
      default:
        break;
    }
  }

  updateArrowTimer = () => {
    if (this.spawnArrowTimer) {
      this.spawnArrowTimer.destroy();
    }
    this.spawnArrowTimer = this.scene.time.addEvent({
      delay: 1000 / this.arrowRate,
      callback: this.spawnArrow,
      callbackScope: this,
      loop: true,
    });
  }

  spawnDarkBlast = () => {
    if (this.darkBlastTimer) {
      this.darkBlastTimer.destroy();
    }
    const x: number = this.scene.scale.width / 2;
    const y: number = this.scene.scale.height / 2;
    const darkBlastSprite = this.scene.physics.add.sprite(x, y, 'darkBlastSprite1');
    darkBlastSprite.scale = 2;
    darkBlastSprite.setData('type', 'darkBlast');
    darkBlastSprite.setData('id', `weapon-${this.weaponCounter++}`);
    darkBlastSprite.play('darkBlastAnimation');

    this.scene.time.delayedCall(1, () => {
      this.scene.physics.velocityFromAngle(
        this.darkBlastDirection,
        200,
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
  }

  spawnFireBlast = () => {
    if (this.fireBlastTimer) {
      this.fireBlastTimer.destroy();
    }
    const x: number = this.scene.scale.width / 2;
    const y: number = this.scene.scale.height / 2;
    const fireBlastSprite = this.scene.physics.add.sprite(x, y, 'fireBlastSprite1');
    fireBlastSprite.scale = 2;
    fireBlastSprite.setData('type', 'fireBlast');
    fireBlastSprite.setData('id', `weapon-${this.weaponCounter++}`);
    fireBlastSprite.play('fireBlastAnimation');

    this.scene.time.delayedCall(1, () => {
      this.scene.physics.velocityFromAngle(
        this.fireBlastDirection,
        200,
        fireBlastSprite.body.velocity
      );
      fireBlastSprite.angle = this.fireBlastDirection;
      if (this.fireBlastDirection + this.fireBlastAngleChange > 0)
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
  }

  spawnRegen = () => {
    if (this.regenTimer) {
      this.regenTimer.destroy();
    }
    const x: number = this.scene.scale.width / 2;
    const y: number = this.scene.scale.height / 2.3;
    const regenSprite = this.scene.physics.add.sprite(x, y, 'regen');
    regenSprite.scale = 1.2;
    regenSprite.setData('type', 'regen');
    regenSprite.play('regenAnimation');
    regenSprite.setImmovable(true);
    if (this.scene.playerTower.currentHp + this.regenAmount >= this.scene.playerTower.maxHp)
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
  }

  spawnTimeSlow = () => {
    if (this.timeSlowTimer) {
      this.timeSlowTimer.destroy();
    }
    const x: number = this.scene.scale.width / 2;
    const y: number = this.scene.scale.height / 2;
    const timeSlowSprite = this.scene.physics.add.sprite(x, y, 'timeSlowTexture');
    this.timeSlow = true;
    timeSlowSprite.scale = 0.5;
    timeSlowSprite.setData('type', 'timeSlow');
    timeSlowSprite.play('timeSlowAnimation');
    timeSlowSprite.setImmovable(true);
    timeSlowSprite.on('animationcomplete', () => {
      timeSlowSprite.destroy();
      this.timeSlow = false;
      // this.enemyCurrentSpeed = ENEMY_BASE_SPEED;
      this.timeSlowTimer = this.scene.time.addEvent({
        delay: this.timeSlowCooldown,
        callback: this.spawnTimeSlow,
        callbackScope: this,
        loop: false,
      });
    });
  }

  spawnTornado = () => {
    const x: number = this.scene.scale.width * Math.random();
    const y: number = this.scene.scale.height * Math.random();
    const tornadoSprite = this.scene.physics.add.sprite(x, y, 'tornadoRepeat1');
    tornadoSprite.scale = 0.2;
    tornadoSprite.setData('type', 'tornado');
    tornadoSprite.setData('id', `weapon-${this.weaponCounter++}`);
    this.scene.PermanentWeapons?.add(tornadoSprite);
    tornadoSprite.play('tornadoAnimation');
    tornadoSprite.setImmovable(true);
  };
}
