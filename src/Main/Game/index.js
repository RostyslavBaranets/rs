import Game from './index.html';
import './index.scss';
import htmlToElement from '../../utils/htmlToElement';
import GameCells from './gameCells';

const game = htmlToElement(Game);

let gameCells = new GameCells(10, 10, 10);
const savedGameState = localStorage.getItem('gameCells');
if(savedGameState){
  gameCells.loadGameState(JSON.parse(savedGameState));
}else{
  gameCells.renderGame();
} 

game.append(gameCells.gridElement);

game.querySelector('.game__mines').addEventListener('keydown', () => {
  event.preventDefault();
});

game.querySelector('.game__new').addEventListener('click', () => {
  game.querySelector('.game__clicks').textContent = 'Clicks: 0';
  game.querySelector('.game__time').textContent = 'Time: 0';
  game.removeChild(gameCells.gridElement);
  const rowXCol = game.querySelector('input[name="radio"]:checked').value;
  const numMines = game.querySelector('.game__mines').value
  clearInterval(gameCells.timer);
  gameCells = new GameCells(rowXCol, rowXCol, numMines);
  gameCells.renderGame();
  game.append(gameCells.gridElement);
})


game.querySelector('.game__audio').addEventListener('click', audio);

function audio(){
  const audio = game.querySelectorAll('audio');
  const audioEnable = game.querySelector('.game__audio_cross');
  if(audioEnable.style.display == 'none'){
    audioEnable.style.display = 'block';
    audio.forEach(a => a.muted = true);
  }else{
    audioEnable.style.display = 'none';
    audio.forEach(a => a.muted = false);
  }
}

window.addEventListener('beforeunload', () => {
  saveResults();
});

const savedGameResults = localStorage.getItem('results');
if(savedGameResults){
  loadResults(JSON.parse(savedGameResults));
}

function saveResults(){
  const gameResults = [];
  const resultsElement = game.querySelectorAll('.game__results-item');
  for(let i = 0; i < 10; i++){
    gameResults.push(resultsElement[i].textContent);
  }
  const save = {
    gameResults,
    audio: game.querySelector('.game__audio_cross').style.display,
    theme: game.querySelector('.game__theme').textContent,
  }
  console.log(save)
  localStorage.setItem('results', JSON.stringify(save));
}

function loadResults(save){
  console.log(save);
  const resultsElement = game.querySelectorAll('.game__results-item');
  for(let i = 0; i < 10; i++){
    resultsElement[i].textContent = save.gameResults[i]; 
  }

  const audio = game.querySelectorAll('audio');
  const audioEnable = game.querySelector('.game__audio_cross');
  if(save.audio == 'none'){
    audio.forEach(a => a.muted = false);
    audioEnable.style.display = 'none';
  }else{
    audio.forEach(a => a.muted = true);
    audioEnable.style.display = 'block';
  }

}

console.log(document.querySelector('.game__theme'))
;

export default game;