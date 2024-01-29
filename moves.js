import { PLAYER_BOTTOM, MOVE_TYPES, IMAGE_COUNT_BY_MOVE_TYPE, ORIENTATIONS, PLAYER_HEIGHT } from "./constants.js";

export class Move {
  constructor(options) {
    this.owner = options.owner;
    this.type = options.type;
    this.totalSteps = IMAGE_COUNT_BY_MOVE_TYPE[options.type];
    this.stepDuration = options.stepDuration ?? 80;
    this.nextMoveType = options.nextMoveType ?? MOVE_TYPES.STAND;
    this.nextMoveStep = options.nextMoveStep ?? 0;
  }

  start(startStep = 0) {
    this.isContinue = true;
    this.currentStep = startStep;
    this.action();
    this.interval = setInterval(() => this.step(), this.stepDuration);
  }

  step() {
    this.calculateNextStep();
    if (this.shouldStop()) {
      this.stop();
      this.owner.setMove(this.nextMoveType, this.nextMoveStep);
      return;
    }
    this.action();
  }

  shouldStop() {
    return this.currentStep >= this.totalSteps;
  }

  action() { }

  calculateNextStep() {
    this.currentStep += 1;
  }

  stop() {
    clearInterval(this.interval);
    this.isContinue = false;
    this.owner.y = PLAYER_BOTTOM;
  }
}

export class Stand extends Move {
  constructor(owner) {
    super({
      owner: owner,
      type: MOVE_TYPES.STAND,
    });
  }

  start() {
    this.owner.height = PLAYER_HEIGHT;
    super.start();
  }

  calculateNextStep() {
    super.calculateNextStep();
    this.currentStep = this.currentStep % this.totalSteps;
  }
}

const WALK_DELTA_X = 10;
export class Walk extends Move {
  constructor(owner) {
    super({
      owner: owner,
      type: MOVE_TYPES.WALK,
    });
  }

  action() {
    this.owner.x += WALK_DELTA_X;
  }

  calculateNextStep() {
    super.calculateNextStep();
    this.currentStep = this.currentStep % this.totalSteps;
  }
}

export class WalkBackward extends Move {
  constructor(owner) {
    super({
      owner: owner,
      type: MOVE_TYPES.WALK_BACKWARD,
    });
  }

  action() {
    this.owner.x -= WALK_DELTA_X;
  }

  calculateNextStep() {
    super.calculateNextStep();
    this.currentStep = this.currentStep % this.totalSteps;
  }
}

export class Squat extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.SQUAT,
      stepDuration: 40,
    });
  }

  start(step) {
    this.owner.height = PLAYER_HEIGHT / 2;
    super.start(step);
  }

  calculateNextStep() {
    super.calculateNextStep();
    if (this.currentStep >= this.totalSteps) {
      this.currentStep = this.totalSteps - 1;
    }
  }
}

export class StandUp extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.STAND_UP,
      stepDuration: 40,
    });
  }

  start() {
    this.owner.height = PLAYER_HEIGHT;
    super.start();
  }
}

export class Block extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.BLOCK,
      stepDuration: 40,
    });
  }

  start() {
    this.owner.height = PLAYER_HEIGHT;
    super.start();
  }

  calculateNextStep() {
    super.calculateNextStep();
    if (this.currentStep >= this.totalSteps) {
      this.currentStep = this.totalSteps - 1;
    }
  }
}

export class Endure extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.ENDURE,
    });
  }
}

export class SquatEndure extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.SQUAT_ENDURE,
      nextMoveType: MOVE_TYPES.SQUAT,
      nextMoveStep: 2,
    });
  }
}

const KNOCK_DOWN_DELTA_X = 15;
export class KnockDown extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.KNOCK_DOWN,
      nextMoveType: MOVE_TYPES.ATTRACTIVE_STAND_UP,
    });
  }

  action() {
    if (this.owner.orientation === ORIENTATIONS.LEFT) {
      this.owner.x -= KNOCK_DOWN_DELTA_X;
    } else {
      this.owner.x += KNOCK_DOWN_DELTA_X;
    }
  }
}

export class AttractiveStandUp extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.ATTRACTIVE_STAND_UP,
    });
  }

  start() {
    this.owner.height = PLAYER_HEIGHT;
    super.start();
  }
}

export class Fall extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.FALL,
    });
  }

  calculateNextStep() {
    super.calculateNextStep();
    if (this.currentStep >= this.totalSteps) {
      this.currentStep = this.totalSteps - 1;
    }
  }
}

export class Win extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.WIN,
    });
  }

  calculateNextStep() {
    super.calculateNextStep();
    if (this.currentStep >= this.totalSteps) {
      this.currentStep = this.totalSteps - 1;
    }
  }
}