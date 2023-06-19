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
  private price;

  constructor({scene, x, y, key, keybind}: ShopBoxConfig) {
    super(scene, x, y, key)
    this.currentItem = null;
    this.keybind = keybind;
    this.price = 0;
    scene.add.existing(this)
  }

  public addItem = (item: Item): void => {
    // start with 3 Ds at start of game though
    this.currentItem = item;
    
    // random gold * somemthing for grade
    // generate random-ish values and add to item (cost, rank, etc.)
  }

  public buyItem = (currentGold: number): Item | null => {
    if (this.currentItem && currentGold < this.price) {
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