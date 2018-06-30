
// Create the 2D array
function make2DArray(cols, rows) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

var grid;
var cols;
var rows;
var w = 100;
var done = false;
var moves = 0;
var movesPlayed = [];
// Setup for the canvas
function setup() {
  createCanvas(301, 301);
  cols = floor(width / w);
  rows = floor(height / w);
  grid = make2DArray(cols, rows);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j, w, 0);
    }
  }
  //Default center is going to be black
  grid[1][1] = new Cell(1, 1, w, 1);

  //Random other cell that is generated
  randX = Math.floor((Math.random() * 3));
  randY = Math.floor((Math.random() * 3));
  grid[randX][randY] = new Cell(randX, randY, w, 1);

  //Random other cell that is generated
  randX = Math.floor((Math.random() * 3));
  randY = Math.floor((Math.random() * 3));
  grid[randX][randY] = new Cell(randX, randY, w, 1);

  //Random other cell that is generated
  randX = Math.floor((Math.random() * 3));
  randY = Math.floor((Math.random() * 3));
  grid[randX][randY] = new Cell(randX, randY, w, 1);

}

// Draw the canvas as well as the cells
function draw() {
  background(255);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }
}

// JavaScript function for when the mouse is pressed
function mousePressed() {
  if (!done) {
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        if (grid[i][j].contains(mouseX, mouseY)) {
          grid[i][j].invertColor();
          for (var x = -1; x < 2; x++) {
            for (var y = -1; y < 2;  y++) {
              if ((i + x) >= 0 && (j + y) >= 0 && (i + x) < cols && (j + y) < rows && (Math.abs(x) !=  Math.abs(y))) {
                grid[i+x][j+y].invertColor();
              }
            }
          }
        }
      }
    }

    moves += 1;
    console.log(moves);
    // Check if the board is filled or not
  }
}

// Check if it's the end of the game
/*function gameStart() {
  done = false;
}*/

function checkEnd() {
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        done = true;
        if (grid[i][j].isColored() == 0) {
          done = false;
          break;
        }
      }
    }
}