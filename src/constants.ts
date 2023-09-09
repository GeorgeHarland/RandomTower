import { ItemGradeType, PowerupType } from './game/types';

// Dev settings

export const DEV_TEXT_AT_TOP = false;

// Enemies

export const ENEMY_BASE_DAMAGE = 5;
export const ENEMY_BASE_RATE = 0.4;
export const ENEMY_RATE_MULTIPLER = 1.015;
export const ENEMY_BASE_SPEED = 80;
export const ENEMY_BASE_GOLD_VALUE = 1;

export const JUGGERNAUT_BASE_DAMAGE = 30;
export const JUGGERNAUT_BASE_RATE = 0.03;
export const JUGGERNAUT_RATE_MULTIPLIER = 1.03;
export const JUGGERNAUT_BASE_GOLD_VALUE = 15;
export const JUGGERNAUT_BASE_HITPOINTS = 50;
export const JUGGERNAUT_SPEED_MULTIPLIER = 0.25;

// Player / Tower

export const TOWER_BASE_HITPOINTS = 100;

// Powerups

export const PowerupRecord: Record<PowerupType, ItemGradeType> = {
  arrowRate: 'C',
  circleSpeed: 'D',
  darkBlast: 'B',
  fireBlast: 'B',
  regen: 'D',
  timeSlow: 'S',
  tornado: 'C',
};

export const ARROW_BASE_SPEED = 200;
export const ARROW_BASE_RATE = 0.2;
export const ARROW_RATE_INCREASE = 0.025;

export const CIRCLE_SPEED_INCREASE = 0.35;

export const DARKBLAST_BASE_ANGLE_CHANGE = 45;
export const DARKBLAST_BASE_COOLDOWN = 1000;
export const DARKBLAST_LEVELUP_ANGLE_MULTIPLIER = 0.9;
export const DARKBLAST_LEVELUP_COOLDOWN_MULTIPLIER = 0.8;

export const FIREBLAST_BASE_ANGLE_CHANGE = 45;
export const FIREBLAST_BASE_COOLDOWN = 1000;
export const FIREBLAST_LEVELUP_ANGLE_MULTIPLIER = 0.9;
export const FIREBLAST_LEVELUP_COOLDOWN_MULTIPLIER = 0.8;

export const REGEN_BASE_COOLDOWN = 5000;
export const REGEN_BASE_HEAL_AMOUNT = 5;
export const REGEN_LEVELUP_COOLDOWN_MULTIPLIER = 0.8;
export const REGEN_LEVELUP_HEAL_INCREASE = 1;

export const TIMESLOW_BASE_COOLDOWN = 30000;
export const TIMESLOW_LEVELUP_COOLDOWN_MULTIPLIER = 0.85;

export const TORNADO_BASE_SHAKE_AMOUNT = 4;
