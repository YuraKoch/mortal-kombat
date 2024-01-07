import { Game } from "./game.js";

async function startNewGame() {
  await new Game().init();
  document.querySelector('.loading').style.display = 'none';
}

startNewGame();