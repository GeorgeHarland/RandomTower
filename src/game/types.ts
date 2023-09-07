// z is a temp default for the shop keybinds - no impact on game
export type KeybindType = 'Q' | 'W' | 'E' | 'Z';

export type ItemGradeType = 'S' | 'A' | 'B' | 'C' | 'D';

export type PowerupType =
  | 'arrowRate'
  | 'circleSpeed'
  | 'darkBlast'
  | 'regen'
  | 'timeSlow'
  | 'tornado';

export type CoordinateType = {
  x: number;
  y: number;
};
