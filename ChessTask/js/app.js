//Shortcuts

// Create Chess table element
let body = document.getElementsByTagName('body');

let table = document.createElement('table');

document.body.appendChild(table);

let white = 'gold';
let black = 'black';


//Make piece array and class to track them on the board

let pieces = [];

class Piece{
  constructor(row, col, type, player){
    this.row = row;
    this.col = col;
    this.player = player;
    this.type = type;
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
  addPieces(0, 1, white);
  addPieces(7, 6, black);
  
 return result;
}

//add img function
const addImage = (cell,type,player) => { 
  const image = document.createElement('img');
  image.src =`/img/${player}_${type}.png`;
  image.classList.add(`${player}Pawns`)
  cell.appendChild(image);
}

//when one square(cell) clicked the other will turn off
let selectedCell;

const selectCell = (e) => {
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
  for(let i = 0; i < 8; i++){
  rows[i]
    for(let j = 0; j < 8; j++){
      let cell = rows[j].appendChild(document.createElement('td'))
      cell.id='row-'+(j)+'_col-'+(i) 

    // creating selected square when palyer click on it.
    cell.addEventListener('click',selectCell)
   }
  }
  pieces = getInitialBoard();

  for (let piece of pieces) {
    addImage(table.rows[piece.row].cells[piece.col], piece.type, piece.player);
  }
}

createChessGame();






