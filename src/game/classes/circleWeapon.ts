type Props = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
  circleNumber: number;
};

export default class CircleWeapon extends Phaser.Physics.Arcade.Sprite {
  private circleNumber: number = 0;

  constructor({ scene, x, y, texture, circleNumber }: Props) {
    super(scene, x, y, texture);
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.setImmovable(true);
    this.circleNumber = circleNumber;
  }

  moveCircle = (
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined,
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

  moveUp() {
    if (this.y !== undefined) this.y = this.y - 2;
  }
  moveDown() {
    if (this.y !== undefined) this.y = this.y + 2;
  }
  moveLeft() {
    if (this.y !== undefined) this.x = this.x - 2;
  }
  moveRight() {
    if (this.y !== undefined) this.x = this.x + 2;
  }
}
