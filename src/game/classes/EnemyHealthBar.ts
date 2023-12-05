import GameStageScene from "../scenes/GameStage";

class EnemyHealthBar extends Phaser.GameObjects.Graphics {
  public currentValue: number;

  constructor(scene: GameStageScene, public x: number, public y: number, public maxValue: number) {
    super(scene);
    this.currentValue = maxValue;

    this.draw();
    this.setVisible(false);
    this.setScale(0.25);
    scene.add.existing(this);
  }

  public decrease(amount: number) {
    this.setVisible(true);
    this.currentValue -= amount;
    if (this.currentValue < 0) {
      this.currentValue = 0;
    }
    this.draw();
  }

  private draw() {
    this.clear();
    // black background
    this.fillStyle(0x000000);
    this.fillRect(0, 0, this.scene.scale.width / 10, this.scene.scale.width / 50);
    // red health
    this.fillStyle(0xffffff);
    this.fillRect(2, 2, this.scene.scale.width / 10.5, this.scene.scale.width / 64);
    if (this.currentValue < 30) {
      this.fillStyle(0xff0000);
    } else {
      this.fillStyle(0x00ff00);
    }
    this.fillRect(2, 2, (this.currentValue / this.maxValue) * this.scene.scale.width / 10.5, this.scene.scale.width / 64);
  }
}

export default EnemyHealthBar;
