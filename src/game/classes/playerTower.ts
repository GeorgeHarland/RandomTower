import { TOWER_BASE_HITPOINTS } from '../../constants';

export default class PlayerTower {
  public currentGold: number = 0;
  public maxHp: number = TOWER_BASE_HITPOINTS;
  public currentHp: number = TOWER_BASE_HITPOINTS;

  public constructor() {}
}
