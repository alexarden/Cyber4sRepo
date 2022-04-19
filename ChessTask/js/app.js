// Create Chess table element
let body = document.getElementsByTagName('body');

let table = document.createElement('table');

document.body.appendChild(table);

const WHITE_PLAYER = 'gold'; 
const BLACK_PLAYER = 'black';

const PAWN = 'pawn';
const ROOK = 'rook';
const KNIGHT = 'knight';
const BISHOP = 'bishop';
const KING = 'king';
const QUEEN = 'queen';

//Make piece array and class to track them on the board

let pieces = [];

class Piece{
  constructor(row, col, type, player){
    this.row = row;
    this.col = col;
    this.player = player;
    this.type = type;
 }

 getPossibleMoves() {
  // Get relative moves
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
  

    // Get absolute moves
    let absoluteMoves = [];
    for (let relativeMove of relativeMoves) {
      const absoluteRow = this.row + relativeMove[0];
      const absoluteCol = this.col + relativeMove[1];
      absoluteMoves.push([absoluteRow, absoluteCol]);
    }
    
    

    // Get filtered absolute moves
    let filteredMoves = [];
    for (let absoluteMove of absoluteMoves) {
      const absoluteRow = absoluteMove[0];
      const absoluteCol = absoluteMove[1];
      if (absoluteRow >= 0 && absoluteRow <= 7 && absoluteCol >= 0 && absoluteCol <= 7) {
        filteredMoves.push(absoluteMove);
      }
    }
    
    return filteredMoves;
   
  }

  getPawnRelativeMoves() {
   // TODO: Give different answer to black player
   if(this.player === WHITE_PLAYER){
   return [[1, 0]];
   }else if(this.player === BLACK_PLAYER){
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
    console.log(result)
    return result;
  }
  getKnightRelativeMoves(){
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
    console.log(result)
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
    console.log(result)
    return result;
  }

  getKingRelativeMoves(){
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
    console.log(result)
    return result;
  }
  getQueenRelativeMoves(){
    let result = [];
    for (let i = 1; i < 8; i++) {
      result.push([i, 0]);
      result.push([-i, 0]);
      result.push([0, i]);
      result.push([0, -i]);
      result.push([i, i]);
      result.push([-i, -i]);
      result.push([i, -i]);
      result.push([-i, i]); 
    } 
    console.log(result)
    return result;
  }

}

class BoardData {
  constructor(pieces) {
    this.pieces = pieces;
  }

  // Returns piece in row, col, or undefined if not exists. Work wuth instead of pieces array.
  getPiece(row, col) {

  }
}



function getInitialBoard() { 
  let result = [];
  //Gold pieces
  const addPieces = (row, pawnRow, player) => {
  result.push(new Piece(row, 0, "rook", player)); 
  result.push(new Piece(row, 7, "rook", player));
  result.push(new Piece(row, 1, "knight", player));
  result.push(new Piece(row, 6, "knight", player));
  result.push(new Piece(row, 2, "bishop", player));
  result.push(new Piece(row, 5,  "bishop", player));
  result.push(new Piece(row, 3,  "king", player));
  result.push(new Piece(row, 4,  "queen", player)); 
  for(let i = 0; i < 8; i++){
  result.push(new Piece(pawnRow, i, "pawn", player));} 
 }
  addPieces(0, 1, WHITE_PLAYER);
  addPieces(7, 6, BLACK_PLAYER);  
  
 return result;
}
  

//add img function
const addImage = (cell,type,player) => { 
  const image = document.createElement('img');
  image.src =`../ChessTask/img/${player}_${type}.png`;    
  image.classList.add(`${player}Pawns`)
  cell.appendChild(image);
}

//when one square(cell) clicked the other will turn off
let selectedCell;

const selectCell = (e, row, col) => {
  //remove previous movment marks
  for(let i = 0; i < 8; i++){

    for(let j = 0; j < 8; j++){
      table.rows[i].cells[j].classList.remove('movement');
    }
  }

  // Show possible moves
  for (let piece of pieces) {

    if (piece.row === row && piece.col === col) {
      
      let possibleMoves = piece.getPossibleMoves();
      for (let possibleMove of possibleMoves) {
        const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];
        cell.classList.add('movement');
      }
    }
  }

  if(selectedCell !== undefined){
    selectedCell.classList.remove('active');
    
  };
  selectedCell = e.currentTarget;
  selectedCell.classList.add('active');
}

//Create rows.

let rows = document.getElementsByTagName('tr');

for(let i = 0; i < 8; i++){
  table.appendChild(document.createElement('tr')).id='row_'+i
}; 

// Create and init Chess game, pieces and squares(cells).
const createChessGame = () => {
  for(let row = 0; row < 8; row++){
  rows[row]

    for(let col = 0; col < 8; col++){
      let cell = rows[col].appendChild(document.createElement('td'))
      cell.id='row-'+(col)+'_col-'+(col) 

    // creating selected square when palyer click on it.
    cell.addEventListener('click',(e) => selectCell(e, col, row))      
   } 

  } 
  pieces = getInitialBoard();

  for (let piece of pieces) {
    addImage(table.rows[piece.row].cells[piece.col], piece.type, piece.player);
  }
}

createChessGame();






