
// Create the 2D array
function make2DArray(cols, rows) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

var grid;
var initialGrid;
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
  initialGrid = make2DArray(cols, rows);

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j, w, 0);
    }
  }
  //Default center is going to be black
  grid[1][1] = new Cell(1, 1, w, 1);

  //Random number of random cells
  randomNum = Math.floor((Math.random() * 9));

  //Random other cell that is generated
  // Prob has something to do with the coordinates
  for (var k = 0; k < randomNum; k++){
    randX = Math.floor((Math.random() * 3));
    randY = Math.floor((Math.random() * 3));
    grid[randX][randY] = new Cell(randX, randY, w, 1);
  }


  for (var i = 0; i < cols; i++){
    for (var j = 0; j < rows; j++){
      if (grid[i][j].isColored() == 0){
        initialGrid[i][j] = 0;
      }
      else {
        initialGrid[i][j] = 1;
      }
    }
  }

  console.log(grid);
  console.log(initialGrid);
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
  console.log(done);
  if (!done) {
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        if (grid[i][j].contains(mouseX, mouseY)) {
          grid[i][j].invertColor();
          // We add the point to the ArrayList
          movesPlayed.push({x:i, y:j});
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
    checkEnd();
  }
}

function debugFunc() {
  for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        grid[i][j] = new Cell(i, j, w, 1);
      }
  }
}

function checkEnd() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      done = true;
      if (grid[i][j].isColored() == 0) {
        done = false;
        return;
      }
    }
  }

  fetch('/verify', {  
    method: 'POST', 
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, 
    body: JSON.stringify({
      moves: movesPlayed,
      grid: initialGrid
    })
  })
  .then(function(response) {
    return response.json();
  })
  .then(function (data) {  
    console.log('Request: ', data.status);  
    if (data.status === 'success') {
      done = true;
    }
    else {
      done = false;
    }
  })  
  .catch(function (error) {  
    console.log('Request failure: ', error);  
  });
}