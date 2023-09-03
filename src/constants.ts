import { ItemGradeType, PowerupType } from './game/types';

// Dev settings

export const DEV_TEXT_AT_TOP = false;

// Enemies

export const ENEMY_BASE_DAMAGE = 5;
export const ENEMY_BASE_RATE = 0.5;
export const ENEMY_BASE_SPEED = 80;
export const ENEMY_BASE_GOLD_VALUE = 1;

// Player / Tower

export const TOWER_BASE_HITPOINTs = 100;

// Powerups

export const PowerupRecord: Record<PowerupType, ItemGradeType> = {
  arrowRate: 'C',
  circleSpeed: 'D',
  darkBlast: 'B',
  timeSlow: 'S',
  tornado: 'A',
};

export const ARROW_BASE_SPEED = 200;
export const ARROW_BASE_RATE = 0.2;
export const ARROW_RATE_INCREASE = 0.1;

export const CIRCLE_SPEED_INCREASE = 0.35;

export const DARKBLAST_BASE_ANGLE_CHANGE = 45;
export const DARKBLAST_BASE_COOLDOWN = 1000;

export const TIMESLOW_BASE_COOLDOWN = 30000;
export const TIMESLOW_LEVELUP_COOLDOWN_MULTIPLIER = 0.75;

export const TORNADO_BASE_SHAKE_AMOUNT = 4;
