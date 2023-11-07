import { MOBILE_BREAKPOINT } from '../../constants';
import GameStageScene from './GameStage';
import HowToPlayScene from './HowToPlayScene';

export default class MainMenuScene extends Phaser.Scene {
  private gameScene: GameStageScene | null = null;

  public constructor() {
    super({ key: 'MainMenuScene' });
  }

  public preload() {}

  public create() {
    this.gameScene = this.scene.get('GameStageScene') as GameStageScene;
    this.setupKeybindings();

    const music = this.sound.add('mainMenuMusic', { loop: true });
    music.play();

    const background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;
    this.children.sendToBack(background);

    const titleFontSize = this.scale.width > MOBILE_BREAKPOINT ? this.sys.canvas.width / 20 : this.sys.canvas.width / 12.5;
    const buttonFontSize = this.scale.width > MOBILE_BREAKPOINT ? this.sys.canvas.width / 25 : this.sys.canvas.width / 17.5;
    const heightMod = this.scale.width > MOBILE_BREAKPOINT ? this.scale.height / 10 : this.scale.height / 7.5;
    
    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - heightMod,
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
        this.cameras.main.centerY + heightMod,
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
    this.sound.stopAll();
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
