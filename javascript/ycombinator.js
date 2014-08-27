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

verifyFactorial(
  (function () {
    var factorial = function (num) {
      if (num === 0) { return 1; }
      return factorial(num - 1) * num;
    };
    return factorial;
  }())
);

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
