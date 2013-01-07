// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                                   || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

// jsFrames main module
window.jsFrames = (function (rx, jsF) {
	var animations = [];
	
	var filterStrength = 20;
	var frameTime = 0, lastFrameTimestamp = 0;

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

	jsF.registerAnimation = function(animation) {
		animations.push(animation);
	};

	jsF.start = function () {
		lastFrameTimestamp = Date.now();
		
		animate(lastFrameTimestamp);
		return lastFrameTimestamp;
	};
	
	jsF.fpsStream = rx.Observable.interval(1000).select(function () {
	    return (1000 / frameTime).toFixed();
	}).distinctUntilChanged();

	return jsF;
}(window.Rx, window.jsFrames || {}));