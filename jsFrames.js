(function (root, factory) {
	// Support for module loaders
	// TODO: Include support for CommonJS
    if (typeof define === 'function' && define.amd) {
		// AMD 
		define(['rx.time'], function (Rx) {
			return factory(root, Rx);
		});
    } else {
		// Fallback to browser globals
		// (using square bracket notation to prevent advanced closure
		// compilation from renaming it)
		root['jsFrames'] = factory(root, root.Rx);
    }
}(this, function(global, Rx, undefined){

	// requestAnimationFrame polyfill by Erik Möller
	// fixes from Paul Irish and Tino Zijdel
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	(function () {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for (var x = 0; x < vendors.length && !global.requestAnimationFrame; ++x) {
			global.requestAnimationFrame = global[vendors[x] + 'RequestAnimationFrame'];
			global.cancelAnimationFrame = global[vendors[x] + 'CancelAnimationFrame']
									   || global[vendors[x] + 'CancelRequestAnimationFrame'];
		}

		if (!global.requestAnimationFrame)
			global.requestAnimationFrame = function (callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = global.setTimeout(function () { callback(currTime + timeToCall); },
				  timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};

		if (!global.cancelAnimationFrame)
			global.cancelAnimationFrame = function (id) {
				clearTimeout(id);
			};
	}());

	var animations = [];
	
	var filterStrength = 20;
	var frameTime = 0, lastFrameTimestamp = 0;

	var fpsStream = Rx.Observable.interval(1000).select(function () {
	    return (1000 / frameTime).toFixed();
	}).distinctUntilChanged();

	function animate(timeStamp) {
		requestAnimationFrame(animate);
		
		for (var i = 0; i < animations.length; i++) {
			animations[i](timeStamp);
		}
		
	    // http://stackoverflow.com/questions/4787431/check-fps-in-js/5111475#5111475
		var timeSinceLastFrame = timeStamp - lastFrameTimestamp;
		frameTime += (timeSinceLastFrame - frameTime) / filterStrength;
		lastFrameTimestamp = timeStamp;
	}

	// (Specifying all public properties with strings to prevent advanced closure
	// compilation from renaming them)
	return {
		'registerAnimation': function(animation) {
			animations.push(animation);
		},

		'start': function () {
			lastFrameTimestamp = Date.now();
			
			animate(lastFrameTimestamp);
			return lastFrameTimestamp;
		},
		
		'onFpsUpdate': function (action) {
			fpsStream.subscribe(action);
		}
	};
}));