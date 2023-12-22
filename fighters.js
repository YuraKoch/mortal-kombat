import { ARENA, MOVE_TYPES, ORIENTATIONS, PLAYER_BOTTOM, PLAYER_HEIGHT, PLAYER_WIDTH } from "./constants.js";
import {
  Stand,
  Walk,
  WalkBack,
  Fall,
  Win,
  Squat,
  Block,
  StandUp,
  AttractiveStandUp,
  Endure,
  KnockDown,
  SquatEndure,
  Jump,
  ForwardJump,
  BackwardJump,
} from "./moves.js";
import {
  HighKick,
  LowKick,
  LowPunch,
  HighPunch,
  Uppercut,
  SquatLowKick,
  SquatHighKick,
  SquatLowPunch,
  SpinKick,
  ForwardJumpKick,
  BackwardJumpKick,
  ForwardJumpPunch,
  BackwardJumpPunch,
} from "./attacks.js";

const START_X_POSITION = {
  [ORIENTATIONS.LEFT]: 100,
  [ORIENTATIONS.RIGHT]: 500,
}
const BLOCK_DAMAGE = 0.2;

export class Fighter {
  currentImg;
  currentMove;
  life = 100;
  width = PLAYER_WIDTH;
  height = PLAYER_HEIGHT;
  locked = false;
  damage = 0;

  constructor(name, orientation) {
    this.name = name;
    this.orientation = orientation;
    this.x = START_X_POSITION[orientation]; // center of player
    this.y = PLAYER_BOTTOM; // bottom s
  }

  async init() {
    this.moves = {};
    this.moves[MOVE_TYPES.STAND] = new Stand(this);
    this.moves[MOVE_TYPES.WALK] = new Walk(this);
    this.moves[MOVE_TYPES.WALK_BACKWARD] = new WalkBack(this);
    this.moves[MOVE_TYPES.SQUAT] = new Squat(this);
    this.moves[MOVE_TYPES.BLOCK] = new Block(this);
    this.moves[MOVE_TYPES.STAND_UP] = new StandUp(this);
    this.moves[MOVE_TYPES.ATTRACTIVE_STAND_UP] = new AttractiveStandUp(this);
    this.moves[MOVE_TYPES.HIGH_KICK] = new HighKick(this);
    this.moves[MOVE_TYPES.LOW_KICK] = new LowKick(this);
    this.moves[MOVE_TYPES.HIGH_PUNCH] = new HighPunch(this);
    this.moves[MOVE_TYPES.LOW_PUNCH] = new LowPunch(this);
    this.moves[MOVE_TYPES.UPPERCUT] = new Uppercut(this);
    this.moves[MOVE_TYPES.SQUAT_LOW_KICK] = new SquatLowKick(this);
    this.moves[MOVE_TYPES.SQUAT_HIGH_KICK] = new SquatHighKick(this);
    this.moves[MOVE_TYPES.SQUAT_LOW_PUNCH] = new SquatLowPunch(this);
    this.moves[MOVE_TYPES.SPIN_KICK] = new SpinKick(this);
    this.moves[MOVE_TYPES.FALL] = new Fall(this);
    this.moves[MOVE_TYPES.KNOCK_DOWN] = new KnockDown(this);
    this.moves[MOVE_TYPES.WIN] = new Win(this);
    this.moves[MOVE_TYPES.JUMP] = new Jump(this);
    this.moves[MOVE_TYPES.FORWARD_JUMP_KICK] = new ForwardJumpKick(this);
    this.moves[MOVE_TYPES.BACKWARD_JUMP_KICK] = new BackwardJumpKick(this);
    this.moves[MOVE_TYPES.FORWARD_JUMP_PUNCH] = new ForwardJumpPunch(this);
    this.moves[MOVE_TYPES.BACKWARD_JUMP_PUNCH] = new BackwardJumpPunch(this);
    this.moves[MOVE_TYPES.ENDURE] = new Endure(this);
    this.moves[MOVE_TYPES.SQUAT_ENDURE] = new SquatEndure(this);
    this.moves[MOVE_TYPES.FORWARD_JUMP] = new ForwardJump(this);
    this.moves[MOVE_TYPES.BACKWARD_JUMP] = new BackwardJump(this);

    for (const move of Object.values(this.moves)) {
      await move.init();
    }

    this.setMove(MOVE_TYPES.STAND);
  }

  isJumping() {
    return [
      MOVE_TYPES.JUMP,
      MOVE_TYPES.BACKWARD_JUMP,
      MOVE_TYPES.FORWARD_JUMP,
    ].includes(this.currentMove.type);
  }

  isMoving() {
    if (!this.currentMove) return false;
    return [
      MOVE_TYPES.WALK,
      MOVE_TYPES.WALK_BACKWARD,
      MOVE_TYPES.BACKWARD_JUMP,
      MOVE_TYPES.FORWARD_JUMP,
      MOVE_TYPES.FORWARD_JUMP_KICK,
      MOVE_TYPES.BACKWARD_JUMP_KICK,
      MOVE_TYPES.FORWARD_JUMP_PUNCH,
      MOVE_TYPES.BACKWARD_JUMP_PUNCH,
    ].includes(this.currentMove.type);
  }

  lock() {
    this.locked = true;
  }

  unlock() {
    this.locked = false;
  }

  endureAttack(damage, attackType) {
    if (this.getMoveType() === MOVE_TYPES.BLOCK) {
      damage *= BLOCK_DAMAGE;
    } else if (this.getMoveType() === MOVE_TYPES.SQUAT) {
      this.unlock();
      this.setMove(MOVE_TYPES.SQUAT_ENDURE);
    } else if (attackType === MOVE_TYPES.UPPERCUT || attackType === MOVE_TYPES.SPIN_KICK) {
      this.unlock();
      this.setMove(MOVE_TYPES.KNOCK_DOWN);
    } else {
      this.unlock();
      this.setMove(MOVE_TYPES.ENDURE);
    }

    this.life = Math.max(this.life - damage, 0);
  }

  getBottom() {
    const bottomY = this.currentImg.height + this.y;
    return ARENA.HEIGHT - bottomY;
  }

  setMove(moveType, step = 0) {
    if (!(moveType in this.moves)) return;
    if (this.currentMove?.type === moveType) return;

    if ([MOVE_TYPES.FORWARD_JUMP_KICK, MOVE_TYPES.BACKWARD_JUMP_KICK, MOVE_TYPES.FORWARD_JUMP_PUNCH, MOVE_TYPES.BACKWARD_JUMP_PUNCH].includes(moveType)) {
      const jumpCurrentStep = this.currentMove.currentStep;
      const jumpTotalSteps = this.currentMove.totalSteps;
      const delta = this.currentMove.delta;
      this.currentMove.stop();
      this.currentMove = this.moves[moveType];
      this.currentMove.start(jumpCurrentStep, jumpTotalSteps, delta);
      return;
    }

    if (this.locked) {
      return;
    }

    this.currentMove?.stop();
    this.currentMove = this.moves[moveType];
    this.currentMove.start(step);
  }

  getMoveType() {
    return this.currentMove.type;
  }
}
