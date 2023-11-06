import Phaser from 'phaser';
import GameStageScene from '../game/scenes/GameStage';
import GameOverScene from '../game/scenes/GameOver';
import HowToPlayScene from '../game/scenes/HowToPlayScene';
import MainMenuScene from '../game/scenes/MainMenu';
import { useEffect, useRef } from 'preact/hooks';
import InitialLoadingScene from '../game/scenes/InitialLoadingScene';

const PhaserGame = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  let game: Phaser.Game | null = null;

  const resize = () => {
    if (game) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scale = Math.min(width / 800, height / 600);

      game.scale.setGameSize(800 * scale, 600 * scale);
      // game.scale.updateScaleFactor();
    }
  };

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: window.innerWidth,
      height: window.innerHeight,
      scene: [
        InitialLoadingScene,
        MainMenuScene,
        HowToPlayScene,
        GameStageScene,
        GameOverScene,
      ],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    game = new Phaser.Game(config);

    window.addEventListener('resize', resize);
    resize();

    return () => {
      game && game.destroy(true);
      window.removeEventListener('resize', resize);
      // window.removeEventListener('click', goFullScreen);
      // window.removeEventListener('touchstart', goFullScreen);
    };
  }, []);

  useEffect(() => {
    if (game && gameContainerRef.current) {
      gameContainerRef.current.appendChild(game.canvas);
    }
  }, [game]);

  return <div ref={gameContainerRef} />;
};

export default PhaserGame;
