var GPU = require('../../src/index');

(function() {
  function inputX(mode) {
    const gpu = new GPU({ mode: mode });
    const input = GPU.input;
    const kernel = gpu.createKernel(function(a) {
      return a[this.thread.x];
    })
      .setOutput([9]);

    const a = new Float32Array(9);
    a.set([1,2,3,4,5,6,7,8,9]);

    const result = kernel(input(a, [3, 3]));
    QUnit.assert.deepEqual(QUnit.extend([], result), [1,2,3,4,5,6,7,8,9]);
    gpu.destroy();
  }

  QUnit.test("inputX (auto)", function() {
    inputX();
  });

  QUnit.test("inputX (gpu)", function() {
    inputX('gpu');
  });

  (GPU.isWebGLSupported ? QUnit.test : QUnit.skip)("inputX (webgl)", function () {
    inputX('webgl');
  });

  (GPU.isWebGL2Supported ? QUnit.test : QUnit.skip)("inputX (webgl2)", function () {
    inputX('webgl2');
  });

  QUnit.test("inputX (cpu)", function() {
    inputX('cpu');
  });

  function inputXY(mode) {
    const gpu = new GPU({ mode: mode });
    const input = GPU.input;
    const kernel = gpu.createKernel(function(a) {
      return a[this.thread.y][this.thread.x];
    })
      .setOutput([9]);

    const a = new Float32Array(9);
    a.set([1,2,3,4,5,6,7,8,9]);

    const b = new Float32Array(9);
    b.set([1,2,3,4,5,6,7,8,9]);

    const result = kernel(input(a, [3, 3]));
    QUnit.assert.deepEqual(QUnit.extend([], result), [1,2,3,4,5,6,7,8,9]);
    gpu.destroy();
  }

  QUnit.test("inputXY (auto)", function() {
    inputXY();
  });

  QUnit.test("inputXY (gpu)", function() {
    inputXY('gpu');
  });

  (GPU.isWebGLSupported ? QUnit.test : QUnit.skip)("inputXY (webgl)", function () {
    inputXY('webgl');
  });

  (GPU.isWebGL2Supported ? QUnit.test : QUnit.skip)("inputXY (webgl2)", function () {
    inputXY('webgl2');
  });

  (GPU.isHeadlessGLSupported ? QUnit.test : QUnit.skip)("inputXY (headlessgl)", function () {
    inputXY('headlessgl');
  });

  QUnit.test("inputXY (cpu)", function() {
    inputXY('cpu');
  });

  function inputYX(mode) {
    const gpu = new GPU({ mode: mode });
    const input = GPU.input;
    const kernel = gpu.createKernel(function(a) {
      return a[this.thread.y][this.thread.x];
    })
      .setOutput([3, 3]);

    const a = new Float32Array(9);
    a.set([1,2,3,4,5,6,7,8,9]);

    const result = kernel(input(a, [3, 3]));
    QUnit.assert.deepEqual(result.map(function(v) { return Array.from(v); }), [[1,2,3],[4,5,6],[7,8,9]]);
    gpu.destroy();
  }

  QUnit.test("inputYX (auto)", function() {
    inputYX();
  });

  QUnit.test("inputYX (gpu)", function() {
    inputYX('gpu');
  });

  (GPU.isWebGLSupported ? QUnit.test : QUnit.skip)("inputYX (webgl)", function () {
    inputYX('webgl');
  });

  (GPU.isWebGL2Supported ? QUnit.test : QUnit.skip)("inputYX (webgl2)", function () {
    inputYX('webgl2');
  });

  (GPU.isHeadlessGLSupported ? QUnit.test : QUnit.skip)("inputYX (headlessgl)", function () {
    inputYX('headlessgl');
  });

  QUnit.test("inputYX (cpu)", function() {
    inputYX('cpu');
  });

  function inputYXOffset(mode) {
    const gpu = new GPU({ mode: mode });
    const input = GPU.input;
    const kernel = gpu.createKernel(function(a) {
      return a[this.thread.x][this.thread.y];
    })
      .setOutput([8, 2]);

    const a = new Float32Array(16);
    a.set([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);

    const result = kernel(input(a, [2, 8]));
    QUnit.assert.deepEqual(result.map(function(v) { return Array.from(v); }), [[1,3,5,7,9,11,13,15],[2,4,6,8,10,12,14,16]]);
    gpu.destroy();
  }

  QUnit.test("inputYXOffset (auto)", function() {
    inputYXOffset();
  });

  QUnit.test("inputYXOffset (gpu)", function() {
    inputYXOffset('gpu');
  });

  (GPU.isWebGLSupported ? QUnit.test : QUnit.skip)("inputYXOffset (webgl)", function () {
    inputYXOffset('webgl');
  });

  (GPU.isWebGL2Supported ? QUnit.test : QUnit.skip)("inputYXOffset (webgl2)", function () {
    inputYXOffset('webgl2');
  });

  (GPU.isHeadlessGLSupported ? QUnit.test : QUnit.skip)("inputYXOffset (headlessgl)", function () {
    inputYXOffset('headlessgl');
  });

  QUnit.test("inputYXOffset (cpu)", function() {
    inputYXOffset('cpu');
  });

  function inputYXOffsetPlus1(mode) {
    const gpu = new GPU({ mode: mode });
    const input = GPU.input;
    const kernel = gpu.createKernel(function(a) {
      return a[this.thread.x][this.thread.y];
    })
      .setOutput([2, 8]);

    const a = new Float32Array(16);
    a.set([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);

    const result = kernel(input(a, [8, 2]));
    QUnit.assert.deepEqual(result.map(function(v) { return Array.from(v); }), [[1,9],[2,10],[3,11],[4,12],[5,13],[6,14],[7,15],[8,16]]);
    gpu.destroy();
  }

  QUnit.test("inputYXOffsetPlus1 (auto)", function() {
    inputYXOffsetPlus1();
  });

  QUnit.test("inputYXOffsetPlus1 (gpu)", function() {
    inputYXOffsetPlus1('gpu');
  });

  (GPU.isWebGLSupported ? QUnit.test : QUnit.skip)("inputYXOffsetPlus1 (webgl)", function () {
    inputYXOffsetPlus1('webgl');
  });

  (GPU.isWebGL2Supported ? QUnit.test : QUnit.skip)("inputYXOffsetPlus1 (webgl2)", function () {
    inputYXOffsetPlus1('webgl2');
  });

  (GPU.isHeadlessGLSupported ? QUnit.test : QUnit.skip)("inputYXOffsetPlus1 (headlessgl)", function () {
    inputYXOffsetPlus1('headlessgl');
  });

  QUnit.test("inputYXOffsetPlus1 (cpu)", function() {
    inputYXOffsetPlus1('cpu');
  });

  function inputZYX(mode) {
    const gpu = new GPU({ mode: mode });
    const input = GPU.input;
    const kernel = gpu.createKernel(function(a) {
      return a[this.thread.z][this.thread.y][this.thread.x];
    })
      .setOutput([2, 4, 4]);

    const a = new Float32Array(64);
    a.set([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]);

    const result = kernel(input(a, [2, 4, 4]));
    QUnit.assert.deepEqual(result.map(function(v) { return v.map(function(v) { return Array.from(v); }); }), [[[1,2],[3,4],[5,6],[7,8]],[[9,10],[11,12],[13,14],[15,16]],[[17,18],[19,20],[21,22],[23,24]],[[25,26],[27,28],[29,30],[31,32]]]);
    gpu.destroy();
  }

  QUnit.test("inputZYX (auto)", function() {
    inputZYX();
  });

  QUnit.test("inputZYX (gpu)", function() {
    inputZYX('gpu');
  });

  (GPU.isWebGLSupported ? QUnit.test : QUnit.skip)("inputZYX (webgl)", function () {
    inputZYX('webgl');
  });

  (GPU.isWebGL2Supported ? QUnit.test : QUnit.skip)("inputZYX (webgl2)", function () {
    inputZYX('webgl2');
  });

  (GPU.isHeadlessGLSupported ? QUnit.test : QUnit.skip)("inputZYX (headlessgl)", function () {
    inputZYX('headlessgl');
  });

  QUnit.test("inputZYX (cpu)", function() {
    inputZYX('cpu');
  });


  function inputZYXVariables(mode) {
    const gpu = new GPU({ mode: mode });
    const input = GPU.input;
    const kernel = gpu.createKernel(function(a, x, y, z) {
      return a[z][y][x];
    })
      .setOutput([1]);

    const a = new Float32Array(64);
    a.set([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]);
    const aInput = input(a, [2, 4, 4]);
    QUnit.assert.deepEqual(QUnit.extend([], kernel(aInput, 1, 2, 3)), [30]);
    QUnit.assert.deepEqual(QUnit.extend([], kernel(aInput, 0, 2, 3)), [29]);
    QUnit.assert.deepEqual(QUnit.extend([], kernel(aInput, 0, 2, 1)), [13]);
    QUnit.assert.deepEqual(QUnit.extend([], kernel(aInput, 1, 2, 2)), [22]);
    QUnit.assert.deepEqual(QUnit.extend([], kernel(aInput, 0, 2, 2)), [21]);
    gpu.destroy();
  }

  QUnit.test("inputZYXVariables (auto)", function() {
    inputZYXVariables();
  });

  QUnit.test("inputZYXVariables (gpu)", function() {
    inputZYXVariables('gpu');
  });

  (GPU.isWebGLSupported ? QUnit.test : QUnit.skip)("inputZYXVariables (webgl)", function () {
    inputZYXVariables('webgl');
  });

  (GPU.isWebGL2Supported ? QUnit.test : QUnit.skip)("inputZYXVariables (webgl2)", function () {
    inputZYXVariables('webgl2');
  });

  (GPU.isHeadlessGLSupported ? QUnit.test : QUnit.skip)("inputZYXVariables (headlessgl)", function () {
    inputZYXVariables('headlessgl');
  });

  QUnit.test("inputZYXVariables (cpu)", function() {
    inputZYXVariables('cpu');
  });
})();
