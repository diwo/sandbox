'use strict';

var assert = require('assert');

function rand5() {
  return Math.floor(Math.random() * 5);
}

function rand7() {
  function rand25() {
    return 5 * rand5() + rand5();
  }

  while (true) {
    var num = rand25();
    if (num < 21) {
      return num % 7;
    };
  }
}

var occurrences = Array.apply(null, new Array(7))
  .map(function() {
    return 0;
  });

for (var i=0; i<1000000; i++) {
  occurrences[rand7()] += 1;
}

var max = Math.max.apply(null, occurrences);
var min = Math.min.apply(null, occurrences);
var avg = occurrences.reduce(function sum(a, n) { return a + n; }) / occurrences.length;

assert.ok(
  (avg-min)/avg < 0.01 && (max-avg)/avg < 0.01,
  'Un-even distribution [{}]'.replace('{}', occurrences.join(', ')));

