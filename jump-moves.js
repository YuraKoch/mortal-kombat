import { Move } from "./moves.js";
import { PLAYER_BOTTOM, MOVE_TYPES, PLAYER_HEIGHT } from "./constants.js";

class JumpMove extends Move {
  constructor(options) {
    super(options);
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

export class Jump extends JumpMove {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.JUMP,
    });
  }
}

export class ForwardJump extends JumpMove {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.FORWARD_JUMP,
    });
  }

  action() {
    super.action();
    this.owner.x += 23;
  }
}

export class BackwardJump extends JumpMove {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.BACKWARD_JUMP,
    });
  }

  action() {
    super.action();
    this.owner.x -= 23;
  }
}