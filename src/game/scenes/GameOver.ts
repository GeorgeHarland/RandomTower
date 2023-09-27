import GameStageScene from './GameStage';
import { secondsToMMSS } from './helpers/gameHelpers';

export default class GameOverScene extends Phaser.Scene {
  private gameScene: GameStageScene | null = null;

  public constructor() {
    super({ key: 'GameOverScene' });
  }
  
  public preload() {
    this.load.audio('backgroundMusic', 'audio/sandsOfTime.mp3');
    this.load.image('gameOverBackground', 'sprites/gameOverBackground.png');
  }
  
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
        { fontSize: `${titleFontSize}px`, color: '#FFFFFF' }
      )
      .setOrigin(0.5);
    this.add
      .text(
        this.scale.width / 20,
        this.scale.height / 20,
        'Survived: ' + secondsToMMSS(gametime),
        { fontSize: `${timeFontSize}px`, color: '#FFFFFF' }
      )
    const button = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, 'Restart', {
        fontSize: `${buttonFontSize}px`,
        color: '#FFFF',
      })
      .setOrigin(0.5);
    button.setInteractive({ useHandCursor: true });
    button.on(
      'pointerup',
      () => {
        this.restartGame();
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
