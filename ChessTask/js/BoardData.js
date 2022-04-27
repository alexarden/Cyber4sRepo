class BoardData {
  constructor(pieces) {
    this.pieces = pieces;

  }


  getPiece(row, col) {

    for (const piece of this.pieces) {

      if (piece.row === row && piece.col === col) {

        return piece;

      };
    }
  };
   
  isEmpty(row, col) {

    return this.getPiece(row, col) === undefined;

  }; 

  isPlayer(row, col, player) {

    const piece = this.getPiece(row, col);
    return piece !== undefined && piece.player === player;

  };  

  removePiece(row, col) {

    for (let i = 0; i < this.pieces.length; i++) {

      let piece = this.pieces[i]; 

      if (piece.row === row && piece.col === col) {

        if(piece.type === KING){
          piece = piece.getOpponent(); 
          turn = GAME_OVER;
          winner = piece;
        }

       this.pieces.splice(i, 1);

      };
    }
  };

  movePiece(piece, row, col) {

    const possibleMoves = piece.getPossibleMoves(boardData);  
    for (const possibleMove of possibleMoves) {
      
      if (possibleMove[0] === row && possibleMove[1] === col) {  
        
        if(turn === WHITE_PLAYER){
          turn = BLACK_PLAYER
        }else {
          turn = WHITE_PLAYER 
        }; 
  
        boardData.removePiece(row, col);
        piece.row = row;
        piece.col = col;
  
       return true;
        
      };
  
    }
  
    return false;
  
  }

  endGame = () => {

    if(turn === GAME_OVER){
  
      body.appendChild(winnerPopUp);
      winnerPopUp.innerHTML = `${winner} wins, Congratulations! <br> Refresh to start again`;    
      winnerPopUp.classList.add('popup'); 
      selectedPiece = undefined;
    }; 
  
    
  }; 

  showPieceMoves = (row, col) => {   
  
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

  resetMarks = () => {

    for(let i = 0; i < 8; i++){ 
        
      for(let j = 0; j < 8; j++){

        table.rows[i].cells[j].classList.remove('movement');
        table.rows[i].cells[j].classList.remove('select'); 
        table.rows[i].cells[j].classList.remove('attack');  
        if(turn === GAME_OVER){
            
          table.rows[i].cells[j].removeEventListener('click', clickOnCell()); 
        };
      } 
    }  
  };
  
}  
