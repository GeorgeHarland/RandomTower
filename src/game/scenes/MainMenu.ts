export default class MainMenuScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MainMenuScene' });
    }
  
    create() {
      this.add.text(400, 300, 'Random Tower', { fontSize: '40px', color: '#ff0000' }).setOrigin(0.5);
      const button = this.add.text(400, 350, 'Start', { fontSize: '28px', color: '#FFFFFF' }).setOrigin(0.5);
      button.setInteractive({ useHandCursor: true });
      button.on('pointerup', () => {
        this.scene.start('GameStageScene');
      }, this);
    }
  }