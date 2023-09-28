import Phaser from 'phaser';
import CircleWeapon from '../classes/CircleWeapon';
import Item from '../classes/Item';
import PlayerTower from '../classes/PlayerTower';
import ShopBox from '../classes/ShopBox';
import { secondsToMMSS } from './helpers/gameHelpers';
import { extractTowerFrames, loadSprites } from './helpers/spriteHelpers';
import { generateTextures } from './helpers/textureHelpers';
import { KeybindType, PowerupType } from '../types';
import {
  JUGGERNAUT_SPEED_MULTIPLIER,
  DEV_TEXT_AT_TOP,
  ENEMY_BASE_SPEED,
  TORNADO_BASE_SHAKE_AMOUNT,
  PowerupRecord,
} from '../../constants';
import EnemyManager from '../classes/EnemyManager';
import PowerupManager from '../classes/PowerupManager';

export default class GameStageScene extends Phaser.Scene {
  public playerTower: PlayerTower = new PlayerTower();
  public enemyManager: EnemyManager = new EnemyManager(this, this.playerTower);
  public powerupManager: PowerupManager = new PowerupManager(this);
  private startTime: number = 0;
  private elapsedSeconds: number = 0;
  public circleWeapons: Phaser.Physics.Arcade.Group | undefined;
  public tower: Phaser.Physics.Arcade.Sprite | undefined;
  public weapons: Phaser.Physics.Arcade.Group | undefined;
  public PermanentWeapons: Phaser.Physics.Arcade.Group | undefined;
  private shopBoxes: Phaser.GameObjects.Group | undefined;
  public generatedItems: PowerupType[] = [];
  public additionalPrice: number = 0;

  private towerSprites: Phaser.GameObjects.Image[] = [];

  private towerLifeText: Phaser.GameObjects.Text | undefined;
  private gameTimeText: Phaser.GameObjects.Text | undefined;
  private goldText: Phaser.GameObjects.Text | undefined;
  private enemyRateText: Phaser.GameObjects.Text | undefined;
  private arrowRateText: Phaser.GameObjects.Text | undefined;

  private keyQ: Phaser.Input.Keyboard.Key | null = null;
  private keyW: Phaser.Input.Keyboard.Key | null = null;
  private keyE: Phaser.Input.Keyboard.Key | null = null;
  private keyU: Phaser.Input.Keyboard.Key | null = null;
  private keyK: Phaser.Input.Keyboard.Key | null = null;

  public constructor() {
    super({ key: 'GameStageScene' });
  }

  public preload() {
    loadSprites(this);
  }

  public create() {
    generateTextures(this.make);
    this.towerSprites = extractTowerFrames(this);

    this.setupKeybindings();
    this.setupAnimations();

    this.enemyManager = new EnemyManager(this, this.playerTower);
    this.enemyManager.initialize();
    this.powerupManager = new PowerupManager(this)

    const bg = this.add.tileSprite(
      0,
      0,
      this.scale.width,
      this.scale.height,
      'bgTexture'
    );
    bg.setOrigin(0, 0);

    const towerImage = this.towerSprites[0];
    
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    this.tower = this.physics.add.sprite(
      centerX,
      centerY,
      'towerSpriteSheet',
      towerImage.frame.name
    );
    this.tower.setBodySize(this.tower.displayWidth , this.tower.displayHeight * 0.7, true)
    this.tower.setOffset(0, this.tower.displayHeight * 0.25)
    this.tower.scale = this.scale.width / 800;

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
      'Tower Life: ' + this.playerTower.currentHp,
      {
        fontSize: `${topTextSize}px`,
        color: '#000000',
      }
    );
    this.goldText = this.add.text(
      this.scale.width / 40,
      this.scale.height / 10,
      'Gold: ' + this.playerTower.currentGold,
      {
        fontSize: `${topTextSize}px`,
        color: '#eeee00',
      }
    );
    this.gameTimeText = this.add.text(
      this.scale.width / 1.15,
      this.scale.height / 40,
      this.elapsedSeconds.toString(),
      {
        fontSize: `${topTextSize}px`,
        color: '#000000',
        align: 'right',
      }
    );
    if (DEV_TEXT_AT_TOP) {
      this.enemyRateText = this.add.text(
        this.scale.width / 40,
        this.scale.height / 6,
        'Enemies per second: ' + this.enemyManager.enemyRate.toFixed(1),
        {
          fontSize: `${topTextSize}px`,
          color: '#cccccc',
        }
      );
      this.arrowRateText = this.add.text(
        this.scale.width / 40,
        this.scale.height / 4,
        'Arrows per second: ' + this.powerupManager.arrowRate.toFixed(1),
        {
          fontSize: `${topTextSize}px`,
          color: '#cccccc',
        }
      );
    }

    this.physics.add.collider(this.enemyManager.enemies as Phaser.Types.Physics.Arcade.ArcadeColliderType, this.tower, (_, enemy) => {
      this.enemyManager.enemyTowerCollision(
        enemy as Phaser.Types.Physics.Arcade.GameObjectWithBody
      );
    });
    this.physics.add.collider(
      this.enemyManager.enemies as Phaser.Types.Physics.Arcade.ArcadeColliderType,
      this.circleWeapons,
      (enemy, circle) => {
        this.enemyManager.enemyWeaponCollision(
          circle as Phaser.Types.Physics.Arcade.GameObjectWithBody,
          enemy as Phaser.Types.Physics.Arcade.GameObjectWithBody,
          false
        );
      }
    );

    this.physics.add.collider(this.enemyManager.enemies as Phaser.Types.Physics.Arcade.ArcadeColliderType, this.weapons, (enemy, weapon) => {
      this.enemyManager.enemyWeaponCollision(
        weapon as Phaser.Types.Physics.Arcade.GameObjectWithBody,
        enemy as Phaser.Types.Physics.Arcade.GameObjectWithBody,
        true
      );
    });
    this.physics.add.collider(
      this.enemyManager.enemies as Phaser.Types.Physics.Arcade.ArcadeColliderType,
      this.PermanentWeapons,
      (enemy, weapon) => {
        this.enemyManager.enemyWeaponCollision(
          weapon as Phaser.Types.Physics.Arcade.GameObjectWithBody,
          enemy as Phaser.Types.Physics.Arcade.GameObjectWithBody,
          false
        );
      }
    );

    this.powerupManager.spawnArrowTimer = this.time.addEvent({
      delay: 1000 / this.powerupManager.arrowRate,
      callback: this.powerupManager.spawnArrow,
      callbackScope: this,
      loop: true,
    });

    this.enemyManager.spawnJuggernautTimer = this.time.addEvent({
      delay: 1000 / this.enemyManager.juggernautRate,
      callback: this.enemyManager.spawnJuggernaut,
      callbackScope: this,
      loop: true,
    });

    this.enemyManager.spawnEnemyTimer = this.time.addEvent({
      delay: 1000 / this.enemyManager.enemyRate,
      callback: this.enemyManager.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 1000,
      callback: () => this.enemyManager.updateEnemyRates(),
      callbackScope: this,
      loop: true,
    });

    this.startTime = this.time.now;
    this.elapsedSeconds = 0;
  }

  public update(time: number) {
    const cursors = this.input.keyboard?.createCursorKeys();
    this.elapsedSeconds = Math.floor((time - this.startTime) / 1000);

    this.circleWeapons?.children.entries.forEach((circle) => {
      (circle as CircleWeapon)?.moveCircle(cursors);
    });

    // this.weapons?.children.entries.forEach((weapon) => {
    //   if (weapon.getData('type') === 'darkBlast') { }
    // });

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
    });

    if (this.powerupManager.timeSlow) this.enemyManager.enemyCurrentSpeed *= 0.95;
    else if (this.enemyManager.enemyCurrentSpeed < ENEMY_BASE_SPEED / 10)
      this.enemyManager.enemyCurrentSpeed = ENEMY_BASE_SPEED / 10;
    else if (this.enemyManager.enemyCurrentSpeed < ENEMY_BASE_SPEED)
      this.enemyManager.enemyCurrentSpeed /= 0.95;
    if (this.enemyManager.enemyCurrentSpeed > ENEMY_BASE_SPEED)
      this.enemyManager.enemyCurrentSpeed = ENEMY_BASE_SPEED;

    const shopBoxKeybinds: { [id: string]: ShopBox } = {};
    this.shopBoxes?.children.entries.forEach(
      (gameObject: Phaser.GameObjects.GameObject) => {
        const shopBox = gameObject as ShopBox;
        shopBoxKeybinds[shopBox.getKeybind()] = shopBox;
      }
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
        this.enemyManager.enemyRate += 1;
        this.enemyManager.juggernautRate += 1;
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
      this.powerupManager.addPowerup(itemBought);
      this.generatedItems = [];
      this.shopBoxes?.children.entries.forEach((shopbox) => {
        (shopbox as ShopBox).rerollItem();
      });
    }

    this.enemyManager.enemies?.children.entries.forEach((enemy) => {
      if (this.tower) {
        if (enemy.getData('type') === 'juggernaut')
          this.physics.moveToObject(
            enemy,
            this.tower,
            this.enemyManager.enemyCurrentSpeed * JUGGERNAUT_SPEED_MULTIPLIER
          );
        else
          this.physics.moveToObject(enemy, this.tower, this.enemyManager.enemyCurrentSpeed);
      }
    });

    this.shopBoxes?.children.entries.forEach((box, index) => {
      const shopBox = box as ShopBox;
      if (shopBox.getItem() === null) {
        if(this.elapsedSeconds > 1) (shopBox as ShopBox).addItem((shopBox as ShopBox).generateRandomItem());
        else if (index === 0) shopBox.addItem(new Item(
          shopBox.scene,
          0,
          0,
          'item0',
          'arrowRate',
          PowerupRecord['arrowRate'],
          10
        ));
        else if (index === 1) shopBox.addItem(new Item(
          shopBox.scene,
          0,
          0,
          'item0',
          'circleStrength',
          PowerupRecord['circleStrength'],
          10
        ));
        else if (index === 2) shopBox.addItem(new Item(
          shopBox.scene,
          0,
          0,
          'item0',
          'tornado',
          PowerupRecord['tornado'],
          8
        ));
      }
      if (shopBox.getItem != null) {
        this.generatedItems.push((shopBox.getItem() as Item).powerup);
      }
    });

    if (this.playerTower.currentHp <= 0) {
      this.data.set('gametime', this.elapsedSeconds)
      // this.scene.remove();
      this.scene.start('GameOverScene');
    }

    this.towerLifeText &&
      this.towerLifeText.setText('Tower Life: ' + this.playerTower.currentHp);
    this.goldText &&
      this.goldText.setText('Gold: ' + this.playerTower.currentGold);
    this.gameTimeText &&
      this.gameTimeText.setText(secondsToMMSS(this.elapsedSeconds));
    this.gameTimeText &&
      this.gameTimeText.setPosition(
        this.scale.width / 1.05 - this.gameTimeText.width,
        this.scale.height / 40
      );
    if (DEV_TEXT_AT_TOP) {
      this.enemyRateText &&
        this.enemyRateText.setText(
          'Enemies per second: ' + this.enemyManager.enemyRate.toFixed(1)
        );
      this.arrowRateText &&
        this.arrowRateText.setText(
          'Arrows per second: ' + this.powerupManager.arrowRate.toFixed(1)
        );
    }
  }

  private setupKeybindings() {
    if (this.input.keyboard) {
      this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      this.keyU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
      this.keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    }
  }

  private setupAnimations() {
    this.anims.create({
      key: 'darkBlastAnimation',
      frames: Array.from({ length: 15 }, (_, i) => ({
        key: `darkBlastSprite${i}`,
      })),
      frameRate: 14,
      repeat: -1,
    });
    this.anims.create({
      key: 'fireBlastAnimation',
      frames: Array.from({ length: 15 }, (_, i) => ({
        key: `fireBlastSprite${i}`,
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

  public increasePrices = (): void => {
    this.additionalPrice += Math.floor(this.elapsedSeconds / 60) + 1;
  };
}
