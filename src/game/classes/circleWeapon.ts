import GameStageScene from "../scenes/GameStage";

type Props = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
  circleNumber: number;
};

export default class CircleWeapon extends Phaser.Physics.Arcade.Sprite {
  private circleNumber: number = 0;
  public circleSpeed: number = 1;
  private gameScene: GameStageScene;

  public constructor({ scene, x, y, texture, circleNumber }: Props) {
    super(scene, x, y, texture);
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.gameScene = scene as GameStageScene;
    this.setImmovable(true);
    this.circleNumber = circleNumber;
  }

  public moveCircle = (
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined
  ) => {
    if (cursors?.up?.isDown) {
      this.circleNumber === 0
        ? this.moveUp()
        : setTimeout(() => this.moveUp(), this.circleNumber * 170);
    } else if (cursors?.down?.isDown) {
      this.circleNumber === 0
        ? this.moveDown()
        : setTimeout(() => this.moveDown(), this.circleNumber * 170);
    }
    if (cursors?.left?.isDown) {
      this.circleNumber === 0
        ? this.moveLeft()
        : setTimeout(() => this.moveLeft(), this.circleNumber * 170);
    } else if (cursors?.right?.isDown) {
      this.circleNumber === 0
        ? this.moveRight()
        : setTimeout(() => this.moveRight(), this.circleNumber * 170);
    }
  };

  private moveUp() {
    this.y -= this.circleSpeed * this.gameScene.gameSpeedScale;
  }
  private moveDown() {
    this.y += this.circleSpeed * this.gameScene.gameSpeedScale;
  }
  private moveLeft() {
    this.x -= this.circleSpeed * this.gameScene.gameSpeedScale;
  }
  private moveRight() {
    this.x += this.circleSpeed * this.gameScene.gameSpeedScale;
  }
}
