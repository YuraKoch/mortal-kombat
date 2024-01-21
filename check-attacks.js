export function checkAttacks(fighter1, fighter2) {
  checkFighterAttack(fighter1, fighter2);
  checkFighterAttack(fighter2, fighter1);
}

function checkFighterAttack(fighter, opponent) {
  if (fighter.damage > 0 && checkDistanceForAttack(fighter, opponent)) {
    opponent.endureAttack(fighter.damage, fighter.moveType);
    fighter.damage = 0;
  }
}

function checkDistanceForAttack(fighter, opponent) {
  const intersectX = Math.abs(opponent.x - fighter.currentMove.damageX) < (opponent.width + fighter.currentMove.damageWidth) / 2;
  const opponentCentralY = opponent.y - opponent.height / 2;
  const fighterCentralDamageY = fighter.currentMove.damageY - fighter.currentMove.damageHeight / 2;
  const intersectY = Math.abs(opponentCentralY - fighterCentralDamageY) < (opponent.height + fighter.currentMove.damageHeight) / 2;
  return intersectX && intersectY;
}