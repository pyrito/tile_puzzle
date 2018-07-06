function Cell(i, j, w, colored) {
  this.i = i;
  this.j = j;
  this.x = i * w;
  this.y = j * w;
  this.w = w;

  this.bee = false;
  this.revealed = false;
  this.clicked = false;
  this.colored = colored;
}

Cell.prototype.show = function() {
  stroke(0);
  noFill();
  rect(this.x, this.y, this.w, this.w);

  // If the button is clicked, then we invert its color
  if (this.colored == 0) {
    noFill();
    rect(this.x, this.y, this.w, this.w);
  }
  else if (this.colored == 1) {
    fill(127);
    rect(this.x, this.y, this.w, this.w);
  }
 }

Cell.prototype.contains = function(x, y) {
  return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w);
}

Cell.prototype.invertColor = function() {
  this.colored = (this.colored == 0) ? 1 : 0;
}

Cell.prototype.isColored = function() {
  return this.colored;
}

if (typeof(module) != 'undefined')
  module.exports = Cell;
