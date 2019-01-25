var GPU = require('../../src/index');

(function() {
  function vec2Test(mode) {
    var gpu = new GPU({ mode: mode });
    function typedFunction() {
      return [1, 2];
    }
    gpu.addFunction(typedFunction, {
      returnType: 'Array(2)'
    });
    var kernel = gpu.createKernel(function() {
      var result = typedFunction();
      return result[0] + result[1];
    })
      .setOutput([1]);
    var result = kernel();
    QUnit.assert.equal(result[0], 3);
    gpu.destroy();
  }

  QUnit.test('add typed functions - Array(2) - (auto)', function() {
    vec2Test(null);
  });
  QUnit.test('add typed functions - Array(2) - (gpu)', function() {
    vec2Test('gpu');
  });
  (GPU.isWebGL2Supported ? QUnit.test : QUnit.skip)('add typed functions - Array(2) - (webgl)', function () {
    vec2Test('webgl');
  });
  (GPU.isWebGLSupported ? QUnit.test : QUnit.skip)('add typed functions - Array(2) - (webgl2)', function () {
    vec2Test('webgl2');
  });
  (GPU.isHeadlessGLSupported ? QUnit.test : QUnit.skip)('add typed functions - Array(2) - (headlessgl)', function () {
    vec2Test('headlessgl');
  });
})();

(function() {
  function vec3Test(mode) {
    var gpu = new GPU({ mode: mode });
    function typedFunction() {
      return [1, 2, 3];
    }
    gpu.addFunction(typedFunction, {
      returnType: 'Array(3)'
    });
    var kernel = gpu.createKernel(function() {
      var result = typedFunction();
      return result[0] + result[1] + result[2];
    })
      .setOutput([1]);
    var result = kernel();
    QUnit.assert.equal(result[0], 6);
    gpu.destroy();
  }

  QUnit.test('add typed functions - Array(3) - (auto)', function() {
    vec3Test(null);
  });
  QUnit.test('add typed functions - Array(3) - (gpu)', function () {
    vec3Test('gpu');
  });
  (GPU.isWebGLSupported ? QUnit.test : QUnit.skip)('add typed functions - Array(3) - (webgl)', function () {
    vec3Test('webgl');
  });
  (GPU.isWebGL2Supported ? QUnit.test : QUnit.skip)('add typed functions - Array(3) - (webgl2)', function () {
    vec3Test('webgl2');
  });
  (GPU.isHeadlessGLSupported ? QUnit.test : QUnit.skip)('add typed functions - Array(3) - (headlessgl)', function () {
    vec3Test('headlessgl');
  });
})();

(function() {
  function vec4Test(mode) {
    var gpu = new GPU({ mode: mode });
    function typedFunction() {
      return [1, 2, 3, 4];
    }
    gpu.addFunction(typedFunction, {
      returnType: 'Array(4)'
    });
    var kernel = gpu.createKernel(function() {
      var result = typedFunction();
      return result[0] + result[1] + result[2] + result[3];
    })
      .setOutput([1]);
    var result = kernel();
    QUnit.assert.equal(result[0], 10);
    gpu.destroy();
  }

  QUnit.test('add typed functions - Array(4) - (auto)', function() {
    vec4Test(null);
  });
  QUnit.test('add typed functions - Array(4) - (gpu)', function() {
    vec4Test('gpu');
  });
  (GPU.isWebGLSupported ? QUnit.test : QUnit.skip)('add typed functions - Array(4) - (webgl)', function () {
    vec4Test('webgl');
  });
  (GPU.isWebGL2Supported ? QUnit.test : QUnit.skip)('add typed functions - Array(4) - (webgl2)', function () {
    vec4Test('webgl2');
  });
  (GPU.isHeadlessGLSupported ? QUnit.test : QUnit.skip)('add typed functions - Array(4) - (headlessgl)', function () {
    vec4Test('headlessgl');
  });
})();
