import Phaser from 'phaser';
import generateTextures from '../textures';

export default class GameStageScene extends Phaser.Scene {

  private circle: Phaser.Physics.Arcade.Sprite | undefined;
  private enemies: Phaser.Physics.Arcade.Group | undefined;
  private tower: Phaser.Physics.Arcade.Sprite | undefined;

  private towerLife: number;
  private towerLifeText: Phaser.GameObjects.Text | undefined;
  private playerGold: number;
  private goldText: Phaser.GameObjects.Text | undefined;
  private enemyRate: number;
  private enemyRateText: Phaser.GameObjects.Text | undefined;

  constructor() {
    super({ key: 'GameStage' });
    this.towerLife = 100;
    this.playerGold = 0;
    this.enemyRate = 0.5
  }

  preload() {
    // ...for assets
  }

  create() {
    generateTextures(this.make);

    const bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'bgTexture');
    bg.setOrigin(0, 0);

    this.tower = this.physics.add.sprite(400, 300, 'towerTexture');
    this.tower.setImmovable(true);
    this.circle = this.physics.add.sprite(400, 200, 'circleTexture');
    this.circle.setImmovable(true);
    this.enemies = this.physics.add.group({
      classType: Phaser.GameObjects.Rectangle
    });
    this.towerLifeText = this.add.text(10, 10, 'Tower Life: ' + this.towerLife, {
      fontSize: '24px',
      color: '#000000'
    });
    this.goldText = this.add.text(10, 40, 'Gold: ' + this.playerGold, {
      fontSize: '24px',
      color: '#eeee00'
    });
    this.enemyRateText = this.add.text(10, 70, 'Enemies per second: ' + this.enemyRate, {
      fontSize: '24px',
      color: '#cccccc'
    });
    
    this.physics.add.collider(this.enemies, this.tower, (tower, enemy) => { this.enemyTowerCollision(tower, enemy) }); 
    this.physics.add.collider(this.enemies, this.circle, (circle, enemy) => { this.enemyWeaponCollision(circle, enemy) }); 

    this.time.addEvent({
      delay: 1000 / this.enemyRate,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });

    this.time.addEvent({
      delay: 1000,
      callback: () => this.enemyRate+=0.25,
      callbackScope: this,
      loop: true
    });
  }

  update() {
    const cursors = this.input.keyboard?.createCursorKeys();

    if (cursors?.up?.isDown) {
        if(this.circle?.y !== undefined) this.circle.y = this.circle.y - 2;
    } else if (cursors?.down?.isDown) {
        if(this.circle?.y !== undefined) this.circle.y = this.circle.y + 2;
    }

    if (cursors?.left?.isDown) {
        if(this.circle?.x !== undefined) this.circle.x = this.circle.x - 2;
    } else if (cursors?.right?.isDown) {
        if(this.circle?.x !== undefined) this.circle.x = this.circle.x + 2;
    }

    this.enemies && this.enemies.children.entries.forEach((enemy) => {
      this.tower && this.physics.moveToObject(enemy, this.tower, 100)
    }); 
    
    this.towerLifeText && this.towerLifeText.setText('Tower Life: ' + this.towerLife);
    this.goldText && this.goldText.setText('Gold: ' + this.playerGold);
    this.enemyRateText && this.enemyRateText.setText('Enemies per second: ' + this.enemyRate);
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
  }

  enemyTowerCollision(tower: any, enemy: any) {
    enemy.destroy();
    this.towerLife -= 5;
    console.log('Tower collision')
  }

  enemyWeaponCollision(weapon: any, enemy: any) {
    this.enemyDefeated(enemy)
    console.log('Weapon collision')
  }

  enemyDefeated(enemy: any) {
    enemy.destroy();
    this.playerGold += 5;
  }
}
