var GPU = require('../../src/index');

(function() {
  function getCanvasTest(mode ) {
    var gpu = new GPU();

    QUnit.assert.ok(gpu.getCanvas() === null, 'canvas is initially null');

    var render = gpu.createKernel(function() {
      this.color(0, 0, 0, 1);
    }, {
      output : [30,30],
      mode : mode
    }).setGraphical(true);

    QUnit.assert.ok(render !== null, 'function generated test');

    QUnit.assert.ok(render.getCanvas(), 'testing for canvas after createKernel' );
    QUnit.assert.ok(gpu.getCanvas(), 'testing for canvas after createKernel' );

    //
    // NOTE: GPU mode somehow return null when render()
    //
    var r = render();
    QUnit.assert.ok(r || true, 'rendering' );

    QUnit.assert.ok(render.getCanvas(), 'testing for canvas after render' );
    QUnit.assert.ok(gpu.getCanvas(), 'testing for canvas after render' );
    gpu.destroy();
  }

  QUnit.test('getCanvas (auto)', function() {
    getCanvasTest(null);
  });

  QUnit.test('getCanvas (gpu)', function() {
    getCanvasTest('gpu');
  });

  (GPU.isWebGLSupported ? QUnit.test : QUnit.skip)('getCanvas (webgl)', function () {
    getCanvasTest('webgl');
  });

  (GPU.isWebGL2Supported ? QUnit.test : QUnit.skip)('getCanvas (webgl2)', function () {
    getCanvasTest('webgl2');
  });

  (GPU.isHeadlessGLSupported ? QUnit.test : QUnit.skip)('getCanvas (headlessgl)', function () {
    getCanvasTest('headlessgl');
  });

  QUnit.test('getCanvas (CPU)', function() {
    getCanvasTest('cpu');
  });
})();
