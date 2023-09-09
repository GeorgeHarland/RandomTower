export default class GameOverScene extends Phaser.Scene {
  public constructor() {
    super({ key: 'GameOverScene' });
  }

  public create() {
    this.add
      .text(400, 300, 'Game Over', { fontSize: '32px', color: '#ff0000' })
      .setOrigin(0.5);
  }
}
