$(function () {
    function triangleWave(time, period, amplitude) {
        return Math.abs(2 * (time / period - Math.floor(time / period + 0.5))) * amplitude;
    }

    var ballRadius = 10;
    var speed = 10000; // milliseconds to cover canvas height (and back again!)

    var theCanvas = $('#theCanvas')[0];
    var drawingContext = theCanvas.getContext("2d");

    resize();
    $(window).resizeAsObservable()
			 .throttle(250)
			 .subscribe(resize);

    function resize() {
        theCanvas.width = $(window).width();
        theCanvas.height = $(window).height();
    }

    jsFrames.registerAnimation(function (thisFrameTimestamp) {
        var position = triangleWave(thisFrameTimestamp - startTime, speed, theCanvas.height - ballRadius * 2) + ballRadius;

        drawingContext.clearRect(0, 0, theCanvas.width, theCanvas.height);

	    drawingContext.beginPath();
	    drawingContext.arc(theCanvas.width / 2, position, ballRadius, 0, Math.PI * 2, false);
	    drawingContext.closePath();

	    drawingContext.fillStyle = "#FF0000";
	    drawingContext.fill();
	});

	var theFpsDisplay = $('#fps');
	jsFrames.fpsStream.subscribe(function (fps) {
		theFpsDisplay.html("FPS: " + fps);
	});
	
	var startTime = jsFrames.start();
});
