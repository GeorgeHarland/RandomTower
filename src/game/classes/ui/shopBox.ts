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

  constructor({scene, x, y, key, keybind}: ShopBoxConfig) {
    super(scene, x, y, key)
    this.currentItem = null;
    this.keybind = keybind;
    scene.add.existing(this)
  }

  public addItem = (item: Item): void => {
    this.currentItem = item;
  }

  public buyItem = (currentGold: number): void => {
    // if player currentGold > price
    // remove item + return Item
    // from there, call restockItem
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