import { MOVE_TYPES } from "./constants.js";

export function checkLifes(fighter1, fighter2) {
  checkFighterLife(fighter1, fighter2);
  checkFighterLife(fighter2, fighter1);
}

function checkFighterLife(fighter, opponent) {
  if (fighter.life === 0) {
    opponent.setMove(MOVE_TYPES.WIN);
    fighter.setMove(MOVE_TYPES.FALL);
  }
}