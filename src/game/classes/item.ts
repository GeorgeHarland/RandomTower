import Phaser from 'phaser';
import { ItemGradeType, PowerupType } from '../types';

export default class Item extends Phaser.GameObjects.Sprite {
  public powerup: PowerupType;
  public cost: number;
  public grade: ItemGradeType;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    key: string,
    powerup: PowerupType,
    grade: ItemGradeType,
    cost: number,
  ) {
    super(scene, x, y, key);
    this.grade = grade;
    this.cost = cost;
    this.powerup = powerup;
  }
}
