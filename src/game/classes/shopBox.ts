import Phaser from 'phaser';
import Item from './item';
import { KeybindType, PowerupType } from '../types';
import Player from './playerTower';
import { getArrayRandomElement } from '../../utils';
import { PowerupRecord, gradeCost } from '../../constants';
import GameStageScene from '../scenes/GameStage';

interface ShopBoxConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
  keybind: KeybindType;
}

export default class ShopBox extends Phaser.GameObjects.Sprite {
  private gameScene: GameStageScene;
  private currentItem: Item | null = null;
  private itemImage: Phaser.Physics.Arcade.Sprite | null = null;
  private keybind: KeybindType;
  private keybindText: Phaser.GameObjects.Text;
  private priceText: Phaser.GameObjects.Text | null = null;

  public constructor({ scene, x, y, key, keybind }: ShopBoxConfig) {
    super(scene, x, y, key);

    this.gameScene = scene as GameStageScene;
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
      this.gameScene.additionalPrice++;
      return boughtItem;
    }
    return null;
  };

  public removeItem = (): void => {
    this.currentItem = null;
    this.priceText && this.priceText.destroy();
    this.itemImage && this.itemImage.destroy();
  };

  public getItem = (): Item | null => {
    return this.currentItem;
  };

  public rerollItem = (): void => {
    this.removeItem();
    this.generateRandomItem();
  };

  public generateRandomItem(): Item {
    let randomPowerup: PowerupType;
    do {
      randomPowerup = getArrayRandomElement(
        Object.keys(PowerupRecord),
      ) as PowerupType;
    } while (
      this.gameScene.generatedItems.includes(randomPowerup)
    );

    const itemGrade = PowerupRecord[randomPowerup];
    const modifier = 0.7 + Math.random() * 0.6; // 70-130%
    const itemCost =
      Math.round(gradeCost[itemGrade] * modifier) +
      this.gameScene.additionalPrice;

    return new Item(
      this.scene,
      0,
      0,
      'item0',
      randomPowerup,
      itemGrade,
      itemCost,
    );
  }

  public getKeybind = (): KeybindType => {
    return this.keybind;
  };
}
