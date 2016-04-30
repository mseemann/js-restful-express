
Error.stackTraceLimit = Infinity;

require('ts-helpers');


var testContext = require.context('../src', true, /\.spec\.ts/);


function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}


var modules = requireAll(testContext);
