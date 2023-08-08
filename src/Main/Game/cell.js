export default class Cell {
  constructor(){
    this.number = 0;
    this.isMine = false;
    this.isOpen = false;
    this.isFlag = false;
    this.cellElement = document.createElement('div');
    this.cellElement.className = 'game-cells__cell';
  }

  mined(){
    this.isMine = true;
  }

  open(){
    this.isOpen = true;
    this.cellElement.oncontextmenu = () => {event.preventDefault()};
    this.cellElement.onclick = () => {};

    if(this.isMine){
      this.cellElement.classList.add('game-cells__cell_mine');
    }else{
      this.cellElement.classList.add('game-cells__cell_open');
      if(this.number > 0){
        this.cellElement.textContent = this.number;
        switch(this.number){
          case 1: this.cellElement.classList.add('game-cells__cell_open-1');
          break;
          case 2: this.cellElement.classList.add('game-cells__cell_open-2');
          break;
          case 3: this.cellElement.classList.add('game-cells__cell_open-3');
          break;
          case 4: this.cellElement.classList.add('game-cells__cell_open-4');
          break;
          case 5: this.cellElement.classList.add('game-cells__cell_open-5');
          break;
          case 6: this.cellElement.classList.add('game-cells__cell_open-6');
          break;
          case 7: this.cellElement.classList.add('game-cells__cell_open-7');
          break;
          case 8: this.cellElement.classList.add('game-cells__cell_open-8');
          break;
        }
      }
    }
  }

  flag(){
    this.isFlag = !this.isFlag;
    if(this.isFlag){
      this.cellElement.classList.add('game-cells__cell_flag');
    }else{
      this.cellElement.classList.remove('game-cells__cell_flag');
    }
  }
}