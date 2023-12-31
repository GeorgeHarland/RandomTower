import Phaser from 'phaser';
import Item from './Item';
import { KeybindType, PowerupType } from '../types';
import { getArrayRandomElement } from '../../utils';
import { MOBILE_BREAKPOINT, PowerupRecord, gradeCost } from '../../constants';
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
    this.dynamicFontSize = `${(scene.scale.width > MOBILE_BREAKPOINT
      ? scene.scale.width / 50
      : scene.scale.width / 35
    ).toString()}px MedievalSharp`;
    this.titleFontSize = `${(scene.scale.width > MOBILE_BREAKPOINT
      ? scene.scale.width / 75
      : scene.scale.width / 45
    ).toString()}px MedievalSharp`;

    scene.add.existing(this);

    const keybindTextX = x - scene.scale.width / 25;
    const keybindTextY = y + scene.scale.height / 35;
    const mobileKeybindTextX = x - scene.scale.width / 20;
    const mobileKeybindTextY = y + scene.scale.height / 38;

    this.keybindText = scene.add.text(
      this.scene.scale.width > MOBILE_BREAKPOINT
        ? keybindTextX
        : mobileKeybindTextX,
      this.scene.scale.width > MOBILE_BREAKPOINT
        ? keybindTextY
        : mobileKeybindTextY,
      keybind,
      {
        font: this.dynamicFontSize,
        color: '#FFFFFF',
      }
    );
    scene.add.existing(this.keybindText);

    this.setInteractive({ useHandCursor: true });
    this.on('pointerdown', () => {
      this.clickBuyItem();
    });
  }

  public addItem = (item: Item | null = null): void => {
    item = item || this.generateRandomItem();
    this.currentItem = item;
    this.priceText?.destroy();
    this.powerupText?.destroy();
    this.itemImage?.destroy();

    const priceTextX = this.x + this.gameScene.scale.width / 25;
    const priceTextY = this.y + this.gameScene.scale.height / 35;
    const mobilePriceTextX = this.x + this.gameScene.scale.width / 20;
    const mobilePriceTextY = this.y + this.gameScene.scale.height / 38;
    this.priceText = this.gameScene.add.text(
      this.scene.scale.width > MOBILE_BREAKPOINT
        ? priceTextX
        : mobilePriceTextX,
      this.scene.scale.width > MOBILE_BREAKPOINT
        ? priceTextY
        : mobilePriceTextY,
      item.cost.toString(),
      { font: this.dynamicFontSize, color: '#000000' }
    );
    this.priceText.setOrigin(1, 0);

    const powerupTextX = this.x - this.gameScene.scale.width / 25;
    const powerupTextY = this.y - this.gameScene.scale.height / 18;
    const mobilePowerupTextX = this.x - this.gameScene.scale.width / 20;
    const mobilePowerupTextY = this.y - this.gameScene.scale.height / 14;
    this.powerupText = this.gameScene.add.text(
      this.scene.scale.width > MOBILE_BREAKPOINT
        ? powerupTextX
        : mobilePowerupTextX,
      this.scene.scale.width > MOBILE_BREAKPOINT
        ? powerupTextY
        : mobilePowerupTextY,
      item.powerup,
      { font: this.titleFontSize, color: '#FFFFFF' }
    );
    this.itemImage = this.gameScene.physics.add.sprite(
      this.x,
      this.y,
      item.powerup
    );
    this.itemImage.setScale(
      this.gameScene.scale.width / 24 / this.itemImage.width
    );
  };

  public buyItem = (): Item | null => {
    let result: Item | null = null;
    if (
      this.currentItem &&
      this.gameScene.playerTower.currentGold >= this.currentItem.cost
    ) {
      const boughtItem = this.currentItem;
      this.currentItem = null;
      this.powerupText?.destroy();
      this.priceText?.destroy();
      this.itemImage?.destroy();
      this.addItem();
      this.gameScene.playerTower.currentGold -= boughtItem.cost;
      this.gameScene.increasePrices();
      result = boughtItem;
    }
    return result;
  };

  public clickBuyItem = () => {
    const itemBought = this.buyItem();

    if (itemBought) {
      this.gameScene.powerupManager.addPowerup(itemBought);
      this.gameScene.generatedItems = [];
      this.gameScene.shopBoxes?.children.entries.forEach((shopbox) => {
        (shopbox as ShopBox).rerollItem();
      });
    }
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
      this.gameScene,
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
