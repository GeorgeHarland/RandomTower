import {
  CIRCLE_SCALE_MULTIPLIER,
  CIRCLE_SPEED_INCREASE,
} from '../../../constants';
import GameStageScene from '../../scenes/GameStage';
import CircleWeapon from '../CircleWeapon';

export default class CircleSpeedManager {
  constructor(private scene: GameStageScene) {}

  public levelUp = () => {
    this.scene.circleWeapons?.children.entries.forEach((circle) => {
      const weaponCircle = circle as CircleWeapon;
      weaponCircle.circleSpeed +=
        CIRCLE_SPEED_INCREASE * this.scene.gameSpeedScale;
      const currentX = weaponCircle.x;
      const currentY = weaponCircle.y;
      weaponCircle.scaleX *= CIRCLE_SCALE_MULTIPLIER;
      weaponCircle.scaleY *= CIRCLE_SCALE_MULTIPLIER;
      weaponCircle.x = currentX;
      weaponCircle.y = currentY;
    });
  };
}
