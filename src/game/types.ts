// powerup, grade
export const PowerupRecord: Record<PowerupType, ItemGradeType> = {
  'arrowRate': 'D',
  'aura': 'B',
  'bladeDrag': 'B',
  'clawSlashes': 'C',
  'crossedAirFlows': 'A',
  'eggDefense': 'D',
  'electricalCrescent': 'S',
  'embrassedEnergy': 'C',
  'eyestalk': 'A',
  'tornado': 'S',
};

// z is a temp default for the shop keybinds - no impact on game
export type KeybindType = 'Q' | 'W' | 'E' | 'Z';

export type ItemGradeType = 'S' | 'A' | 'B' | 'C' | 'D';

export type PowerupType = 
  | 'arrowRate'
  | 'aura'
  | 'bladeDrag'
  | 'clawSlashes'
  | 'crossedAirFlows'
  | 'eggDefense'
  | 'electricalCrescent'
  | 'embrassedEnergy'
  | 'eyestalk'
  | 'tornado';
  
