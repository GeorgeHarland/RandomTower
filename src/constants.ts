import { EnemyConfig, ItemGradeType, PowerupType } from './game/types';

export const MOBILE_BREAKPOINT = 600;

// Enemies

export const ENEMY_BASE_SPEED = 80;
export const ENEMY_WEAPON_HIT_RATE = 200;

export const EnemyConstants: Record<string, EnemyConfig> = {
  MINION: {
    DAMAGE: 5,
    RATE: 0.5,
    RATE_MULTIPLIER: 1.012,
    SPEED_MULTIPLIER: 1,
    HITPOINTS: 1,
    GOLD_VALUE: 1,
  },
  JUGGERNAUT: {
    DAMAGE: 20,
    RATE: 0.03,
    RATE_MULTIPLIER: 1.013,
    SPEED_MULTIPLIER: 0.25,
    HITPOINTS: 40,
    GOLD_VALUE: 5,
  },
  BOSS: {
    DAMAGE: 50,
    RATE: 0.01,
    RATE_MULTIPLIER: 1.012,
    SPEED_MULTIPLIER: 0.10,
    HITPOINTS: 400,
    GOLD_VALUE: 50,
  }
};

// Player / Tower

export const TOWER_BASE_HITPOINTS = 100;

// Powerups

export const PowerupRecord: Record<PowerupType, ItemGradeType> = {
  'Arrow Rate': 'B',
  'Circle Speed': 'D',
  'Dark Blast': 'C',
  'Fire Blast': 'C',
  'Ice Spike': 'A',
  Regen: 'D',
  'Time Slow': 'S',
  Tornado: 'D',
};

export const gradeCost: Record<ItemGradeType, number> = {
  D: 7,
  C: 11,
  B: 15,
  A: 19,
  S: 23,
};

export const ARROW_BASE_SPEED = 200;
export const ARROW_BASE_RATE = 0.2;
export const ARROW_RATE_INCREASE = 0.025;

export const CIRCLE_BASE_SPEED = 1.2;
export const CIRCLE_SPEED_INCREASE = 0.30;
export const CIRCLE_SCALE_MULTIPLIER = 1.15;

export const DARKBLAST_BASE_ANGLE_CHANGE = 45;
export const DARKBLAST_BASE_COOLDOWN = 1000;
export const DARKBLAST_LEVELUP_ANGLE_MULTIPLIER = 0.9;
export const DARKBLAST_LEVELUP_COOLDOWN_MULTIPLIER = 0.8;

export const FIREBLAST_BASE_ANGLE_CHANGE = 45;
export const FIREBLAST_BASE_COOLDOWN = 1000;
export const FIREBLAST_LEVELUP_ANGLE_MULTIPLIER = 0.9;
export const FIREBLAST_LEVELUP_COOLDOWN_MULTIPLIER = 0.8;

export const ICEPOOL_BASE_SIZE_SCALE = 0.7;
export const ICEPOOL_DURATION = 8000;
export const ICEPOOL_SLOW = 0.3;
export const ICESPIKE_BASE_COOLDOWN = 8000;
export const ICESPIKE_BASE_SIZE_SCALE = 1.5;
export const ICESPIKE_BASE_SPEED = 100;
export const ICESPIKE_LEVELUP_COOLDOWN_MULTIPLIER = 0.9;
export const ICESPIKE_LEVELUP_POOL_INCREASE = 0.05;

export const REGEN_BASE_COOLDOWN = 5000;
export const REGEN_BASE_HEAL_AMOUNT = 5;
export const REGEN_LEVELUP_COOLDOWN_MULTIPLIER = 0.8;
export const REGEN_LEVELUP_HEAL_INCREASE = 1;
export const REGEN_LEVELUP_MAXHP_INCREASE = 5;

export const TIMESLOW_BASE_COOLDOWN = 30000;
export const TIMESLOW_LEVELUP_COOLDOWN_MULTIPLIER = 0.85;

export const TORNADO_BASE_SHAKE_AMOUNT = 4;
