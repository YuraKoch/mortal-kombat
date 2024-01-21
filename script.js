import { Game } from "./game.js";

async function startNewGame() {
  const game = new Game();
  await game.init();
  document.querySelector('.loading').style.display = 'none';
}

startNewGame();