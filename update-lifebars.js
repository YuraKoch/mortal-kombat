export function updateLifebars(fighter1, fighter2) {
  document.getElementById(`player1Life`).style.width = fighter1.life + '%';
  document.getElementById(`player2Life`).style.width = fighter2.life + '%';
}