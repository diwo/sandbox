// findArithmeticOperationsOrderOptimal.js
//
// Given a starting and an ending number, find the shortest sequence of arithmetic operations
// that can be applied to the starting number to arrive at the ending number

"use strict";

var assert = require("./tools/assert");

var makeFind = function(opList) {
  return function(start, end) {
    if (start === end) { return []; }

    var queue = [start];
    var visitedMemos = {};
    var currentValue, found;

    var addMemo = function(value, originValue, op) {
      visitedMemos[value] = {
        originValue: originValue,
        op: op
      };
    };

    while (queue.length) {
      currentValue = queue.shift();

      found = opList.some(function(op) {
        var nextValue = op.opFunc(currentValue);
        if (nextValue > end) {
          return false;
        }
        if (visitedMemos[nextValue] === undefined) {
          queue.push(nextValue);
          addMemo(nextValue, currentValue, op);
          if (nextValue === end) {
            return true;
          }
        }
        return false;
      });

      if (found) {
        return (function() {
          var path = [];
          var memo = visitedMemos[end];
          while (memo !== undefined) {
            path.unshift(memo.op);
            memo = visitedMemos[memo.originValue];
          }
          return path;
        }());
      }
    }

    return null;
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

var prettyFind = makePrettyFind(
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

assert.assertEqual("((1+5)*3) = 18", prettyFind(1, 18));
// optimal: ((1+5)*3) = 18
// other:   ((((1*3)+5)+5)+5) = 18

assert.assertEqual("(((1*3)+5)*3) = 24", prettyFind(1, 24));
// optimal: (((1*3)+5)*3) = 24
// other:   (((((1*3)*3)+5)+5)+5) = 24

assert.assertEqual(undefined, prettyFind(1, 20));
// => undefined

console.log("All good!");
