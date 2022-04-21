let body = document.getElementsByTagName('body');

let table = document.createElement('table');

let currentPiece;

document.body.appendChild(table);

const WHITE_PLAYER = 'gold';
const BLACK_PLAYER = 'black';
const PAWN = 'pawn';
const ROOK = 'rook';
const KNIGHT = 'knight';
const BISHOP = 'bishop';
const KING = 'king';
const QUEEN = 'queen';

const EVENTS = [];  

class Piece {
  constructor(row, col, type, player) {
    this.row = row;
    this.col = col;
    this.player = player;
    this.type = type;
  }

  getPossibleMoves() {

    let relativeMoves;

    if (this.type === PAWN) {
      relativeMoves = this.getPawnRelativeMoves();
    } else if (this.type === ROOK) {
      relativeMoves = this.getRookRelativeMoves();
    } else if (this.type === KNIGHT) {
      relativeMoves = this.getKnightRelativeMoves();
    } else if (this.type === BISHOP) {
      relativeMoves = this.getBishopRelativeMoves();
    } else if (this.type === KING) {
      relativeMoves = this.getKingRelativeMoves();
    } else if (this.type === QUEEN) {
      relativeMoves = this.getQueenRelativeMoves();
    } else {
      console.log("Unknown type", type)
    }



    let absoluteMoves = [];
    for (let relativeMove of relativeMoves) {
      const absoluteRow = this.row + relativeMove[0];
      const absoluteCol = this.col + relativeMove[1];
      absoluteMoves.push([absoluteRow, absoluteCol]);
    }


    // On trial 

    let filteredMoves = [];
    for (let absoluteMove of absoluteMoves) {
      const absoluteRow = absoluteMove[0];
      const absoluteCol = absoluteMove[1];
      if (absoluteRow >= 0 && absoluteRow <= 7 && absoluteCol >= 0 && absoluteCol <= 7) {
       filteredMoves.push(absoluteMove);
      } 
    } 

    console.log(filteredMoves);
     
    // End trial

    return filteredMoves;

  }

  getPawnRelativeMoves() {
    if (this.player === WHITE_PLAYER) {
      return [[1, 0]];
    } else if (this.player === BLACK_PLAYER) {
      return [[-1, 0]]
    }
  }

  getRookRelativeMoves() {
    let result = [];
    for (let i = 1; i < 8; i++) {
      result.push([i, 0]);
      result.push([-i, 0]);
      result.push([0, i]);
      result.push([0, -i]);
    }
 
    console.log(result); 
    return result;
  }
  getKnightRelativeMoves() {
    let result = [];
    for (let i = 1; i < 8; i++) {
      result.push([1, -2]);
      result.push([2, -1]);
      result.push([1, 2]);
      result.push([2, 1]);
      result.push([-1, -2]);
      result.push([-2, -1]);
      result.push([-1, 2]);
      result.push([-2, 1]);
    }

    return result;
  }
  getBishopRelativeMoves() {
    let result = [];
    for (let i = 1; i < 8; i++) {
      result.push([i, i]);
      result.push([-i, -i]);
      result.push([-i, i]);
      result.push([i, -i]);

    }

    return result;
  }

  getKingRelativeMoves() {
    let result = [];
    for (let i = 1; i < 8; i++) {
      result.push([1, 0]);
      result.push([-1, 0]);
      result.push([0, 1]);
      result.push([0, -1]);
      result.push([1, 1]);
      result.push([-1, -1]);
      result.push([1, -1]);
      result.push([-1, 1]);
    }

    return result;
  }
  getQueenRelativeMoves() {
    let result = [];
    for (let i = 1; i < 8; i++) {
      result.push([i, 0], [-i, 0], [0, i], [0, -i]);
      result.push([i, i], [-i, -i], [i, -i], [-i, i]);
    }

    return result;
  }

}; 

class BoardData {
  constructor(pieces) {
    this.pieces = pieces;

  }


  getPiece(row, col) {

    let piece = undefined;

    for (let i = 0; i < 32; i++) {

      if (this.pieces[i].row === row && this.pieces[i].col === col) {
        piece = this.pieces[i]
      }
    }

    return piece;
  }

  movePiece(event, row, col){

    EVENTS.push(event);
    EVENTS[clicks].eventNumber = clicks; 
    console.log(EVENTS);
    
    
    if(currentPiece === undefined){
  
      currentPiece = boardData.getPiece(row, col);     
  
    };
  
    if(currentPiece !== undefined){
  
      if(!(event.currentTarget.innerHTML) && event.path[0].classList.contains('movement')){ 
  
        pieceClicks++;
        currentPiece.row = row;
        currentPiece.col = col;
        addImage(table.rows[currentPiece.row].cells[currentPiece.col], currentPiece.type, currentPiece.player);
  
          if(EVENTS[clicks-1].path.length === 8){  
  
            EVENTS[clicks-1].path[1].innerHTML = '';
  
          }else if(EVENTS[clicks-1].path.length === 7){
            
            EVENTS[clicks-1].path[0].innerHTML = ''; 
  
          };
      }; 
      
    }; 
  
    clicks++;
  
    if(pieceClicks > 0){    
      pieceClicks = 0;
      currentPiece = undefined;
    };
  
  };
    

};  


function getInitialBoard() {
  let result = [];

  const addPieces = (row, pawnRow, player) => {
    result.push(new Piece(row, 0, "rook", player));
    result.push(new Piece(row, 7, "rook", player));
    result.push(new Piece(row, 1, "knight", player));
    result.push(new Piece(row, 6, "knight", player));
    result.push(new Piece(row, 2, "bishop", player));
    result.push(new Piece(row, 5, "bishop", player));
    result.push(new Piece(row, 3, "king", player));
    result.push(new Piece(row, 4, "queen", player));
    for (let i = 0; i < 8; i++) {
      result.push(new Piece(pawnRow, i, "pawn", player))
    };
  };
  addPieces(0, 1, WHITE_PLAYER);
  addPieces(7, 6, BLACK_PLAYER);

 
  console.log(result); 

  return result;
}

const removeEmptyFromPieces = () => {

  for (let i = 0; i < 8; i++) {

    for (let j = 0; j < 8; j++) {

      if(table.rows[i].cells[j].innerHTML.includes('img')){

        table.rows[i].cells[j].classList.remove('empty'); 

      } 
    }
  }

}; 




const boardData = new BoardData(getInitialBoard());
 


const addImage = (cell, type, player) => {
  image = document.createElement('img');
  image.src = `./img/${player}_${type}.png`;
  image.classList.add(`${player}Pawns`);
  cell.appendChild(image);
};



//        ***
//   The Click Event :
//        ***



let selectedCell; 

let clicks = 0;  
let pieceClicks = 0; 

const selectCell = (event, row, col) => {
  
  boardData.movePiece(event, row, col);

  for (let i = 0; i < 8; i++) {

    for (let j = 0; j < 8; j++) {
      table.rows[i].cells[j].classList.remove('movement');
    }
  }

  
  for (let piece of boardData.pieces) {

    if (piece.row === row && piece.col === col) {

      let possibleMoves = piece.getPossibleMoves();
      for (let possibleMove of possibleMoves) {

        const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];
        cell.classList.add('movement');
        
      }
    } 
  }

    
  
  if (selectedCell !== undefined) {
    selectedCell.classList.remove('select');

  };
 
  selectedCell = event.currentTarget;
  selectedCell.classList.add('select');
};


let rows = document.getElementsByTagName('tr');

for (let i = 0; i < 8; i++) {
  table.appendChild(document.createElement('tr')).id = 'row_' + i
};


const createChessGame = () => {
  for (let row = 0; row < 8; row++) {
    rows[row]

    for (let col = 0; col < 8; col++) {
      let cell = rows[col].appendChild(document.createElement('td'))
      cell.id = 'row-' + (row) + '_col-' + (col)
      cell.classList.add('empty')
      
      cell.addEventListener('click', (event) => selectCell(event, col, row)) 
      
    }

  }
  for (let piece of boardData.pieces) { 
    addImage(table.rows[piece.row].cells[piece.col], piece.type, piece.player);
  }
  
 
  removeEmptyFromPieces(); 
  

   
 
};

createChessGame();

//TODO: add ; where necessary 




