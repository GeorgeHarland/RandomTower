import * as WebFont from 'webfontloader';
import GameStageScene from './GameStage';
import HowToPlayScene from './HowToPlayScene';
import { loadSprites } from './helpers/spriteHelpers';

export default class MainMenuScene extends Phaser.Scene {
  private gameScene: GameStageScene | null = null;

  public constructor() {
    super({ key: 'MainMenuScene' });
  }

  public preload() {
    this.load.audio('backgroundMusic', 'audio/sandsOfTime.mp3');
    this.load.image('background', 'sprites/background.png');
    this.load.image('gameOverBackground', 'sprites/gameOverBackground.png');
    loadSprites(this);
    this.load.start();

    WebFont.load({
      google: {
        families: ['PressStart2P', 'VT323', 'MedievalSharp'],
      },
      active: () => {
        this.load.on('complete', () => {});
      },
    });
  }

  public create() {
    this.gameScene = this.scene.get('GameStageScene') as GameStageScene;
    const music = this.sound.add('backgroundMusic', { loop: true });
    music.play();

    this.setupKeybindings();

    const background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;
    this.children.sendToBack(background);

    const titleFontSize = Math.floor(this.sys.canvas.width / 20);
    const buttonFontSize = Math.floor(this.sys.canvas.width / 25);

    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - this.scale.height / 10,
        'Random Tower',
        {
          fontSize: `${titleFontSize}px`,
          color: '#ff0000',
          fontFamily: 'MedievalSharp',
        }
      )
      .setOrigin(0.5);
    const startButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start', {
        fontSize: `${buttonFontSize}px`,
        color: '#FFFFFF',
        fontFamily: 'MedievalSharp',
      })
      .setOrigin(0.5);
    startButton.setInteractive({ useHandCursor: true });
    startButton.on(
      'pointerup',
      () => {
        this.startGame();
      },
      this
    );
    const htpButton = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + this.scale.height / 10,
        'How to play',
        {
          fontSize: `${buttonFontSize}px`,
          color: '#FFFFFF',
          fontFamily: 'MedievalSharp',
        }
      )
      .setOrigin(0.5);
    htpButton.setInteractive({ useHandCursor: true });
    htpButton.on(
      'pointerup',
      () => {
        this.startHtp();
      },
      this
    );
  }

  private startGame() {
    this.gameScene && this.gameScene.scene.remove();
    !this.scene.get('GameStageScene') &&
      this.scene.add('GameStageScene', GameStageScene);
    this.scene.start('GameStageScene');
  }

  private startHtp() {
    !this.scene.get('HowToPlayScene') &&
      this.scene.add('HowToPlayScene', HowToPlayScene);
    this.scene.start('HowToPlayScene');
  }

  private setupKeybindings() {
    const enterKey = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    enterKey?.on('down', this.startGame, this);
    const spacebar = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    spacebar?.on('down', this.startGame, this);
  }
}
