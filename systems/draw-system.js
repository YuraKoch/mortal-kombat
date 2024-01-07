import { ARENA, ORIENTATIONS } from "../constants.js";

export function useDrawSystem(fighter1, fighter2, context) {
  context.clearRect(0, 0, ARENA.WIDTH, ARENA.HEIGHT);
  drawFighter(fighter1, context);
  drawFighter(fighter2, context);

  // for test
  // context.strokeStyle = 'green';
  // context.strokeRect(fighter1.x - fighter1.width / 2, fighter1.y - fighter1.height, fighter1.width, fighter1.height);
  // context.strokeRect(fighter2.x - fighter2.width / 2, fighter2.y - fighter2.height, fighter2.width, fighter2.height);
  // context.strokeStyle = 'red';
  // fighter1.damage && context.strokeRect(
  //   fighter1.currentMove.damageX - fighter1.currentMove.damageWidth / 2,
  //   fighter1.currentMove.damageY - fighter1.currentMove.damageHeight,
  //   fighter1.currentMove.damageWidth,
  //   fighter1.currentMove.damageHeight
  // );
  // fighter2.damage && context.strokeRect(
  //   fighter2.currentMove.damageX - fighter2.currentMove.damageWidth / 2,
  //   fighter2.currentMove.damageY - fighter2.currentMove.damageHeight,
  //   fighter2.currentMove.damageWidth,
  //   fighter2.currentMove.damageHeight
  // );
}

function drawFighter(fighter, context) {
  const x = fighter.orientation === ORIENTATIONS.LEFT ?
    fighter.x - fighter.width / 2 :
    fighter.x - fighter.width / 2 + fighter.width - fighter.currentImg.width;
  const y = fighter.y - fighter.currentImg.height;
  context.drawImage(fighter.currentImg, x, y);
}