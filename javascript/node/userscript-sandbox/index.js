'use strict';

var child = require('child_process').fork('child');

child.send({
  cmd: 'exec',
  script: 'userscript'
});

child.on('message', function(msg) {
  console.log(msg);
  child.kill();
});
