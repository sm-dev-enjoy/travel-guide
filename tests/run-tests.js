const Module = require('node:module');
const path = require('node:path');

// Alias @/ to dist-test/src/
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request.startsWith('@/')) {
    const aliased = path.resolve(__dirname, '..', 'dist-test', 'src', request.slice(2));
    return originalResolveFilename.call(this, aliased, parent, isMain, options);
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

// Run the test files with node:test
require('../dist-test/tests/bookmarking_system.test.js');
