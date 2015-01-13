'use strict';

import interfaceVerify from 'interface-verify';
import assert from 'assert';
import hello from './hello';

assert.equal(typeof interfaceVerify, 'object');

var textNode = document.createTextNode(`${hello} world`);
document.getElementById('main').appendChild(textNode);
