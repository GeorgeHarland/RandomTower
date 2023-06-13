import Phaser from "phaser";
import Item from './item';

type KeybindType = 'Q' | 'W' | 'E'

interface ShopBoxConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
  keybind: KeybindType;
}

export default class ShopBox extends Phaser.GameObjects.Sprite {
  private currentItem: Item | null;

  constructor({scene, x, y, key, keybind}: ShopBoxConfig) {
    super(scene, x, y, key)
    // other args?
    this.currentItem = null;
    scene.add.existing(this)
  }

  public addItem = (item: Item): void => {
    this.currentItem = item;
  }

  public removeItem = (): void => {
    this.currentItem = null;
  }

  public getItem = (): Item | null => {
    return this.currentItem;
  }
}