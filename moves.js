import { PLAYER_BOTTOM, MOVE_TYPES, IMAGE_COUNT_BY_MOVE_TYPE, ORIENTATIONS, PLAYER_HEIGHT } from "./constants.js";

export class Move {
  currentStep = 0;
  isContinue = false;
  interval;
  totalSteps;

  constructor(options) {
    this.owner = options.owner;
    this.type = options.type;
    this.totalSteps = IMAGE_COUNT_BY_MOVE_TYPE[options.type];
    this.stepDuration = options.stepDuration ?? 80;
    this.nextMoveType = options.nextMoveType ?? MOVE_TYPES.STAND;
    this.nextMoveStep = options.nextMoveStep ?? 0;
  }

  start(step = 0) {
    this.isContinue = true;
    this.currentStep = step;
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
    this.owner.y = PLAYER_BOTTOM;
    super.start();
  }

  calculateNextStep() {
    this.currentStep += 1;
    this.currentStep = this.currentStep % this.totalSteps;
  }
}

export class Walk extends Move {
  constructor(owner) {
    super({
      owner: owner,
      type: MOVE_TYPES.WALK,
    });
  }

  start() {
    super.start();
  }

  action() {
    this.owner.x += 10;
  }

  calculateNextStep() {
    this.currentStep += 1;
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

  start() {
    super.start();
  }

  action() {
    this.owner.x -= 10;
  }

  calculateNextStep() {
    this.currentStep += 1;
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
    this.currentStep += 1;
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

  start(step) {
    super.start(step);
  }

  calculateNextStep() {
    this.currentStep += 1;
    if (this.currentStep >= this.totalSteps) {
      this.currentStep = this.totalSteps - 1;
    }
  }
}

export class Jump extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.JUMP,
    });
  }

  start() {
    this.owner.height = PLAYER_HEIGHT / 2;
    super.start();
  }

  action() {
    if (this.currentStep === 0) {
      return;
    }
    if (this.currentStep === 1) {
      this.owner.y = PLAYER_BOTTOM - PLAYER_HEIGHT * 0.9;
    } else if (this.currentStep < this.totalSteps / 2) {
      this.owner.y -= 25;
    } else {
      this.owner.y += 25;
    }
  }
}

export class ForwardJump extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.FORWARD_JUMP,
    });
  }

  start() {
    this.owner.height = PLAYER_HEIGHT / 2;
    super.start();
  }

  action() {
    if (this.currentStep === 0) {
      return;
    }
    if (this.currentStep === 1) {
      this.owner.y = PLAYER_BOTTOM - PLAYER_HEIGHT * 0.9;
    } else if (this.currentStep < this.totalSteps / 2) {
      this.owner.y -= 25;
    } else {
      this.owner.y += 25;
    }

    this.owner.x += 23;
  }
}

export class BackwardJump extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.BACKWARD_JUMP,
    });
  }

  start() {
    this.owner.height = PLAYER_HEIGHT / 2;
    super.start();
  }

  action() {
    if (this.currentStep === 0) {
      return;
    }
    if (this.currentStep === 1) {
      this.owner.y = PLAYER_BOTTOM - PLAYER_HEIGHT * 0.9;
    } else if (this.currentStep < this.totalSteps / 2) {
      this.owner.y -= 25;
    } else {
      this.owner.y += 25;
    }

    this.owner.x -= 23;
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
      this.owner.x -= 15;
    } else {
      this.owner.x += 15;
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
}

export class Win extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.WIN,
    });
  }
}