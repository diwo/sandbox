'use strict';

import interfaceVerify from 'interface-verify';
import assert from 'assert';
import hello from './hello';
import Handlebars from 'handlebars';

assert.equal(typeof interfaceVerify, 'object');

var textNode = document.createTextNode(`${hello} world`);
document.getElementById('main').appendChild(textNode);

var divNode = document.createElement('div');
divNode.innerHTML =
  Handlebars.compile([
    '<p>Hello my name is {{name}}.</p>',
    'Some of my favorite things are:',
    '<ul>{{#fav}}<li>{{thing}}</li>{{/fav}}</ul>'
  ].join(''))({
    name: 'Dickson',
    fav: [
      {thing: 'food'},
      {thing: 'sleep'},
      {thing: 'good food'}
    ]
  });
document.getElementById('main').appendChild(divNode);

Handlebars.registerPartial('inception',
  '{{#with dream}}<span style="font-size: 0.8em;">dreaming about being in a {{loc}}... {{> inception}}</span>{{/with}}');
var anotherNode = document.createElement('div');
anotherNode.innerHTML =
  Handlebars.compile('I was in a {{loc}}... {{> inception}}')({
    loc: 'plane',
    dream: {
      loc: 'car',
      dream: {
        loc: 'hotel',
        dream: {
          loc: 'maze'
        }
      }
    }
  });
document.getElementById('main').appendChild(anotherNode);
