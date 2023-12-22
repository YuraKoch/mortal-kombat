import { Move } from "./moves.js";
import { PLAYER_BOTTOM, MOVE_TYPES, ORIENTATIONS, PLAYER_HEIGHT, PLAYER_WIDTH } from "./constants.js";

class Attack extends Move {
  moveBack = false;

  constructor(options) {
    super(options);
    this.damage = options.damage;
    this.damageWidth = options.damageWidth ?? PLAYER_WIDTH;
    this.damageHeight = options.damageHeight ?? PLAYER_HEIGHT * 0.4;
    this.damageYOffset = options.damageYOffset ?? PLAYER_HEIGHT * 0.6;
  }

  start() {
    this.moveBack = false;
    this.setDamagePosition();
    super.start();
  }

  setDamagePosition() {
    if (this.owner.orientation === ORIENTATIONS.LEFT) {
      this.damageX = this.owner.x + PLAYER_WIDTH / 2 + this.damageWidth / 2;
    } else {
      this.damageX = this.owner.x - PLAYER_WIDTH / 2 - this.damageWidth / 2;
    }

    this.damageY = this.owner.y - this.damageYOffset;
  }

  action() {
    if (this.currentStep === Math.round(this.totalSteps / 2) && !this.moveBack) {
      this.owner.damage = this.damage;
    }
  }

  calculateNextStep() {
    if (this.moveBack && this.currentStep <= 0) {
      this.stop();
      this.owner.setMove(this.nextMoveType, this.nextMoveStep);
      return;
    }

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
      totalSteps: 7,
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
      totalSteps: 6,
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
      totalSteps: 5,
      stepDuration: 50,
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
      totalSteps: 5,
      stepDuration: 50,
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
      totalSteps: 5,
      stepDuration: 60,
      damage: 13,
      damageWidth: PLAYER_WIDTH * 0.8,
      damageHeight: PLAYER_HEIGHT * 1.2,
      damageYOffset: 0,
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
      totalSteps: 3,
      stepDuration: 70,
      nextMoveType: MOVE_TYPES.SQUAT,
      nextMoveStep: 2,
      damage: 4,
      damageWidth: PLAYER_WIDTH * 1.2,
      damageYOffset: 0,
    });
  }
}

export class SquatHighKick extends Attack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.SQUAT_HIGH_KICK,
      totalSteps: 4,
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
      totalSteps: 3,
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
      totalSteps: 8,
      stepDuration: 60,
      damage: 13,
      damageWidth: PLAYER_WIDTH * 0.9,
      damageYOffset: PLAYER_HEIGHT * 0.6,
    });
    this.dontReturn = true;
  }

  calculateNextStep() {
    this.currentStep += 1;
    if (this.currentStep === this.totalSteps) {
      this.stop();
      this.owner.setMove(this.nextMoveType);
    }
  }
}


export class ForwardJumpKick extends Attack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.FORWARD_JUMP_KICK,
      totalSteps: 3,
      stepDuration: 80,
      damage: 10,
      damageWidth: PLAYER_WIDTH,
      damageYOffset: 0,
    });
  }

  start(jumpCurrentStep, jumpTotalSteps, delta) {
    this.owner.height = PLAYER_HEIGHT / 2;
    this.delta = delta;
    this.jumpCurrentStep = jumpCurrentStep;
    this.jumpTotalSteps = jumpTotalSteps;
    super.start();
  }

  action() {
    super.action();

    if (this.jumpCurrentStep >= this.jumpTotalSteps / 2) {
      this.delta += 25;
    } else {
      this.delta -= 25;
    }

    if (this.owner.damage > 0) this.owner.x += 23;
    this.owner.y = PLAYER_BOTTOM - PLAYER_HEIGHT * 1.2 + this.owner.currentImg.height + this.delta;
    this.setDamagePosition();
  }

  calculateNextStep() {
    if (this.jumpCurrentStep >= this.jumpTotalSteps) {
      this.stop();
      this.owner.setMove(MOVE_TYPES.STAND);
      return;
    }
    this.currentStep += 1;
    this.jumpCurrentStep += 1;
  }
}

export class BackwardJumpKick extends Attack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.BACKWARD_JUMP_KICK,
      totalSteps: 3,
      stepDuration: 80,
      damage: 10,
      damageWidth: PLAYER_WIDTH,
      damageYOffset: 0,
    });
  }

  start(jumpCurrentStep, jumpTotalSteps, delta) {
    this.owner.height = PLAYER_HEIGHT / 2;
    this.delta = delta;
    this.jumpCurrentStep = jumpCurrentStep;
    this.jumpTotalSteps = jumpTotalSteps;
    super.start();
  }

  action() {
    super.action();

    if (this.jumpCurrentStep >= this.jumpTotalSteps / 2) {
      this.delta += 25;
    } else {
      this.delta -= 25;
    }

    if (this.owner.damage > 0) this.owner.x -= 23;
    this.owner.y = PLAYER_BOTTOM - PLAYER_HEIGHT * 1.2 + this.owner.currentImg.height + this.delta;
    this.setDamagePosition();
  }

  calculateNextStep() {
    if (this.jumpCurrentStep >= this.jumpTotalSteps) {
      this.stop();
      this.owner.setMove(MOVE_TYPES.STAND);
      return;
    }
    this.currentStep += 1;
    this.jumpCurrentStep += 1;
  }
}

export class ForwardJumpPunch extends Attack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.FORWARD_JUMP_PUNCH,
      totalSteps: 3,
      stepDuration: 80,
      damage: 8,
      damageWidth: PLAYER_WIDTH,
      damageYOffset: 0,
    });
  }

  start(jumpCurrentStep, jumpTotalSteps, delta) {
    this.owner.height = PLAYER_HEIGHT / 2;
    this.delta = delta;
    this.jumpCurrentStep = jumpCurrentStep;
    this.jumpTotalSteps = jumpTotalSteps;
    super.start();
  }

  action() {
    super.action();

    if (this.jumpCurrentStep >= this.jumpTotalSteps / 2) {
      this.delta += 25;
    } else {
      this.delta -= 25;
    }

    if (this.owner.damage > 0) this.owner.x += 23;
    this.owner.y = PLAYER_BOTTOM - PLAYER_HEIGHT * 1.2 + this.owner.currentImg.height + this.delta;
    this.setDamagePosition();
  }

  calculateNextStep() {
    if (this.jumpCurrentStep >= this.jumpTotalSteps) {
      this.stop();
      this.owner.setMove(MOVE_TYPES.STAND);
      return;
    }
    this.currentStep += 1;
    this.jumpCurrentStep += 1;
  }
}

export class BackwardJumpPunch extends Attack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.BACKWARD_JUMP_PUNCH,
      totalSteps: 3,
      stepDuration: 80,
      damage: 8,
      damageWidth: PLAYER_WIDTH,
      damageYOffset: 0,
    });
  }

  start(jumpCurrentStep, jumpTotalSteps, delta) {
    this.owner.height = PLAYER_HEIGHT / 2;
    this.delta = delta;
    this.jumpCurrentStep = jumpCurrentStep;
    this.jumpTotalSteps = jumpTotalSteps;
    super.start();
  }

  action() {
    super.action();

    if (this.jumpCurrentStep >= this.jumpTotalSteps / 2) {
      this.delta += 25;
    } else {
      this.delta -= 25;
    }

    if (this.owner.damage > 0) this.owner.x -= 23;
    this.owner.y = PLAYER_BOTTOM - PLAYER_HEIGHT * 1.2 + this.owner.currentImg.height + this.delta;
    this.setDamagePosition();
  }

  calculateNextStep() {
    if (this.jumpCurrentStep >= this.jumpTotalSteps) {
      this.stop();
      this.owner.setMove(MOVE_TYPES.STAND);
      return;
    }
    this.currentStep += 1;
    this.jumpCurrentStep += 1;
  }
}