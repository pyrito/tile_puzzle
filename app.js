var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var Sequelize = require("sequelize");
var SequelizeStore = require("connect-session-sequelize")(session.Store);
require("dotenv").config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.set("env", process.env.ENV || "development");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var sequelizeStore = new SequelizeStore({
	db: new Sequelize({
		host: process.env.DB_HOST || "db",
		port: process.env.DB_PORT || 3306,
		database: process.env.DB_NAME || "puzzles",
		username: process.env.DB_USER || "root",
		password: process.env.DB_PASSWORD || "",
		dialect: process.env.DB_DIALECT || "mysql",
	})
});
sequelizeStore.sync();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

var sess = {
	secret: process.env.SESSION_SECRET,
	cookie: { maxAge: Date.now() + (30 * 86400 * 1000) },
	store: sequelizeStore,
	resave: true,
	saveUninitialized: true,
	name: "tilepuzzle-session"
}
if (app.get("env") === "production") {
	app.set("trust proxy", 1);
	sess.cookie.secure = true;
}
app.use(session(sess));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
