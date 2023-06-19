import Phaser from "phaser";
import Item from './item';
import { KeybindType } from "../../types";

interface ShopBoxConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
  keybind: KeybindType;
}

export default class ShopBox extends Phaser.GameObjects.Sprite {
  private currentItem: Item | null;
  private keybind: KeybindType = 'K';
  private keybindText: Phaser.GameObjects.Text;
  private priceText: Phaser.GameObjects.Text;

  constructor({scene, x, y, key, keybind}: ShopBoxConfig) {
    super(scene, x, y, key)
    this.currentItem = null;
    this.keybind = keybind;
    scene.add.existing(this)
    this.keybindText = scene.add.text(x, y, keybind, { font: '16px Arial', color: '#FFFFFF' });
    this.keybindText.setOrigin(0.5, -1);
    scene.add.existing(this.keybindText)
  }

  public addItem = (item: Item): void => {
    // start with 3 Ds at start of game though
    this.currentItem = item;
    this.priceText = this.scene.add.text(this.x, this.y, item.cost.toString(), { font: '16px Arial', color: '#000000' });
    this.priceText.setOrigin(0.5, 0.5);

    // generate random-ish values and add to item (cost, rank, etc.)
  }

  public buyItem = (currentGold: number): Item | null => {
    if(this.currentItem) console.log('Key pressed', currentGold, this.currentItem.cost)
    if (this.currentItem && (currentGold >= this.currentItem.cost)) {
      console.log('Buying', currentGold, this.currentItem.cost)
      this.priceText && this.priceText.destroy()
      return this.currentItem;
      // subtract gold from player somehow
      // remove item + return Item
      // from there, call restockItem / start timer until item restocked
    }
    return null
  }

  public removeItem = (): void => {
    this.currentItem = null;
  }

  public getItem = (): Item | null => {
    return this.currentItem;
  }

  public getKeybind = (): KeybindType => {
    return this.keybind;
  }
}