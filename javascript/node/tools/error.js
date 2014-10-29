"use strict";

var InvalidArgumentError = function(message) {
  Error.captureStackTrace(this);
  this.name = "InvalidArgumentError";
  this.message = message;
};
InvalidArgumentError.prototype = Object.create(Error.prototype);

var AssertionError = function(message) {
  Error.captureStackTrace(this, AssertionError);
  this.name = "AssertionError";
  this.message = message;
};
AssertionError.prototype = Object.create(Error.prototype);

module.exports = {
  InvalidArgumentError: InvalidArgumentError,
  AssertionError: AssertionError
};
