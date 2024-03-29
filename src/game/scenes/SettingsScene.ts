import MainMenuScene from './MainMenu';

export default class SettingsScene extends Phaser.Scene {
  private menuScene: MainMenuScene | null = null;

  public constructor() {
    super({ key: 'SettingsScene' });
  }

  public preload() {}

  public create() {
    const background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;
    this.children.sendToBack(background);

    const titleFontSize = Math.floor(this.sys.canvas.width / 20);
    const buttonFontSize = Math.floor(this.sys.canvas.width / 25);
    const textFontSize = Math.floor(this.sys.canvas.width / 35);

    // title text
    this.add
      .text(
        this.cameras.main.centerX - this.scale.width / 3,
        this.cameras.main.centerY - this.scale.height / 2.5,
        'Settings',
        {
          fontSize: `${titleFontSize}px`,
          color: '#FFFFFF',
          fontFamily: 'MedievalSharp',
        }
      )
      .setOrigin(0.5);

    // settings
    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - this.scale.height / 16,
        'Fullscreen',
        {
          fontSize: `${textFontSize}px`,
          color: '#FFFFFF',
          fontFamily: 'MedievalSharp',
        }
      )
      .setOrigin(0.5);

    const backButton = this.add
      .text(
        this.cameras.main.centerX - this.scale.width / 2.5,
        this.cameras.main.centerY + this.scale.height / 2.5,
        'Back',
        {
          fontSize: `${buttonFontSize}px`,
          color: '#FFFFFF',
          fontFamily: 'MedievalSharp',
        }
      )
      .setOrigin(0.5);
    backButton.setInteractive({ useHandCursor: true });
    backButton.on(
      'pointerup',
      () => {
        this.backToMenu();
      },
      this
    );
  }

  private backToMenu() {
    this.menuScene && this.menuScene.scene.remove();
    !this.scene.get('MainMenuScene') &&
      this.scene.add('MainMenuScene', MainMenuScene);
    this.scene.start('MainMenuScene');
  }
}
