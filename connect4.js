/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 * make the board
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let i = 0; i < HEIGHT; i++) {
    let row = [];
    for (let j = 0; j < WIDTH; j++) {
      row.push(null)
    }
    board.push(row);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"

  // TODO: add comment for this code
  let htmlBoard = document.getElementById("board");
  let top = document.createElement("tr");         //creates the special top row
  top.setAttribute("id", "column-top");           //give it a unique id
  top.addEventListener("click", handleClick);     //makes it clickable
  top.addEventListener("mouseover", handleHover)
  top.addEventListener("mouseout", handleOut)

  for (let x = 0; x < WIDTH; x++) {               //loop thru width
    let headCell = document.createElement("td");  //make a table cell
    headCell.setAttribute("id", x);               //give it a unique id based on the x;
    top.append(headCell);                         //appending the new table cell to our special top row
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  for (let y = 0; y < HEIGHT; y++) {              //loop thru height;   
    const row = document.createElement("tr");     //make a new row at each loopy
    for (let x = 0; x < WIDTH; x++) {             //loop thru width
      const cell = document.createElement("td");  //make a new cell at each loopy
      cell.setAttribute("id", `${y}-${x}`);       //give the cell a unique id based on x-y
      row.append(cell);                           //append the new cell to the row being looped thru
    }
    htmlBoard.append(row);                        //add a new row to the board on each loopy;
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function handleHover(evt) {
  if (currPlayer === 1) {
    evt.target.style.backgroundColor = "salmon";
  } else {
    evt.target.style.backgroundColor = "teal";
  }
}

function handleOut(evt) {
  evt.target.style.backgroundColor = "palegoldenrod";
}

function findSpotForCol(x) {
  let firstEmptyPlace = HEIGHT - 1;

  for (y = HEIGHT - 1; y > 0; y--){
    if (board[y][x] !== null) {
      firstEmptyPlace = y - 1;
    }
  }

  if (firstEmptyPlace === -1) {
    let fullCol = document.getElementById(x);
    fullCol.removeEventListener(handleClick);
  }
  
  return firstEmptyPlace;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  let puck = document.createElement("div");
  puck.classList.add('piece', `p${currPlayer}`); 
  let square = document.getElementById(`${y}-${x}`);
  if (board[y][x] === null) {
    square.append(puck)
    board[y][x] = currPlayer;
  }
}

/** endGame: announce game end */

function endGame(msg) {
  setTimeout(function () {alert(msg)}, 250);
}

/** handleClick: handle click of column top to play piece */
let counter = 0;

function handleClick(evt) {
  counter++
  
  if (counter >= WIDTH * HEIGHT) {
    endGame("Tie game!")
  }
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won, but is still a bitch, but better than Player ${currPlayer - 1 || 2}!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  

  // switch players
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < HEIGHT &&
          x >= 0 &&
          x < WIDTH &&
          board[y][x] === currPlayer
      );
    }

    // TODO: read and understand this code. Add comments to help you.

    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }

}

makeBoard();
makeHtmlBoard();
