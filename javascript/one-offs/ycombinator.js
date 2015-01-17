// ycombinator.js
//
// Deriving the applicative order Y-combinator.

/* jshint newcap:false */

"use strict";

var assert = require("./tools/assert");

var verifyFactorial = function (factorial) {
  assert.assertEqual(1, factorial(0));
  assert.assertEqual(120, factorial(5));
};

// Standard recursive factorial definition.
verifyFactorial(
  (function () {
    var factorial = function (num) {
      if (num === 0) { return 1; }
      return factorial(num - 1) * num;
    };
    return factorial;
  }())
);

// After removing the use of a function reference, factorial can't
// recursively call itself anymore. Each recursive call is inlined instead.
// The factorial function is defined for numbers up to 5.
verifyFactorial(
  function (num) {
    if (num === 0) { return 1; }
    return (function (num) {
      if (num === 0) { return 1; }
      return (function (num) {
        if (num === 0) { return 1; }
        return (function (num) {
          if (num === 0) { return 1; }
          return (function (num) {
            if (num === 0) { return 1; }
            return (function (num) {
              if (num === 0) { return 1; }
              return ((undefined)(num - 1)) * num;
            }(num - 1)) * num;
          }(num - 1)) * num;
        }(num - 1)) * num;
      }(num - 1)) * num;
    }(num - 1)) * num;
  }
);

// At each recursion level, we can extract the anonymous function out as
// the parameter of a new immediately invoked generator function.
verifyFactorial(
  (function (factorial4) {
    return function (num) {
      if (num === 0) { return 1; }
      return factorial4(num - 1) * num;
    };
  }(
    (function (factorial3) {
      return function (num) {
        if (num === 0) { return 1; }
        return factorial3(num - 1) * num;
      };
    }(
      (function (factorial2) {
        return function (num) {
          if (num === 0) { return 1; }
          return factorial2(num - 1) * num;
        };
      }(
        (function (factorial1) {
          return function (num) {
            if (num === 0) { return 1; }
            return factorial1(num - 1) * num;
          };
        }(
          (function (factorial0) {
            return function (num) {
              if (num === 0) { return 1; }
              return factorial0(num - 1) * num;
            };
          }(
            (function (_) {
              return function (num) {
                if (num === 0) { return 1; }
                return _(num - 1) * num;
              };
            }(undefined))
          ))
        ))
      ))
    ))
  ))
);

// The factorial generator functions can be refactored into a single function.
verifyFactorial(
  (function (makeFactorial) {
    return makeFactorial(
            makeFactorial(
              makeFactorial(
                makeFactorial(
                  makeFactorial(
                    makeFactorial(undefined))))));
  }(
    function (factorial) {
      return function (num) {
        if (num === 0) { return 1; }
        return factorial(num - 1) * num;
      };
    }
  ))
);

// Instead of generating a factorial function first and passing it to the
// generator function to be consumed, give the generator function access to
// itself so that it can generate the recursive factorial function for itself.
verifyFactorial(
  (function (makeFactorial) {
    return makeFactorial(makeFactorial);
  }(
    function (makeFactorial) {
      return function (num) {
        if (num === 0) { return 1; }
        return (makeFactorial(makeFactorial)(num - 1)) * num;
      };
    }
  ))
);

// Even though makeFactorial(makeFactorial) returns a proper recursive factorial
// function, it needs to be encapsulated here so that it will not get stuck in an
// evaluation loop when it's extracted out as a function parameter in the next step.
verifyFactorial(
  (function (makeFactorial) {
    return makeFactorial(makeFactorial);
  }(
    function (makeFactorial) {
      return function (num) {
        if (num === 0) { return 1; }
        return (function (x) {
          return (makeFactorial(makeFactorial)(x));
        }(num - 1)) * num;
      };
    }
  ))
);

// The call to makeFactorial(makeFactorial) is extracted out to separate the
// code specific to factorial from the code for making recursion possible.
verifyFactorial(
  (function (makeFactorial) {
    return makeFactorial(makeFactorial);
  }(
    function (makeFactorial) {
      return (function (factorial) {
        return function (num) {
          if (num === 0) { return 1; }
          return (factorial(num - 1)) * num;
        };
      }(
        function (x) {
          return (makeFactorial(makeFactorial)(x));
        }
      ));
    }
  ))
);

// The code specific to factorial is extracted out.
verifyFactorial(
  (function (func) {
    return (function (makeFactorial) {
      return makeFactorial(makeFactorial);
    }(
      function (makeFactorial) {
        return func(
          function (x) {
            return (makeFactorial(makeFactorial)(x));
          }
        );
      }
    ));
  }(
    function (factorial) {
      return function (num) {
        if (num === 0) { return 1; }
        return (factorial(num - 1)) * num;
      };
    }
  ))
);

// The remaining function is the Y-combinator.
var Y = function (le) {
  return (function (f) {
    return f(f);
  }(
    function (f) {
      return le(
        function (x) {
          return f(f)(x);
        }
      );
    }
  ));
};

verifyFactorial(
  Y(
    function (factorial) {
      return function (num) {
        if (num === 0) { return 1; }
        return factorial(num - 1) * num;
      };
    }
  )
);

assert.assertEqualArrays(
  [5, 4, 3, 2, 1],
  (Y(
    function (reverse) {
      return function (list) {
        if (!list.length) { return []; }
        return reverse(list.slice(1)).concat(list[0]);
      };
    }
  )([1, 2, 3, 4, 5]))
);

console.log("All good!");
