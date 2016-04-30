
var path = require('path');

var _root = path.resolve(__dirname, '..');

function absPath(args) {
  args = Array.prototype.slice.call(arguments, 0);
  var p = path.join.apply(path, [_root].concat(args));
  return p;
}


exports.absPath = absPath;



