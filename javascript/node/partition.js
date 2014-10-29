// partition.js
//
// Partition a list into 2 using a collector function.

"use strict";

var assert = require("./tools/assert");

var partition = function(list, decide, collect) {
  if (!list.length) {
    return collect([], []);
  }

  var head = list[0];
  var tail = list.slice(1);

  if (decide(head)) {
    return partition(
      tail,
      decide,
      function(matches, nomatches) {
        return collect([head].concat(matches), nomatches);
      }
    );
  } else {
    return partition(
      tail,
      decide,
      function(matches, nomatches) {
        return collect(matches, [head].concat(nomatches));
      }
    );
  }
};

var obj = partition(
  [1,2,3,4,5],
  function(n) {
    return n % 2 === 0;
  },
  function(matches, nomatches) {
    return {
      matches: matches,
      nomatches: nomatches
    };
  }
);

assert.assertEqual(2, obj.matches.length);
assert.assertEqual(3, obj.nomatches.length);

console.log("All good!");
