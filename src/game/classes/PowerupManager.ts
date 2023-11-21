import {
  CIRCLE_SCALE_MULTIPLIER,
  CIRCLE_SPEED_INCREASE,
  PowerupRecord,
} from '../../constants';
import GameStageScene from '../scenes/GameStage';
import CircleWeapon from './CircleWeapon';
import Item from './Item';
import ShopBox from './ShopBox';
import ArrowRateManager from './powerups/ArrowRateManager';
import DarkBlastManager from './powerups/DarkBlastManager';
import FireBlastManager from './powerups/FireBlastManager';
import IceSpikeManager from './powerups/IceSpikeManager';
import PoisonCloudsManager from './powerups/PoisonCloudsManager';
import RegenManager from './powerups/RegenManager';
import TimeSlowManager from './powerups/TimeSlowManager';
import TornadoManager from './powerups/TornadoManager';

export default class PowerupManager {
  public arrowRateManager: ArrowRateManager;
  public darkBlastManager: DarkBlastManager;
  public fireBlastManager: FireBlastManager;
  public iceSpikeManager: IceSpikeManager;
  public tornadoManager: TornadoManager;
  public poisonCloudsManager: PoisonCloudsManager;
  public regenManager: RegenManager;
  public timeSlowManager: TimeSlowManager;
  public weaponCounter: number = 0;

  public constructor(private scene: GameStageScene) {
    this.arrowRateManager = new ArrowRateManager(this.scene);
    this.darkBlastManager = new DarkBlastManager(this.scene);
    this.fireBlastManager = new FireBlastManager(this.scene);
    this.iceSpikeManager = new IceSpikeManager(this.scene);
    this.tornadoManager = new TornadoManager(this.scene);
    this.poisonCloudsManager = new PoisonCloudsManager(this.scene);
    this.regenManager = new RegenManager(this.scene);
    this.timeSlowManager = new TimeSlowManager(this.scene);
  }

  public addPowerup = (item: Item) => {
    switch (item.powerup) {
      case 'Arrow Rate':
        this.arrowRateManager.levelUp();
        break;
      case 'Circle Speed':
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
        break;
      case 'Dark Blast':
        this.darkBlastManager.levelUp();
        break;
      case 'Fire Blast':
        this.fireBlastManager.levelUp();
        break;
      case 'Ice Spike':
        this.iceSpikeManager.levelUp();
        break;
      case 'Poison Clouds':
        this.poisonCloudsManager.levelUp();
        break;
      case 'Regen':
        this.regenManager.levelUp();
        break;
      case 'Time Slow':
        this.timeSlowManager.levelUp();
        break;
      case 'Tornado':
        this.tornadoManager.spawnTornado();
        break;
      default:
        break;
    }
    this.scene.powerupsBought?.push(item?.powerup);
  };

  public initShopBoxes = () => {
    this.scene.shopBoxes?.children.entries.forEach((box, index) => {
      const shopBox = box as ShopBox;
      if (shopBox.getItem() === null) {
        if (this.scene.elapsedSeconds > 1)
          (shopBox as ShopBox).addItem(
            (shopBox as ShopBox).generateRandomItem()
          );
        else if (index === 0)
          shopBox.addItem(
            new Item(
              shopBox.scene,
              0,
              0,
              'item0',
              'Arrow Rate',
              PowerupRecord['Arrow Rate'],
              10
            )
          );
        else if (index === 1)
          shopBox.addItem(
            new Item(
              shopBox.scene,
              0,
              0,
              'item0',
              'Circle Speed',
              PowerupRecord['Circle Speed'],
              10
            )
          );
        else if (index === 2)
          shopBox.addItem(
            new Item(
              shopBox.scene,
              0,
              0,
              'item0',
              'Tornado',
              PowerupRecord['Tornado'],
              8
            )
          );
      }
      if (shopBox.getItem != null) {
        this.scene.generatedItems.push((shopBox.getItem() as Item).powerup);
      }
    });
  };
}
