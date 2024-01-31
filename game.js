import { ARENA, ORIENTATIONS, MOVE_TYPES, IMAGE_COUNT_BY_MOVE_TYPE } from "./constants.js";
import { Fighter } from "./fighters.js";
import { draw } from "./draw.js";
import { ResourceManager } from "./resource-manager.js";
import { setMovements } from "./set-movements.js";
import { checkAttacks } from "./check-attacks.js";
import { updateLifebars } from "./update-lifebars.js";
import { checkLifes } from "./check-lifes.js";
import { setHoldMovements } from "./set-hold-movements.js";
import { recalculatePositions } from "./recalculate-positions.js";

export class Game {
  pressed = {};
  fighters = [];
  resourceManager = new ResourceManager();

  async init() {
    this.initCanvas();
    await this.initializeFighters();
    this.addHandlers();
    this.animate();
  }

  initCanvas() {
    const canvas = document.getElementById('canvas');
    canvas.width = ARENA.WIDTH;
    canvas.height = ARENA.HEIGHT;
    this.context = canvas.getContext('2d');
  }

  async initializeFighters() {
    this.fighters[0] = new Fighter('subzero', ORIENTATIONS.LEFT);
    this.fighters[1] = new Fighter('kano', ORIENTATIONS.RIGHT);
    await this.loadFighterImages();
  }

  async loadFighterImages() {
    const urls = [];
    for (let moveKey in MOVE_TYPES) {
      const moveType = MOVE_TYPES[moveKey];
      for (let i = 0; i < IMAGE_COUNT_BY_MOVE_TYPE[moveType]; i++) {
        urls.push(`./images/fighters/${this.fighters[0].name}/${ORIENTATIONS.LEFT}/${moveType}/${i}.png`);
        urls.push(`./images/fighters/${this.fighters[0].name}/${ORIENTATIONS.RIGHT}/${moveType}/${i}.png`);
        urls.push(`./images/fighters/${this.fighters[1].name}/${ORIENTATIONS.LEFT}/${moveType}/${i}.png`);
        urls.push(`./images/fighters/${this.fighters[1].name}/${ORIENTATIONS.RIGHT}/${moveType}/${i}.png`);
      }
    }

    await this.resourceManager.loadImages(urls);
  }

  addHandlers() {
    document.addEventListener('keydown', event => {
      if (!this.pressed[event.code]) {
        this.pressed[event.code] = true;
        setMovements(this.fighters[0], this.fighters[1], this.pressed);
      }
    });
    document.addEventListener('keyup', event => {
      delete this.pressed[event.code];
      setMovements(this.fighters[0], this.fighters[1], this.pressed);
    });
  }

  animate() {
    setHoldMovements(this.fighters[0], this.fighters[1], this.pressed);
    recalculatePositions(this.fighters[0], this.fighters[1]);
    checkAttacks(this.fighters[0], this.fighters[1]);
    updateLifebars(this.fighters[0], this.fighters[1]);
    checkLifes(this.fighters[0], this.fighters[1]);

    draw(this.fighters[0], this.fighters[1], this.context, this.resourceManager);

    requestAnimationFrame(() => this.animate());
  }
}