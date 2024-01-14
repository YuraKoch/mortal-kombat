import { Attack } from "./attacks.js";
import { PLAYER_BOTTOM, MOVE_TYPES, PLAYER_HEIGHT } from "./constants.js";

const DELTA_X = 23;
const DELTA_Y = 25;

class JumpAttack extends Attack {
  start(jumpCurrentStep, jumpTotalSteps) {
    this.owner.height = PLAYER_HEIGHT / 2;
    this.jumpCurrentStep = jumpCurrentStep;
    this.jumpTotalSteps = jumpTotalSteps;
    super.start();
  }

  shouldStop() {
    return this.jumpCurrentStep >= this.jumpTotalSteps;
  }

  action(deltaX, additionalOffsetY = 0) {
    super.action();

    if (this.jumpCurrentStep === 0) {
      this.owner.y = PLAYER_BOTTOM - PLAYER_HEIGHT * 0.9;
    } else if (this.jumpCurrentStep < this.jumpTotalSteps / 2) {
      this.owner.y -= DELTA_Y;
    } else {
      this.owner.y += DELTA_Y;
    }

    if (this.currentStep === 0) {
      this.owner.y += additionalOffsetY;
    }

    this.owner.x += deltaX;
    this.updateDamageRectangle();
  }

  calculateNextStep() {
    this.currentStep += 1;
    if (this.currentStep >= this.totalSteps) {
      this.currentStep = this.totalSteps - 1;
    }
    this.jumpCurrentStep += 1;
  }
}

export class ForwardJumpKick extends JumpAttack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.FORWARD_JUMP_KICK,
      stepDuration: 80,
      damage: 10,
    });
  }

  action() {
    const additionalOffsetY = PLAYER_HEIGHT * 0.1;
    super.action(DELTA_X, additionalOffsetY);
  }
}

export class BackwardJumpKick extends JumpAttack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.BACKWARD_JUMP_KICK,
      stepDuration: 80,
      damage: 10,
    });
  }

  action() {
    const additionalOffsetY = PLAYER_HEIGHT * 0.1;
    super.action(-1 * DELTA_X, additionalOffsetY);
  }
}

export class ForwardJumpPunch extends JumpAttack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.FORWARD_JUMP_PUNCH,
      stepDuration: 80,
      damage: 8,
    });
  }

  action() {
    const additionalOffsetY = PLAYER_HEIGHT * 0.25;
    super.action(DELTA_X, additionalOffsetY);
  }
}

export class BackwardJumpPunch extends JumpAttack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.BACKWARD_JUMP_PUNCH,
      stepDuration: 80,
      damage: 8,
    });
  }

  action() {
    const additionalOffsetY = PLAYER_HEIGHT * 0.25;
    super.action(-1 * DELTA_X, additionalOffsetY);
  }
}