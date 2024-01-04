import { MOVE_TYPES, ORIENTATIONS } from "./constants.js";
import { Fighter } from "./fighters.js";

const ARENA = {
  WIDTH: 600,
  HEIGHT: 400
};

const FIGHTERS = ['subzero', 'kano'];

const KEYS = [
  {
    UP: 'KeyW',
    DOWN: 'KeyS',
    LEFT: 'KeyA',
    RIGHT: 'KeyD',
    BLOCK: 'ShiftLeft',
    HP: 'KeyR',
    HK: 'KeyT',
    LP: 'KeyF',
    LK: 'KeyG'
  },
  {
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    BLOCK: 'ShiftRight',
    HP: 'KeyI',
    HK: 'KeyO',
    LP: 'KeyK',
    LK: 'KeyL'
  }
];

export class Game {
  pressed = {};

  async init() {
    await this.initializeFighters();
    this.initCanvas()
    this.addHandlers();
  }

  async initializeFighters() {
    this.fighters = [];
    this.fighters[0] = new Fighter(FIGHTERS[0], ORIENTATIONS.LEFT);
    this.fighters[1] = new Fighter(FIGHTERS[1], ORIENTATIONS.RIGHT);
    await Promise.all([this.fighters[0].init(), this.fighters[1].init()]);
  }

  initCanvas() {
    const canvas = document.getElementById('canvas');
    canvas.width = ARENA.WIDTH;
    canvas.height = ARENA.HEIGHT;
    this.context = canvas.getContext('2d');
    this.refreshCanvas();
  }

  addHandlers() {
    document.addEventListener('keydown', event => {
      if (!this.pressed[event.code]) {
        this.pressed[event.code] = true;
        this.updateFightersMove();
      }
    });
    document.addEventListener('keyup', event => {
      delete this.pressed[event.code];
      this.updateFightersMove();
    });
  }

  refreshCanvas() {
    this.updateFightersHoldMove();
    this.synchronizeFighters();
    this.checkFightersAttack();
    this.checkFightersLife();

    this.context.clearRect(0, 0, ARENA.WIDTH, ARENA.HEIGHT);
    this.drawFighter(this.fighters[0]);
    this.drawFighter(this.fighters[1]);

    // for test
    // this.context.strokeStyle = 'green';
    // this.context.strokeRect(this.fighters[0].x - this.fighters[0].width / 2, this.fighters[0].y - this.fighters[0].height, this.fighters[0].width, this.fighters[0].height);
    // this.context.strokeRect(this.fighters[1].x - this.fighters[1].width / 2, this.fighters[1].y - this.fighters[1].height, this.fighters[1].width, this.fighters[1].height);
    // this.context.strokeStyle = 'red';
    // this.fighters[0].damage && this.context.strokeRect(this.fighters[0].currentMove.damageX - this.fighters[0].currentMove.damageWidth / 2, this.fighters[0].currentMove.damageY - this.fighters[0].currentMove.damageHeight, this.fighters[0].currentMove.damageWidth, this.fighters[0].currentMove.damageHeight);
    // this.fighters[1].damage && this.context.strokeRect(this.fighters[1].currentMove.damageX - this.fighters[1].currentMove.damageWidth / 2, this.fighters[1].currentMove.damageY - this.fighters[1].currentMove.damageHeight, this.fighters[1].currentMove.damageWidth, this.fighters[1].currentMove.damageHeight);

    requestAnimationFrame(() => this.refreshCanvas());
  }

  drawFighter(fighter) {
    const x = fighter.orientation === ORIENTATIONS.LEFT ?
      fighter.x - fighter.width / 2 :
      fighter.x - fighter.width / 2 + fighter.width - fighter.currentImg.width;
    const y = fighter.y - fighter.currentImg.height;
    this.context.drawImage(fighter.currentImg, x, y);
  }

  checkFightersAttack() {
    this.checkFighterAttack(this.fighters[0], this.fighters[1]);
    this.checkFighterAttack(this.fighters[1], this.fighters[0]);
  }

  checkFighterAttack(fighter, opponent) {
    if (fighter.damage > 0 && this.checkDistanceForAttack(fighter, opponent)) {
      opponent.endureAttack(fighter.damage, fighter.moveType);
      fighter.damage = 0;
      this.updateLifebars();
    }
  }

  checkDistanceForAttack(fighter, opponent) {
    const intersectX = Math.abs(opponent.x - fighter.currentMove.damageX) < (opponent.width + fighter.currentMove.damageWidth) / 2;
    const intersectY = Math.abs((opponent.y - opponent.height / 2) - (fighter.currentMove.damageY - fighter.currentMove.damageHeight / 2)) < (opponent.height + fighter.currentMove.damageHeight) / 2;
    return intersectX && intersectY;
  }

  updateLifebars() {
    document.getElementById(`player1Life`).style.width = this.fighters[0].life + '%';
    document.getElementById(`player2Life`).style.width = this.fighters[1].life + '%';
  }

  checkFightersLife() {
    this.checkFighterLife(this.fighters[0], this.fighters[1]);
    this.checkFighterLife(this.fighters[1], this.fighters[0]);
  }

  checkFighterLife(fighter, opponent) {
    if (fighter.life === 0 && fighter.moveType !== MOVE_TYPES.FALL) {
      opponent.currentMove.stop();
      opponent.setMove(MOVE_TYPES.WIN);
      fighter.unlock();
      fighter.setMove(MOVE_TYPES.FALL);
    }
  }

  synchronizeFighters() {
    this.synchronizeFighter(this.fighters[0], this.fighters[1]);
    this.synchronizeFighter(this.fighters[1], this.fighters[0]);
  }

  synchronizeFighter(fighter, opponent) {
    if (fighter.x <= fighter.width / 2) {
      fighter.x = fighter.width / 2;
      return;
    }

    if (fighter.x >= ARENA.WIDTH - fighter.width / 2) {
      fighter.x = ARENA.WIDTH - fighter.width / 2;
      return;
    }

    if (fighter.isJumping() && !opponent.isJumping() || opponent.isJumping() && !fighter.isJumping()) {
      this.setFightersOrientation();
      return;
    }

    const haveXCollision = Math.abs(opponent.x - fighter.x) < (opponent.width + fighter.width) / 2;
    if (!haveXCollision) return;

    if (!fighter.isMoving() && opponent.isMoving()) return;

    if (fighter.isMoving() && !opponent.isMoving() && fighter.orientation === ORIENTATIONS.LEFT) {
      fighter.x = opponent.x - (opponent.width + fighter.width) / 2;
      return;
    }

    if (fighter.isMoving() && !opponent.isMoving() && fighter.orientation === ORIENTATIONS.RIGHT) {
      fighter.x = opponent.x + (opponent.width + fighter.width) / 2;
      return;
    }

    const collisionWidth = (opponent.width + fighter.width) / 2 - Math.abs(opponent.x - fighter.x);
    if (fighter.orientation === ORIENTATIONS.LEFT) {
      fighter.x -= collisionWidth / 2;
      opponent.x += collisionWidth / 2;
      return;
    }

    if (fighter.orientation === ORIENTATIONS.LEFT) {
      fighter.x += collisionWidth / 2;
      opponent.x -= collisionWidth / 2;
      return;
    }
  }

  setFightersOrientation() {
    if (this.fighters[0].x < this.fighters[1].x) {
      this.fighters[0].orientation = ORIENTATIONS.LEFT;
      this.fighters[1].orientation = ORIENTATIONS.RIGHT;
    } else {
      this.fighters[0].orientation = ORIENTATIONS.RIGHT;
      this.fighters[1].orientation = ORIENTATIONS.LEFT;
    }
  }

  updateFightersMove() {
    this.fighters[0].setMove(this.getMoveFromCombination(0));
    this.fighters[1].setMove(this.getMoveFromCombination(1));
  }

  updateFightersHoldMove() {
    this.fighters[0].setMove(this.getHoldMoveFromCombination(0));
    this.fighters[1].setMove(this.getHoldMoveFromCombination(1));
  }

  getMoveFromCombination(playerIndex) {
    const fighter = this.fighters[playerIndex];
    const orientation = fighter.orientation;
    const keys = KEYS[playerIndex];
    const currentFighterMove = fighter.moveType;

    if (this.pressed[keys.HK] && currentFighterMove === MOVE_TYPES.FORWARD_JUMP) return MOVE_TYPES.FORWARD_JUMP_KICK;
    if (this.pressed[keys.HK] && currentFighterMove === MOVE_TYPES.BACKWARD_JUMP) return MOVE_TYPES.BACKWARD_JUMP_KICK;
    if (this.pressed[keys.LK] && currentFighterMove === MOVE_TYPES.FORWARD_JUMP) return MOVE_TYPES.FORWARD_JUMP_KICK;
    if (this.pressed[keys.LK] && currentFighterMove === MOVE_TYPES.BACKWARD_JUMP) return MOVE_TYPES.BACKWARD_JUMP_KICK;
    if (this.pressed[keys.HP] && currentFighterMove === MOVE_TYPES.FORWARD_JUMP) return MOVE_TYPES.FORWARD_JUMP_PUNCH;
    if (this.pressed[keys.HP] && currentFighterMove === MOVE_TYPES.BACKWARD_JUMP) return MOVE_TYPES.BACKWARD_JUMP_PUNCH;
    if (this.pressed[keys.LP] && currentFighterMove === MOVE_TYPES.FORWARD_JUMP) return MOVE_TYPES.FORWARD_JUMP_PUNCH;
    if (this.pressed[keys.LP] && currentFighterMove === MOVE_TYPES.BACKWARD_JUMP) return MOVE_TYPES.BACKWARD_JUMP_PUNCH;

    if (this.pressed[keys.BLOCK]) return MOVE_TYPES.BLOCK;

    if (this.pressed[keys.LEFT] && this.pressed[keys.UP]) return MOVE_TYPES.BACKWARD_JUMP;
    if (this.pressed[keys.LEFT] && this.pressed[keys.HK] && orientation === ORIENTATIONS.LEFT) return MOVE_TYPES.SPIN_KICK;

    if (this.pressed[keys.RIGHT] && this.pressed[keys.UP]) return MOVE_TYPES.FORWARD_JUMP;
    if (this.pressed[keys.RIGHT] && this.pressed[keys.HK] && orientation === ORIENTATIONS.RIGHT) return MOVE_TYPES.SPIN_KICK;

    if (this.pressed[keys.DOWN] && this.pressed[keys.HP]) return MOVE_TYPES.UPPERCUT;
    if (this.pressed[keys.DOWN] && this.pressed[keys.LP]) return MOVE_TYPES.SQUAT_LOW_PUNCH;
    if (this.pressed[keys.DOWN] && this.pressed[keys.HK]) return MOVE_TYPES.SQUAT_HIGH_KICK;
    if (this.pressed[keys.DOWN] && this.pressed[keys.LK]) return MOVE_TYPES.SQUAT_LOW_KICK;

    if (this.pressed[keys.HK]) return MOVE_TYPES.HIGH_KICK;
    if (this.pressed[keys.LK]) return MOVE_TYPES.LOW_KICK;
    if (this.pressed[keys.HP]) return MOVE_TYPES.HIGH_PUNCH;
    if (this.pressed[keys.LP]) return MOVE_TYPES.LOW_PUNCH;

    if (this.pressed[keys.LEFT]) return MOVE_TYPES.WALK_BACKWARD;
    if (this.pressed[keys.RIGHT]) return MOVE_TYPES.WALK;
    if (this.pressed[keys.DOWN]) return MOVE_TYPES.SQUAT;
    if (this.pressed[keys.UP]) return MOVE_TYPES.JUMP;

    if (currentFighterMove === MOVE_TYPES.SQUAT && !this.pressed[keys.DOWN]) return MOVE_TYPES.STAND_UP;
    if (currentFighterMove === MOVE_TYPES.BLOCK && !this.pressed[keys.BLOCK]) return MOVE_TYPES.STAND;

    return MOVE_TYPES.STAND;
  }

  getHoldMoveFromCombination(playerIndex) {
    const keys = KEYS[playerIndex];
    if (this.pressed[keys.BLOCK]) return MOVE_TYPES.BLOCK;

    if (this.pressed[keys.LEFT] && this.pressed[keys.UP]) return MOVE_TYPES.BACKWARD_JUMP;
    if (this.pressed[keys.RIGHT] && this.pressed[keys.UP]) return MOVE_TYPES.FORWARD_JUMP;

    if (this.pressed[keys.LEFT]) return MOVE_TYPES.WALK_BACKWARD;
    if (this.pressed[keys.RIGHT]) return MOVE_TYPES.WALK;
    if (this.pressed[keys.DOWN]) return MOVE_TYPES.SQUAT;
    if (this.pressed[keys.UP]) return MOVE_TYPES.JUMP;
    return MOVE_TYPES.STAND;
  }
}