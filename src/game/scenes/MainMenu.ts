export default class MainMenuScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MainMenuScene' });
    }
  
    create() {
      this.add.text(400, 300, 'Main Menu', { fontSize: '32px', color: '#ff0000' }).setOrigin(0.5);
    }
  }