// z is a temp default for the shop keybinds - no impact on game
export type KeybindType = 'Q' | 'W' | 'E' | 'Z';

export type ItemGradeType = 'S' | 'A' | 'B' | 'C' | 'D';

export type EnemyTypes = 'all' | 'minion' | 'juggernaut';

export type EnemyConfig = {
  DAMAGE: number;
  RATE: number;
  RATE_MULTIPLIER: number;
  SPEED?: number;
  SPEED_MULTIPLIER: number;
  GOLD_VALUE: number;
  HITPOINTS: number;
};

export type PowerupType =
  | 'Arrow Rate'
  | 'Circle Speed'
  | 'Dark Blast'
  | 'Fire Blast'
  | 'Ice Spike'
  | 'Regen'
  | 'Time Slow'
  | 'Tornado';

export type CoordinateType = {
  x: number;
  y: number;
};
