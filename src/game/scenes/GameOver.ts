import GameStageScene from "./GameStage";

export default class GameOverScene extends Phaser.Scene {
  public constructor() {
    super({ key: 'GameOverScene' });
  }

  public preload() {
    this.load.audio('backgroundMusic', 'audio/sandsOfTime.mp3');
    this.load.image('gameOverBackground', 'sprites/gameOverBackground.png');
  }

  public create() {
    this.sound.stopByKey('backgroundMusic');

    this.setupKeybindings();

    const background = this.add.image(0, 0, 'gameOverBackground');
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
        'Game over',
        { fontSize: `${titleFontSize}px`, color: '#FFFFFF' },
      )
      .setOrigin(0.5);
    const button = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, 'Restart', {
        fontSize: `${buttonFontSize}px`,
        color: '#FFFFFF',
      })
      .setOrigin(0.5);
    button.setInteractive({ useHandCursor: true });
    button.on(
      'pointerup',
      () => {
        this.restartGame();
      },
      this,
    );
  }

  private restartGame() {
    this.sound.get('backgroundMusic').play();
    !this.scene.get('GameStageScene') &&
      this.scene.add('GameStageScene', GameStageScene);
    this.scene.start('GameStageScene');
  }

  private setupKeybindings() {
    const enterKey = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER,
    );
    enterKey?.on('down', this.restartGame, this);
    const spacebar = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
    spacebar?.on('down', this.restartGame, this);
  }
}
