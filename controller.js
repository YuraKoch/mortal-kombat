import { ARENA, MOVE_TYPES, ORIENTATIONS, KEYS } from "./constants.js";
import { Fighter } from "./fighters.js";
import { runFightersPositionAjustmentSystem } from "./systems/fighters-position-ajustment-system.js";
import { runFightersAttackSystem } from "./systems/fighters-attack-system.js";
import { runFightersLifeSystem } from "./systems/fighters-life-system.js";
import { runLifebarsSystem } from "./systems/lifebars-system.js";
import { runFightersMovementSystem } from "./systems/fighters-movement-system.js";

export class Game {
  pressed = {};

  async init() {
    await this.initializeFighters();
    this.initCanvas();
    this.addHandlers();
    this.animate();
  }

  async initializeFighters() {
    this.fighters = [];
    this.fighters[0] = new Fighter('subzero', ORIENTATIONS.LEFT);
    this.fighters[1] = new Fighter('kano', ORIENTATIONS.RIGHT);
    await Promise.all([this.fighters[0].init(), this.fighters[1].init()]);
  }

  initCanvas() {
    const canvas = document.getElementById('canvas');
    canvas.width = ARENA.WIDTH;
    canvas.height = ARENA.HEIGHT;
    this.context = canvas.getContext('2d');
  }

  addHandlers() {
    document.addEventListener('keydown', event => {
      if (!this.pressed[event.code]) {
        this.pressed[event.code] = true;
        runFightersMovementSystem(this.fighters[0], this.fighters[1], this.pressed);
      }
    });
    document.addEventListener('keyup', event => {
      delete this.pressed[event.code];
      runFightersMovementSystem(this.fighters[0], this.fighters[1], this.pressed);
    });
  }

  animate() {
    this.updateFightersHoldMove();
    runFightersPositionAjustmentSystem(this.fighters[0], this.fighters[1]);
    runFightersAttackSystem(this.fighters[0], this.fighters[1]);
    runFightersLifeSystem(this.fighters[0], this.fighters[1]);
    runLifebarsSystem(this.fighters[0], this.fighters[1]);

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

    requestAnimationFrame(() => this.animate());
  }

  drawFighter(fighter) {
    const x = fighter.orientation === ORIENTATIONS.LEFT ?
      fighter.x - fighter.width / 2 :
      fighter.x - fighter.width / 2 + fighter.width - fighter.currentImg.width;
    const y = fighter.y - fighter.currentImg.height;
    this.context.drawImage(fighter.currentImg, x, y);
  }

  updateFightersHoldMove() {
    this.fighters[0].setMove(this.getHoldMoveFromCombination(0));
    this.fighters[1].setMove(this.getHoldMoveFromCombination(1));
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