import Phaser from 'phaser';
import Item from './item';
import { ItemGradeType, KeybindType, PowerupRecord, PowerupType } from '../types';
import Player from './playerTower';
import { getArrayRandomElement } from '../../utils';

interface ShopBoxConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
  keybind: KeybindType;
}

export default class ShopBox extends Phaser.GameObjects.Sprite {
  private currentItem: Item | null = null;
  private itemImage: Phaser.Physics.Arcade.Sprite | null = null;
  private keybind: KeybindType = 'Z';
  private keybindText: Phaser.GameObjects.Text;
  private priceText: Phaser.GameObjects.Text | null = null;

  constructor({ scene, x, y, key, keybind }: ShopBoxConfig) {
    super(scene, x, y, key);
    this.keybind = keybind;
    scene.add.existing(this);
    this.keybindText = scene.add.text(x - 35, y + 20, keybind, {
      font: '16px Arial',
      color: '#FFFFFF',
    });
    scene.add.existing(this.keybindText);
  }

  public addItem = (item: Item | null = null): void => {
    item = item || this.generateRandomItem();
    this.currentItem = item;
    this.priceText?.destroy();
    this.itemImage?.destroy();
    this.priceText = this.scene.add.text(
      this.x - 35,
      this.y - 35,
      item.cost.toString(),
      { font: '16px Arial', color: '#000000' },
    );
    this.itemImage = this.scene.physics.add.sprite(
      this.x,
      this.y,
      item.powerup,
    );
  };

  public buyItem = (player: Player): Item | null => {
    if (this.currentItem && player.currentGold >= this.currentItem.cost) {
      const boughtItem = this.currentItem;
      this.currentItem = null;
      this.priceText && this.priceText.destroy();
      this.itemImage && this.itemImage.destroy();
      this.addItem();
      player.currentGold -= boughtItem.cost;
      return boughtItem;
    }
    return null;
  };

  public removeItem = (): void => {
    this.currentItem = null;
  };

  public getItem = (): Item | null => {
    return this.currentItem;
  };

  generateRandomItem(): Item {
    const gradeCost: Record<ItemGradeType, number> = {
      D: 10,
      C: 15,
      B: 20,
      A: 25,
      S: 30,
    };

    // const randomNum = Math.random() * 100;
    // let grade: ItemGradeType = 'D';
    // if (randomNum > 40 && randomNum <= 70) grade = 'C';
    // if (randomNum > 70 && randomNum <= 90) grade = 'B';
    // if (randomNum > 90 && randomNum <= 98) grade = 'A';
    // if (randomNum > 98 && randomNum <= 100) grade = 'S';

    const randomPowerup = getArrayRandomElement(Object.keys(PowerupRecord));
    const itemGrade = PowerupRecord[randomPowerup as PowerupType]
    const modifier = 0.7 + (Math.random() * 0.6); // 70-130%
    const itemCost = Math.round(gradeCost[itemGrade] * modifier);

    return new Item(this.scene, 0, 0, 'item0', randomPowerup, itemGrade, itemCost);
  }

  public getKeybind = (): KeybindType => {
    return this.keybind;
  };
}
