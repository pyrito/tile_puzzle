var express = require('express');
var router = express.Router();
var Cell = require('../public/js/cell.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

/* GET home page. */
router.post('/verify', function(req, res, next) {
	var moves = req.body.moves;
	var initialGrid = req.body.grid;
	var rows = 3;
	var cols = 3;
	var done = false;
	console.log(moves);

	// Verify if the moves are ok, gotta simulate the board
	var grid = new Array(3);
	for (var i = 0; i < grid.length; i++) {
		grid[i] = new Array(3);
	}

	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			if (initialGrid[i][j] == 0)
				grid[i][j] = new Cell(i, j, 100, 0);
			else
				grid[i][j] = new Cell(i, j, 100, 1);
		}
	}

 	// Now we run through the moves 
 	for (var k = 0; k < moves.length; k++){
 		var xCord = moves[k].x;
 		var yCord = moves[k].y;
 		
		grid[xCord][yCord].invertColor();
		for (var x = -1; x < 2; x++) {
			for (var y = -1; y < 2;  y++) {
				if ((i + x) >= 0 && (j + y) >= 0 && (i + x) < cols && (j + y) < rows && (Math.abs(x) !=  Math.abs(y))) {
					console.log("grid x is: ", xCord+x);
					console.log("grid y is: ", yCord+y);
					grid[xCord+x][yCord+y].invertColor();
				}
			}
		}
 	} 

	// Check if the puzzle is done
	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			done = true;
			if (grid[i][j].isColored() == 0) {
				done = false;
				res.json({
					status: 'failure'
				})
				return;
			}
		}
	}

	res.json({
		status: 'success'
	})
});

module.exports = router;