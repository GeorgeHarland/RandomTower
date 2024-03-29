import Phaser from 'phaser';
import CircleWeapon from '../classes/CircleWeapon';
import EnemyManager from '../classes/EnemyManager';
import PlayerTower from '../classes/PlayerTower';
import PowerupManager from '../classes/PowerupManager';
import ShopBox from '../classes/ShopBox';
import { secondsToMMSS, setupKeybindings } from './helpers/gameHelpers';
import { extractTowerFrames } from './helpers/spriteHelpers';
import { generateTextures } from './helpers/textureHelpers';
import { KeybindType, PowerupType } from '../types';
import {
  EnemyConstants,
  ICEPOOL_SLOW,
  MOBILE_BREAKPOINT,
} from '../../constants';
import { setupAnimations } from './helpers/animationHelpers';

export default class GameStageScene extends Phaser.Scene {
  public gameSpeedScale: number = 1;
  public additionalPrice: number = 0;
  public circleWeapons: Phaser.Physics.Arcade.Group | undefined;
  public elapsedSeconds: number = 0;
  public generatedItems: PowerupType[] = [];
  public terrainEffects: Phaser.Physics.Arcade.Group | undefined;
  public PermanentWeapons: Phaser.Physics.Arcade.Group | undefined;
  public playerTower: PlayerTower = new PlayerTower();
  public shopBoxes: Phaser.GameObjects.Group | undefined;
  public tower: Phaser.Physics.Arcade.Sprite | undefined;
  public weapons: Phaser.Physics.Arcade.Group | undefined;
  public enemyManager: EnemyManager = new EnemyManager(this, this.playerTower);
  public powerupManager: PowerupManager = new PowerupManager(this);
  public powerupsBought: string[] = [];
  public keyQ: Phaser.Input.Keyboard.Key | null = null;
  public keyW: Phaser.Input.Keyboard.Key | null = null;
  public keyE: Phaser.Input.Keyboard.Key | null = null;
  public keyU: Phaser.Input.Keyboard.Key | null = null;
  public keyK: Phaser.Input.Keyboard.Key | null = null;

  private gameTimeText: Phaser.GameObjects.Text | undefined;
  private goldText: Phaser.GameObjects.Text | undefined;
  private startTime: number = 0;
  private gameStarted: boolean = false;
  private towerLifeText: Phaser.GameObjects.Text | undefined;
  private towerSprites: Phaser.GameObjects.Image[] = [];

  public constructor() {
    super({ key: 'GameStageScene' });
  }

  public preload() {}

  public create() {
    generateTextures(this);
    this.towerSprites = extractTowerFrames(this);

    setupKeybindings(this);
    setupAnimations(this);

    const music = this.sound.add('gameMusic1', { loop: true });
    music.setVolume(0.4);
    music.play();

    this.enemyManager = new EnemyManager(this, this.playerTower);
    this.enemyManager.initialize();
    this.powerupManager = new PowerupManager(this);

    const bg = this.add.tileSprite(
      0,
      0,
      this.scale.width,
      this.scale.height,
      'bgTexture'
    );
    bg.setOrigin(0, 0);
    bg.setDepth(-1);

    const towerImage = this.towerSprites[0];

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    this.tower = this.physics.add.sprite(
      centerX,
      centerY,
      'towerSpriteSheet',
      towerImage.frame.name
    );
    this.tower.setBodySize(
      this.tower.displayWidth,
      this.tower.displayHeight * 0.7,
      true
    );
    this.tower.setOffset(0, this.tower.displayHeight * 0.25);
    this.tower.scale = this.scale.width / 800;
    this.tower.setImmovable(true);

    this.circleWeapons = this.physics.add.group({
      classType: CircleWeapon,
    });
    let scale = 0;
    for (let i = 0; i < 3; i++) {
      const currentWeapon = new CircleWeapon({
        scene: this,
        x: this.scale.width / 2,
        y: this.scale.height / 2.2,
        circleNumber: i,
      });
      if (i === 0) {
        scale = currentWeapon.scaleX * this.gameSpeedScale;
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
    this.terrainEffects = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
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
      const shopboxX = this.scale.width / 10 + (this.scale.width / 8) * i;
      const shopboxY = this.scale.height - this.scale.height / 8;
      const mobileShopboxX = this.scale.width / 12;
      const mobileShopboxY =
        (this.scale.height / 5) * i * 1.3 + this.scale.height / 2.9;
      const shopBox = new ShopBox({
        scene: this,
        x: this.scale.width > MOBILE_BREAKPOINT ? shopboxX : mobileShopboxX,
        y: this.scale.width > MOBILE_BREAKPOINT ? shopboxY : mobileShopboxY,
        key: 'shopBoxTexture',
        keybind: keybind,
      });
      this.shopBoxes?.add(shopBox);
    }

    const topTextSize = Math.floor(this.sys.canvas.width / 22);

    this.towerLifeText = this.add.text(
      this.scale.width / 40,
      this.scale.height / 40,
      'Tower Life: ' + this.playerTower.currentHp,
      {
        fontSize: `${topTextSize}px`,
        color: '#000000',
        fontFamily: 'MedievalSharp',
      }
    );
    this.goldText = this.add.text(
      this.scale.width / 40,
      this.scale.height / 10,
      'Gold: ' + this.playerTower.currentGold,
      {
        fontSize: `${topTextSize}px`,
        color: '#eeee00',
        fontFamily: 'MedievalSharp',
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
        fontFamily: 'MedievalSharp',
      }
    );

    this.physics.add.overlap(
      this.enemyManager
        .enemies as Phaser.Types.Physics.Arcade.ArcadeColliderType,
      this.tower,
      (_, enemy) => {
        this.enemyManager.enemyTowerCollision(
          enemy as Phaser.Types.Physics.Arcade.GameObjectWithBody
        );
      }
    );
    this.physics.add.overlap(
      this.enemyManager
        .enemies as Phaser.Types.Physics.Arcade.ArcadeColliderType,
      this.circleWeapons,
      (enemy, circle) => {
        this.enemyManager.enemyWeaponCollision(
          circle as Phaser.Types.Physics.Arcade.GameObjectWithBody,
          enemy as Phaser.Types.Physics.Arcade.GameObjectWithBody,
          false
        );
      }
    );

    this.physics.add.overlap(
      this.enemyManager
        .enemies as Phaser.Types.Physics.Arcade.ArcadeColliderType,
      this.weapons,
      (enemy, weapon) => {
        this.enemyManager.enemyWeaponCollision(
          weapon as Phaser.Types.Physics.Arcade.GameObjectWithBody,
          enemy as Phaser.Types.Physics.Arcade.GameObjectWithBody,
          true
        );
      }
    );
    this.physics.add.overlap(
      this.enemyManager
        .enemies as Phaser.Types.Physics.Arcade.ArcadeColliderType,
      this.PermanentWeapons,
      (enemy, weapon) => {
        this.enemyManager.enemyWeaponCollision(
          weapon as Phaser.Types.Physics.Arcade.GameObjectWithBody,
          enemy as Phaser.Types.Physics.Arcade.GameObjectWithBody,
          false
        );
      }
    );
    this.physics.add.overlap(
      this.enemyManager
        .enemies as Phaser.Types.Physics.Arcade.ArcadeColliderType,
      this.terrainEffects,
      (enemy, effect) => {
        this.enemyManager.enemyTerrainCollision(
          effect as Phaser.Types.Physics.Arcade.GameObjectWithBody,
          enemy as Phaser.Types.Physics.Arcade.GameObjectWithBody
        );
      }
    );

    this.powerupManager.arrowRateManager.spawnArrowTimer = this.time.addEvent({
      delay: 1000 / this.powerupManager.arrowRateManager.arrowRate,
      callback: this.powerupManager.arrowRateManager.spawnArrow,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 1000,
      callback: () => this.enemyManager.updateEnemyRates(),
      callbackScope: this,
      loop: true,
    });

    this.gameSpeedScale = this.scale.width / 800;
  }

  public update(time: number) {
    if (!this.gameStarted) {
      this.elapsedSeconds = 0;
      this.startTime = this.time.now;
      this.gameStarted = true;
    }

    const cursors = this.input.keyboard?.createCursorKeys();
    this.elapsedSeconds = Math.floor((time - this.startTime) / 1000);

    this.circleWeapons?.children.entries.forEach((circle) => {
      (circle as CircleWeapon)?.moveCircle(cursors);
    });

    this.PermanentWeapons?.children.entries.forEach((weapon) => {
      if (weapon.getData('type') === 'tornado') {
        this.powerupManager.tornadoManager.moveTornado(
          weapon as Phaser.Physics.Arcade.Sprite
        );
      }
    });

    this.powerupManager.timeSlowManager.updateTimeSlow();

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
        this.enemyManager.enemyRates.minionRate += 1;
        this.enemyManager.spawnEnemy('minion');
        this.enemyManager.enemyRates.juggernautRate += 1;
        this.enemyManager.spawnEnemy('juggernaut');
        this.enemyManager.enemyRates.bossRate += 1;
        this.enemyManager.spawnEnemy('boss');
      }
      if (
        Phaser.Input.Keyboard.JustDown(this.keyQ as Phaser.Input.Keyboard.Key)
      ) {
        itemBought = shopBoxKeybinds.Q.buyItem();
      }
      if (
        Phaser.Input.Keyboard.JustDown(this.keyW as Phaser.Input.Keyboard.Key)
      ) {
        itemBought = shopBoxKeybinds.W.buyItem();
      }
      if (
        Phaser.Input.Keyboard.JustDown(this.keyE as Phaser.Input.Keyboard.Key)
      ) {
        itemBought = shopBoxKeybinds.E.buyItem();
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
      // update healthbar positions
      const healthBar = enemy.getData('healthBar');
      const enemySprite = enemy as Phaser.Physics.Arcade.Sprite;
      healthBar.x = enemySprite.x - 10;
      healthBar.y = enemySprite.y - enemySprite.height * 0.1;

      if (this.tower) {
        const effectMultiplier =
          enemy.getData('chilled') === true ? ICEPOOL_SLOW : 1;
        if (enemy.getData('type') === EnemyConstants.juggernaut.TYPE)
          this.physics.moveToObject(
            enemy,
            this.tower,
            this.enemyManager.enemiesCurrentSpeed *
              EnemyConstants.juggernaut.SPEED_MULTIPLIER *
              this.gameSpeedScale *
              effectMultiplier
          );
        else if (enemy.getData('type') === EnemyConstants.boss.TYPE)
          this.physics.moveToObject(
            enemy,
            this.tower,
            this.enemyManager.enemiesCurrentSpeed *
              EnemyConstants.boss.SPEED_MULTIPLIER *
              this.gameSpeedScale *
              effectMultiplier
          );
        else
          this.physics.moveToObject(
            enemy,
            this.tower,
            this.enemyManager.enemiesCurrentSpeed *
              this.gameSpeedScale *
              effectMultiplier
          );
      }
    });

    this.powerupManager.initShopBoxes();

    if (this.playerTower.currentHp <= 0) {
      this.data.set('gametime', this.elapsedSeconds);
      this.data.set('powerupsBought', this.powerupsBought);
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

    this.enemyManager.enemies?.children.entries.forEach((enemy) => {
      enemy.setData('chilled', false);
    });
  }

  public increasePrices = (): void => {
    this.additionalPrice += Math.floor(this.elapsedSeconds / 30) + 1;
  };
}
