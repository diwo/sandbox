"use strict";

var error = require("./error");
var InvalidArgumentError = error.InvalidArgumentError;
var AssertionError = error.AssertionError;

var enhanceMessageWithExpectation = function(message, expectedValue, actualValue) {
  message = message ? '"' + message + '" - ' : "";
  message += "Expected:'" + expectedValue + "' Got:'" + actualValue + "'";
  return message;
};

var assertTrue = function(condition, message) {
  if (arguments.length < 1) {
    throw new InvalidArgumentError("Assertion must have a success condition.");
  }

  if (!condition) {
    throw new AssertionError(message);
  }
};

var assertEqual = function(expectedValue, actualValue, message) {
  if (arguments.length < 2) {
    throw new InvalidArgumentError("Assertion must have expected value and actual value.");
  }

  message = enhanceMessageWithExpectation(message, expectedValue, actualValue);
  assertTrue(expectedValue === actualValue, message);
};

var assertEqualArrays = function(expectedArray, actualArray, message) {
  if (arguments.length < 2) {
    throw new InvalidArgumentError("Assertion must have expected value and actual value.");
  }
  if (!Array.isArray(expectedArray) || !Array.isArray(actualArray)) {
    throw new InvalidArgumentError("Arguments must be arrays.");
  }

  var equalArrays = function(expectedArray, actualArray) {
    if (expectedArray.length !== actualArray.length) { return false; }
    if (expectedArray.length === 0) { return true; }
    if (Array.isArray(expectedArray[0]) && Array.isArray(actualArray[0])) {
      return equalArrays(expectedArray[0], actualArray[0])
          && equalArrays(expectedArray.slice(1), actualArray.slice(1));
    }
    return expectedArray[0] === actualArray[0]
        && equalArrays(expectedArray.slice(1), actualArray.slice(1));
  };

  message = enhanceMessageWithExpectation(message, JSON.stringify(expectedArray), JSON.stringify(actualArray));
  assertTrue(equalArrays(expectedArray, actualArray), message);
};

module.exports = {
  assertTrue: assertTrue,
  assertEqual: assertEqual,
  assertEqualArrays: assertEqualArrays
};
