import { Attack } from "./attacks.js";
import { PLAYER_BOTTOM, MOVE_TYPES, PLAYER_HEIGHT, PLAYER_WIDTH } from "./constants.js";

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

  action(offsetX, offsetY = 0) {
    super.action();

    if (this.jumpCurrentStep === 0) {
      this.owner.y = PLAYER_BOTTOM - PLAYER_HEIGHT * 0.9 + 25;
    } else if (this.jumpCurrentStep === 1) {
      this.owner.y = PLAYER_BOTTOM - PLAYER_HEIGHT * 0.9;
    } else if (this.jumpCurrentStep < this.jumpTotalSteps / 2) {
      this.owner.y -= 25;
    } else {
      this.owner.y += 25;
    }

    if (this.currentStep === 0) {
      this.owner.y += offsetY;
    }

    this.owner.x += offsetX;
    this.updateDamageRectangleXY();
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
      damage: 10,
      damageWidth: PLAYER_WIDTH,
      damageYOffset: 0,
    });
  }

  action() {
    super.action(23, PLAYER_HEIGHT * 0.1);
  }
}

export class BackwardJumpKick extends JumpAttack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.BACKWARD_JUMP_KICK,
      damage: 10,
      damageWidth: PLAYER_WIDTH,
      damageYOffset: 0,
    });
  }

  action() {
    super.action(-23, PLAYER_HEIGHT * 0.1);
  }
}

export class ForwardJumpPunch extends JumpAttack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.FORWARD_JUMP_PUNCH,
      damage: 8,
      damageWidth: PLAYER_WIDTH,
      damageYOffset: 0,
    });
  }

  action() {
    super.action(23, PLAYER_HEIGHT * 0.25);
  }
}

export class BackwardJumpPunch extends JumpAttack {
  constructor(owner) {
    super({
      owner,
      type: MOVE_TYPES.BACKWARD_JUMP_PUNCH,
      damage: 8,
      damageWidth: PLAYER_WIDTH,
      damageYOffset: 0,
    });
  }

  action() {
    super.action(-23, PLAYER_HEIGHT * 0.25);
  }
}