import Phaser from 'phaser';
import generateTextures from '../textures';

export default class GameStageScene extends Phaser.Scene {

  private circle: Phaser.Physics.Arcade.Sprite | undefined;
  private enemies: Phaser.Physics.Arcade.Group | undefined;
  private tower: Phaser.Physics.Arcade.Sprite | undefined;

  private towerLife: number;
  private towerLifeText: Phaser.GameObjects.Text | undefined;

  constructor() {
    super({ key: 'GameStage' });
    this.towerLife = 100;
  }

  preload() {
    // ...for assets
  }

  create() {
    generateTextures(this.make);

    this.tower = this.physics.add.sprite(400, 300, 'towerTexture');
    this.tower.setImmovable(true);
    this.circle = this.physics.add.sprite(400, 200, 'circleTexture');
    this.circle.setImmovable(true);
    this.enemies = this.physics.add.group({
      classType: Phaser.GameObjects.Rectangle
    });
    this.towerLifeText = this.add.text(10, 10, 'Tower Life: ' + this.towerLife, {
      fontSize: '24px',
      color: '#ffffff'
    });
    
    this.physics.add.collider(this.enemies, this.tower, (tower, enemy) => { this.enemyTowerCollision(tower, enemy) }); 
    this.physics.add.collider(this.enemies, this.circle, (circle, enemy) => { this.enemyWeaponCollision(circle, enemy) }); 

    this.time.addEvent({
      delay: 2000,
      callback: this.spawnEnemy,
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

    // enemies: move towards tower -> despawn and deal damage if collides
    this.enemies && this.enemies.children.entries.forEach((enemy) => {
      this.tower && this.physics.moveToObject(enemy, this.tower, 100)
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
    console.log('Enemy spawned')
  }

  enemyTowerCollision(tower: any, enemy: any) {
    enemy.destroy();
    this.towerLife -= 5;
    console.log('Tower collision')
    this.towerLifeText && this.towerLifeText.setText('Tower Life: ' + this.towerLife);
  }

  enemyWeaponCollision(weapon: any, enemy: any) {
    enemy.destroy();
    console.log('Weapon collision')
  }
}
