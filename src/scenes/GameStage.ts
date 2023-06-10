import Phaser from 'phaser';

export default class GameStageScene extends Phaser.Scene {

  private circle: Phaser.GameObjects.Arc | undefined;
  private tower: Phaser.GameObjects.Rectangle | undefined;
  private enemies: Phaser.GameObjects.Group | undefined;

  constructor() {
    super({ key: 'GameStage' });
  }

  preload() {
    // ...for assets
  }

  create() {
    this.tower = this.add.rectangle(400, 300, 30, 30, 0x0000ff)
    this.circle = this.add.circle(400, 300, 15, 0xff0000);

    this.enemies = this.physics.add.group({
      classType: Phaser.GameObjects.Rectangle
    });

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
        if(this.circle?.y !== undefined) this.circle.y = this.circle.y - 3;
    } else if (cursors?.down?.isDown) {
        if(this.circle?.y !== undefined) this.circle.y = this.circle.y + 3;
    }

    if (cursors?.left?.isDown) {
        if(this.circle?.x !== undefined) this.circle.x = this.circle.x - 3;
    } else if (cursors?.right?.isDown) {
        if(this.circle?.x !== undefined) this.circle.x = this.circle.x + 3;
    }

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

    const enemy = this.add.rectangle(x, y, 30, 30, 0x00ff00);
    this.enemies?.add(enemy);
    console.log('happening')
  }
}
