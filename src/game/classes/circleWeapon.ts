type Props = {
  scene: Phaser.Scene
  x: number
  y: number
  texture: string
}

export default class CircleWeapon extends Phaser.Physics.Arcade.Sprite {
  constructor({scene, x, y, texture}: Props) {
    super(scene, x, y, texture);
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.setImmovable(true);
  }

  moveCircle = (cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined) => {
    if (cursors?.up?.isDown) {
      if(this.y !== undefined) this.y = this.y - 2;
    } else if (cursors?.down?.isDown) {
      if(this.y !== undefined) this.y = this.y + 2;
    }
    if (cursors?.left?.isDown) {
      if(this.x !== undefined) this.x = this.x - 2;
    } else if (cursors?.right?.isDown) {
      if(this.x !== undefined) this.x = this.x + 2;
    }
  }
}
