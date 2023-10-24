import Phaser from 'phaser';
import Item from './Item';
import { KeybindType, PowerupType } from '../types';
import Player from './PlayerTower';
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
  private powerupText: Phaser.GameObjects.Text | null = null;
  private dynamicFontSize: string;
  private titleFontSize: string;

  public constructor({ scene, x, y, key, keybind }: ShopBoxConfig) {
    super(scene, x, y, key);

    this.gameScene = scene as GameStageScene;
    this.keybind = keybind;
    this.dynamicFontSize = `${(
      scene.scale.width / 50
    ).toString()}px MedievalSharp`;
    this.titleFontSize = `${(
      scene.scale.width / 75
    ).toString()}px MedievalSharp`;

    scene.add.existing(this);
    this.keybindText = scene.add.text(
      x - scene.scale.width / 25,
      y + scene.scale.height / 35,
      keybind,
      {
        font: this.dynamicFontSize,
        color: '#FFFFFF',
      }
    );
    scene.add.existing(this.keybindText);
  }

  public addItem = (item: Item | null = null): void => {
    item = item || this.generateRandomItem();
    this.currentItem = item;
    this.priceText?.destroy();
    this.powerupText?.destroy();
    this.itemImage?.destroy();
    this.priceText = this.scene.add.text(
      this.x + this.scene.scale.width / 25,
      this.y + this.scene.scale.height / 35,
      item.cost.toString(),
      { font: this.dynamicFontSize, color: '#000000' }
    );
    this.priceText.setOrigin(1, 0);
    this.powerupText = this.scene.add.text(
      this.x - this.scene.scale.width / 25,
      this.y - this.scene.scale.height / 18,
      item.powerup,
      { font: this.titleFontSize, color: '#FFFFFF' }
    );
    this.itemImage = this.scene.physics.add.sprite(
      this.x,
      this.y,
      item.powerup
    );
    this.itemImage.setScale(this.scene.scale.width / 24 / this.itemImage.width);
  };

  public buyItem = (player: Player): Item | null => {
    if (this.currentItem && player.currentGold >= this.currentItem.cost) {
      const boughtItem = this.currentItem;
      this.currentItem = null;
      this.powerupText && this.powerupText.destroy();
      this.priceText && this.priceText.destroy();
      this.itemImage && this.itemImage.destroy();
      this.addItem();
      player.currentGold -= boughtItem.cost;
      this.gameScene.increasePrices();
      return boughtItem;
    }
    return null;
  };

  public removeItem = (): void => {
    this.currentItem = null;
    this.powerupText && this.powerupText.destroy();
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
        Object.keys(PowerupRecord)
      ) as PowerupType;
    } while (this.gameScene.generatedItems.includes(randomPowerup));

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
      itemCost
    );
  }

  public getKeybind = (): KeybindType => {
    return this.keybind;
  };
}
