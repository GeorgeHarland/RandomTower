import GameStageScene from './GameStage';
import MainMenuScene from './MainMenu';
import { secondsToMMSS } from './helpers/gameHelpers';

export default class GameOverScene extends Phaser.Scene {
  private gameScene: GameStageScene | null = null;
  private mainMenuScene: MainMenuScene | null = null;

  public constructor() {
    super({ key: 'GameOverScene' });
  }

  public preload() {}

  public create() {
    this.gameScene = this.scene.get('GameStageScene') as GameStageScene;
    this.sound.stopByKey('backgroundMusic');

    this.setupKeybindings();

    const gametime = this.gameScene.data.get('gametime');

    const background = this.add.image(0, 0, 'gameOverBackground');
    background.setOrigin(0, 0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;
    this.children.sendToBack(background);

    const titleFontSize = Math.floor(this.sys.canvas.width / 20);
    const timeFontSize = Math.floor(this.sys.canvas.width / 25);
    const buttonFontSize = Math.floor(this.sys.canvas.width / 25);

    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - this.scale.height / 10,
        'Game over',
        {
          fontSize: `${titleFontSize}px`,
          color: '#FFFFFF',
          fontFamily: 'MedievalSharp',
        }
      )
      .setOrigin(0.5);
    this.add.text(
      this.scale.width / 20,
      this.scale.height / 20,
      'Survived: ' + secondsToMMSS(gametime),
      {
        fontSize: `${timeFontSize}px`,
        color: '#FFFFFF',
        fontFamily: 'MedievalSharp',
      }
    );
    const restartButton = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + this.scale.height / 15,
        'Restart',
        {
          fontSize: `${buttonFontSize}px`,
          color: '#FFFFFF',
          fontFamily: 'MedievalSharp',
        }
      )
      .setOrigin(0.5);
    restartButton.setInteractive({ useHandCursor: true });
    restartButton.on(
      'pointerup',
      () => {
        this.restartGame();
      },
      this
    );
    const menuButton = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + this.scale.height / 7,
        'Main Menu',
        {
          fontSize: `${buttonFontSize}px`,
          color: '#FFFFFF',
          fontFamily: 'MedievalSharp',
        }
      )
      .setOrigin(0.5);
    menuButton.setInteractive({ useHandCursor: true });
    menuButton.on(
      'pointerup',
      () => {
        this.startMainMenu();
      },
      this
    );
  }

  private restartGame() {
    this.gameScene && this.gameScene.scene.remove();
    this.sound.get('backgroundMusic').play();
    !this.scene.get('GameStageScene') &&
      this.scene.add('GameStageScene', GameStageScene);
    this.scene.start('GameStageScene');
  }

  private startMainMenu() {
    this.mainMenuScene && this.mainMenuScene.scene.remove();
    !this.scene.get('MainMenuScene') &&
      this.scene.add('MainMenuScene', MainMenuScene);
    this.scene.start('MainMenuScene');
  }

  private setupKeybindings() {
    const enterKey = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    enterKey?.on('down', this.restartGame, this);
    const spacebar = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    spacebar?.on('down', this.restartGame, this);
  }
}
