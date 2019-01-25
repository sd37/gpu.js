'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var utils = require('./utils');
var GPUCore = require('./gpu-core');
var CPURunner = require('../backend/cpu/runner');
var HeadlessGLRunner = require('../backend/headless-gl/runner');
var WebGL2Runner = require('../backend/web-gl2/runner');
var WebGLRunner = require('../backend/web-gl/runner');

var runners = [HeadlessGLRunner, WebGL2Runner, WebGLRunner];

var runnerTypes = ['gpu', 'cpu'];

var internalRunners = {
	'headlessgl': HeadlessGLRunner,
	'webgl2': WebGL2Runner,
	'webgl': WebGLRunner
};

/**
 * Initialises the GPU.js library class which manages the webGlContext for the created functions.
 */

var GPU = function (_GPUCore) {
	_inherits(GPU, _GPUCore);

	_createClass(GPU, null, [{
		key: 'runners',
		get: function get() {
			return runners;
		}
	}, {
		key: 'runnerTypes',
		get: function get() {
			return runnerTypes;
		}
		/**
   * Creates an instance of GPU.
   * @param {Object} [settings] - Settings to set mode, and other properties. See #GPUCore
   */

	}]);

	function GPU(settings) {
		_classCallCheck(this, GPU);

		var _this = _possibleConstructorReturn(this, (GPU.__proto__ || Object.getPrototypeOf(GPU)).call(this));

		settings = settings || {};
		_this.canvas = settings.canvas || null;
		_this.context = settings.context || null;
		var mode = _this.mode = settings.mode;
		var Runner = null;

		if (_this.context) {
			for (var i = 0; i < runners.length; i++) {
				var ExternalRunner = runners[i];
				if (ExternalRunner.isContextMatch(_this.context)) {
					Runner = ExternalRunner;
					break;
				}
			}
			if (Runner === null) {
				throw new Error('unknown Context');
			}
		} else if (mode) {
			if (mode in internalRunners) {
				Runner = internalRunners[mode];
			} else if (mode === 'gpu') {
				for (var _i = 0; _i < runners.length; _i++) {
					if (runners[_i].isSupported) {
						Runner = runners[_i];
						break;
					}
				}
			} else if (mode === 'cpu') {
				Runner = CPURunner;
			}
			if (!Runner) {
				throw new Error('A requested mode of "' + mode + '" and is not supported');
			}
		} else {
			for (var _i2 = 0; _i2 < runners.length; _i2++) {
				if (runners[_i2].isSupported) {
					Runner = runners[_i2];
					break;
				}
			}
			if (!Runner) {
				Runner = CPURunner;
			}
		}

		_this.kernels = [];
		_this.runner = new Runner(settings);
		return _this;
	}
	/**
  *
  * @desc This creates a callable function object to call the kernel function with the argument parameter set
  *
  * @param {Function} fn - The calling to perform the conversion
  * @param {Object} [settings] - The parameter configuration object
  * @property {String} settings.dimensions - Thread dimension array (Defaults to [1024])
  * @property {String} settings.mode - CPU / GPU configuration mode (Defaults to null)
  *
  * The following modes are supported
  * *'falsey'* : Attempts to build GPU mode, else fallbacks
  * *'gpu'* : Attempts to build GPU mode, else fallbacks
  * *'cpu'* : Forces JS fallback mode only
  *
  * @returns {Function} callable function to run
  */


	_createClass(GPU, [{
		key: 'createKernel',
		value: function createKernel(fn, settings) {
			//
			// basic parameters safety checks
			//
			if (typeof fn === 'undefined') {
				throw 'Missing fn parameter';
			}
			if (!utils.isFunction(fn) && typeof fn !== 'string') {
				throw 'fn parameter not a function';
			}

			var mergedSettings = Object.assign({
				context: this.context,
				canvas: this.canvas
			}, settings || {});

			var kernel = this.runner.buildKernel(fn, mergedSettings);

			//if canvas didn't come from this, propagate from kernel
			if (!this.canvas) {
				this.canvas = kernel.getCanvas();
			}
			if (!this.context) {
				this.context = kernel.getContext();
			}
			this.kernels.push(kernel);

			return kernel;
		}

		/**
   *
   * Create a super kernel which executes sub kernels
   * and saves their output to be used with the next sub kernel.
   * This can be useful if we want to save the output on one kernel,
   * and then use it as an input to another kernel. *Machine Learning*
   *
   * @param {Object|Array} subKernels - Sub kernels for this kernel
   * @param {Function} rootKernel - Root kernel
   *
   * @returns {Function} callable kernel function
   *
   * @example
   * const megaKernel = gpu.createKernelMap({
   *   addResult: function add(a, b) {
   *     return a[this.thread.x] + b[this.thread.x];
   *   },
   *   multiplyResult: function multiply(a, b) {
   *     return a[this.thread.x] * b[this.thread.x];
   *   },
   *  }, function(a, b, c) {
   *       return multiply(add(a, b), c);
   * });
   *
   * megaKernel(a, b, c);
   *
   * Note: You can also define subKernels as an array of functions.
   * > [add, multiply]
   *
   */

	}, {
		key: 'createKernelMap',
		value: function createKernelMap() {
			var fn = void 0;
			var settings = void 0;
			if (typeof arguments[arguments.length - 2] === 'function') {
				fn = arguments[arguments.length - 2];
				settings = arguments[arguments.length - 1];
			} else {
				fn = arguments[arguments.length - 1];
			}

			if (!this.runner.constructor.isSupported || !this.runner.constructor.features.kernelMap) {
				if (this.mode && runnerTypes.indexOf(this.mode) < 0) {
					throw new Error('kernelMap not supported on ' + this.runner.constructor.name);
				}
			}

			var kernel = this.createKernel(fn, settings);
			if (Array.isArray(arguments[0])) {
				var functions = arguments[0];
				for (var i = 0; i < functions.length; i++) {
					kernel.addSubKernel(functions[i]);
				}
			} else {
				var _functions = arguments[0];
				for (var p in _functions) {
					if (!_functions.hasOwnProperty(p)) continue;
					kernel.addSubKernelProperty(p, _functions[p]);
				}
			}

			return kernel;
		}

		/**
   *
   * Combine different kernels into one super Kernel,
   * useful to perform multiple operations inside one
   * kernel without the penalty of data transfer between
   * cpu and gpu.
   *
   * The number of kernel functions sent to this method can be variable.
   * You can send in one, two, etc.
   *
   * @param {Function} subKernels - Kernel function(s) to combine.
   * @param {Function} rootKernel - Root kernel to combine kernels into
   *
   * @example
   * 	combineKernels(add, multiply, function(a,b,c){
   *	 	return add(multiply(a,b), c)
   *	})
   *
   * @returns {Function} Callable kernel function
   *
   */

	}, {
		key: 'combineKernels',
		value: function combineKernels() {
			var lastKernel = arguments[arguments.length - 2];
			var combinedKernel = arguments[arguments.length - 1];
			if (this.getMode() === 'cpu') return combinedKernel;

			var canvas = arguments[0].getCanvas();
			var context = arguments[0].getContext();

			for (var i = 0; i < arguments.length - 1; i++) {
				arguments[i].setCanvas(canvas).setContext(context).setOutputToTexture(true);
			}

			return function () {
				combinedKernel.apply(null, arguments);
				var texSize = lastKernel.texSize;
				var gl = lastKernel.getContext();
				var threadDim = lastKernel.threadDim;
				var result = void 0;
				if (lastKernel.floatOutput) {
					var w = texSize[0];
					var h = Math.ceil(texSize[1] / 4);
					result = new Float32Array(w * h * 4);
					gl.readPixels(0, 0, w, h, gl.RGBA, gl.FLOAT, result);
				} else {
					var bytes = new Uint8Array(texSize[0] * texSize[1] * 4);
					gl.readPixels(0, 0, texSize[0], texSize[1], gl.RGBA, gl.UNSIGNED_BYTE, bytes);
					result = new Float32Array(bytes.buffer);
				}

				result = result.subarray(0, threadDim[0] * threadDim[1] * threadDim[2]);

				if (lastKernel.output.length === 1) {
					return result;
				} else if (lastKernel.output.length === 2) {
					return utils.splitArray(result, lastKernel.output[0]);
				} else if (lastKernel.output.length === 3) {
					var cube = utils.splitArray(result, lastKernel.output[0] * lastKernel.output[1]);
					return cube.map(function (x) {
						return utils.splitArray(x, lastKernel.output[0]);
					});
				}
			};
		}

		/**
   * @desc Adds additional functions, that the kernel may call.
   * @param {Function|String} fn - JS Function to do conversion
   * @param {Object} [settings]
   * @returns {GPU} returns itself
   */

	}, {
		key: 'addFunction',
		value: function addFunction(fn, settings) {
			this.runner.functionBuilder.addFunction(null, fn, settings);
			return this;
		}

		/**
   * @desc Adds additional native functions, that the kernel may call.
   * @param {String} name - native function name, used for reverse lookup
   * @param {String} nativeFunction - the native function implementation, as it would be defined in it's entirety
   * @returns {GPU} returns itself
   */

	}, {
		key: 'addNativeFunction',
		value: function addNativeFunction(name, nativeFunction) {
			this.runner.functionBuilder.addNativeFunction(name, nativeFunction);
			return this;
		}

		/**
   * @desc Return the current mode in which gpu.js is executing.
   * @returns {String} The current mode, "cpu", "webgl", etc.
   */

	}, {
		key: 'getMode',
		value: function getMode() {
			return this.runner.getMode();
		}

		/**
   * @desc Return TRUE, if browser supports WebGL AND Canvas
   *
   * @returns {Boolean} TRUE if browser supports webGl
   */

	}, {
		key: 'getCanvas',

		/**
   * @desc Return the canvas object bound to this gpu instance.
   * @returns {Object} Canvas object if present
   */
		value: function getCanvas() {
			return this.canvas;
		}

		/**
   * @desc Return the webGl object bound to this gpu instance.
   * @returns {Object} WebGl object if present
   */

	}, {
		key: 'getContext',
		value: function getContext() {
			return this.context;
		}

		/**
   * Return the runner
   */

	}, {
		key: 'getRunner',
		value: function getRunner() {
			return this.runner;
		}

		/**
   * @desc Destroys all memory associated with gpu.js & the webGl if we created it
   */

	}, {
		key: 'destroy',
		value: function destroy() {
			var _this2 = this;

			// perform on next run loop - for some reason we dont get lose context events
			// if webGl is created and destroyed in the same run loop.
			setTimeout(function () {
				for (var i = 0; i < _this2.kernels.length; i++) {
					_this2.kernels[i].destroy(true); // remove canvas if exists
				}
				_this2.kernels[0].kernel.constructor.destroyContext(_this2.context);
			}, 0);
		}
	}], [{
		key: 'isWebGLSupported',
		get: function get() {
			return WebGLRunner.isSupported;
		}

		/**
   * @desc Return TRUE, if browser supports WebGL2 AND Canvas
   *
   * @returns {Boolean} TRUE if browser supports webGl
   */

	}, {
		key: 'isWebGL2Supported',
		get: function get() {
			return WebGL2Runner.isSupported;
		}

		/**
   * @desc Return TRUE, if node supports WebGL
   *
   * @returns {Boolean} TRUE if browser supports webGl
   */

	}, {
		key: 'isHeadlessGLSupported',
		get: function get() {
			return HeadlessGLRunner.isSupported;
		}
	}, {
		key: 'isCanvasSupported',
		get: function get() {
			throw new Error('how to check canvas');
			return utils.isCanvasSupported();
		}
	}]);

	return GPU;
}(GPUCore);

module.exports = GPU;