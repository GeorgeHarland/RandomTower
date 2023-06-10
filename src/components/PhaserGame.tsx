import Phaser from 'phaser';
import GameStageScene from '../scenes/GameStage';
import GameOverScene from '../scenes/GameOver';
import MainMenuScene from '../scenes/MainMenu';
import { useEffect, useRef } from 'preact/hooks';

const PhaserGame = () => {
    const gameContainerRef = useRef<HTMLDivElement>(null)
    let game: Phaser.Game | null = null;

    useEffect(() => {
        const config = {
          type: Phaser.AUTO,
          width: 800,
          height: 600,
          scene: [GameStageScene, GameOverScene, MainMenuScene],
        };
    
        game = new Phaser.Game(config);
    
        return () => {
          game && game.destroy(true);
        };
      }, []);
    
      useEffect(() => {
        if (game && gameContainerRef.current) {
          gameContainerRef.current.appendChild(game.canvas);
        }
      }, [game]);

    return <div ref={gameContainerRef} />;
}

export default PhaserGame;