// recursiveReduceMapFilter.js
//
// Defining higher order functions "reduce", "map", and "filter".

"use strict";

var assert = require("./tools/assert");

// --- Reduce ---

var reduce = function(l, f, i) {
  if (!l.length) { return i; }
  return reduce(l.slice(1), f, f(i, l[0]));
};

assert.assertEqual(
  15,
  reduce(
    [1, 2, 3, 4, 5],
    function(a, b) { return a+b; },
    0
  )
);

assert.assertEqualArrays(
  [5, 4, 3, 2, 1],
  reduce(
    [1, 2, 3, 4, 5],
    function(a, b) { return [b].concat(a); },
    []
  )
);


// --- Map ---

var map = function(l, f) {
  // Some day we will have ES6 and TCO...
  var mapOptimized = function(l, f, a) {
    if (!l.length) { return a; }
    return mapOptimized(l.slice(1), f, a.concat(f(l[0])));
  };
  return mapOptimized(l, f, []);
};

assert.assertEqualArrays(
  [2, 4, 6, 8, 10],
  map(
    [1, 2, 3, 4, 5],
    function(x) { return x*2; }
  )
);


// --- Map 2 ---

var map2 = function(l, f) {
  return reduce(l, function(a, b) { return a.concat(f(b)); }, []);
};

assert.assertEqualArrays(
  [1, 4, 9, 16, 25],
  map2(
    [1, 2, 3, 4, 5],
    function(x) { return x*x; }
  )
);


// --- Filter ---

var filter = function(l, f) {
  return reduce(l, function(a, b) {
    if (f(b)) { return a.concat(b); }
    return a;
  }, []);
};

assert.assertEqualArrays(
  [1, 3, 5],
  filter(
    [1, 2, 3, 4, 5],
    function(x) { return x%2; }
  )
);

console.log("All good!");
