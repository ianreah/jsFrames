﻿$(function () {
    var Firework = jsFrames.Particle.extend({
        init: function (position, velocity, color, exploded) {
            this._super(position, velocity, color);
            this.exploded = exploded;
        },

        update: function() {
            this._super();

            if (this.alpha < 0.005) {
                jsFrames.removeParticle(this);

                if (!this.exploded) {
                    var count = 100;
                    var angle = (Math.PI * 2) / count;
                    while (count--) {

                        var randomVelocity = 4 + Math.random() * 4;
                        var particleAngle = count * angle;

                        createFirework(
                          this.position,
                          {
                              x: Math.cos(particleAngle) * randomVelocity,
                              y: Math.sin(particleAngle) * randomVelocity
                          },
                          this.color,
                          true);
                    }
                }
            }
        }
    });

    var createFirework = function(position, velocity, color, exploded) {
        var firework = new Firework(position, velocity, color, exploded);
        jsFrames.addParticle(firework);
    };

    var theCanvas = $('#theCanvas')[0];
    var drawingContext = theCanvas.getContext("2d");

    Rx.Observable.generateWithRelativeTime(
        0,
        function (x) {
            return true;
        },
        function (x) {
            return x;
        },
        function (x) {
            return x;
        },
        function (x) {
            return Math.random() * 3000;
        })
        .subscribe(function (x) {
            createFirework(
                { x: theCanvas.width * 0.5, y: theCanvas.height + 10 }, // firework start position
                { x: Math.random() * 3 - 1.5, y: -10 }, // velocity
                "hsl(" + Math.random() * 255 + ",100%,60%)"); // color
        });

    jsFrames.registerAnimation(function () {
        drawingContext.fillStyle = "rgba(0,0,0,0.2)";
        drawingContext.fillRect(0, 0, theCanvas.width, theCanvas.height);

        jsFrames.renderParticles(drawingContext);
    });

    var theFpsDisplay = $('#fps');
    jsFrames.onFpsUpdate(function (fps) {
        theFpsDisplay.html("FPS: " + fps);
    });

    jsFrames.start();
});