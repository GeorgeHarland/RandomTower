import CircleWeapon from '../classes/circleWeapon';
import Phaser from 'phaser';
import PlayerTower from '../classes/playerTower';
import ShopBox from '../classes/shopBox';
import { KeybindType } from '../types';
import { generateTextures } from './helpers/textureHelpers';
import { extractSpriteFrames, loadSprites } from './helpers/spriteHelpers';
import Item from '../classes/item';
import {
  ARROW_BASE_SPEED,
  ARROW_RATE_INCREASE,
  CIRCLE_SPEED_INCREASE,
  DEV_TEXT_AT_TOP,
  ENEMY_BASE_DAMAGE,
  ENEMY_BASE_SPEED,
  TIME_SLOW_LEVELUP_COOLDOWN_REDUCTION,
  TORNADO_BASE_SHAKE_AMOUNT,
} from '../../constants';

export default class GameStageScene extends Phaser.Scene {
  private playerTower: PlayerTower = new PlayerTower();
  private circleWeapons: Phaser.Physics.Arcade.Group | undefined;
  private enemies: Phaser.Physics.Arcade.Group | undefined;
  private tower: Phaser.Physics.Arcade.Sprite | undefined;
  private weapons: Phaser.Physics.Arcade.Group | undefined;
  private PermanentWeapons: Phaser.Physics.Arcade.Group | undefined;
  private shopBoxes: Phaser.GameObjects.Group | undefined;

  private towerSprites: Phaser.GameObjects.Image[] = [];

  private towerLife: number = 100;
  private towerLifeText: Phaser.GameObjects.Text | undefined;
  private goldText: Phaser.GameObjects.Text | undefined;
  private enemyRate: number = 0.5;
  private enemyRateText: Phaser.GameObjects.Text | undefined;
  private arrowRate: number = 0.2;
  private arrowRateText: Phaser.GameObjects.Text | undefined;
  private timeSlowCooldown: number = 30000;

  private spawnArrowTimer: Phaser.Time.TimerEvent | undefined;
  private spawnEnemyTimer: Phaser.Time.TimerEvent | undefined;
  private timeSlowTimer: Phaser.Time.TimerEvent | undefined;

  private enemyCurrentSpeed: number = ENEMY_BASE_SPEED;

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
    this.towerSprites = extractSpriteFrames(this);

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

    this.spawnEnemyTimer = this.time.addEvent({
      delay: 1000 / this.enemyRate,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    this.spawnArrowTimer = this.time.addEvent({
      delay: 1000 / this.arrowRate,
      callback: this.spawnArrow,
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

    this.PermanentWeapons?.children.entries.forEach((weapon) => {
      // maybe best to make a type for these weapons inc sprite and name/type
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
        this.enemyCurrentSpeed *= 0.95;
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
    itemBought && this.addPowerup(itemBought);

    this.enemies?.children.entries.forEach((enemy) => {
      this.tower &&
        this.physics.moveToObject(enemy, this.tower, this.enemyCurrentSpeed);
    });

    this.shopBoxes?.children.entries.forEach((box) => {
      const shopBox = box as ShopBox;
      if (shopBox.getItem() === null) {
        (shopBox as ShopBox).addItem((shopBox as ShopBox).generateRandomItem());
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
      key: 'timeSlowAnimation',
      frames: this.anims.generateFrameNumbers('timeSlowAnimationSheet', {
        start: 0,
        end: 14,
      }),
      frameRate: 14,
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

  spawnEnemy() {
    let x: number;
    let y: number;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? -50 : this.scale.width + 50;
      y = Math.random() * this.scale.height;
    } else {
      x = Math.random() * this.scale.width;
      y = Math.random() < 0.5 ? -50 : this.scale.height + 50;
    }

    const enemy = this.physics.add.sprite(x, y, 'enemyTexture');
    this.enemies?.add(enemy);
    this.updateEnemySpawnTimer();
  }

  spawnArrow() {
    if (this.tower) {
      const x = this.tower.x;
      const y = this.tower.y;

      const arrow = this.physics.add.sprite(x, y, 'arrowTexture');
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
    if (item.powerup === 'arrowRate')
      this.arrowRate += item.cost * ARROW_RATE_INCREASE;
    if (item.powerup === 'circleSpeed') {
      this.circleWeapons?.children.entries.forEach((circle) => {
        (circle as CircleWeapon).circleSpeed += CIRCLE_SPEED_INCREASE;
      });
    }
    if (item.powerup === 'timeSlow') {
      this.timeSlowCooldown *= TIME_SLOW_LEVELUP_COOLDOWN_REDUCTION;
      this.spawnTimeSlow();
    }
    if (item.powerup === 'tornado') {
      let x: number = this.scale.width * Math.random();
      let y: number = this.scale.height * Math.random();
      const tornadoSprite = this.physics.add.sprite(x, y, 'tornadoRepeat1');
      tornadoSprite.scale = 0.2;
      tornadoSprite.setData('type', 'tornado');
      this.PermanentWeapons?.add(tornadoSprite);
      tornadoSprite.play('tornadoAnimation');
      tornadoSprite.setImmovable(true);
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
    this.towerLife -= ENEMY_BASE_DAMAGE;
  }

  enemyWeaponCollision({ weapon, enemy, weaponDestroyed = false }: any) {
    if (weaponDestroyed) weapon.destroy();
    this.enemyDefeated(enemy);
  }

  enemyDefeated(enemy: any) {
    enemy.destroy();
    this.playerTower.currentGold++;
  }

  updateEnemySpawnTimer() {
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
}
