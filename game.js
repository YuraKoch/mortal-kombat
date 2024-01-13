import { ARENA, ORIENTATIONS, MOVE_TYPES, IMAGE_COUNT_BY_MOVE_TYPE } from "./constants.js";
import { Fighter } from "./fighters.js";
import { ResourceManager } from "./resource-manager.js";
import { runFightersPositionAjustmentSystem } from "./systems/fighters-position-ajustment-system.js";
import { runFightersAttackSystem } from "./systems/fighters-attack-system.js";
import { runFightersLifeSystem } from "./systems/fighters-life-system.js";
import { runLifebarsSystem } from "./systems/lifebars-system.js";
import { runFightersMovementSystem } from "./systems/fighters-movement-system.js";
import { runFightersHoldMovementSystem } from "./systems/fighters-hold-movement-system.js";
import { runDrawSystem } from "./systems/draw-system.js";

export class Game {
  pressed = {};
  fighters = [];
  resourceManager = new ResourceManager();

  async init() {
    await this.initializeFighters();
    this.initCanvas();
    this.addHandlers();
    this.animate();
  }

  async initializeFighters() {
    this.fighters[0] = new Fighter('subzero', ORIENTATIONS.LEFT);
    this.fighters[1] = new Fighter('kano', ORIENTATIONS.RIGHT);
    await this.loadFighterImages();
    this.fighters[0].init();
    this.fighters[1].init();
  }

  async loadFighterImages() {
    const urls = [];
    for (let moveName in MOVE_TYPES) {
      const moveType = MOVE_TYPES[moveName];
      for (let i = 0; i < IMAGE_COUNT_BY_MOVE_TYPE[moveType]; i++) {
        urls.push(`./images/fighters/${this.fighters[0].name}/${ORIENTATIONS.LEFT}/${moveType}/${i}.png`);
        urls.push(`./images/fighters/${this.fighters[0].name}/${ORIENTATIONS.RIGHT}/${moveType}/${i}.png`);
        urls.push(`./images/fighters/${this.fighters[1].name}/${ORIENTATIONS.LEFT}/${moveType}/${i}.png`);
        urls.push(`./images/fighters/${this.fighters[1].name}/${ORIENTATIONS.RIGHT}/${moveType}/${i}.png`);
      }
    }

    await this.resourceManager.loadImages(urls);
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
    runFightersHoldMovementSystem(this.fighters[0], this.fighters[1], this.pressed);
    runFightersPositionAjustmentSystem(this.fighters[0], this.fighters[1]);
    runFightersAttackSystem(this.fighters[0], this.fighters[1]);
    runFightersLifeSystem(this.fighters[0], this.fighters[1]);
    runLifebarsSystem(this.fighters[0], this.fighters[1]);

    runDrawSystem(this.fighters[0], this.fighters[1], this.context, this.resourceManager);

    requestAnimationFrame(() => this.animate());
  }
}