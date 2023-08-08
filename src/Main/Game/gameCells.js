import game from ".";
import Cell from "./cell";

export default class GameCells{
  constructor(rows, cols, numMines){
    this.rows = rows;
    this.cols = cols;
    this.numMines = numMines;
    this.numNotMines = this.rows * this.cols - this.numMines;
    this.numClicks = 0;
    this.sec = 0;
    this.grid = [];
    this.isState = false;
    this.result = ''; 
  }

  renderGame(){
    for (let row = 0; row < this.rows; row++){
      const rowCells = [];
      for(let col = 0; col < this.cols; col++){
        const cell = new Cell();
        rowCells.push(cell);
      }
      this.grid.push(rowCells);
    }
    
    this.gridElement = document.createElement('div');
    this.gridElement.className = 'game-cells';
    
    for (let row = 0; row < this.rows; row++){
      const rowElement = document.createElement('div');
      rowElement.className = "row";
      for(let col = 0; col < this.cols; col++){
        const cellElement = this.grid[row][col].cellElement;

        cellElement.onclick = () => this.cellClick(row, col);
        cellElement.oncontextmenu = () => this.cellRightClick(row, col);

        rowElement.appendChild(cellElement);
      }
      this.gridElement.appendChild(rowElement);
    }

    window.addEventListener('beforeunload', () => {
      this.saveGameState();
    });
  }

  saveGameState(){
    const gameState = {
      rows: this.rows,
      cols: this.cols,
      numMines: this.numMines,
      numNotMines: this.numNotMines,
      numClicks: this.numClicks,
      sec: this.sec,
      isState: true,
      grid: this.grid.map(row => row.map(cell => ({
        number: cell.number,
        isMine: cell.isMine,
        isOpen: cell.isOpen,
        isFlag: cell.isFlag,
      })))
    };
    localStorage.setItem('gameCells', JSON.stringify(gameState));
  }

  loadGameState(gameState){
    this.rows = gameState.rows;
    this.cols = gameState.cols;
    this.numMines = gameState.numMines;
    this.numNotMines = gameState.numNotMines;
    this.numClicks = gameState.numClicks;
    this.sec = gameState.sec;
    this.isState = gameState.isState;
    this.grid = gameState.grid.map(row => row.map(cellState => {
      const cell = new Cell();
      cell.number = cellState.number;
      cell.isMine = cellState.isMine;
      cell.isOpen = cellState.isOpen;
      cell.isFlag = cellState.isFlag;
      return cell;
    }));

    let numMines = this.numMines;
    this.gridElement = document.createElement('div');
    this.gridElement.className = 'game-cells';

    setTimeout(() => {
      document.querySelector('.game__clicks').textContent = `Clicks: ${this.numClicks}`;
      document.querySelector('.game__time').textContent = `Time: ${this.sec}`;
      document.querySelector('.game__mines').value = this.numMines;
      document.querySelectorAll('.game__radio').forEach(el => {
        if(el.value == this.rows){
          el.checked = true;
        }
      });
      
      
    },100);
    
    for (let row = 0; row < this.rows; row++){
      const rowElement = document.createElement('div');
      rowElement.className = "row";
      for(let col = 0; col < this.cols; col++){
        
        const cellElement = this.grid[row][col].cellElement;
        cellElement.onclick = () => this.cellClick(row, col);
        cellElement.oncontextmenu = () => this.cellRightClick(row, col);

        if(this.grid[row][col].isOpen){
          this.grid[row][col].open();
          if(this.grid[row][col].isMine){
            numMines--;
          }
        }
        if(this.grid[row][col].isFlag){
          this.grid[row][col].flag();
          this.grid[row][col].flag();
        }

        this.grid[row][col].flag();
        this.grid[row][col].flag();

        rowElement.appendChild(cellElement);
      }
      this.gridElement.appendChild(rowElement);
    }

    if(this.numNotMines === 0 || numMines === 0){
      for (let row = 0; row < this.rows; row++){
        for(let col = 0; col < this.cols; col++){
          this.grid[row][col].cellElement.onclick = () => {};
          this.grid[row][col].cellElement.oncontextmenu = () => event.preventDefault();
        }
      }
    }

    window.addEventListener('beforeunload', () => {
      this.saveGameState();
    });
  }

  createMines(curentRow, curentCol){
    let numMinesPlaced = 0;
    while (numMinesPlaced < this.numMines){
      const row = Math.floor(Math.random() * this.rows);
      const col = Math.floor(Math.random() * this.cols);
      if (!this.grid[row][col].isMine && !(row == curentRow && col == curentCol)){
        this.grid[row][col].mined();

        this.getCellNum(row-1, col-1);
        this.getCellNum(row-1, col);
        this.getCellNum(row-1, col+1);
        this.getCellNum(row, col-1);
        this.getCellNum(row, col+1);
        this.getCellNum(row+1, col-1);
        this.getCellNum(row+1, col);
        this.getCellNum(row+1, col+1);

        numMinesPlaced++;
      }
    }
    for (let row = 0; row < this.rows; row++){
      for(let col = 0; col < this.cols; col++){
        if(this.grid[row][col].isMine){
          this.grid[row][col].number = 0;
        }
      }
    }
  }

  getCellNum(row, col, isClick){
    if(row >= 0 && row < this.rows && col >= 0 && col < this.cols){
      if(!isClick){
        this.grid[row][col].number++;
      }else{
        return this.grid[row][col]
      }
    }
  }

  cellClick(row, col){
    if(this.numClicks === 0 && !this.isState){
      this.createMines(row, col);
      this.timer = setInterval(() => {
        this.sec++;
        document.querySelector('.game__time').textContent = `Time: ${this.sec}`;
      },1000);
    }else if(this.isState && !this.timer){
      this.timer = setInterval(() => {
        this.sec++;
        document.querySelector('.game__time').textContent = `Time: ${this.sec}`;
      },1000);
    }

    const cell =this.grid[row][col];
    cell.open();
    this.numNotMines--;

    if(!cell.isMine){
      const audio = document.getElementById('click');
      audio.volume = 0.1;
      audio.play();

      if(cell.number === 0){
        this.showNeighborCell(row, col);
      }
    }else if(cell.isMine){
      const audio = document.getElementById('lose');
      audio.volume = 0.1;
      audio.play();

      for (let row = 0; row < this.rows; row++){
        for(let col = 0; col < this.cols; col++){
          if(this.grid[row][col].isMine){
            this.grid[row][col].open();
          }
          this.grid[row][col].cellElement.onclick = () => {};
          this.grid[row][col].cellElement.oncontextmenu = () => event.preventDefault();
        }
      }

      this.results = `Lose - clicks: ${this.numClicks} - time: ${this.sec}s.`;
      const resultsElement = document.querySelectorAll('.game__results-item');
      for(let i = 9; i >= 0; i--){
        if(i == 0){
          resultsElement[i].textContent = this.results;
          break;
        }
        if(resultsElement[i-1].textContent){
          resultsElement[i].textContent = resultsElement[i-1].textContent;
        }
      }

      clearInterval(this.timer);
      setTimeout(() => {
        alert('You lose');
      },100);
    }

    this.numClicks++;
    document.querySelector('.game__clicks').textContent = `Clicks: ${this.numClicks}`;

    if(this.numNotMines === 0){
      for (let row = 0; row < this.rows; row++){
        for(let col = 0; col < this.cols; col++){
          this.grid[row][col].cellElement.onclick = () => {};
          this.grid[row][col].cellElement.oncontextmenu = () => event.preventDefault();
          if(this.grid[row][col].isMine){
            this.grid[row][col].open();
          }
        }
      }
      
      this.results = `Win - clicks: ${this.numClicks} - time: ${this.sec}s.`;
      const resultsElement = document.querySelectorAll('.game__results-item');
      for(let i = 9; i >= 0; i--){
        if(i == 0){
          resultsElement[i].textContent = this.results;
          break;
        }
        if(resultsElement[i-1].textContent){
          resultsElement[i].textContent = resultsElement[i-1].textContent;
        }
      }

      const audio = document.getElementById('win');
      audio.volume = 0.1;
      audio.play();

      clearInterval(this.timer);
      setTimeout(() => {
        alert('You WIN!');
      },100);
    }
  }

  showNeighborCell(row, col){
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if(newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols && this.grid[newRow][newCol].isOpen === false){
          this.grid[newRow][newCol].open();
          this.numNotMines--;
          if(this.grid[newRow][newCol].number === 0){
            this.showNeighborCell(newRow, newCol);
          }
        }
      }
    }
  }

  cellRightClick(row, col){
    event.preventDefault();
    const audio = document.getElementById('flag');
    audio.volume = 0.1;
    audio.play();

    if(this.numClicks > 0 || this.numNotMines > 0){
      const cell = this.grid[row][col];
      cell.flag();
      if(cell.isFlag){
        cell.cellElement.onclick = () => {};
      }else{
        cell.cellElement.onclick = () => this.cellClick(row, col)
      }
    }
  }

}