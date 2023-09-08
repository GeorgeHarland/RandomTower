import CircleWeapon from '../classes/circleWeapon';
import Phaser from 'phaser';
import PlayerTower from '../classes/playerTower';
import ShopBox from '../classes/shopBox';
import { KeybindType, PowerupType } from '../types';
import { generateTextures } from './helpers/textureHelpers';
import { extractTowerFrames, loadSprites } from './helpers/spriteHelpers';
import Item from '../classes/item';
import {
  ARROW_BASE_RATE,
  ARROW_BASE_SPEED,
  ARROW_RATE_INCREASE,
  BOSS_BASE_DAMAGE,
  BOSS_BASE_GOLD_VALUE,
  BOSS_BASE_HITPOINTS,
  BOSS_SECONDS_TO_SPAWN,
  BOSS_SPEED_MULTIPLIER,
  CIRCLE_SPEED_INCREASE,
  DARKBLAST_BASE_ANGLE_CHANGE,
  DARKBLAST_BASE_COOLDOWN,
  DARKBLAST_LEVELUP_ANGLE_MULTIPLIER,
  DARKBLAST_LEVELUP_COOLDOWN_MULTIPLIER,
  DEV_TEXT_AT_TOP,
  ENEMY_BASE_DAMAGE,
  ENEMY_BASE_GOLD_VALUE,
  ENEMY_BASE_RATE,
  ENEMY_BASE_SPEED,
  REGEN_BASE_COOLDOWN,
  REGEN_BASE_HEAL_AMOUNT,
  REGEN_LEVELUP_COOLDOWN_MULTIPLIER,
  REGEN_LEVELUP_HEAL_INCREASE,
  TIMESLOW_BASE_COOLDOWN,
  TIMESLOW_LEVELUP_COOLDOWN_MULTIPLIER,
  TORNADO_BASE_SHAKE_AMOUNT,
  TOWER_BASE_HITPOINTS,
} from '../../constants';
import { getRandomEdgeOfScreen } from './helpers/gameHelpers';

export default class GameStageScene extends Phaser.Scene {
  private playerTower: PlayerTower = new PlayerTower();
  private circleWeapons: Phaser.Physics.Arcade.Group | undefined;
  private enemies: Phaser.Physics.Arcade.Group | undefined;
  private tower: Phaser.Physics.Arcade.Sprite | undefined;
  private weapons: Phaser.Physics.Arcade.Group | undefined;
  private PermanentWeapons: Phaser.Physics.Arcade.Group | undefined;
  private shopBoxes: Phaser.GameObjects.Group | undefined;
  public generatedItems: PowerupType[] = [];

  private towerSprites: Phaser.GameObjects.Image[] = [];

  private towerLife: number = TOWER_BASE_HITPOINTS;
  private towerLifeText: Phaser.GameObjects.Text | undefined;
  private goldText: Phaser.GameObjects.Text | undefined;
  private enemyRate: number = ENEMY_BASE_RATE;
  private enemyRateText: Phaser.GameObjects.Text | undefined;
  private arrowRate: number = ARROW_BASE_RATE;
  private arrowRateText: Phaser.GameObjects.Text | undefined;
  private darkBlastCooldown: number = DARKBLAST_BASE_COOLDOWN;
  private darkBlastDirection: number = 0;
  private darkBlastAngleChange: number = DARKBLAST_BASE_ANGLE_CHANGE;
  private regenCooldown: number = REGEN_BASE_COOLDOWN;
  private timeSlowCooldown: number = TIMESLOW_BASE_COOLDOWN;

  private spawnArrowTimer: Phaser.Time.TimerEvent | undefined;
  private spawnBossTimer: Phaser.Time.TimerEvent | undefined;
  private weaponBossHitMap = new Map();
  private spawnEnemyTimer: Phaser.Time.TimerEvent | undefined;
  private darkBlastTimer: Phaser.Time.TimerEvent | undefined;
  private regenTimer: Phaser.Time.TimerEvent | undefined;
  private regenAmount: number = REGEN_BASE_HEAL_AMOUNT;
  private timeSlowTimer: Phaser.Time.TimerEvent | undefined;

  private enemyCurrentSpeed: number = ENEMY_BASE_SPEED;
  private weaponCounter: number = 0;
  private enemyCounter: number = 0;

  private keyQ: Phaser.Input.Keyboard.Key | null = null;
  private keyW: Phaser.Input.Keyboard.Key | null = null;
  private keyE: Phaser.Input.Keyboard.Key | null = null;
  private keyU: Phaser.Input.Keyboard.Key | null = null;
  private keyK: Phaser.Input.Keyboard.Key | null = null;

  constructor() {
    super({ key: 'GameStageScene' });
  }

  preload() {
    loadSprites(this);
  }

  create() {
    generateTextures(this.make);
    this.towerSprites = extractTowerFrames(this);

    this.setupKeybindings();
    this.setupAnimations();

    const bg = this.add.tileSprite(
      0,
      0,
      this.scale.width,
      this.scale.height,
      'bgTexture',
    );
    bg.setOrigin(0, 0);

    if (this.towerSprites[0]) {
      const towerImage = this.towerSprites[0];
      const centerX = this.scale.width / 2;
      const centerY = this.scale.height / 2;
      this.tower = this.physics.add.sprite(
        centerX,
        centerY,
        'towerSpriteSheet',
        towerImage.frame.name,
      );
    } else {
      this.tower = this.physics.add.sprite(400, 300, 'towerTexture');
    }
    this.tower.setImmovable(true);

    this.circleWeapons = this.physics.add.group({
      classType: CircleWeapon,
    });
    let scale = 0;
    for (let i = 0; i < 3; i++) {
      const currentWeapon = new CircleWeapon({
        scene: this,
        x: 400,
        y: 280,
        texture: 'circleTexture',
        circleNumber: i,
      });
      if (i === 0) {
        scale = currentWeapon.scaleX;
      } else {
        const newScale = scale * 0.8;
        currentWeapon.scaleX = newScale;
        currentWeapon.scaleY = newScale;
        scale = newScale;
      }
      this.circleWeapons.add(currentWeapon);
    }
    this.circleWeapons.children.entries.forEach((circle) => {
      (circle as CircleWeapon)?.setImmovable(true);
    });

    this.enemies = this.physics.add.group({
      classType: Phaser.GameObjects.Rectangle,
    });
    this.weapons = this.physics.add.group({
      classType: Phaser.GameObjects.Rectangle,
    });
    this.PermanentWeapons = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
    });
    this.shopBoxes = this.physics.add.group({
      classType: ShopBox,
    });

    for (let i = 0; i < 3; i++) {
      let keybind: KeybindType = 'Z';
      if (i === 0) keybind = 'Q';
      if (i === 1) keybind = 'W';
      if (i === 2) keybind = 'E';
      const shopBox = new ShopBox({
        scene: this,
        x: 80 + 100 * i,
        y: this.scale.height - 80,
        key: 'shopBoxTexture',
        keybind: keybind,
      });
      this.shopBoxes?.add(shopBox);
    }

    const topTextSize = Math.floor(this.sys.canvas.width / 25);

    this.towerLifeText = this.add.text(
      this.scale.width / 40,
      this.scale.height / 40,
      'Tower Life: ' + this.towerLife,
      {
        fontSize: `${topTextSize}px`,
        color: '#000000',
      },
    );
    this.goldText = this.add.text(
      this.scale.width / 40,
      this.scale.height / 10,
      'Gold: ' + this.playerTower.currentGold,
      {
        fontSize: `${topTextSize}px`,
        color: '#eeee00',
      },
    );
    if (DEV_TEXT_AT_TOP) {
      this.enemyRateText = this.add.text(
        this.scale.width / 40,
        this.scale.height / 6,
        'Enemies per second: ' + this.enemyRate.toFixed(1),
        {
          fontSize: `${topTextSize}px`,
          color: '#cccccc',
        },
      );
      this.arrowRateText = this.add.text(
        this.scale.width / 40,
        this.scale.height / 4,
        'Arrows per second: ' + this.arrowRate.toFixed(1),
        {
          fontSize: `${topTextSize}px`,
          color: '#cccccc',
        },
      );
    }

    this.physics.add.collider(this.enemies, this.tower, (tower, enemy) => {
      this.enemyTowerCollision(tower, enemy);
    });
    this.physics.add.collider(
      this.enemies,
      this.circleWeapons,
      (enemy, circle) => {
        this.enemyWeaponCollision({
          weapon: circle,
          enemy: enemy,
          weaponDestroyed: false,
        });
      },
    );
    this.physics.add.collider(this.enemies, this.weapons, (weapon, enemy) => {
      this.enemyWeaponCollision({
        weapon: weapon,
        enemy: enemy,
        weaponDestroyed: true,
      });
    });
    this.physics.add.collider(
      this.enemies,
      this.PermanentWeapons,
      (enemy, weapon) => {
        this.enemyWeaponCollision({
          weapon: weapon,
          enemy: enemy,
          weaponDestroyed: false,
        });
      },
    );

    this.spawnArrowTimer = this.time.addEvent({
      delay: 1000 / this.arrowRate,
      callback: this.spawnArrow,
      callbackScope: this,
      loop: true,
    });

    this.spawnBossTimer = this.time.addEvent({
      delay: 1000 * BOSS_SECONDS_TO_SPAWN,
      callback: this.spawnBoss,
      callbackScope: this,
      loop: true,
    });

    this.spawnEnemyTimer = this.time.addEvent({
      delay: 1000 / this.enemyRate,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 1000,
      callback: () => (this.enemyRate += 0.01),
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    const cursors = this.input.keyboard?.createCursorKeys();

    this.circleWeapons?.children.entries.forEach((circle) => {
      (circle as CircleWeapon)?.moveCircle(cursors);
    });

    this.weapons?.children.entries.forEach((weapon) => {
      if (weapon.getData('type') === 'darkBlast') {
        // (weapon as Phaser.Physics.Arcade.Sprite).x += 1;
      }
    });

    this.PermanentWeapons?.children.entries.forEach((weapon) => {
      if (weapon.getData('type') === 'tornado') {
        const dir = Math.random();
        if (dir < 0.25)
          (weapon as Phaser.Physics.Arcade.Sprite).x +=
            TORNADO_BASE_SHAKE_AMOUNT;
        if (dir >= 0.25 && dir < 0.5)
          (weapon as Phaser.Physics.Arcade.Sprite).x -=
            TORNADO_BASE_SHAKE_AMOUNT;
        if (dir >= 0.5 && dir < 0.75)
          (weapon as Phaser.Physics.Arcade.Sprite).y +=
            TORNADO_BASE_SHAKE_AMOUNT;
        if (dir >= 0.75)
          (weapon as Phaser.Physics.Arcade.Sprite).y -=
            TORNADO_BASE_SHAKE_AMOUNT;
      }
      if (weapon.getData('type') === 'timeSlow') {
        this.enemyCurrentSpeed *= 0.975;
      }
    });

    const shopBoxKeybinds: { [id: string]: ShopBox } = {};
    this.shopBoxes?.children.entries.forEach(
      (gameObject: Phaser.GameObjects.GameObject) => {
        let shopBox = gameObject as ShopBox;
        shopBoxKeybinds[shopBox.getKeybind()] = shopBox;
      },
    );
    let itemBought = null;
    if (this.input.keyboard) {
      if (
        Phaser.Input.Keyboard.JustDown(this.keyU as Phaser.Input.Keyboard.Key)
      ) {
        this.playerTower.currentGold += 1000;
      }
      if (
        Phaser.Input.Keyboard.JustDown(this.keyK as Phaser.Input.Keyboard.Key)
      ) {
        this.enemyRate += 1;
      }
      if (
        Phaser.Input.Keyboard.JustDown(this.keyQ as Phaser.Input.Keyboard.Key)
      ) {
        itemBought = shopBoxKeybinds.Q.buyItem(this.playerTower);
      }
      if (
        Phaser.Input.Keyboard.JustDown(this.keyW as Phaser.Input.Keyboard.Key)
      ) {
        itemBought = shopBoxKeybinds.W.buyItem(this.playerTower);
      }
      if (
        Phaser.Input.Keyboard.JustDown(this.keyE as Phaser.Input.Keyboard.Key)
      ) {
        itemBought = shopBoxKeybinds.E.buyItem(this.playerTower);
      }
    }
    if (itemBought) {
      this.addPowerup(itemBought);
      this.generatedItems = [];
      this.shopBoxes?.children.entries.forEach((shopbox) => {
        (shopbox as ShopBox).rerollItem();
      });
    }

    this.enemies?.children.entries.forEach((enemy) => {
      if (this.tower) {
        if (enemy.getData('type') === 'boss')
          this.physics.moveToObject(
            enemy,
            this.tower,
            this.enemyCurrentSpeed * BOSS_SPEED_MULTIPLIER,
          );
        else
          this.physics.moveToObject(enemy, this.tower, this.enemyCurrentSpeed);
      }
    });

    this.shopBoxes?.children.entries.forEach((box) => {
      const shopBox = box as ShopBox;
      if (shopBox.getItem() === null) {
        (shopBox as ShopBox).addItem((shopBox as ShopBox).generateRandomItem());
      }
      if (shopBox.getItem != null) {
        this.generatedItems.push((shopBox.getItem() as Item).powerup)
      }
    });

    if (this.towerLife <= 0) {
      this.scene.remove();
      this.scene.start('MainMenuScene');
    }

    this.towerLifeText &&
      this.towerLifeText.setText('Tower Life: ' + this.towerLife);
    this.goldText &&
      this.goldText.setText('Gold: ' + this.playerTower.currentGold);
    if (DEV_TEXT_AT_TOP) {
      this.enemyRateText &&
        this.enemyRateText.setText(
          'Enemies per second: ' + this.enemyRate.toFixed(1),
        );
      this.arrowRateText &&
        this.arrowRateText.setText(
          'Arrows per second: ' + this.arrowRate.toFixed(1),
        );
    }
  }

  setupKeybindings() {
    if (this.input.keyboard) {
      this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      this.keyU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
      this.keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    }
  }

  setupAnimations() {
    this.anims.create({
      key: 'darkBlastAnimation',
      frames: Array.from({ length: 15 }, (_, i) => ({
        key: `darkBlastSprite${i}`,
      })),
      frameRate: 14,
      repeat: -1,
    });
    this.anims.create({
      key: 'regenAnimation',
      frames: this.anims.generateFrameNumbers('healEffectSheet', {
        start: 0,
        end: 15,
      }),
      frameRate: 12,
      repeat: 0,
    });
    this.anims.create({
      key: 'timeSlowAnimation',
      frames: this.anims.generateFrameNumbers('timeSlowAnimationSheet', {
        start: 0,
        end: 14,
      }),
      frameRate: 12,
      repeat: 1,
    });
    this.anims.create({
      key: 'tornadoAnimation',
      frames: Array.from({ length: 9 }, (_, i) => ({
        key: `tornadoRepeat${i}`,
      })),
      frameRate: 28,
      repeat: -1,
    });
  }

  spawnBoss() {
    const { x, y } = getRandomEdgeOfScreen(this);
    const boss = this.physics.add.sprite(x, y, 'bossTexture');
    boss.setData('type', 'boss');
    boss.setData('hitpoints', BOSS_BASE_HITPOINTS);
    boss.setData('id', `enemy-${this.enemyCounter++}`);
    boss.setImmovable(true);
    this.enemies?.add(boss);
    if (this.spawnBossTimer) {
      this.spawnBossTimer.destroy();
    }
    this.spawnBossTimer = this.time.addEvent({
      delay: 1000 * BOSS_SECONDS_TO_SPAWN,
      callback: this.spawnBoss,
      callbackScope: this,
      loop: true,
    });
  }

  spawnEnemy() {
    const { x, y } = getRandomEdgeOfScreen(this);
    const enemy = this.physics.add.sprite(x, y, 'enemyTexture');
    enemy.setImmovable(true);
    enemy.setData('id', `enemy-${this.enemyCounter++}`);
    this.enemies?.add(enemy);
    if (this.spawnEnemyTimer) {
      this.spawnEnemyTimer.destroy();
    }
    this.spawnEnemyTimer = this.time.addEvent({
      delay: 1000 / this.enemyRate,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });
  }

  spawnArrow() {
    if (this.tower) {
      const x = this.tower.x;
      const y = this.tower.y;

      const arrow = this.physics.add.sprite(x, y, 'arrowTexture');
      arrow.setData('id', `weapon-${this.weaponCounter++}`);

      this.weapons?.add(arrow);

      let closestEnemy = this.getClosestEnemy(this.tower);
      if (closestEnemy) {
        this.physics.moveToObject(arrow, closestEnemy, ARROW_BASE_SPEED);
      } else {
        let angle = Phaser.Math.Between(0, 360);
        this.physics.velocityFromAngle(angle, 200, arrow.body.velocity);
      }

      this.updateArrowTimer();
    }
  }

  addPowerup(item: Item) {
    switch (item.powerup) {
      case 'arrowRate':
        this.arrowRate += item.cost * ARROW_RATE_INCREASE;
        break;
      case 'circleSpeed':
        this.circleWeapons?.children.entries.forEach((circle) => {
          (circle as CircleWeapon).circleSpeed += CIRCLE_SPEED_INCREASE;
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
      case 'regen':
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

  getClosestEnemy(origin: Phaser.Physics.Arcade.Sprite) {
    let closestEnemy = null;
    let closestDistance = Number.MAX_VALUE;

    this.enemies?.children.entries.forEach(
      (enemy: Phaser.GameObjects.GameObject) => {
        const enemySprite = enemy as Phaser.Physics.Arcade.Sprite;
        let distance = Phaser.Math.Distance.Between(
          origin.x,
          origin.y,
          enemySprite.x,
          enemySprite.y,
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestEnemy = enemySprite;
        }
      },
    );

    return closestEnemy;
  }

  // @ts-ignore
  enemyTowerCollision(tower: any, enemy: any) {
    enemy.destroy();
    if (enemy.getData('type') === 'boss') this.towerLife -= BOSS_BASE_DAMAGE;
    else this.towerLife -= ENEMY_BASE_DAMAGE;
  }

  enemyWeaponCollision({ weapon, enemy, weaponDestroyed = false }: any) {
    const currentTime = Date.now();
    const hitCooldown = 200; // milliseconds
    const weaponId = weapon.getData('id');
    const bossId = enemy.getData('id');

    const compositeKey = `${weaponId}-${bossId}`;
    const lastHitTime = this.weaponBossHitMap.get(compositeKey) || 0;
    if (currentTime - lastHitTime < hitCooldown) {
      return;
    }
    this.weaponBossHitMap.set(compositeKey, currentTime);

    if (enemy.getData('type') === 'boss' && enemy.getData('hitpoints') > 0) {
      enemy.setData('hitpoints', enemy.getData('hitpoints') - 5);
      console.log(enemy.getData('hitpoints'));
    } else {
      this.enemyDefeated(enemy);
    }

    if (weaponDestroyed) {
      weapon.destroy();
    }
  }

  enemyDefeated(enemy: any) {
    enemy.destroy();
    if (enemy.getData('type') === 'boss')
      this.playerTower.currentGold += BOSS_BASE_GOLD_VALUE;
    else this.playerTower.currentGold += ENEMY_BASE_GOLD_VALUE;
  }

  updateArrowTimer() {
    if (this.spawnArrowTimer) {
      this.spawnArrowTimer.destroy();
    }
    this.spawnArrowTimer = this.time.addEvent({
      delay: 1000 / this.arrowRate,
      callback: this.spawnArrow,
      callbackScope: this,
      loop: true,
    });
  }

  spawnDarkBlast() {
    if (this.darkBlastTimer) {
      this.darkBlastTimer.destroy();
    }
    let x: number = this.scale.width / 2;
    let y: number = this.scale.height / 2;
    const darkBlastSprite = this.physics.add.sprite(x, y, 'darkBlastSprite1');
    darkBlastSprite.scale = 2;
    darkBlastSprite.setData('type', 'darkBlast');
    darkBlastSprite.setData('id', `weapon-${this.weaponCounter++}`);
    darkBlastSprite.play('darkBlastAnimation');

    // Delay the velocity setting by 1 ms
    this.time.delayedCall(1, () => {
      // let angle = Phaser.Math.Between(0, 360);

      this.physics.velocityFromAngle(
        this.darkBlastDirection,
        200,
        darkBlastSprite.body.velocity,
      );
      darkBlastSprite.angle = this.darkBlastDirection;
      if (this.darkBlastDirection + this.darkBlastAngleChange < 360)
        this.darkBlastDirection += this.darkBlastAngleChange;
      else this.darkBlastDirection = 0;
    });

    this.weapons?.add(darkBlastSprite);
    this.darkBlastTimer = this.time.addEvent({
      delay: this.darkBlastCooldown,
      callback: this.spawnDarkBlast,
      callbackScope: this,
      loop: false,
    });
  }

  spawnRegen() {
    if (this.regenTimer) {
      this.regenTimer.destroy();
    }
    let x: number = this.scale.width / 2;
    let y: number = this.scale.height / 2.3;
    const regenSprite = this.physics.add.sprite(x, y, 'regen');
    regenSprite.scale = 1.2;
    regenSprite.setData('type', 'regen');
    regenSprite.play('regenAnimation');
    regenSprite.setImmovable(true);
    this.towerLife += this.regenAmount;
    if (this.towerLife > TOWER_BASE_HITPOINTS)
      this.towerLife === TOWER_BASE_HITPOINTS;
    regenSprite.on('animationcomplete', () => {
      regenSprite.destroy();
      this.regenTimer = this.time.addEvent({
        delay: this.regenCooldown,
        callback: this.spawnRegen,
        callbackScope: this,
        loop: false,
      });
    });
  }

  spawnTimeSlow() {
    if (this.timeSlowTimer) {
      this.timeSlowTimer.destroy();
    }
    let x: number = this.scale.width / 2;
    let y: number = this.scale.height / 2;
    const timeSlowSprite = this.physics.add.sprite(x, y, 'timeSlowTexture');
    timeSlowSprite.scale = 0.5;
    timeSlowSprite.setData('type', 'timeSlow');
    timeSlowSprite.play('timeSlowAnimation');
    timeSlowSprite.setImmovable(true);
    this.PermanentWeapons?.add(timeSlowSprite);
    timeSlowSprite.on('animationcomplete', () => {
      timeSlowSprite.destroy();
      this.enemyCurrentSpeed = ENEMY_BASE_SPEED;
      this.timeSlowTimer = this.time.addEvent({
        delay: this.timeSlowCooldown,
        callback: this.spawnTimeSlow,
        callbackScope: this,
        loop: false,
      });
    });
  }

  spawnTornado = () => {
    let x: number = this.scale.width * Math.random();
    let y: number = this.scale.height * Math.random();
    const tornadoSprite = this.physics.add.sprite(x, y, 'tornadoRepeat1');
    tornadoSprite.scale = 0.2;
    tornadoSprite.setData('type', 'tornado');
    tornadoSprite.setData('id', `weapon-${this.weaponCounter++}`);
    this.PermanentWeapons?.add(tornadoSprite);
    tornadoSprite.play('tornadoAnimation');
    tornadoSprite.setImmovable(true);
  };
}
