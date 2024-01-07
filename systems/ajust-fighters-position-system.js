import { ARENA, ORIENTATIONS } from "../constants.js";

export function adjustFightersPosition(fighter1, fighter2) {
  adjustFighterPosition(fighter1, fighter2);
  adjustFighterPosition(fighter2, fighter1);
}

function adjustFighterPosition(fighter, opponent) {
  if (fighter.x <= fighter.width / 2) {
    fighter.x = fighter.width / 2;
    return;
  }

  if (fighter.x >= ARENA.WIDTH - fighter.width / 2) {
    fighter.x = ARENA.WIDTH - fighter.width / 2;
    return;
  }

  if (fighter.isJumping() && !opponent.isJumping() || opponent.isJumping() && !fighter.isJumping()) {
    setFightersOrientation(fighter, opponent);
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

function setFightersOrientation(fighter, opponent) {
  if (fighter.x < opponent.x) {
    fighter.orientation = ORIENTATIONS.LEFT;
    opponent.orientation = ORIENTATIONS.RIGHT;
  } else {
    fighter.orientation = ORIENTATIONS.RIGHT;
    opponent.orientation = ORIENTATIONS.LEFT;
  }
}