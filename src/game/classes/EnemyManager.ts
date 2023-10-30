import {
  ENEMY_BASE_DAMAGE,
  ENEMY_BASE_GOLD_VALUE,
  ENEMY_BASE_RATE,
  ENEMY_BASE_SPEED,
  ENEMY_RATE_MULTIPLER,
  JUGGERNAUT_BASE_DAMAGE,
  JUGGERNAUT_BASE_GOLD_VALUE,
  JUGGERNAUT_BASE_HITPOINTS,
  JUGGERNAUT_BASE_RATE,
  JUGGERNAUT_RATE_MULTIPLIER,
} from '../../constants';
import GameStageScene from '../scenes/GameStage';
import { getRandomEdgeOfScreen } from '../scenes/helpers/gameHelpers';
import { EnemyTypes } from '../types';
import PlayerTower from './PlayerTower';

export default class EnemyManager {
  private scene: GameStageScene;
  private playerTower: PlayerTower;
  private enemyCounter: number = 0;
  public enemies: Phaser.Physics.Arcade.Group | undefined;
  public spawnEnemyTimer: Phaser.Time.TimerEvent | undefined;
  public spawnJuggernautTimer: Phaser.Time.TimerEvent | undefined;
  public enemyRate: number = ENEMY_BASE_RATE;
  public juggernautRate: number = JUGGERNAUT_BASE_RATE;
  public enemiesCurrentSpeed: number;
  public weaponJuggernautHitMap = new Map();

  public constructor(scene: GameStageScene, playerTower: PlayerTower) {
    this.scene = scene;
    this.playerTower = playerTower;
    this.enemiesCurrentSpeed = ENEMY_BASE_SPEED * this.scene.gameSpeedScale;
  }

  public initialize = () => {
    this.enemies = this.scene.physics.add.group({
      classType: Phaser.GameObjects.Rectangle,
    });
  };

  public spawnEnemy = () => {
    const { x, y } = getRandomEdgeOfScreen(this.scene);
    const enemy = this.scene.physics.add.sprite(x, y, 'enemyTexture');
    enemy.setImmovable(true);
    enemy.setData('id', `enemy-${this.enemyCounter++}`);
    enemy.setData('type', 'minion');
    this.enemies?.add(enemy);
    if (this.spawnEnemyTimer) {
      this.spawnEnemyTimer.destroy();
    }
    this.spawnEnemyTimer = this.scene.time.addEvent({
      delay: 1000 / this.enemyRate,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });
  };

  public spawnJuggernaut = () => {
    const { x, y } = getRandomEdgeOfScreen(this.scene);
    const juggernaut = this.scene.physics.add.sprite(x, y, 'juggernautTexture');
    juggernaut.setData('type', 'juggernaut');
    juggernaut.setData('hitpoints', JUGGERNAUT_BASE_HITPOINTS);
    juggernaut.setData('id', `enemy-${this.enemyCounter++}`);
    juggernaut.setImmovable(true);

    this.enemies?.add(juggernaut);
    if (this.spawnJuggernautTimer) {
      this.spawnJuggernautTimer.destroy();
    }
    this.spawnJuggernautTimer = this.scene.time.addEvent({
      delay: 1000 / this.juggernautRate,
      callback: this.spawnJuggernaut,
      callbackScope: this,
      loop: true,
    });
  };

  public enemyTowerCollision = (
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) => {
    if (enemy.getData('type') === 'juggernaut')
      this.playerTower.currentHp -= JUGGERNAUT_BASE_DAMAGE;
    else this.playerTower.currentHp -= ENEMY_BASE_DAMAGE;
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
    const hitCooldown = 200;
    const weaponId = weapon.getData('id');
    const juggernautId = enemy.getData('id');

    const compositeKey = `${weaponId}-${juggernautId}`;
    const lastHitTime = this.weaponJuggernautHitMap.get(compositeKey) || 0;
    if (currentTime - lastHitTime < hitCooldown) {
      return;
    }
    this.weaponJuggernautHitMap.set(compositeKey, currentTime);

    if (
      enemy.getData('type') === 'juggernaut' &&
      enemy.getData('hitpoints') > 0
    ) {
      enemy.setData('hitpoints', enemy.getData('hitpoints') - 5);
    } else {
      this.enemyDefeated(enemy);
    }

    if (weaponDestroyed) {
      weapon.destroy();
    } else if (
      weapon.getData('type') === 'iceSpike' &&
      enemy.getData('type') === 'juggernaut'
    ) {
      this.scene.powerupManager.spawnIceSpikeExplosion(
        weapon.body.x + weapon.body.width / 2,
        weapon.body.y + weapon.body.height / 2
      );
      weapon.destroy();
    }
  };

  public enemyDefeated = (
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) => {
    if (enemy.getData('type') === 'juggernaut')
      this.playerTower.currentGold += JUGGERNAUT_BASE_GOLD_VALUE;
    else this.playerTower.currentGold += ENEMY_BASE_GOLD_VALUE;
    enemy.destroy();
  };

  public getClosestEnemy = (
    origin: Phaser.Physics.Arcade.Sprite,
    type: EnemyTypes | null = null
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
    this.enemyRate *= ENEMY_RATE_MULTIPLER;
    this.juggernautRate *= JUGGERNAUT_RATE_MULTIPLIER;
  };
}
