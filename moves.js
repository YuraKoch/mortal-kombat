import { PLAYER_BOTTOM, MOVE_TYPES, ORIENTATIONS, PLAYER_HEIGHT } from "./constants.js";

export class Move {
  imagesBySteps = {
    [ORIENTATIONS.LEFT]: [],
    [ORIENTATIONS.RIGHT]: [],
  };
  currentStep = 0;
  interval;
  totalSteps;

  constructor(options) {
    this.owner = options.owner;
    this.type = options.type;
    this.totalSteps = options.totalSteps;
    this.stepDuration = options.stepDuration || 80;
    this.nextMoveType = options.nextMoveType || MOVE_TYPES.STAND;
    this.nextMoveStep = options.nextMoveStep || 0;
  }

  async init() {
    const imagePromises = [];
    for (let i = 0; i < this.totalSteps; i++) {
      [ORIENTATIONS.LEFT, ORIENTATIONS.RIGHT].forEach(orientation => {
        const img = new Image();
        img.src = `./images/fighters/${this.owner.name}/${orientation}/${this.type}/${i}.png`;
        this.imagesBySteps[orientation].push(img);
        imagePromises.push(new Promise(resolve => img.onload = resolve));
      });
    }
    await Promise.all(imagePromises);
  }

  start(step = 0) {
    this.owner.lock();
    this.currentStep = step;
    this.step();
    this.interval = setInterval(() => this.step(), this.stepDuration);
  }

  step() {
    const step = this.currentStep < this.totalSteps ? this.currentStep : this.totalSteps - 1;
    this.owner.currentImg = this.imagesBySteps[this.owner.orientation][step];
    this.action();
    this.calculateNextStep();
  }

  action() { }

  calculateNextStep() {
    if (this.currentStep >= this.totalSteps) {
      this.stop();
      this.owner.setMove(this.nextMoveType, this.nextMoveStep);
      return;
    }
    this.currentStep += 1;
  }

  stop() {
    clearInterval(this.interval);
    this.owner.unlock();
    this.owner.y = PLAYER_BOTTOM;
  }
}

export class Stand extends Move {
  constructor(owner) {
    super({
      owner: owner,
      type: MOVE_TYPES.STAND,
      totalSteps: 9,
    });
  }

  start() {
    this.owner.height = PLAYER_HEIGHT;
    this.owner.y = PLAYER_BOTTOM;
    super.start();
    this.owner.unlock();
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
      totalSteps: 9,
    });
  }

  start() {
    super.start();
    this.owner.unlock();
  }

  action() {
    this.owner.x += 10;
  }

  calculateNextStep() {
    this.currentStep += 1;
    this.currentStep = this.currentStep % this.totalSteps;
  }
}

export class WalkBack extends Move {
  constructor(owner) {
    super({
      owner: owner,
      type: MOVE_TYPES.WALK_BACKWARD,
      totalSteps: 9,
    });
  }

  start() {
    super.start();
    this.owner.unlock();
  }

  action() {
    this.owner.x -= 10;
  }

  calculateNextStep() {
    this.currentStep += 1;
    this.currentStep = this.currentStep % this.totalSteps;
  }
}

export class Fall extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.FALL,
      totalSteps: 7,
      stepDuration: 100,
      nextMoveType: MOVE_TYPES.FALL,
    });
  }

  start() {
    this.ownerX = this.owner.x;
    super.start();
  }

  action() {
    const delta = this.owner.width - this.owner.currentImg.width;
    this.owner.x = this.owner.orientation === ORIENTATIONS.LEFT ? this.ownerX + delta : this.ownerX - delta;
  }

  stop() {
    super.stop();
    this.owner.lock();
  }
}

export class Win extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.WIN,
      totalSteps: 10,
      stepDuration: 100,
      nextMoveType: MOVE_TYPES.WIN,
    });
  }

  start() {
    this.ownerX = this.owner.x;
    super.start();
  }

  action() {
    const delta = this.owner.width / 2 - this.owner.currentImg.width / 2;
    this.owner.x = this.owner.orientation === ORIENTATIONS.LEFT ? this.ownerX + delta : this.ownerX - delta;
  }

  stop() {
    super.stop();
    this.owner.lock();
  }
}

export class Squat extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.SQUAT,
      totalSteps: 3,
      stepDuration: 40,
    });
  }

  start(step) {
    this.owner.height = PLAYER_HEIGHT / 2;
    super.start(step);
    this.owner.unlock();
  }

  calculateNextStep() {
    this.currentStep += 1;
  }
}

export class StandUp extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.STAND_UP,
      totalSteps: 3,
      stepDuration: 80,
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
      totalSteps: 3,
      stepDuration: 40,
    });
  }

  start(step) {
    super.start(step);
    this.owner.unlock();
  }

  calculateNextStep() {
    this.currentStep += 1;
  }
}

export class AttractiveStandUp extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.ATTRACTIVE_STAND_UP,
      totalSteps: 4,
      stepDuration: 100,
    });
  }

  start() {
    this.owner.height = PLAYER_HEIGHT;
    super.start();
  }
}

export class Endure extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.ENDURE,
      totalSteps: 3,
    });
  }
}

export class KnockDown extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.KNOCK_DOWN,
      totalSteps: 10,
      nextMoveType: MOVE_TYPES.ATTRACTIVE_STAND_UP,
    });
  }

  action() {
    if (this.owner.orientation === ORIENTATIONS.LEFT) {
      this.owner.x -= 20;
    } else {
      this.owner.x += 20;
    }
  }
}

export class SquatEndure extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.SQUAT_ENDURE,
      totalSteps: 3,
      nextMoveType: MOVE_TYPES.SQUAT,
      nextMoveStep: 2,
    });
  }
}

export class Jump extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.JUMP,
      totalSteps: 8,
    });
  }

  start() {
    this.owner.height = PLAYER_HEIGHT / 2;
    this.delta = 0;
    super.start();
  }

  action() {
    if (this.currentStep === 0) {
      return;
    }

    if (this.currentStep >= this.totalSteps / 2) {
      this.delta += 25;
    } else {
      this.delta -= 25;
    }

    this.owner.y = PLAYER_BOTTOM - PLAYER_HEIGHT * 1.2 + this.owner.currentImg.height + this.delta;
  }
}

export class ForwardJump extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.FORWARD_JUMP,
      totalSteps: 8,
    });
  }

  start() {
    this.owner.height = PLAYER_HEIGHT / 2;
    this.delta = 0;
    super.start();
  }

  action() {
    if (this.currentStep === 0) {
      return;
    }

    if (this.currentStep >= this.totalSteps / 2) {
      this.delta += 25;
    } else {
      this.delta -= 25;
    }

    this.owner.x += 23;
    this.owner.y = PLAYER_BOTTOM - PLAYER_HEIGHT * 1.2 + this.owner.currentImg.height + this.delta;
  }
}

export class BackwardJump extends Move {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.BACKWARD_JUMP,
      totalSteps: 8,
    });
  }

  start() {
    this.owner.height = PLAYER_HEIGHT / 2;
    this.delta = 0;
    super.start();
  }

  action() {
    if (this.currentStep === 0) {
      return;
    }

    if (this.currentStep >= this.totalSteps / 2) {
      this.delta += 25;
    } else {
      this.delta -= 25;
    }

    this.owner.x -= 23;
    this.owner.y = PLAYER_BOTTOM - PLAYER_HEIGHT * 1.2 + this.owner.currentImg.height + this.delta;
  }
}