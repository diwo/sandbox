'use strict';

var mymodule1 = require('usermodule1');
var mymodule2 = require('usermodule2');

module.exports = [mymodule1.hello, mymodule2.world()].join(' ');
