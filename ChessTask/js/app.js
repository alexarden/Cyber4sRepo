let body = document.getElementsByTagName('body');

let table = document.createElement('table');

let currentPiece = undefined; 

let boardData;

let selectedCell; 

let clicks = 0;  

let pieceMoves = 0; 

let selectedPiece;


const WHITE_PLAYER = 'gold';
const BLACK_PLAYER = 'black';
const PAWN = 'pawn';
const ROOK = 'rook';
const KNIGHT = 'knight';
const BISHOP = 'bishop';
const KING = 'king';
const QUEEN = 'queen';

const EVENTS = [];  

const CHESS_BOARD_ID = 'table-id';

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

    if(this.player === BLACK_PLAYER && this.row === 6){
      result.push([this.row-2, this.col]) 
    }else if(this.player === WHITE_PLAYER && this.row === 1){
      result.push([this.row+2, this.col])
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
        // console.log("opponent"); 
        return result;
      } else if (boardData.isPlayer(row, col, this.player)) {
        // console.log("player");
        return result;
      }
    } 
    
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
  

  removePiece(row, col) {
    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];
      if (piece.row === row && piece.col === col) {
        this.pieces.splice(i, 1);
      }
    }
  }
}  


function getNewBoard() {
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


const addImage = (cell, type, player) => {
  image = document.createElement('img');
  image.src = `./img/${player}_${type}.png`;
  image.classList.add(`${player}Pawns`);
  cell.appendChild(image);
};



//        ***
//   The Click Event :
//        ***




const showPieceMoves = (row, col) => {

  for (let i = 0; i < 8; i++) {

    for (let j = 0; j < 8; j++) {
      table.rows[i].cells[j].classList.remove('movement');
      if( table.rows[i].cells[j].innerHTML.includes('goldPawns')){
        table.rows[i].cells[j].classList.add('gold')
      }
      if( table.rows[i].cells[j].innerHTML.includes('blackPawns')){
        table.rows[i].cells[j].classList.add('black')
      }
    }
  }

  const piece = boardData.getPiece(row, col);

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
 
  selectedCell = table.rows[row].cells[col];
  selectedCell.classList.add('select');
  selectedPiece = piece; 

}

function movePiece(piece, row, col) {
  const possibleMoves = piece.getPossibleMoves(boardData);
  
  for (const possibleMove of possibleMoves) {
    
    if (possibleMove[0] === row && possibleMove[1] === col) {
      
      boardData.removePiece(row, col);
      piece.row = row;
      piece.col = col;
      return true;
    }
  }
  return false;
}
 


const clickOnCell = (event, row, col) => {


  if (selectedPiece === undefined) {

    showPieceMoves(row, col);

  } else {
    
    if (movePiece(selectedPiece, row, col)) { 

      selectedPiece = undefined;
      updateChessBoard(boardData);
     

    } else {

      showPieceMoves(row, col);
    }
  }
  
};



const initGame = () => {
  boardData = new BoardData(getNewBoard());
  updateChessBoard(boardData)
}



const updateChessBoard = () => {

  table = document.getElementById(CHESS_BOARD_ID);
  if (table !== null) {

    table.remove();

  }

  table = document.createElement('table');
  table.id = CHESS_BOARD_ID;
  document.body.appendChild(table);
  for (let row = 0; row < 8; row++) {
    const rowElement = table.insertRow();
    for (let col = 0; col < 8; col++) { 
      const cell = rowElement.insertCell();
      cell.id = `cell-${row}-${col}`; 
      cell.addEventListener('click', (event) => clickOnCell(event, row, col)); 
      
    }
  }


 for (let piece of boardData.pieces) { 
    addImage(table.rows[piece.row].cells[piece.col], piece.type, piece.player);
  } 

  
};




//TODO: add ; where necessary 


window.addEventListener('load', initGame);   


