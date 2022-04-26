let body = document.getElementsByTagName('body');

let table = document.createElement('table');

let currentPiece = undefined; 

let boardData;

let selectedCell; 

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


let turn = WHITE_PLAYER; 
 

function getNewBoard() {

  let result = [];

  const pieces = [ROOK, KNIGHT, BISHOP, KING, QUEEN, BISHOP, KNIGHT, ROOK ];

  const addPieces = (row, pawnRow, player) => {

    
    for (let i = 0; i < 8; i++) { 

      result.push(new Piece(row, i, pieces[i], player));
      result.push(new Piece(pawnRow, i, PAWN, player));

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

const showThisTurnPieceMoves = (row, col) => { 
  
 const piece = boardData.getPiece(row, col);

 for (let piece of boardData.pieces) {

    if (piece.row === row && piece.col === col) {

      let possibleMoves = piece.getPossibleMoves(boardData); 
      
      for (let possibleMove of possibleMoves) {

        const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];

        const possibleEnemy = boardData.getPiece(possibleMove[0], possibleMove[1])

        if(piece && piece.player === turn){
          
          if(possibleEnemy){

            cell.classList.add('attack');

          }

          cell.classList.add('movement');
           
        }  
        
      }

    }; 
    
  }

  selectedCell = table.rows[row].cells[col];
  selectedCell.classList.add('select');
  selectedPiece = piece;  
      


}; 

function movePiece(piece, row, col) {

  const possibleMoves = piece.getPossibleMoves(boardData);
   
  for (const possibleMove of possibleMoves) {
    
    if (possibleMove[0] === row && possibleMove[1] === col) {  
      
      boardData.removePiece(row, col);
      piece.row = row;
      piece.col = col;

      if(turn === WHITE_PLAYER){

        turn = BLACK_PLAYER

      }else {

        turn = WHITE_PLAYER 
      }; 

      return true;
      
    };

  }

  return false;

}

const resetMarks = () => {

  for(let i = 0; i < 8; i++){ 
    for(let j = 0; j < 8; j++){
      table.rows[i].cells[j].classList.remove('movement');
      table.rows[i].cells[j].classList.remove('select'); 
      table.rows[i].cells[j].classList.remove('attack');  
    } 
  } 
 


}

//        ***
//   The Click Event :
//        ***
 
const clickOnCell = (row, col) => {

  resetMarks(); 

  if (selectedPiece === undefined) {
        
    showThisTurnPieceMoves(row, col);

  } else { 

    if(selectedPiece.player === turn){

     
     
      if (movePiece(selectedPiece, row, col)) { 

       
        
        selectedPiece = undefined;
        updateChessBoard(boardData);
      

      } else {
        
        showThisTurnPieceMoves(row, col);

      }

    }else{

     return selectedPiece = undefined;

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
      cell.addEventListener('click', () => clickOnCell(row, col)); 
      
    }
  }


  for (let piece of boardData.pieces) { 

    addImage(table.rows[piece.row].cells[piece.col], piece.type, piece.player);

  } 

 
};

//TODO: add ; where necessary 

window.addEventListener('load', initGame);    
