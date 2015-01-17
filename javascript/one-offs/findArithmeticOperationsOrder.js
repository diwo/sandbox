// findArithmeticOperationsOrder.js
//
// A solution to http://eloquentjavascript.net/03_functions.html#p_KNlnW1VpW2
//
// Given a starting and an ending number, find a sequence of arithmetic operations
// that can be applied to the starting number to arrive at the ending number

"use strict";

var makeFind = function(opList) {
  return function(start, end) {
    var findPath = function(start) {
      if (start > end) { return null; }
      if (start === end) { return []; }

      var path;
      opList.slice().sort(function(a, b) {
        // Operation with largest result first as heuristic for shorter path
        return b.opFunc(start) - a.opFunc(start);
      }).some(function(op){
        // Short-circuits out of first found path
        path = findPath(op.opFunc(start));
        if (path) {
          path = [op].concat(path);
          return true;
        }
        return false;
      });

      return path;
    };

    return findPath(start) || undefined;
  };
};

var makePrettyFind = function(findFunc) {
  return function(start, end) {
    var path = findFunc(start, end);
    if (path) {
      return path.reduce(
        function(prev, curr) {
          return "(" + prev + curr.opString + ")";
        }, start) + " = " + end;
    }
    return undefined;
  };
};

var find = makePrettyFind(
  makeFind([
    {
      opFunc: function times3(n) { return n*3; },
      opString: "*3"
    },
    {
      opFunc: function plus5(n) { return n+5; },
      opString: "+5"
    }
  ])
);

console.log(find(1, 18));
// => ((1+5)*3) = 18
// other solution ((((1*3)+5)+5)+5) = 18

console.log(find(1, 24));
// => (((((1*3)*3)+5)+5)+5) = 24
// heuristics failure, could be shorter (((1*3)+5)*3) = 24

console.log(find(1, 20));
// => undefined
