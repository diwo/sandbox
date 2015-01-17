'use strict';

var fs = require('fs');
var vm = require('vm');

function execute(module) {
  function toFilePath(module) {
    if (!module.match(/[a-zA-Z]+/)) {
      throw Error('Invalid module name: ' + module);
    }
    return module + '.js';
  }

  var scriptFile = toFilePath(module);
  var data = fs.readFileSync(scriptFile);
  var script = vm.createScript(data, scriptFile);

  var context = {
    require: execute,
    module: {
      exports: void 0
    }
  };

  script.runInNewContext(context);

  return context.module.exports;
}

process.on('message', function(msg) {
  if (msg.cmd === 'exec') {
    process.send(execute(msg.script));
  }
});
