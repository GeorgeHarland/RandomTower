import CircleWeapon from '../classes/circleWeapon';
import Phaser from 'phaser';
import PlayerTower from '../classes/playerTower';
import ShopBox from '../classes/shopBox';
import { KeybindType } from '../types';
import { generateTextures } from './helpers/textureHelpers';
import { extractSpriteFrames, loadSprites } from './helpers/spriteHelpers';

export default class GameStageScene extends Phaser.Scene {

  private circleWeapon: CircleWeapon | undefined;
  private enemies: Phaser.Physics.Arcade.Group | undefined;
  private tower: Phaser.Physics.Arcade.Sprite | undefined;
  private arrows: Phaser.Physics.Arcade.Group | undefined;
  private playerTower: PlayerTower = new PlayerTower();
  private shopBoxes: Phaser.GameObjects.Group | undefined;

  private towerSprites: Phaser.GameObjects.Image[] = [];

  private towerLife: number = 100;
  private towerLifeText: Phaser.GameObjects.Text | undefined;
  private goldText: Phaser.GameObjects.Text | undefined;
  private enemyRate: number = 0.5;
  private enemyRateText: Phaser.GameObjects.Text | undefined;
  private arrowRate: number = 0.2;
  private arrowRateText: Phaser.GameObjects.Text | undefined;

  private spawnArrowTimer: Phaser.Time.TimerEvent | undefined;
  private spawnEnemyTimer: Phaser.Time.TimerEvent | undefined;

  private keyQ: Phaser.Input.Keyboard.Key | null = null;
  private keyW: Phaser.Input.Keyboard.Key | null = null;
  private keyE: Phaser.Input.Keyboard.Key | null = null;
  private keyU: Phaser.Input.Keyboard.Key | null = null;

  constructor() {
    super({ key: 'GameStageScene' });
  }

  preload() {
    loadSprites(this);
  }

  create() {
    generateTextures(this.make);
    this.towerSprites = extractSpriteFrames(this);

    if(this.input.keyboard) {
      this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      this.keyU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
    }

    const bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'bgTexture');
    bg.setOrigin(0, 0);

    if (this.towerSprites[0]) {
      const towerImage = this.towerSprites[0];
      const centerX = this.scale.width / 2;
      const centerY = this.scale.height / 2;
      this.tower = this.physics.add.sprite(centerX, centerY, 'towerSpriteSheet', towerImage.frame.name);
    } else {
      this.tower = this.physics.add.sprite(400, 300, 'towerTexture');
    }
    this.tower.setImmovable(true);

    this.circleWeapon = new CircleWeapon({scene: this, x: 400, y: 280, texture: 'circleTexture'})
    this.enemies = this.physics.add.group({
      classType: Phaser.GameObjects.Rectangle
    });
    this.arrows = this.physics.add.group({
      classType: Phaser.GameObjects.Rectangle
    });
    this.shopBoxes = this.physics.add.group({
      classType: ShopBox
    })
    for(let i = 0; i < 3; i++) {
      let keybind : KeybindType = 'K';
      if (i === 0) keybind = 'Q';
      if (i === 1) keybind = 'W';
      if (i === 2) keybind = 'E';
      const shopBox = new ShopBox({
        scene: this,
        x: 80+(100*i),
        y: this.scale.height - 80,
        key: 'shopBoxTexture',
        keybind: keybind,
      })
      this.shopBoxes?.add(shopBox);
    }
    this.towerLifeText = this.add.text(10, 10, 'Tower Life: ' + this.towerLife, {
      fontSize: '24px',
      color: '#000000'
    });
    this.goldText = this.add.text(10, 40, 'Gold: ' + this.playerTower.currentGold, {
      fontSize: '24px',
      color: '#eeee00'
    });
    this.enemyRateText = this.add.text(10, 70, 'Enemies per second: ' + this.enemyRate.toFixed(1), {
      fontSize: '24px',
      color: '#cccccc'
    });
    this.arrowRateText = this.add.text(10, 90, 'Arrows per second: ' + this.arrowRate.toFixed(1), {
      fontSize: '24px',
      color: '#cccccc'
    });
    
    this.physics.add.collider(this.enemies, this.tower, (tower, enemy) => { this.enemyTowerCollision(tower, enemy) }); 
    this.physics.add.collider(this.enemies, this.circleWeapon, (circle, enemy) => { this.enemyWeaponCollision(circle, enemy, false) }); 
    this.physics.add.collider(this.enemies, this.arrows, (arrow, enemy) => { this.enemyWeaponCollision(arrow, enemy, true) }); 

    this.spawnEnemyTimer = this.time.addEvent({
      delay: 1000 / this.enemyRate,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });

    this.spawnArrowTimer = this.time.addEvent({
      delay: 1000 / this.arrowRate,
      callback: this.spawnArrow,
      callbackScope: this,
      loop: true
    });

    this.time.addEvent({
      delay: 1000,
      callback: () => this.enemyRate+=0.01,
      callbackScope: this,
      loop: true
    });
  }

  update() {
    const cursors = this.input.keyboard?.createCursorKeys();

    this.circleWeapon?.moveCircle(cursors);

    const shopBoxKeybinds: {[id: string]: ShopBox} = {}
    this.shopBoxes?.children.entries.forEach((gameObject: Phaser.GameObjects.GameObject) => {
      let shopBox = gameObject as ShopBox;
      shopBoxKeybinds[shopBox.getKeybind()] = shopBox;
    })
    if(this.input.keyboard) {
      if(Phaser.Input.Keyboard.JustDown(this.keyU as Phaser.Input.Keyboard.Key)) {
        this.playerTower.currentGold += 1000;
      }
      if(Phaser.Input.Keyboard.JustDown(this.keyQ as Phaser.Input.Keyboard.Key)) {
        shopBoxKeybinds.Q.buyItem(this.playerTower)
      }
      if(Phaser.Input.Keyboard.JustDown(this.keyW as Phaser.Input.Keyboard.Key)) {
        shopBoxKeybinds.W.buyItem(this.playerTower)
      }
      if(Phaser.Input.Keyboard.JustDown(this.keyE as Phaser.Input.Keyboard.Key)) {
        shopBoxKeybinds.E.buyItem(this.playerTower)
      }
    }

    this.enemies?.children.entries.forEach((enemy) => {
      this.tower && this.physics.moveToObject(enemy, this.tower, 80)
    });

    this.shopBoxes?.children.entries.forEach((box) => {
      const shopBox = box as ShopBox;
      if((shopBox).getItem() === null) {
        (shopBox as ShopBox).addItem((shopBox as ShopBox).generateRandomItem())
      }
    })
    
    this.towerLifeText && this.towerLifeText.setText('Tower Life: ' + this.towerLife);
    this.goldText && this.goldText.setText('Gold: ' + this.playerTower.currentGold);
    this.enemyRateText && this.enemyRateText.setText('Enemies per second: ' + this.enemyRate.toFixed(1));
    this.arrowRateText && this.arrowRateText.setText('Arrows per second: ' + this.arrowRate.toFixed(1));
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
    console.log('Enemy spawned')
    this.updateEnemySpawnTimer();
  }

  spawnArrow() {
    if(this.tower) {
      const x = this.tower.x
      const y = this.tower.y

      const arrow = this.physics.add.sprite(x, y, 'arrowTexture');
      this.arrows?.add(arrow);

      let closestEnemy = this.getClosestEnemy(this.tower);
      if (closestEnemy) {
        this.physics.moveToObject(arrow, closestEnemy, 200);
      } else {
        let angle = Phaser.Math.Between(0, 360);
        this.physics.velocityFromAngle(angle, 200, arrow.body.velocity);
      }
  
      console.log('Arrow fired');
      this.updateArrowTimer();
    } 
  }
  
  getClosestEnemy(origin: Phaser.Physics.Arcade.Sprite) {
    let closestEnemy = null;
    let closestDistance = Number.MAX_VALUE;
  
    this.enemies?.children.entries.forEach((enemy: Phaser.GameObjects.GameObject) => {
      const enemySprite = enemy as Phaser.Physics.Arcade.Sprite;
      let distance = Phaser.Math.Distance.Between(origin.x, origin.y, enemySprite.x, enemySprite.y);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestEnemy = enemySprite;
      }
    })
  
    return closestEnemy;
  }
  
  // @ts-ignore
  enemyTowerCollision(tower: any, enemy: any) {
    enemy.destroy();
    this.towerLife -= 5;
    console.log('Tower collision')
  }

  enemyWeaponCollision(weapon: any, enemy: any, weaponDestroyed: boolean = false) {
    weaponDestroyed && weapon.destroy()
    this.enemyDefeated(enemy)
    console.log('Weapon collision')
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
      loop: true
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
      loop: true
    });
  }
}
