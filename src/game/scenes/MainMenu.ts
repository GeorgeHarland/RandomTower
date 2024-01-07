import { MOBILE_BREAKPOINT } from '../../constants';

export default class MainMenuScene extends Phaser.Scene {
  // private gameScene: GameStageScene | null = null;

  public constructor() {
    super({ key: 'MainMenuScene' });
  }

  public preload() {}

  public create() {
    this.setupKeybindings();

    const music = this.sound.add('mainMenuMusic', { loop: true });
    music.setVolume(0.4);
    music.play();

    const background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;
    this.children.sendToBack(background);

    const titleFontSize =
      this.scale.width > MOBILE_BREAKPOINT
        ? this.sys.canvas.width / 20
        : this.sys.canvas.width / 12.5;
    const buttonFontSize =
      this.scale.width > MOBILE_BREAKPOINT
        ? this.sys.canvas.width / 25
        : this.sys.canvas.width / 17.5;
    const heightMod =
      this.scale.width > MOBILE_BREAKPOINT
        ? this.scale.height / 12
        : this.scale.height / 8.5;

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
        this.startScene('GameStageScene');
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
        this.startScene('HowToPlayScene');
      },
      this
    );
    const settingsButton = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + heightMod*2,
        'Settings',
        {
          fontSize: `${buttonFontSize}px`,
          color: '#FFFFFF',
          fontFamily: 'MedievalSharp',
        }
      )
      .setOrigin(0.5);
      settingsButton.setInteractive({ useHandCursor: true });
      settingsButton.on(
      'pointerup',
      () => {
        this.startScene('SettingsScene');
      },
      this
    );
  }

  private startScene(sceneKey: string) {
    if(sceneKey === 'GameStageScene') {
      this.sound.stopAll();
    } 
    !this.scene.get(sceneKey) &&
      this.scene.add(sceneKey, sceneKey as Phaser.Types.Scenes.SceneType);
    this.scene.start(sceneKey);
  }

  private setupKeybindings() {
    const enterKey = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    enterKey?.on('down', () => this.startScene('GameStageScene'), this);
    const spacebar = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    spacebar?.on('down', () => this.startScene('GameStageScene'), this);
  }
}
