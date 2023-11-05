import GameStageScene from '../scenes/GameStage';

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
  private pointerDown: boolean = false;
  private targetPosition: Phaser.Math.Vector2 | null = null;

  public constructor({ scene, x, y, texture, circleNumber }: Props) {
    super(scene, x, y, texture);
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.gameScene = scene as GameStageScene;
    this.setImmovable(true);
    this.circleNumber = circleNumber;

    this.setInteractive();
    this.scene.input.on('pointerdown', this.onPointerDown, this);
    this.scene.input.on('pointerup', this.onPointerUp, this);
    this.scene.input.on('pointermove', this.onPointerMove, this);
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
    if (this.targetPosition) {
      const direction = this.targetPosition
        .clone()
        .subtract(this.getCenter())
        .normalize();
      this.x += direction.x * this.circleSpeed * this.gameScene.gameSpeedScale;
      this.y += direction.y * this.circleSpeed * this.gameScene.gameSpeedScale;
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
  private onPointerDown(pointer: Phaser.Input.Pointer) {
    this.pointerDown = true;
    this.targetPosition = new Phaser.Math.Vector2(pointer.x, pointer.y);
  }

  private onPointerUp() {
    this.pointerDown = false;
    this.targetPosition = null;
  }

  private onPointerMove(pointer: Phaser.Input.Pointer) {
    if (this.pointerDown) {
      this.targetPosition = new Phaser.Math.Vector2(pointer.x, pointer.y);
    }
  }
}
