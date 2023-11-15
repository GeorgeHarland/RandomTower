import {
  EnemyConfig,
  EnemyTypes,
  ItemGradeType,
  PowerupType,
} from './game/types';

export const MOBILE_BREAKPOINT = 600;

// Enemies

export const ENEMY_BASE_SPEED = 80;
export const ENEMY_WEAPON_HIT_RATE = 200;

export const EnemyConstants: Record<EnemyTypes, EnemyConfig> = {
  minion: {
    TYPE: 'minion',
    TEXTURE: 'enemyTexture', // uses texture if sprite null
    SPRITE: 'minionSprite',
    SPRITE_SCALE: 0.05,
    DAMAGE: 5,
    RATE: 0.3,
    RATE_MULTIPLIER: 1.012,
    SPEED_MULTIPLIER: 1,
    HITPOINTS: 1,
    GOLD_VALUE: 1,
  },
  juggernaut: {
    TYPE: 'juggernaut',
    TEXTURE: 'juggernautTexture',
    SPRITE: 'juggernautSprite',
    SPRITE_SCALE: 0.135,
    DAMAGE: 20,
    RATE: 0.05, // first around 25s
    RATE_MULTIPLIER: 1.025,
    SPEED_MULTIPLIER: 0.25,
    HITPOINTS: 50,
    GOLD_VALUE: 5,
  },
  boss: {
    TYPE: 'boss',
    TEXTURE: 'bossTexture',
    SPRITE: 'bossSprite',
    SPRITE_SCALE: 0.25,
    DAMAGE: 50,
    RATE: 0.015, // first around 85s
    RATE_MULTIPLIER: 1.015,
    SPEED_MULTIPLIER: 0.1,
    HITPOINTS: 400,
    GOLD_VALUE: 30,
  },
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
  'Poison Clouds': 'C',
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

export const CIRCLE_BASE_SPEED = 1.1;
export const CIRCLE_BASE_SIZE_DIVISION = 4000;
export const CIRCLE_SPEED_INCREASE = 0.4;
export const CIRCLE_SCALE_MULTIPLIER = 1.05;

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

export const POISON_CLOUDS_BASE_AMOUNT = 2;
export const POISON_CLOUDS_BASE_DURATION = 2000;
export const POISON_CLOUDS_BASE_SCALE = 0.35;
export const POISON_CLOUDS_BASE_COOLDOWN = 5000;

export const REGEN_BASE_COOLDOWN = 5000;
export const REGEN_BASE_HEAL_AMOUNT = 5;
export const REGEN_LEVELUP_COOLDOWN_MULTIPLIER = 0.8;
export const REGEN_LEVELUP_HEAL_INCREASE = 1;
export const REGEN_LEVELUP_MAXHP_INCREASE = 5;

export const TIMESLOW_BASE_COOLDOWN = 30000;
export const TIMESLOW_LEVELUP_COOLDOWN_MULTIPLIER = 0.9;

export const TORNADO_BASE_SHAKE_AMOUNT = 4;
