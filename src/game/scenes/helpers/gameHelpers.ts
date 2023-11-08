import { Duration } from 'luxon';
import { CoordinateType } from '../../types';

export const getRandomEdgeOfScreen = (scene: Phaser.Scene): CoordinateType => {
  let x: number;
  let y: number;
  if (Math.random() < 0.5) {
    x = Math.random() < 0.5 ? -50 : scene.scale.width + 50;
    y = Math.random() * scene.scale.height;
  } else {
    x = Math.random() * scene.scale.width;
    y = Math.random() < 0.5 ? -50 : scene.scale.height + 50;
  }
  return { x, y };
};

export const secondsToMMSS = (seconds: number): string => {
  return Duration.fromObject({ seconds }).toFormat('mm:ss');
};

export const goFullScreen = () => {
  let element: any = document.getElementById('game-container');

  if (element?.requestFullscreen) {
    element.requestFullscreen().catch((err: any) => {
      console.error(
        `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
      );
    });
  } else if (element?.mozRequestFullScreen) {
    element.mozRequestFullScreen(); // firefox
  } else if (element?.webkitRequestFullscreen) {
    element.webkitRequestFullscreen(); // chrome, Safari and Opera
  } else if (element?.msRequestFullscreen) {
    element.msRequestFullscreen(); // ie/edge
  } else {
    console.error('Fullscreen mode not avaliable');
  }
};
