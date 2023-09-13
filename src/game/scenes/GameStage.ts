import { Duration } from 'luxon';
import Phaser from 'phaser';
import CircleWeapon from '../classes/circleWeapon';
import Item from '../classes/item';
import PlayerTower from '../classes/playerTower';
import ShopBox from '../classes/shopBox';
import { getRandomEdgeOfScreen } from './helpers/gameHelpers';
import { extractTowerFrames, loadSprites } from './helpers/spriteHelpers';
import { generateTextures } from './helpers/textureHelpers';
import { KeybindType, PowerupType } from '../types';
import {
  ARROW_BASE_RATE,
  ARROW_BASE_SPEED,
  ARROW_RATE_INCREASE,
  JUGGERNAUT_BASE_DAMAGE,
  JUGGERNAUT_BASE_GOLD_VALUE,
  JUGGERNAUT_BASE_HITPOINTS,
  JUGGERNAUT_SPEED_MULTIPLIER,
  CIRCLE_SPEED_INCREASE,
  DARKBLAST_BASE_ANGLE_CHANGE,
  DARKBLAST_BASE_COOLDOWN,
  DARKBLAST_LEVELUP_ANGLE_MULTIPLIER,
  DARKBLAST_LEVELUP_COOLDOWN_MULTIPLIER,
  FIREBLAST_BASE_ANGLE_CHANGE,
  FIREBLAST_BASE_COOLDOWN,
  FIREBLAST_LEVELUP_ANGLE_MULTIPLIER,
  FIREBLAST_LEVELUP_COOLDOWN_MULTIPLIER,
  DEV_TEXT_AT_TOP,
  ENEMY_BASE_DAMAGE,
  ENEMY_BASE_GOLD_VALUE,
  ENEMY_BASE_RATE,
  ENEMY_RATE_MULTIPLER,
  ENEMY_BASE_SPEED,
  REGEN_BASE_COOLDOWN,
  REGEN_BASE_HEAL_AMOUNT,
  REGEN_LEVELUP_COOLDOWN_MULTIPLIER,
  REGEN_LEVELUP_HEAL_INCREASE,
  TIMESLOW_BASE_COOLDOWN,
  TIMESLOW_LEVELUP_COOLDOWN_MULTIPLIER,
  TORNADO_BASE_SHAKE_AMOUNT,
  TOWER_BASE_HITPOINTS,
  JUGGERNAUT_BASE_RATE,
  JUGGERNAUT_RATE_MULTIPLIER,
  CIRCLE_SCALE_MULTIPLIER,
} from '../../constants';

export default class GameStageScene extends Phaser.Scene {
  private playerTower: PlayerTower = new PlayerTower();
  private startTime: number = 0;
  private elapsedSeconds: number = 0;
  private circleWeapons: Phaser.Physics.Arcade.Group | undefined;
  private enemies: Phaser.Physics.Arcade.Group | undefined;
  private tower: Phaser.Physics.Arcade.Sprite | undefined;
  private weapons: Phaser.Physics.Arcade.Group | undefined;
  private PermanentWeapons: Phaser.Physics.Arcade.Group | undefined;
  private shopBoxes: Phaser.GameObjects.Group | undefined;
  public generatedItems: PowerupType[] = [];
  public additionalPrice: number = 0;

  private towerSprites: Phaser.GameObjects.Image[] = [];

  private towerLife: number = TOWER_BASE_HITPOINTS;
  private towerLifeText: Phaser.GameObjects.Text | undefined;
  private gameTimeText: Phaser.GameObjects.Text | undefined;
  private goldText: Phaser.GameObjects.Text | undefined;
  private enemyRate: number = ENEMY_BASE_RATE;
  private juggernautRate: number = JUGGERNAUT_BASE_RATE;
  private enemyRateText: Phaser.GameObjects.Text | undefined;
  private arrowRate: number = ARROW_BASE_RATE;
  private arrowRateText: Phaser.GameObjects.Text | undefined;
  private darkBlastCooldown: number = DARKBLAST_BASE_COOLDOWN;
  private darkBlastDirection: number = 0;
  private darkBlastAngleChange: number = DARKBLAST_BASE_ANGLE_CHANGE;
  private fireBlastCooldown: number = FIREBLAST_BASE_COOLDOWN;
  private fireBlastDirection: number = 180;
  private fireBlastAngleChange: number = FIREBLAST_BASE_ANGLE_CHANGE;
  private regenCooldown: number = REGEN_BASE_COOLDOWN;
  private timeSlowCooldown: number = TIMESLOW_BASE_COOLDOWN;
  private timeSlow: boolean = false;

  private spawnArrowTimer: Phaser.Time.TimerEvent | undefined;
  private spawnJuggernautTimer: Phaser.Time.TimerEvent | undefined;
  private weaponJuggernautHitMap = new Map();
  private spawnEnemyTimer: Phaser.Time.TimerEvent | undefined;
  private darkBlastTimer: Phaser.Time.TimerEvent | undefined;
  private fireBlastTimer: Phaser.Time.TimerEvent | undefined;
  private regenTimer: Phaser.Time.TimerEvent | undefined;
  private regenAmount: number = REGEN_BASE_HEAL_AMOUNT;
  private timeSlowTimer: Phaser.Time.TimerEvent | undefined;

  private enemyCurrentSpeed: number = ENEMY_BASE_SPEED;
  private weaponCounter: number = 0;
  private enemyCounter: number = 0;

  private keyQ: Phaser.Input.Keyboard.Key | null = null;
  private keyW: Phaser.Input.Keyboard.Key | null = null;
  private keyE: Phaser.Input.Keyboard.Key | null = null;
  private keyU: Phaser.Input.Keyboard.Key | null = null;
  private keyK: Phaser.Input.Keyboard.Key | null = null;

  public constructor() {
    super({ key: 'GameStageScene' });
  }

  public preload() {
    loadSprites(this);
  }

  public create() {
    generateTextures(this.make);
    this.towerSprites = extractTowerFrames(this);

    this.setupKeybindings();
    this.setupAnimations();

    const bg = this.add.tileSprite(
      0,
      0,
      this.scale.width,
      this.scale.height,
      'bgTexture',
    );
    bg.setOrigin(0, 0);

    if (this.towerSprites[0]) {
      const towerImage = this.towerSprites[0];
      const centerX = this.scale.width / 2;
      const centerY = this.scale.height / 2;
      this.tower = this.physics.add.sprite(
        centerX,
        centerY,
        'towerSpriteSheet',
        towerImage.frame.name,
      );
    } else {
      this.tower = this.physics.add.sprite(400, 300, 'towerTexture');
    }
    this.tower.setImmovable(true);

    this.circleWeapons = this.physics.add.group({
      classType: CircleWeapon,
    });
    let scale = 0;
    for (let i = 0; i < 3; i++) {
      const currentWeapon = new CircleWeapon({
        scene: this,
        x: 400,
        y: 280,
        texture: 'circleTexture',
        circleNumber: i,
      });
      if (i === 0) {
        scale = currentWeapon.scaleX;
      } else {
        const newScale = scale * 0.8;
        currentWeapon.scaleX = newScale;
        currentWeapon.scaleY = newScale;
        scale = newScale;
      }
      this.circleWeapons.add(currentWeapon);
    }
    this.circleWeapons.children.entries.forEach((circle) => {
      (circle as CircleWeapon)?.setImmovable(true);
    });

    this.enemies = this.physics.add.group({
      classType: Phaser.GameObjects.Rectangle,
    });
    this.weapons = this.physics.add.group({
      classType: Phaser.GameObjects.Rectangle,
    });
    this.PermanentWeapons = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
    });
    this.shopBoxes = this.physics.add.group({
      classType: ShopBox,
    });

    for (let i = 0; i < 3; i++) {
      let keybind: KeybindType = 'Z';
      if (i === 0) keybind = 'Q';
      if (i === 1) keybind = 'W';
      if (i === 2) keybind = 'E';
      const shopBox = new ShopBox({
        scene: this,
        x: 80 + 100 * i,
        y: this.scale.height - 80,
        key: 'shopBoxTexture',
        keybind: keybind,
      });
      this.shopBoxes?.add(shopBox);
    }

    const topTextSize = Math.floor(this.sys.canvas.width / 25);

    this.towerLifeText = this.add.text(
      this.scale.width / 40,
      this.scale.height / 40,
      'Tower Life: ' + this.towerLife,
      {
        fontSize: `${topTextSize}px`,
        color: '#000000',
      },
    );
    this.goldText = this.add.text(
      this.scale.width / 40,
      this.scale.height / 10,
      'Gold: ' + this.playerTower.currentGold,
      {
        fontSize: `${topTextSize}px`,
        color: '#eeee00',
      },
    );
    this.gameTimeText = this.add.text(
      this.scale.width / 1.15,
      this.scale.height / 40,
      this.elapsedSeconds.toString(),
      {
        fontSize: `${topTextSize}px`,
        color: '#000000',
        align: 'right',
      },
    );
    if (DEV_TEXT_AT_TOP) {
      this.enemyRateText = this.add.text(
        this.scale.width / 40,
        this.scale.height / 6,
        'Enemies per second: ' + this.enemyRate.toFixed(1),
        {
          fontSize: `${topTextSize}px`,
          color: '#cccccc',
        },
      );
      this.arrowRateText = this.add.text(
        this.scale.width / 40,
        this.scale.height / 4,
        'Arrows per second: ' + this.arrowRate.toFixed(1),
        {
          fontSize: `${topTextSize}px`,
          color: '#cccccc',
        },
      );
    }

    this.physics.add.collider(this.enemies, this.tower, (_, enemy) => {
      this.enemyTowerCollision(
        enemy as Phaser.Types.Physics.Arcade.GameObjectWithBody,
      );
    });
    this.physics.add.collider(
      this.enemies,
      this.circleWeapons,
      (enemy, circle) => {
        this.enemyWeaponCollision(
          circle as Phaser.Types.Physics.Arcade.GameObjectWithBody,
          enemy as Phaser.Types.Physics.Arcade.GameObjectWithBody,
          false,
        );
      },
    );

    this.physics.add.collider(this.enemies, this.weapons, (enemy, weapon) => {
      this.enemyWeaponCollision(
        weapon as Phaser.Types.Physics.Arcade.GameObjectWithBody,
        enemy as Phaser.Types.Physics.Arcade.GameObjectWithBody,
        true,
      );
    });
    this.physics.add.collider(
      this.enemies,
      this.PermanentWeapons,
      (enemy, weapon) => {
        this.enemyWeaponCollision(
          weapon as Phaser.Types.Physics.Arcade.GameObjectWithBody,
          enemy as Phaser.Types.Physics.Arcade.GameObjectWithBody,
          false,
        );
      },
    );

    this.spawnArrowTimer = this.time.addEvent({
      delay: 1000 / this.arrowRate,
      callback: this.spawnArrow,
      callbackScope: this,
      loop: true,
    });

    this.spawnJuggernautTimer = this.time.addEvent({
      delay: 1000 / this.juggernautRate,
      callback: this.spawnJuggernaut,
      callbackScope: this,
      loop: true,
    });

    this.spawnEnemyTimer = this.time.addEvent({
      delay: 1000 / this.enemyRate,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 1000,
      callback: () => this.updateRates(),
      callbackScope: this,
      loop: true,
    });

    this.startTime = this.time.now;
    this.elapsedSeconds = 0;
  }

  public update(time: number) {
    const cursors = this.input.keyboard?.createCursorKeys();
    this.elapsedSeconds = Math.floor((time - this.startTime) / 1000);

    this.circleWeapons?.children.entries.forEach((circle) => {
      (circle as CircleWeapon)?.moveCircle(cursors);
    });

    // this.weapons?.children.entries.forEach((weapon) => {
    //   if (weapon.getData('type') === 'darkBlast') { }
    // });

    this.PermanentWeapons?.children.entries.forEach((weapon) => {
      if (weapon.getData('type') === 'tornado') {
        const dir = Math.random();
        if (dir < 0.25)
          (weapon as Phaser.Physics.Arcade.Sprite).x +=
            TORNADO_BASE_SHAKE_AMOUNT;
        if (dir >= 0.25 && dir < 0.5)
          (weapon as Phaser.Physics.Arcade.Sprite).x -=
            TORNADO_BASE_SHAKE_AMOUNT;
        if (dir >= 0.5 && dir < 0.75)
          (weapon as Phaser.Physics.Arcade.Sprite).y +=
            TORNADO_BASE_SHAKE_AMOUNT;
        if (dir >= 0.75)
          (weapon as Phaser.Physics.Arcade.Sprite).y -=
            TORNADO_BASE_SHAKE_AMOUNT;
      }
    });

    if (this.timeSlow) this.enemyCurrentSpeed *= 0.95;
    else if (this.enemyCurrentSpeed < ENEMY_BASE_SPEED / 10)
      this.enemyCurrentSpeed = ENEMY_BASE_SPEED / 10;
    else if (this.enemyCurrentSpeed < ENEMY_BASE_SPEED)
      this.enemyCurrentSpeed /= 0.95;
    if (this.enemyCurrentSpeed > ENEMY_BASE_SPEED)
      this.enemyCurrentSpeed = ENEMY_BASE_SPEED;

    const shopBoxKeybinds: { [id: string]: ShopBox } = {};
    this.shopBoxes?.children.entries.forEach(
      (gameObject: Phaser.GameObjects.GameObject) => {
        const shopBox = gameObject as ShopBox;
        shopBoxKeybinds[shopBox.getKeybind()] = shopBox;
      },
    );
    let itemBought = null;
    if (this.input.keyboard) {
      if (
        Phaser.Input.Keyboard.JustDown(this.keyU as Phaser.Input.Keyboard.Key)
      ) {
        this.playerTower.currentGold += 1000;
      }
      if (
        Phaser.Input.Keyboard.JustDown(this.keyK as Phaser.Input.Keyboard.Key)
      ) {
        this.enemyRate += 1;
        this.juggernautRate += 1;
      }
      if (
        Phaser.Input.Keyboard.JustDown(this.keyQ as Phaser.Input.Keyboard.Key)
      ) {
        itemBought = shopBoxKeybinds.Q.buyItem(this.playerTower);
      }
      if (
        Phaser.Input.Keyboard.JustDown(this.keyW as Phaser.Input.Keyboard.Key)
      ) {
        itemBought = shopBoxKeybinds.W.buyItem(this.playerTower);
      }
      if (
        Phaser.Input.Keyboard.JustDown(this.keyE as Phaser.Input.Keyboard.Key)
      ) {
        itemBought = shopBoxKeybinds.E.buyItem(this.playerTower);
      }
    }
    if (itemBought) {
      this.addPowerup(itemBought);
      this.generatedItems = [];
      this.shopBoxes?.children.entries.forEach((shopbox) => {
        (shopbox as ShopBox).rerollItem();
      });
    }

    this.enemies?.children.entries.forEach((enemy) => {
      if (this.tower) {
        if (enemy.getData('type') === 'juggernaut')
          this.physics.moveToObject(
            enemy,
            this.tower,
            this.enemyCurrentSpeed * JUGGERNAUT_SPEED_MULTIPLIER,
          );
        else
          this.physics.moveToObject(enemy, this.tower, this.enemyCurrentSpeed);
      }
    });

    this.shopBoxes?.children.entries.forEach((box) => {
      const shopBox = box as ShopBox;
      if (shopBox.getItem() === null) {
        (shopBox as ShopBox).addItem((shopBox as ShopBox).generateRandomItem());
      }
      if (shopBox.getItem != null) {
        this.generatedItems.push((shopBox.getItem() as Item).powerup);
      }
    });

    if (this.towerLife <= 0) {
      this.scene.remove();
      this.scene.start('GameOverScene');
    }

    this.towerLifeText &&
      this.towerLifeText.setText('Tower Life: ' + this.towerLife);
    this.goldText &&
      this.goldText.setText('Gold: ' + this.playerTower.currentGold);
    this.gameTimeText &&
      this.gameTimeText.setText(this.secondsToMMSS(this.elapsedSeconds));
    this.gameTimeText &&
      this.gameTimeText.setPosition(
        this.scale.width / 1.05 - this.gameTimeText.width,
        this.scale.height / 40,
      );
    if (DEV_TEXT_AT_TOP) {
      this.enemyRateText &&
        this.enemyRateText.setText(
          'Enemies per second: ' + this.enemyRate.toFixed(1),
        );
      this.arrowRateText &&
        this.arrowRateText.setText(
          'Arrows per second: ' + this.arrowRate.toFixed(1),
        );
    }
  }

  private setupKeybindings() {
    if (this.input.keyboard) {
      this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      this.keyU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
      this.keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    }
  }

  private setupAnimations() {
    this.anims.create({
      key: 'darkBlastAnimation',
      frames: Array.from({ length: 15 }, (_, i) => ({
        key: `darkBlastSprite${i}`,
      })),
      frameRate: 14,
      repeat: -1,
    });
    this.anims.create({
      key: 'fireBlastAnimation',
      frames: Array.from({ length: 15 }, (_, i) => ({
        key: `fireBlastSprite${i}`,
      })),
      frameRate: 14,
      repeat: -1,
    });
    this.anims.create({
      key: 'regenAnimation',
      frames: this.anims.generateFrameNumbers('healEffectSheet', {
        start: 0,
        end: 15,
      }),
      frameRate: 12,
      repeat: 0,
    });
    this.anims.create({
      key: 'timeSlowAnimation',
      frames: this.anims.generateFrameNumbers('timeSlowAnimationSheet', {
        start: 0,
        end: 14,
      }),
      frameRate: 12,
      repeat: 1,
    });
    this.anims.create({
      key: 'tornadoAnimation',
      frames: Array.from({ length: 9 }, (_, i) => ({
        key: `tornadoRepeat${i}`,
      })),
      frameRate: 28,
      repeat: -1,
    });
  }

  private spawnJuggernaut() {
    const { x, y } = getRandomEdgeOfScreen(this);
    const juggernaut = this.physics.add.sprite(x, y, 'juggernautTexture');
    juggernaut.setData('type', 'juggernaut');
    juggernaut.setData('hitpoints', JUGGERNAUT_BASE_HITPOINTS);
    juggernaut.setData('id', `enemy-${this.enemyCounter++}`);
    juggernaut.setImmovable(true);

    this.enemies?.add(juggernaut);
    if (this.spawnJuggernautTimer) {
      this.spawnJuggernautTimer.destroy();
    }
    this.spawnJuggernautTimer = this.time.addEvent({
      delay: 1000 / this.juggernautRate,
      callback: this.spawnJuggernaut,
      callbackScope: this,
      loop: true,
    });
  }

  private spawnEnemy() {
    const { x, y } = getRandomEdgeOfScreen(this);
    const enemy = this.physics.add.sprite(x, y, 'enemyTexture');
    enemy.setImmovable(true);
    enemy.setData('id', `enemy-${this.enemyCounter++}`);
    this.enemies?.add(enemy);
    if (this.spawnEnemyTimer) {
      this.spawnEnemyTimer.destroy();
    }
    this.spawnEnemyTimer = this.time.addEvent({
      delay: 1000 / this.enemyRate,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });
  }

  private spawnArrow() {
    if (this.tower) {
      const x = this.tower.x;
      const y = this.tower.y;

      const arrow = this.physics.add.sprite(x, y, 'arrowTexture');
      arrow.setData('id', `weapon-${this.weaponCounter++}`);

      this.weapons?.add(arrow);

      const closestEnemy = this.getClosestEnemy(this.tower);
      if (closestEnemy) {
        this.physics.moveToObject(arrow, closestEnemy, ARROW_BASE_SPEED);
      } else {
        const angle = Phaser.Math.Between(0, 360);
        this.physics.velocityFromAngle(angle, 200, arrow.body.velocity);
      }

      this.updateArrowTimer();
    }
  }

  private addPowerup(item: Item) {
    switch (item.powerup) {
      case 'arrowRate':
        this.arrowRate += item.cost * ARROW_RATE_INCREASE;
        this.spawnArrow();
        break;
      case 'circleStrength':
        this.circleWeapons?.children.entries.forEach((circle) => {
          const weaponCircle = circle as CircleWeapon;
          weaponCircle.circleSpeed += CIRCLE_SPEED_INCREASE;
          const currentX = weaponCircle.x;
          const currentY = weaponCircle.y;
          weaponCircle.scaleX *= CIRCLE_SCALE_MULTIPLIER;
          weaponCircle.scaleY *= CIRCLE_SCALE_MULTIPLIER;
          weaponCircle.x = currentX;
          weaponCircle.y = currentY;
        });
        break;
      case 'darkBlast':
        if (this.darkBlastTimer) {
          this.darkBlastCooldown =
            this.darkBlastCooldown * DARKBLAST_LEVELUP_COOLDOWN_MULTIPLIER;
          this.darkBlastAngleChange =
            this.darkBlastAngleChange * DARKBLAST_LEVELUP_ANGLE_MULTIPLIER;
        }
        this.spawnDarkBlast();
        break;
      case 'fireBlast':
        if (this.fireBlastTimer) {
          this.fireBlastCooldown =
            this.fireBlastCooldown * FIREBLAST_LEVELUP_COOLDOWN_MULTIPLIER;
          this.fireBlastAngleChange =
            this.fireBlastAngleChange * FIREBLAST_LEVELUP_ANGLE_MULTIPLIER;
        }
        this.spawnFireBlast();
        break;
      case 'regen':
        if (this.regenTimer) {
          this.regenCooldown *= REGEN_LEVELUP_COOLDOWN_MULTIPLIER;
          this.regenAmount += REGEN_LEVELUP_HEAL_INCREASE;
        }
        this.spawnRegen();
        break;
      case 'timeSlow':
        if (this.timeSlowTimer) {
          this.timeSlowCooldown *= TIMESLOW_LEVELUP_COOLDOWN_MULTIPLIER;
        }
        this.spawnTimeSlow();
        break;
      case 'tornado':
        this.spawnTornado();
        break;
      default:
        break;
    }
  }

  private getClosestEnemy(origin: Phaser.Physics.Arcade.Sprite) {
    let closestEnemy = null;
    let closestDistance = Number.MAX_VALUE;

    this.enemies?.children.entries.forEach(
      (enemy: Phaser.GameObjects.GameObject) => {
        const enemySprite = enemy as Phaser.Physics.Arcade.Sprite;
        const distance = Phaser.Math.Distance.Between(
          origin.x,
          origin.y,
          enemySprite.x,
          enemySprite.y,
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestEnemy = enemySprite;
        }
      },
    );

    return closestEnemy;
  }

  private enemyTowerCollision(
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    if (enemy.getData('type') === 'juggernaut')
      this.towerLife -= JUGGERNAUT_BASE_DAMAGE;
    else this.towerLife -= ENEMY_BASE_DAMAGE;
    enemy.destroy();
  }

  private enemyWeaponCollision(
    weapon: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    weaponDestroyed = false,
  ) {
    const currentTime = Date.now();
    const hitCooldown = 200; // milliseconds
    const weaponId = weapon.getData('id');
    const juggernautId = enemy.getData('id');

    const compositeKey = `${weaponId}-${juggernautId}`;
    const lastHitTime = this.weaponJuggernautHitMap.get(compositeKey) || 0;
    if (currentTime - lastHitTime < hitCooldown) {
      return;
    }
    this.weaponJuggernautHitMap.set(compositeKey, currentTime);

    if (
      enemy.getData('type') === 'juggernaut' &&
      enemy.getData('hitpoints') > 0
    ) {
      enemy.setData('hitpoints', enemy.getData('hitpoints') - 5);
    } else {
      this.enemyDefeated(enemy);
    }

    if (weaponDestroyed) {
      weapon.destroy();
    }
  }

  private enemyDefeated(enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
    if (enemy.getData('type') === 'juggernaut')
      this.playerTower.currentGold += JUGGERNAUT_BASE_GOLD_VALUE;
    else this.playerTower.currentGold += ENEMY_BASE_GOLD_VALUE;
    enemy.destroy();
  }

  private updateArrowTimer() {
    if (this.spawnArrowTimer) {
      this.spawnArrowTimer.destroy();
    }
    this.spawnArrowTimer = this.time.addEvent({
      delay: 1000 / this.arrowRate,
      callback: this.spawnArrow,
      callbackScope: this,
      loop: true,
    });
  }

  private spawnDarkBlast() {
    if (this.darkBlastTimer) {
      this.darkBlastTimer.destroy();
    }
    const x: number = this.scale.width / 2;
    const y: number = this.scale.height / 2;
    const darkBlastSprite = this.physics.add.sprite(x, y, 'darkBlastSprite1');
    darkBlastSprite.scale = 2;
    darkBlastSprite.setData('type', 'darkBlast');
    darkBlastSprite.setData('id', `weapon-${this.weaponCounter++}`);
    darkBlastSprite.play('darkBlastAnimation');

    this.time.delayedCall(1, () => {
      this.physics.velocityFromAngle(
        this.darkBlastDirection,
        200,
        darkBlastSprite.body.velocity,
      );
      darkBlastSprite.angle = this.darkBlastDirection;
      if (this.darkBlastDirection + this.darkBlastAngleChange < 360)
        this.darkBlastDirection += this.darkBlastAngleChange;
      else this.darkBlastDirection = 0;
    });

    this.weapons?.add(darkBlastSprite);
    this.darkBlastTimer = this.time.addEvent({
      delay: this.darkBlastCooldown,
      callback: this.spawnDarkBlast,
      callbackScope: this,
      loop: false,
    });
  }

  private spawnFireBlast() {
    if (this.fireBlastTimer) {
      this.fireBlastTimer.destroy();
    }
    const x: number = this.scale.width / 2;
    const y: number = this.scale.height / 2;
    const fireBlastSprite = this.physics.add.sprite(x, y, 'fireBlastSprite1');
    fireBlastSprite.scale = 2;
    fireBlastSprite.setData('type', 'fireBlast');
    fireBlastSprite.setData('id', `weapon-${this.weaponCounter++}`);
    fireBlastSprite.play('fireBlastAnimation');

    this.time.delayedCall(1, () => {
      this.physics.velocityFromAngle(
        this.fireBlastDirection,
        200,
        fireBlastSprite.body.velocity,
      );
      fireBlastSprite.angle = this.fireBlastDirection;
      if (this.fireBlastDirection + this.fireBlastAngleChange > 0)
        this.fireBlastDirection -= this.fireBlastAngleChange;
      else this.fireBlastDirection = 360;
    });

    this.weapons?.add(fireBlastSprite);
    this.fireBlastTimer = this.time.addEvent({
      delay: this.fireBlastCooldown,
      callback: this.spawnFireBlast,
      callbackScope: this,
      loop: false,
    });
  }

  private spawnRegen() {
    if (this.regenTimer) {
      this.regenTimer.destroy();
    }
    const x: number = this.scale.width / 2;
    const y: number = this.scale.height / 2.3;
    const regenSprite = this.physics.add.sprite(x, y, 'regen');
    regenSprite.scale = 1.2;
    regenSprite.setData('type', 'regen');
    regenSprite.play('regenAnimation');
    regenSprite.setImmovable(true);
    if (this.towerLife + this.regenAmount >= TOWER_BASE_HITPOINTS)
      this.towerLife = TOWER_BASE_HITPOINTS;
    else this.towerLife += this.regenAmount;
    if (this.towerLife > TOWER_BASE_HITPOINTS)
      this.towerLife === TOWER_BASE_HITPOINTS;
    regenSprite.on('animationcomplete', () => {
      regenSprite.destroy();
      this.regenTimer = this.time.addEvent({
        delay: this.regenCooldown,
        callback: this.spawnRegen,
        callbackScope: this,
        loop: false,
      });
    });
  }

  private spawnTimeSlow() {
    if (this.timeSlowTimer) {
      this.timeSlowTimer.destroy();
    }
    const x: number = this.scale.width / 2;
    const y: number = this.scale.height / 2;
    const timeSlowSprite = this.physics.add.sprite(x, y, 'timeSlowTexture');
    this.timeSlow = true;
    timeSlowSprite.scale = 0.5;
    timeSlowSprite.setData('type', 'timeSlow');
    timeSlowSprite.play('timeSlowAnimation');
    timeSlowSprite.setImmovable(true);
    timeSlowSprite.on('animationcomplete', () => {
      timeSlowSprite.destroy();
      this.timeSlow = false;
      // this.enemyCurrentSpeed = ENEMY_BASE_SPEED;
      this.timeSlowTimer = this.time.addEvent({
        delay: this.timeSlowCooldown,
        callback: this.spawnTimeSlow,
        callbackScope: this,
        loop: false,
      });
    });
  }

  private spawnTornado = () => {
    const x: number = this.scale.width * Math.random();
    const y: number = this.scale.height * Math.random();
    const tornadoSprite = this.physics.add.sprite(x, y, 'tornadoRepeat1');
    tornadoSprite.scale = 0.2;
    tornadoSprite.setData('type', 'tornado');
    tornadoSprite.setData('id', `weapon-${this.weaponCounter++}`);
    this.PermanentWeapons?.add(tornadoSprite);
    tornadoSprite.play('tornadoAnimation');
    tornadoSprite.setImmovable(true);
  };

  private updateRates = () => {
    this.enemyRate *= ENEMY_RATE_MULTIPLER;
    this.juggernautRate *= JUGGERNAUT_RATE_MULTIPLIER;
  };

  private secondsToMMSS = (seconds: number): string => {
    return Duration.fromObject({ seconds }).toFormat('mm:ss');
  };

  public increasePrices = (): void => {
    this.additionalPrice += Math.floor(this.elapsedSeconds / 180) + 1;
  };
}
