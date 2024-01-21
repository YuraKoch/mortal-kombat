import { MOVE_TYPES, KEYS } from "./constants.js";

export function setHoldMovements(fighter1, fighter2, pressed) {
  const fighter1NextMoveType = getHoldMoveFromCombination(KEYS[0], pressed);
  fighter1.setMove(fighter1NextMoveType);
  const fighter2NextMoveType = getHoldMoveFromCombination(KEYS[1], pressed);
  fighter2.setMove(fighter2NextMoveType);
}

function getHoldMoveFromCombination(keys, pressed) {
  if (pressed[keys.BLOCK]) return MOVE_TYPES.BLOCK;

  if (pressed[keys.LEFT] && pressed[keys.UP]) return MOVE_TYPES.BACKWARD_JUMP;
  if (pressed[keys.RIGHT] && pressed[keys.UP]) return MOVE_TYPES.FORWARD_JUMP;

  if (pressed[keys.LEFT]) return MOVE_TYPES.WALK_BACKWARD;
  if (pressed[keys.RIGHT]) return MOVE_TYPES.WALK;
  if (pressed[keys.DOWN]) return MOVE_TYPES.SQUAT;
  if (pressed[keys.UP]) return MOVE_TYPES.JUMP;

  return MOVE_TYPES.STAND;
}