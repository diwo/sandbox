// findKthLargestInSortedMatrix.js
//
// Given a number k and a matrix sorted in both rows and columns,
// find the k-th largest element in the matrix.

"use strict";

var assert = require("./tools/assert");

var MatrixBackedPriorityQueue = function(sortedMatrix) {
  this.matrix = sortedMatrix;
  this.overrides = [];
  this.overrides.length = sortedMatrix.length * sortedMatrix.length;
};
MatrixBackedPriorityQueue.prototype.shift = function() {
  var self = this;
  var matrixWidth = this.matrix.length;

  var getRoot = function() {
    return {
      x: matrixWidth - 1,
      y: matrixWidth - 1
    };
  };

  var setValue = function(node, value) {
    self.overrides[node.y*matrixWidth + node.x] = value;
  };

  var getValue = function(node) {
    var overrideValue = self.overrides[node.y*matrixWidth + node.x];
    if (overrideValue !== undefined) { return overrideValue; }
    return self.matrix[node.y][node.x];
  };

  var getChildren = function(node) {
    var children = [];
    var child;

    if (node.x > 0) {
      child = {
        x: node.x-1,
        y: node.y
      };
      if (getValue(child) !== null) { children.push(child); }
    }

    if (node.y > 0) {
      child = {
        x: node.x,
        y: node.y-1
      };
      if (getValue(child) !== null) { children.push(child); }
    }

    return children;
  };

  var promoteChildren = function(node) {
    var children = getChildren(node);
    if (!children.length) {
      setValue(node, null);
      return;
    }

    var biggestChild = children.reduce(function(a, b) {
      if (getValue(b) > getValue(a)) { return b; }
      return a;
    });

    setValue(node, getValue(biggestChild));
    promoteChildren(biggestChild);
  };

  var root = getRoot();
  var rootValue = getValue(root);
  promoteChildren(root);
  return rootValue;
};

var findKthLargest = function(matrix, k) {
  var pQ = new MatrixBackedPriorityQueue(matrix);
  var head, count;

  head = pQ.shift();
  count = 1;
  while (head !== null) {
    if (count === k) { return head; }
    head = pQ.shift();
    count += 1;
  }
  return undefined;
};

var matrix1 = [
  [ 1,  2,  3,  4],
  [ 5,  6,  7,  8],
  [ 9, 10, 11, 12],
  [13, 14, 15, 16]
];

assert.assertEqual(13, findKthLargest(matrix1,  4));
assert.assertEqual(12, findKthLargest(matrix1,  5));
assert.assertEqual( 1, findKthLargest(matrix1, 16));

var matrix2 = [
  [ 1,  5,  9, 13],
  [ 2,  6, 10, 14],
  [ 3,  7, 11, 15],
  [ 4,  8, 12, 16]
];

assert.assertEqual(13, findKthLargest(matrix2,  4));
assert.assertEqual(12, findKthLargest(matrix2,  5));
assert.assertEqual( 1, findKthLargest(matrix2, 16));

var matrix3 = [
  [ 1,  2,  6,  7],
  [ 3,  5,  8, 13],
  [ 4,  9, 12, 14],
  [10, 11, 15, 16]
];

assert.assertEqual(13, findKthLargest(matrix3,  4));
assert.assertEqual(12, findKthLargest(matrix3,  5));
assert.assertEqual( 1, findKthLargest(matrix3, 16));

console.log("All good!");
