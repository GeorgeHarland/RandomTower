// powerup, grade
export const PowerupRecord: Record<PowerupType, ItemGradeType> = {
  arrowRate: 'D',
  tornado: 'S',
};

// z is a temp default for the shop keybinds - no impact on game
export type KeybindType = 'Q' | 'W' | 'E' | 'Z';

export type ItemGradeType = 'S' | 'A' | 'B' | 'C' | 'D';

export type PowerupType = 'arrowRate' | 'tornado';
