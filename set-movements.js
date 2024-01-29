import { MOVE_TYPES, ORIENTATIONS, KEYS } from "./constants.js";

export function setMovements(fighter1, fighter2, pressed) {
  const fighter1NextMoveType = getMoveFromCombination(fighter1, KEYS[0], pressed);
  fighter1.setMove(fighter1NextMoveType);
  const fighter2NextMoveType = getMoveFromCombination(fighter2, KEYS[1], pressed);
  fighter2.setMove(fighter2NextMoveType);
}

function getMoveFromCombination(fighter, keys, pressed) {
  if (pressed[keys.HK] && fighter.moveType === MOVE_TYPES.FORWARD_JUMP) return MOVE_TYPES.FORWARD_JUMP_KICK;
  if (pressed[keys.LK] && fighter.moveType === MOVE_TYPES.FORWARD_JUMP) return MOVE_TYPES.FORWARD_JUMP_KICK;
  if (pressed[keys.HK] && fighter.moveType === MOVE_TYPES.BACKWARD_JUMP) return MOVE_TYPES.BACKWARD_JUMP_KICK;
  if (pressed[keys.LK] && fighter.moveType === MOVE_TYPES.BACKWARD_JUMP) return MOVE_TYPES.BACKWARD_JUMP_KICK;
  if (pressed[keys.HP] && fighter.moveType === MOVE_TYPES.FORWARD_JUMP) return MOVE_TYPES.FORWARD_JUMP_PUNCH;
  if (pressed[keys.LP] && fighter.moveType === MOVE_TYPES.FORWARD_JUMP) return MOVE_TYPES.FORWARD_JUMP_PUNCH;
  if (pressed[keys.HP] && fighter.moveType === MOVE_TYPES.BACKWARD_JUMP) return MOVE_TYPES.BACKWARD_JUMP_PUNCH;
  if (pressed[keys.LP] && fighter.moveType === MOVE_TYPES.BACKWARD_JUMP) return MOVE_TYPES.BACKWARD_JUMP_PUNCH;

  if (pressed[keys.LEFT] && pressed[keys.UP]) return MOVE_TYPES.BACKWARD_JUMP;
  if (pressed[keys.RIGHT] && pressed[keys.UP]) return MOVE_TYPES.FORWARD_JUMP;

  if (pressed[keys.LEFT] && pressed[keys.HK] && fighter.orientation === ORIENTATIONS.LEFT) return MOVE_TYPES.SPIN_KICK;
  if (pressed[keys.RIGHT] && pressed[keys.HK] && fighter.orientation === ORIENTATIONS.RIGHT) return MOVE_TYPES.SPIN_KICK;

  if (pressed[keys.DOWN] && pressed[keys.HP]) return MOVE_TYPES.UPPERCUT;
  if (pressed[keys.DOWN] && pressed[keys.LP]) return MOVE_TYPES.SQUAT_LOW_PUNCH;
  if (pressed[keys.DOWN] && pressed[keys.HK]) return MOVE_TYPES.SQUAT_HIGH_KICK;
  if (pressed[keys.DOWN] && pressed[keys.LK]) return MOVE_TYPES.SQUAT_LOW_KICK;

  if (pressed[keys.HK]) return MOVE_TYPES.HIGH_KICK;
  if (pressed[keys.LK]) return MOVE_TYPES.LOW_KICK;
  if (pressed[keys.HP]) return MOVE_TYPES.HIGH_PUNCH;
  if (pressed[keys.LP]) return MOVE_TYPES.LOW_PUNCH;

  if (pressed[keys.BLOCK]) return MOVE_TYPES.BLOCK;

  if (pressed[keys.LEFT]) return MOVE_TYPES.WALK_BACKWARD;
  if (pressed[keys.RIGHT]) return MOVE_TYPES.WALK;
  if (pressed[keys.DOWN]) return MOVE_TYPES.SQUAT;
  if (pressed[keys.UP]) return MOVE_TYPES.JUMP;

  if (fighter.moveType === MOVE_TYPES.SQUAT && !pressed[keys.DOWN]) return MOVE_TYPES.STAND_UP;

  return MOVE_TYPES.STAND;
}