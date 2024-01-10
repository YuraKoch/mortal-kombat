import { Move } from "./moves.js";
import { MOVE_TYPES, ORIENTATIONS, PLAYER_HEIGHT, PLAYER_WIDTH } from "./constants.js";

export class Attack extends Move {
  moveBack = false;

  constructor(options) {
    super(options);
    this.damage = options.damage;
    this.damageWidth = options.damageWidth ?? PLAYER_WIDTH;
    this.damageHeight = options.damageHeight ?? PLAYER_HEIGHT * 0.4;
    this.damageYOffset = options.damageYOffset ?? 0;
  }

  start() {
    this.moveBack = false;
    this.updateDamageRectangleXY();
    super.start();
  }

  updateDamageRectangleXY() {
    if (this.owner.orientation === ORIENTATIONS.LEFT) {
      this.damageX = this.owner.x + PLAYER_WIDTH / 2 + this.damageWidth / 2;
    } else {
      this.damageX = this.owner.x - PLAYER_WIDTH / 2 - this.damageWidth / 2;
    }

    this.damageY = this.owner.y - this.damageYOffset;
  }

  shouldStop() {
    return this.moveBack && this.currentStep <= 0;
  }

  action() {
    if (this.currentStep === Math.floor(this.totalSteps / 2) && !this.moveBack) {
      this.owner.damage = this.damage;
    }
  }

  calculateNextStep() {
    if (this.moveBack) {
      this.currentStep -= 1;
      return;
    }

    this.currentStep += 1;

    if (this.currentStep >= this.totalSteps) {
      this.moveBack = true;
      this.currentStep -= 1;
    }
  }

  stop() {
    this.owner.damage = 0;
    super.stop();
  }
}

export class HighKick extends Attack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.HIGH_KICK,
      stepDuration: 50,
      damage: 10,
      damageYOffset: PLAYER_HEIGHT * 0.7,
      damageWidth: PLAYER_WIDTH * 0.8,
    });
  }
}

export class LowKick extends Attack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.LOW_KICK,
      stepDuration: 50,
      damage: 6,
      damageWidth: PLAYER_WIDTH * 1.2,
      damageYOffset: PLAYER_HEIGHT * 0.4,
    });
  }
}

export class HighPunch extends Attack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.HIGH_PUNCH,
      stepDuration: 60,
      damage: 8,
      damageWidth: PLAYER_WIDTH * 0.8,
      damageYOffset: PLAYER_HEIGHT * 0.7,
    });
  }

  shouldStop() {
    return this.currentStep >= this.totalSteps;
  }

  calculateNextStep() {
    this.currentStep += 1;
  }
}

export class LowPunch extends Attack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.LOW_PUNCH,
      stepDuration: 60,
      damage: 5,
      damageWidth: PLAYER_WIDTH,
      damageYOffset: PLAYER_HEIGHT * 0.6,
    });
  }

  shouldStop() {
    return this.currentStep >= this.totalSteps;
  }

  calculateNextStep() {
    this.currentStep += 1;
  }
}

export class Uppercut extends Attack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.UPPERCUT,
      stepDuration: 60,
      damage: 13,
      damageWidth: PLAYER_WIDTH * 0.8,
      damageHeight: PLAYER_HEIGHT * 1.2,
    });
  }

  start() {
    this.owner.height = PLAYER_HEIGHT;
    super.start();
  }
}

export class SquatLowKick extends Attack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.SQUAT_LOW_KICK,
      stepDuration: 70,
      nextMoveType: MOVE_TYPES.SQUAT,
      nextMoveStep: 2,
      damage: 4,
      damageWidth: PLAYER_WIDTH * 1.2,
    });
  }
}

export class SquatHighKick extends Attack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.SQUAT_HIGH_KICK,
      stepDuration: 70,
      nextMoveType: MOVE_TYPES.SQUAT,
      nextMoveStep: 2,
      damage: 6,
      damageWidth: PLAYER_WIDTH * 0.7,
      damageYOffset: PLAYER_HEIGHT * 0.4,
    });
  }
}

export class SquatLowPunch extends Attack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.SQUAT_LOW_PUNCH,
      stepDuration: 70,
      nextMoveType: MOVE_TYPES.SQUAT,
      nextMoveStep: 2,
      damage: 4,
      damageWidth: PLAYER_WIDTH * 0.6,
      damageYOffset: PLAYER_HEIGHT * 0.3,
    });
  }
}

export class SpinKick extends Attack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.SPIN_KICK,
      stepDuration: 60,
      damage: 13,
      damageWidth: PLAYER_WIDTH * 0.9,
      damageYOffset: PLAYER_HEIGHT * 0.6,
    });
    this.dontReturn = true;
  }

  shouldStop() {
    return this.currentStep >= this.totalSteps;
  }

  calculateNextStep() {
    this.currentStep += 1;
  }
}