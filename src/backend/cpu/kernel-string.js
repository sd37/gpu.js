'use strict';

const utils = require('../../core/utils');
const kernelRunShortcut = require('../kernel-run-shortcut');

function removeFnNoise(fn) {
	if (/^function /.test(fn)) {
		fn = fn.substring(9);
	}
	return fn.replace(/[_]typeof/g, 'typeof');
}

function removeNoise(str) {
	return str
		.replace(/^[A-Za-z]+/, 'function')
		.replace(/[_]typeof/g, 'typeof');
}

module.exports = function(cpuKernel, name) {
	return `() => {
    ${ kernelRunShortcut.toString() };
    const utils = {
      allPropertiesOf: ${ removeNoise(utils.allPropertiesOf.toString()) },
      clone: ${ removeNoise(utils.clone.toString()) },
      checkOutput: ${ removeNoise(utils.checkOutput.toString()) }
    };
    const Utils = utils;
    let Input = function() {};
    class ${ name || 'Kernel' } {
      constructor() {        
        this.argumentsLength = 0;
        this.canvas = null;
        this.context = null;
        this.built = false;
        this.program = null;
        this.paramNames = ${ JSON.stringify(cpuKernel.paramNames) };
        this.paramTypes = ${ JSON.stringify(cpuKernel.paramTypes) };
        this.texSize = ${ JSON.stringify(cpuKernel.texSize) };
        this.output = ${ JSON.stringify(cpuKernel.output) };
        this._kernelString = \`${ cpuKernel._kernelString }\`;
        this.output = ${ JSON.stringify(cpuKernel.output) };
		    this.run = function() {
          this.run = null;
          this.build();
          return this.run.apply(this, arguments);
        }.bind(this);
        this.thread = {
          x: 0,
          y: 0,
          z: 0
        };
      }
      setCanvas(canvas) { this.canvas = canvas; return this; }
      setContext(context) { this.context = context; return this; }
      setInput(Type) { Input = Type; }
      ${ removeFnNoise(cpuKernel.build.toString()) }
      ${ removeFnNoise(cpuKernel.setupParams.toString()) }
      ${ removeFnNoise(cpuKernel.setupConstants.toString()) }
      run () { ${ cpuKernel.kernelString } }
      getKernelString() { return this._kernelString; }
      ${ removeFnNoise(cpuKernel.validateSettings.toString()) }
    };
    return kernelRunShortcut(new Kernel());
  };`;
};