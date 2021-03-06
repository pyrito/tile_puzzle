var express = require('express');
var router = express.Router();
var Cell = require('../public/js/cell.js');
var rp = require("request-promise");

/* GET home page. */
router.get('/', function(req, res, next) {
	// When we first enter the puzzle we have to make this check
	if (!req.query.token) {
		// no token?
		res.redirect(process.env.REDIRECT_ON_COMPETE);
	} else {
		console.log("this is " + process.env.PUZZLE_SECRET);

		rp({
			method: "GET",
			//uri: process.env.HOST_SERVICE+"/api/info",
			uri: "http://host:3000/api/info",
			qs: {
				secret: process.env.PUZZLE_SECRET,
				token: req.query.token,
			},
			json: true
		}).then(function(data) {
			if (data.status == "success" && data.access) {
				req.session.token = data.data.token;
				req.session.name = data.data.name;
				console.log("success token is: " + req.session.token);
				console.log(req.session);
				res.redirect("/granted");
			} else {
				// does not have access or something happened
				res.redirect("/denied");
				res.redirect(process.env.REDIRECT_ON_COMPETE);
			}
		}).catch(function(data) {
			console.log("error");
			res.send(data.error.message);
		});
	}
});

router.get('/granted', function(req, res, next) {
	console.log("granted token is: " + req.session.token);
	console.log(req.session);
	//req.session.save();
	res.render('index', { title: 'Express' });
});

router.get('/denied' ,function(req, res, next) {
	res.render('denied', { title: 'Sorry'});
});

router.post('/verify', function(req, res, next) {
	var moves = req.body.moves;
	var initialGrid = req.body.grid;
	var rows = 3;
	var cols = 3;
	var done = false;

	// Verify if the moves are ok, gotta simulate the board
	var grid = new Array(3);
	for (var i = 0; i < grid.length; i++) {
		grid[i] = new Array(3);
	}

	// We are copying the initial game state
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

	/*
	res.json({
		status: 'success'
	})
	*/
	console.log("verify token is: " + req.session.token);
	console.log(req.session);

	// Once the puzzle is completed we send this information over
	console.log(req.session);
	if (!req.session.token) {
		// need to authenticate
		console.log("iciadads");
		res.redirect(process.env.REDIRECT_ON_COMPETE);
		return;
	}
	rp({
		method: "GET",
		//uri: process.env.HOST_SERVICE+"/api/completed",
		uri: "http://host:3000/api/completed",
		qs: {
			secret: process.env.PUZZLE_SECRET,
			token: req.session.token,
		},
		json: true
	}).then(function(data) {

			if (data.status == "success") {
				console.log("success");
				res.json({
					status: 'success',
					url: process.env.REDIRECT_ON_COMPETE
				});
			} else {
				console.log("failure");
				res.json({
					status: 'failure'
				});
				// does not have access or something happened
			}
		}).catch(function(data) {
			res.send(data.error.message);
	});

});

router.get('/success', function(req, res, next) {
	res.render('success', {title: 'Success'});
});

module.exports = router;
