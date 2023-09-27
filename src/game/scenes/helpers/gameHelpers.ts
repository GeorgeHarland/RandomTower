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
