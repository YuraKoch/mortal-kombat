import { ARENA, ORIENTATIONS } from "./constants.js";

export function recalculatePositions(fighter1, fighter2) {
  recalculateFighterPosition(fighter1, fighter2);
  recalculateFighterPosition(fighter2, fighter1);
}

function recalculateFighterPosition(fighter, opponent) {
  if (fighter.x <= fighter.width / 2) {
    fighter.x = fighter.width / 2;
    return;
  }

  if (fighter.x >= ARENA.WIDTH - fighter.width / 2) {
    fighter.x = ARENA.WIDTH - fighter.width / 2;
    return;
  }

  if (!fighter.isJumping() && !fighter.isJumpingAttack()) {
    setFighterOrientation(fighter, opponent);
  }

  if (!fighter.isJumping() && opponent.isJumping() || fighter.isJumping() && !opponent.isJumping()) {
    return;
  }

  if (!fighter.isMoving()) return;

  const haveXCollision = Math.abs(opponent.x - fighter.x) < (opponent.width + fighter.width) / 2;
  const opponentCentralY = opponent.y - opponent.height / 2;
  const fighterCentralY = fighter.y - fighter.height / 2;
  const haveYCollision = Math.abs(opponentCentralY - fighterCentralY) < (opponent.height + fighter.height) / 2;
  if (!haveXCollision || !haveYCollision) return;

  if (!opponent.isMoving()) {
    fighter.x = fighter.orientation === ORIENTATIONS.LEFT ?
      opponent.x - (opponent.width + fighter.width) / 2 :
      opponent.x + (opponent.width + fighter.width) / 2;
    return;
  }

  const collisionWidth = (opponent.width + fighter.width) / 2 - Math.abs(opponent.x - fighter.x);
  if (fighter.orientation === ORIENTATIONS.LEFT) {
    fighter.x -= collisionWidth / 2;
    opponent.x += collisionWidth / 2;
  } else {
    fighter.x += collisionWidth / 2;
    opponent.x -= collisionWidth / 2;
  }
}

function setFighterOrientation(fighter, opponent) {
  if (fighter.x < opponent.x) {
    fighter.orientation = ORIENTATIONS.LEFT;
  } else {
    fighter.orientation = ORIENTATIONS.RIGHT;
  }
}