import {
  REGEN_BASE_COOLDOWN,
  REGEN_BASE_HEAL_AMOUNT,
  REGEN_LEVELUP_COOLDOWN_MULTIPLIER,
  REGEN_LEVELUP_HEAL_INCREASE,
  REGEN_LEVELUP_MAXHP_INCREASE,
} from '../../../constants';
import GameStageScene from '../../scenes/GameStage';

export default class RegenManager {
  public regenAmount: number = REGEN_BASE_HEAL_AMOUNT;
  public regenCooldown: number = REGEN_BASE_COOLDOWN;
  public regenTimer: Phaser.Time.TimerEvent | undefined;

  constructor(private scene: GameStageScene) {}

  public levelUp = () => {
    this.scene.playerTower.maxHp += REGEN_LEVELUP_MAXHP_INCREASE;
    if (this.regenTimer) {
      this.regenCooldown *= REGEN_LEVELUP_COOLDOWN_MULTIPLIER;
      this.regenAmount += REGEN_LEVELUP_HEAL_INCREASE;
    }
    this.spawnRegen();
  };

  public spawnRegen = () => {
    if (this.regenTimer) {
      this.regenTimer.destroy();
    }
    const x: number = this.scene.scale.width / 2;
    const y: number = this.scene.scale.height / 2.3;
    const regenSprite = this.scene.physics.add.sprite(x, y, 'regen');
    regenSprite.scale = 1.2 * this.scene.gameSpeedScale;
    regenSprite.setData('type', 'regen');
    regenSprite.play('regenAnimation');
    regenSprite.setImmovable(true);
    if (
      this.scene.playerTower.currentHp + this.regenAmount >=
      this.scene.playerTower.maxHp
    )
      this.scene.playerTower.currentHp = this.scene.playerTower.maxHp;
    else this.scene.playerTower.currentHp += this.regenAmount;
    if (this.scene.playerTower.currentHp > this.scene.playerTower.maxHp)
      this.scene.playerTower.currentHp === this.scene.playerTower.maxHp;
    regenSprite.on('animationcomplete', () => {
      regenSprite.destroy();
      this.regenTimer = this.scene.time.addEvent({
        delay: this.regenCooldown,
        callback: this.spawnRegen,
        callbackScope: this,
        loop: false,
      });
    });
  };
}
