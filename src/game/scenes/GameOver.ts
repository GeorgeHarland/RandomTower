import { PowerupRecord } from '../../constants';
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
    this.sound.stopAll();
    const music = this.sound.add('gameOverMusic', { loop: true });
    music.setVolume(0.4);
    music.play();

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

    this.displayPowerupCount();

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
    this.sound.stopAll();
    this.gameScene && this.gameScene.scene.remove();
    !this.scene.get('GameStageScene') &&
      this.scene.add('GameStageScene', GameStageScene);
    this.scene.start('GameStageScene');
  }

  private startMainMenu() {
    this.sound.stopAll();
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

  private displayPowerupCount() {
    const powerupCountFontSize = Math.floor(this.sys.canvas.width / 40);
    let x = this.scale.width / 6.5;
    const initialY = this.scale.height - this.scale.height / 6;
    let y = initialY;
    let rowCount = 0;

    const powerupCountDict = this.createPowerupCount();

    for (const key in PowerupRecord) {
      if (PowerupRecord.hasOwnProperty(key)) {
        const icon = this.add.image(x, y, key);
        icon.setScale(this.scale.width / 800);
        this.add.text(
          x + this.scale.width / 20,
          y - (this.scale.width / 100),
          powerupCountDict[key]?.toString(),
          {
            fontSize: `${powerupCountFontSize}px`,
            color: '#FFFFFF',
            fontFamily: 'MedievalSharp',
          }
        );

        rowCount++;
        if (rowCount >= 2) {
          x += this.scale.width / 6;
          y = initialY;
          rowCount = 0;
        } else {
          y += this.scale.height / 12;
        }
      }
    }
  }

  private createPowerupCount() {
    const powerupsBought = this.gameScene?.data.get(
      'powerupsBought'
    ) as string[];

    for (const key in PowerupRecord) {
      powerupsBought.push(key);
    }

    const powerupCount: { [PowerupType: string]: number } = {};

    powerupsBought.forEach((powerup) => {
      if (powerup in powerupCount) {
        powerupCount[powerup]++;
      } else {
        powerupCount[powerup] = 0;
      }
    });
    return powerupCount;
  }
}
