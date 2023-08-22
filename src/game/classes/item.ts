import Phaser from 'phaser';

export type ItemGradeType = 'S' | 'A' | 'B' | 'C' | 'D';

export default class Item extends Phaser.GameObjects.Sprite {
  public powerup: string;
  public cost: number;
  public grade: ItemGradeType;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    key: string,
    powerup: string,
    grade: ItemGradeType,
    cost: number,
  ) {
    super(scene, x, y, key);
    this.grade = grade;
    this.cost = cost;
    this.powerup = powerup;
  }
}
