import {
  ENEMY_BASE_SPEED,
  ENEMY_WEAPON_HIT_RATE,
  EnemyConstants,
} from '../../constants';
import GameStageScene from '../scenes/GameStage';
import { getRandomEdgeOfScreen } from '../scenes/helpers/gameHelpers';
import { EnemyRatesMap, EnemyTimerMap, EnemyType } from '../types';
import EnemyHealthBar from './EnemyHealthBar';
import PlayerTower from './PlayerTower';

export default class EnemyManager {
  private scene: GameStageScene;
  private playerTower: PlayerTower;
  private enemyCounter: number = 0;
  public enemies: Phaser.Physics.Arcade.Group | undefined;
  public enemyTimers: EnemyTimerMap = {};
  public enemyRates: EnemyRatesMap = {
    minionRate: EnemyConstants.minion.RATE,
    juggernautRate: EnemyConstants.juggernaut.RATE,
    bossRate: EnemyConstants.boss.RATE,
  };
  public enemiesCurrentSpeed: number;
  public weaponEnemyHitMap = new Map();

  public constructor(scene: GameStageScene, playerTower: PlayerTower) {
    this.scene = scene;
    this.playerTower = playerTower;
    this.enemiesCurrentSpeed = ENEMY_BASE_SPEED * this.scene.gameSpeedScale;
  }

  public initialize = () => {
    this.enemies = this.scene.physics.add.group({
      classType: Phaser.GameObjects.Rectangle,
    });

    this.enemyTimers.spawnjuggernautTimer = this.scene.time.addEvent({
      delay: 1000 / this.enemyRates.juggernautRate,
      callback: () => this.spawnEnemy('juggernaut'),
      callbackScope: this,
      loop: true,
    });

    this.enemyTimers.spawnbossTimer = this.scene.time.addEvent({
      delay: 1000 / this.enemyRates.bossRate,
      callback: () => this.spawnEnemy('boss'),
      callbackScope: this,
      loop: true,
    });

    this.enemyTimers.spawnminionTimer = this.scene.time.addEvent({
      delay: 1000 / this.enemyRates.minionRate,
      callback: () => this.spawnEnemy('minion'),
      callbackScope: this,
      loop: true,
    });
  };

  public spawnEnemy = (enemyRecord: EnemyType) => {
    const timerKey = `spawn${EnemyConstants[enemyRecord].TYPE}Timer`;
    this.enemyTimers[timerKey]?.destroy();
    const { x, y } = getRandomEdgeOfScreen(this.scene);
    const enemy = this.scene.physics.add.sprite(
      x,
      y,
      EnemyConstants[enemyRecord].SPRITE
    );
    enemy.setData('type', EnemyConstants[enemyRecord].TYPE);
    const healthBar = new EnemyHealthBar(
      this.scene,
      enemy.x - enemy.width / 2,
      enemy.y,
      EnemyConstants[enemyRecord].HITPOINTS
    );
    enemy.setData('healthBar', healthBar);
    enemy.setData('id', `enemy-${this.enemyCounter++}`);
    EnemyConstants[enemyRecord].SPRITE &&
      enemy.setScale(
        EnemyConstants[enemyRecord].SPRITE_SCALE * this.scene.gameSpeedScale
      );
    enemy.setImmovable(true);

    this.enemies?.add(enemy);

    const rateKey = `${EnemyConstants[enemyRecord].TYPE}Rate`;
    this.enemyTimers[timerKey] = this.scene.time.addEvent({
      delay: 1000 / this.enemyRates[rateKey],
      callback: () => this.spawnEnemy(enemyRecord),
      callbackScope: this,
      loop: true,
    });
  };

  public enemyTowerCollision = (
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) => {
    if (enemy.getData('type') === EnemyConstants.juggernaut.TYPE)
      this.playerTower.currentHp -= EnemyConstants.juggernaut.DAMAGE;
    else if (enemy.getData('type') === EnemyConstants.boss.TYPE)
      this.playerTower.currentHp -= EnemyConstants.boss.DAMAGE;
    else this.playerTower.currentHp -= EnemyConstants.minion.DAMAGE;
    const healthBar = enemy.getData('healthBar');
    healthBar.destroy();
    enemy.destroy();
  };

  public enemyTerrainCollision = (
    effect: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) => {
    switch (effect.getData('type')) {
      case 'icePool':
        enemy && enemy.setData('chilled', true);
        break;
      default:
        break;
    }
  };

  public enemyWeaponCollision = (
    weapon: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    weaponDestroyed = false
  ) => {
    const currentTime = Date.now();
    const hitCooldown = ENEMY_WEAPON_HIT_RATE;
    const weaponId = weapon.getData('id');
    const weaponType = weapon.getData('type');
    const enemyId = enemy.getData('id');
    const healthBar = enemy.getData('healthBar') as EnemyHealthBar;
    const enemyIsBig =
      enemy.getData('type') === EnemyConstants.juggernaut.TYPE ||
      EnemyConstants.boss.TYPE
        ? true
        : false;
    const compositeKey = `${weaponId}-${enemyId}`;
    const lastHitTime = this.weaponEnemyHitMap.get(compositeKey) || 0;
    if (currentTime - lastHitTime < hitCooldown) {
      return;
    }
    this.weaponEnemyHitMap.set(compositeKey, currentTime);

    if (enemyIsBig && healthBar.currentValue > 1) {
      healthBar.decrease(5);
      if(weaponType === 'poisonCloud') {
        enemy.setData('poisoned', true)
        healthBar.poisoned = true;
      }
    } else {
      this.enemyDefeated(enemy);
    }

    if (weaponDestroyed) {
      weapon.destroy();
    } else if (weapon.getData('type') === 'iceSpike' && enemyIsBig) {
      this.scene.powerupManager.iceSpikeManager.spawnIceSpikeExplosion(
        weapon.body.x + weapon.body.width / 2,
        weapon.body.y + weapon.body.height / 2
      );
      weapon.destroy();
    }
  };

  public enemyDefeated = (
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) => {
    const healthBar = enemy.getData('healthBar');
    healthBar.destroy();
    if (enemy.getData('type') === EnemyConstants.juggernaut.TYPE)
      this.playerTower.currentGold += EnemyConstants.juggernaut.GOLD_VALUE;
    if (enemy.getData('type') === EnemyConstants.boss.TYPE)
      this.playerTower.currentGold += EnemyConstants.boss.GOLD_VALUE;
    else this.playerTower.currentGold += EnemyConstants.minion.GOLD_VALUE;
    enemy.destroy();
  };

  public getClosestEnemy = (
    origin: Phaser.Physics.Arcade.Sprite,
    type: EnemyType | null = null
  ): Phaser.Physics.Arcade.Sprite | null => {
    let closestEnemy = null;
    let closestDistance = Number.MAX_VALUE;

    this.enemies?.children.entries.forEach(
      (enemy: Phaser.GameObjects.GameObject) => {
        if (!type || enemy.getData('type') === type) {
          const enemySprite = enemy as Phaser.Physics.Arcade.Sprite;
          const distance = Phaser.Math.Distance.Between(
            origin.x,
            origin.y,
            enemySprite.x,
            enemySprite.y
          );
          if (distance < closestDistance) {
            closestDistance = distance;
            closestEnemy = enemySprite;
          }
        }
      }
    );

    return closestEnemy;
  };

  public updateEnemyRates = () => {
    this.enemyRates.minionRate *= EnemyConstants.minion.RATE_MULTIPLIER;
    this.enemyRates.juggernautRate *= EnemyConstants.juggernaut.RATE_MULTIPLIER;
    this.enemyRates.bossRate *= EnemyConstants.boss.RATE_MULTIPLIER;
  };
}
