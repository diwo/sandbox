// continuationFactorial.js
//
// Define factorial in continuation-passing style.

"use strict";

var assert = require("./tools/assert");

var continuify = function (op) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var callback = args[args.length - 1];
    callback(op.apply(null, args.slice(0, -1)));
  };
};

var factorialCont = function (n, callback) {
  continuify(function (a, b) {
    return a === b;
  })(n, 0, function (eq0) {
    if (eq0) {
      callback(1);
    } else {
      continuify(function (a, b) {
        return a - b;
      })(n, 1, function (nm1) {
        factorialCont(nm1, function (factnm1) {
          continuify(function (a, b) {
            return a * b;
          })(factnm1, n, callback);
        });
      });
    }
  });
};

factorialCont(5, function (ret) {
  assert.assertEqual(120, ret);
  console.log("All good!");
});
