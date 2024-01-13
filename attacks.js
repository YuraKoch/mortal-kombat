import { Move } from "./moves.js";
import { MOVE_TYPES, ORIENTATIONS, PLAYER_HEIGHT, PLAYER_WIDTH } from "./constants.js";

export class Attack extends Move {
  constructor(options) {
    super(options);
    this.damage = options.damage;
    this.stepDuration = options.stepDuration ?? 60;
    this.damageWidth = options.damageWidth ?? PLAYER_WIDTH;
    this.damageHeight = options.damageHeight ?? PLAYER_HEIGHT * 0.4;
    this.damageYOffset = options.damageYOffset ?? 0;
  }

  start() {
    this.updateDamageRectangle();
    super.start();
  }

  updateDamageRectangle() {
    if (this.owner.orientation === ORIENTATIONS.LEFT) {
      this.damageX = this.owner.x + PLAYER_WIDTH / 2 + this.damageWidth / 2;
    } else {
      this.damageX = this.owner.x - PLAYER_WIDTH / 2 - this.damageWidth / 2;
    }

    this.damageY = this.owner.y - this.damageYOffset;
  }

  action() {
    if (this.currentStep === Math.floor(this.totalSteps / 2)) {
      this.owner.damage = this.damage;
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
      damage: 8,
      damageWidth: PLAYER_WIDTH * 0.8,
      damageYOffset: PLAYER_HEIGHT * 0.7,
    });
  }
}

export class LowPunch extends Attack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.LOW_PUNCH,
      damage: 5,
      damageWidth: PLAYER_WIDTH,
      damageYOffset: PLAYER_HEIGHT * 0.6,
    });
  }
}

export class Uppercut extends Attack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.UPPERCUT,
      nextMoveType: MOVE_TYPES.SQUAT,
      nextMoveStep: 2,
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
      damage: 13,
      damageWidth: PLAYER_WIDTH * 0.9,
      damageYOffset: PLAYER_HEIGHT * 0.6,
    });
  }
}