import GameStageScene from '../scenes/GameStage';
import { drawHealthBar } from '../scenes/helpers/textureHelpers';

class EnemyHealthBar extends Phaser.GameObjects.Graphics {
  public currentValue: number;
  public poisoned: boolean;

  constructor(
    scene: GameStageScene,
    public x: number,
    public y: number,
    public maxValue: number
  ) {
    super(scene);
    this.currentValue = maxValue;
    this.poisoned = false;

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
    drawHealthBar(this);
  }
}

export default EnemyHealthBar;
