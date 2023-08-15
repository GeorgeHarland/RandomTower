import Phaser from 'phaser';
import GameStageScene from '../game/scenes/GameStage';
import GameOverScene from '../game/scenes/GameOver';
import MainMenuScene from '../game/scenes/MainMenu';
import { useEffect, useRef } from 'preact/hooks';

const PhaserGame = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  let game: Phaser.Game | null = null;

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [MainMenuScene, GameStageScene, GameOverScene],
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

    // window.addEventListener('resize', resize);
    // resize();

    return () => {
      game && game.destroy(true);
      // window.removeEventListener('resize', resize);
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
