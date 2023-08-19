import GameStageScene from './GameStage';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  preload() {
    this.load.image('background', 'sprites/background.png');
  }

  create() {
    const background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;
    this.children.sendToBack(background);

    this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'Random Tower', { fontSize: '40px', color: '#ff0000' })
      .setOrigin(0.5);
    const button = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start', { fontSize: '28px', color: '#FFFFFF' })
      .setOrigin(0.5);
    button.setInteractive({ useHandCursor: true });
    button.on(
      'pointerup',
      () => {
        !this.scene.get('GameStageScene') &&
          this.scene.add('GameStageScene', GameStageScene);
        this.scene.start('GameStageScene');
      },
      this,
    );
  }
}
