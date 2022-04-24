let body = document.getElementsByTagName('body');

let table = document.createElement('table');

let currentPiece = undefined; 

document.body.appendChild(table);

let boardData;
let selectedCell; 

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

  getOpponent() {
    if (this.player === WHITE_PLAYER) {
      return BLACK_PLAYER;
    }
    return WHITE_PLAYER;
  }

  getPossibleMoves(boardData) {

    let moves; 

    if (this.type === PAWN) {
      moves = this.getPawnMoves(boardData);
    } else if (this.type === ROOK) {
      moves = this.getRookMoves(boardData);
    } else if (this.type === KNIGHT) {
      moves = this.getKnightMoves(boardData); 
    } else if (this.type === BISHOP) {
      moves = this.getBishopMoves(boardData);
    } else if (this.type === KING) {
      moves = this.getKingMoves(boardData);
    } else if (this.type === QUEEN) {
      moves = this.getQueenMoves(boardData);  
    } else {
      console.log("Unknown type", type) 
    }

   

    let filteredMoves = [];
    for (let absoluteMove of moves) {
      const absoluteRow = absoluteMove[0];
      const absoluteCol = absoluteMove[1];
      if (absoluteRow >= 0 && absoluteRow <= 7 && absoluteCol >= 0 && absoluteCol <= 7) {
       filteredMoves.push(absoluteMove);
      } 
    } 

    console.log(filteredMoves);
    return filteredMoves;

  }

  getPawnMoves(boardData) {
    let result = [];
    let direction = 1;
    if (this.player === BLACK_PLAYER) {
      direction = -1;
    }

    let position = [this.row + direction, this.col];
    if (boardData.isEmpty(position[0], position[1])) {
      result.push(position);
    }

    position = [this.row + direction, this.col + direction];
    if (boardData.isPlayer(position[0], position[1], this.getOpponent())) {
      result.push(position);
    }

    position = [this.row + direction, this.col - direction];
    if (boardData.isPlayer(position[0], position[1], this.getOpponent())) {
      result.push(position);
    }


    return result;
  }

  getRookMoves(boardData) {
    let result = [];
    result = result.concat(this.getMovesInDirection(-1, 0, boardData));
    result = result.concat(this.getMovesInDirection(1, 0, boardData));
    result = result.concat(this.getMovesInDirection(0, -1, boardData));
    result = result.concat(this.getMovesInDirection(0, 1, boardData));
    return result;
  }

  getMovesInDirection(directionRow, directionCol, boardData) {
    let result = [];

    for (let i = 1; i < 8; i++) {
      let row = this.row + directionRow * i;
      let col = this.col + directionCol * i;
      if (boardData.isEmpty(row, col)) { 
        result.push([row, col]); 
      } else if (boardData.isPlayer(row, col, this.getOpponent())) {
        result.push([row, col]);
        console.log("opponent"); 
        return result;
      } else if (boardData.isPlayer(row, col, this.player)) {
        console.log("player");
        return result;
      }
    } 
    console.log("all empty");
    return result;
  }

  getKnightMoves(boardData) {
    let result = [];
    const relativeMoves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [-1, 2], [1, 2], [-1, -2], [1, -2]];
    for (let relativeMove of relativeMoves) {
      let row = this.row + relativeMove[0];
      let col = this.col + relativeMove[1];
      if (!boardData.isPlayer(row, col, this.player)) {
        result.push([row, col]);
      }
    }
    return result;
  }

  getBishopMoves(boardData) {
    let result = [];
    result = result.concat(this.getMovesInDirection(-1, -1, boardData));
    result = result.concat(this.getMovesInDirection(-1, 1, boardData));
    result = result.concat(this.getMovesInDirection(1, -1, boardData));
    result = result.concat(this.getMovesInDirection(1, 1, boardData));
    return result;
  }

  getKingMoves(boardData) {
    let result = [];
    const relativeMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    for (let relativeMove of relativeMoves) {
      let row = this.row + relativeMove[0];
      let col = this.col + relativeMove[1];
      if (!boardData.isPlayer(row, col, this.player)) {
        result.push([row, col]);
      }
    }
    return result;
  }

  getQueenMoves(boardData) {
    let result = this.getBishopMoves(boardData);
    result = result.concat(this.getRookMoves(boardData));
    return result; 
  } 

}; 

class BoardData {
  constructor(pieces) {
    this.pieces = pieces;

  }


  getPiece(row, col) {
    for (const piece of this.pieces) {
      if (piece.row === row && piece.col === col) {
        return piece;
      }
    }
  }
   
  isEmpty(row, col) {
    return this.getPiece(row, col) === undefined;
  }  

  isPlayer(row, col, player) {
    const piece = this.getPiece(row, col);
    return piece !== undefined && piece.player === player;
  }  

}  


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

  return result;
}


// const boardData = new BoardData(getInitialBoard());
 

const addImage = (cell, type, player) => {
  image = document.createElement('img');
  image.src = `./img/${player}_${type}.png`;
  image.classList.add(`${player}Pawns`);
  cell.appendChild(image);
};



//        ***
//   The Click Event :
//        ***





let clicks = 0;  
let pieceMoves = 0; 

const selectCell = (event, row, col) => {

 
  for (let i = 0; i < 8; i++) {

    for (let j = 0; j < 8; j++) {
      table.rows[i].cells[j].classList.remove('movement');
    }
  }

  
  for (let piece of boardData.pieces) {

    if (piece.row === row && piece.col === col) {

      let possibleMoves = piece.getPossibleMoves(boardData); 
       
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
      
      cell.addEventListener('click', (event) => selectCell(event, col, row))  
      
    }

  }

  boardData = new BoardData(getInitialBoard());
  console.log(boardData);   

  for (let piece of boardData.pieces) { 
    addImage(table.rows[piece.row].cells[piece.col], piece.type, piece.player);
  }
  
};

// createChessGame();

//TODO: add ; where necessary 


window.addEventListener('load', createChessGame); 



