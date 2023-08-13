import Phaser from "phaser";

export type ItemGradeType = 'S' | 'A' | 'B' | 'C' | 'D';

export default class Item extends Phaser.GameObjects.Sprite {

  public cost: number;
  public grade: ItemGradeType;
  public sprite: string;

  constructor(scene: Phaser.Scene, x: number, y:number, key: string, grade: ItemGradeType, cost: number, sprite: string) {
    super(scene, x, y, key)
    this.grade = grade;
    this.cost = cost;
    this.sprite = sprite;
  }
}