import Phaser from "phaser";

export default class Item extends Phaser.GameObjects.Sprite {

  private cost: number = 10;
  private rank: 'S' | 'A' | 'B' | 'C' = 'C';
  // private effect: PowerUp;

  constructor(scene: Phaser.Scene, x: number, y:number, key: string) {
    super(scene, x, y, key)
  }
}
