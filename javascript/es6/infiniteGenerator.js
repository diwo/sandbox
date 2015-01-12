'use strict';

function* gNat() {
  var i = 1;
  while(true) {
    yield i++;
  }
}

function first(g, n) {
  return function*() {
    var i = n;
    for (let e of g()) {
      if (i--) yield e;
      else return;
    }
  };
}

function skip(g, n) {
  return function*() {
    var i = 0;
    for (let e of g()) {
      if (++i > n) yield e;
    }
  };
}

function map(g, f) {
  return function*() {
    for (let e of g()) {
      yield f(e);
    }
  };
}

function filter(g, f) {
  return function*() {
    for (let e of g()) {
      if (f(e)) {
        yield e;
      }
    }
  };
}

console.log('Generating...');

var gFiveToTen = skip(first(gNat, 10), 4);
var gSquaresOfFiveToTen = map(gFiveToTen, x => x*x);
var gEvenSquaresOfFiveToTen = filter(gSquaresOfFiveToTen, x => x%2 === 0);

for (let e of gEvenSquaresOfFiveToTen()) {
  console.log(e);
}
