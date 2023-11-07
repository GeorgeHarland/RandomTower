import WebFont from 'webfontloader';
import MainMenuScene from './MainMenu';
import { loadSprites } from './helpers/spriteHelpers';
import { MOBILE_BREAKPOINT } from '../../constants';

export default class InitialLoadingScene extends Phaser.Scene {
  private menuScene: MainMenuScene | null = null;

  public constructor() {
    super({ key: 'InitialLoadingScene' });
  }

  public preload() {
    WebFont.load({
      google: {
        families: ['PressStart2P', 'VT323', 'MedievalSharp'],
      },
      active: () => {
        this.load.on('complete', () => {});
      },
    });

    // const background = this.add.image(0, 0, 'background');
    // background.setOrigin(0, 0);
    // background.displayWidth = this.sys.canvas.width;
    // background.displayHeight = this.sys.canvas.height;
    // this.children.sendToBack(background);

    const titleFontSize = this.scale.width > MOBILE_BREAKPOINT ? this.sys.canvas.width / 20 : this.sys.canvas.width / 15;

    this.add
      .text(
        this.cameras.main.centerX - this.scale.width / 3,
        this.cameras.main.centerY + this.scale.height / 2.5,
        'Loading...',
        {
          fontSize: `${titleFontSize}px`,
          color: '#FFFFFF',
          fontFamily: 'MedievalSharp',
        }
      )
      .setOrigin(0.5);

    this.load.audio(
      'mainMenuMusic',
      'audio/walk-alone-dark-cinematic-music-horror-music-153445.mp3'
    );
    this.load.audio(
      'gameMusic1',
      'audio/inspiring-cinematic-ambient-116199.mp3'
    );
    this.load.audio('gameOverMusic', 'audio/lonestar-136900.mp3');

    this.load.image('background', 'sprites/background.png');
    this.load.image('gameOverBackground', 'sprites/gameOverBackground.png');
    loadSprites(this);
    this.load.start();
  }

  public create() {
    this.toMenu();
  }

  private toMenu() {
    this.menuScene && this.menuScene.scene.remove();
    !this.scene.get('MainMenuScene') &&
      this.scene.add('MainMenuScene', MainMenuScene);
    this.scene.start('MainMenuScene');
  }
}
