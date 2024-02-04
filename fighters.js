import { MOVE_TYPES, ORIENTATIONS, PLAYER_BOTTOM, PLAYER_HEIGHT, PLAYER_WIDTH } from "./constants.js";
import {
  Stand,
  Walk,
  WalkBackward,
  Squat,
  StandUp,
  Block,
  Endure,
  SquatEndure,
  KnockDown,
  AttractiveStandUp,
  Fall,
  Win,
} from "./moves.js";
import {
  Jump,
  ForwardJump,
  BackwardJump,
} from "./jump-moves.js";
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
} from "./attacks.js";
import {
  ForwardJumpKick,
  BackwardJumpKick,
  ForwardJumpPunch,
  BackwardJumpPunch,
} from "./jump-attacks.js";

const START_X_POSITION = {
  [ORIENTATIONS.LEFT]: 100,
  [ORIENTATIONS.RIGHT]: 500,
};
const BLOCK_DAMAGE = 0.2;

const INTERRUPTED_MOVE_TYPES = [MOVE_TYPES.STAND, MOVE_TYPES.WALK, MOVE_TYPES.WALK_BACKWARD, MOVE_TYPES.SQUAT, MOVE_TYPES.BLOCK];
const JUMP_ATTACK_MOVE_TYPES = [MOVE_TYPES.FORWARD_JUMP_KICK, MOVE_TYPES.BACKWARD_JUMP_KICK, MOVE_TYPES.FORWARD_JUMP_PUNCH, MOVE_TYPES.BACKWARD_JUMP_PUNCH];
const JUMP_MOVE_TYPES = [MOVE_TYPES.JUMP, MOVE_TYPES.BACKWARD_JUMP, MOVE_TYPES.FORWARD_JUMP];
const MOVING_MOVE_TYPES = [MOVE_TYPES.WALK, MOVE_TYPES.WALK_BACKWARD, MOVE_TYPES.BACKWARD_JUMP, MOVE_TYPES.FORWARD_JUMP, MOVE_TYPES.FORWARD_JUMP_KICK, MOVE_TYPES.BACKWARD_JUMP_KICK, MOVE_TYPES.FORWARD_JUMP_PUNCH, MOVE_TYPES.BACKWARD_JUMP_PUNCH];

export class Fighter {
  life = 100;
  width = PLAYER_WIDTH;
  height = PLAYER_HEIGHT;
  damage = 0;

  constructor(name, orientation) {
    this.name = name;
    this.orientation = orientation;
    this.x = START_X_POSITION[orientation]; // center of player
    this.y = PLAYER_BOTTOM;
    this.initMoves();
  }

  initMoves() {
    this.moves = {};
    this.moves[MOVE_TYPES.STAND] = new Stand(this);
    this.moves[MOVE_TYPES.WALK] = new Walk(this);
    this.moves[MOVE_TYPES.WALK_BACKWARD] = new WalkBackward(this);
    this.moves[MOVE_TYPES.SQUAT] = new Squat(this);
    this.moves[MOVE_TYPES.STAND_UP] = new StandUp(this);
    this.moves[MOVE_TYPES.BLOCK] = new Block(this);
    this.moves[MOVE_TYPES.JUMP] = new Jump(this);
    this.moves[MOVE_TYPES.FORWARD_JUMP] = new ForwardJump(this);
    this.moves[MOVE_TYPES.BACKWARD_JUMP] = new BackwardJump(this);
    this.moves[MOVE_TYPES.HIGH_KICK] = new HighKick(this);
    this.moves[MOVE_TYPES.LOW_KICK] = new LowKick(this);
    this.moves[MOVE_TYPES.HIGH_PUNCH] = new HighPunch(this);
    this.moves[MOVE_TYPES.LOW_PUNCH] = new LowPunch(this);
    this.moves[MOVE_TYPES.UPPERCUT] = new Uppercut(this);
    this.moves[MOVE_TYPES.SQUAT_LOW_KICK] = new SquatLowKick(this);
    this.moves[MOVE_TYPES.SQUAT_HIGH_KICK] = new SquatHighKick(this);
    this.moves[MOVE_TYPES.SQUAT_LOW_PUNCH] = new SquatLowPunch(this);
    this.moves[MOVE_TYPES.SPIN_KICK] = new SpinKick(this);
    this.moves[MOVE_TYPES.FORWARD_JUMP_KICK] = new ForwardJumpKick(this);
    this.moves[MOVE_TYPES.BACKWARD_JUMP_KICK] = new BackwardJumpKick(this);
    this.moves[MOVE_TYPES.FORWARD_JUMP_PUNCH] = new ForwardJumpPunch(this);
    this.moves[MOVE_TYPES.BACKWARD_JUMP_PUNCH] = new BackwardJumpPunch(this);
    this.moves[MOVE_TYPES.ENDURE] = new Endure(this);
    this.moves[MOVE_TYPES.SQUAT_ENDURE] = new SquatEndure(this);
    this.moves[MOVE_TYPES.KNOCK_DOWN] = new KnockDown(this);
    this.moves[MOVE_TYPES.ATTRACTIVE_STAND_UP] = new AttractiveStandUp(this);
    this.moves[MOVE_TYPES.FALL] = new Fall(this);
    this.moves[MOVE_TYPES.WIN] = new Win(this);

    this.currentMove = this.moves[MOVE_TYPES.STAND];
    this.currentMove.start();
  }

  isJumping() {
    return JUMP_MOVE_TYPES.includes(this.currentMove.type);
  }

  isJumpingAttack() {
    return JUMP_ATTACK_MOVE_TYPES.includes(this.currentMove.type);
  }

  isMoving() {
    return MOVING_MOVE_TYPES.includes(this.currentMove.type);
  }

  endureAttack(damage, attackType) {
    if (this.moveType === MOVE_TYPES.BLOCK) {
      damage *= BLOCK_DAMAGE;
    } else if (this.moveType === MOVE_TYPES.SQUAT) {
      this.setMove(MOVE_TYPES.SQUAT_ENDURE);
    } else if (attackType === MOVE_TYPES.UPPERCUT || attackType === MOVE_TYPES.SPIN_KICK) {
      this.setMove(MOVE_TYPES.KNOCK_DOWN);
    } else {
      this.setMove(MOVE_TYPES.ENDURE);
    }

    this.life = Math.max(this.life - damage, 0);
  }

  setMove(newMoveType, startStep = 0) {
    if (this.moveType === newMoveType) return;

    if (JUMP_ATTACK_MOVE_TYPES.includes(newMoveType)) {
      const jumpCurrentStep = this.currentMove.currentStep;
      const jumpTotalSteps = this.currentMove.totalSteps;
      const jumpY = this.y;
      this.currentMove.stop();
      this.currentMove = this.moves[newMoveType];
      this.y = jumpY;
      this.currentMove.start(jumpCurrentStep, jumpTotalSteps);
      return;
    }

    if (!INTERRUPTED_MOVE_TYPES.includes(this.moveType) && this.currentMove.isContinue) return;

    this.currentMove.stop();
    this.currentMove = this.moves[newMoveType];
    this.currentMove.start(startStep);
  }

  get moveType() {
    return this.currentMove.type;
  }
}