import Phaser from 'phaser';

export default class GameStageScene extends Phaser.Scene {

  private circle: Phaser.GameObjects.Arc | undefined;
  private tower: Phaser.GameObjects.Rectangle | undefined;

  constructor() {
    super({ key: 'GameStage' });
  }

  preload() {
    // ...for assets
  }

  create() {
    this.tower = this.add.rectangle(400, 300, 30, 30, 0x0000ff)
    this.circle = this.add.circle(400, 300, 15, 0xff0000);
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
  }
}
