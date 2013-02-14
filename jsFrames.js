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
        root.jsFrames = factory(root, root.Rx);
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

    /* Simple JavaScript Inheritance
    * By John Resig http://ejohn.org/
    * MIT Licensed.
    */
    // Inspired by base2 and Prototype
    (function() {
        var initializing = false, fnTest = /xyz/.test(function() { xyz; }) ? /\b_super\b/ : /.*/;

        // The base Class implementation (does nothing)
        this.Class = function() {
        };

        // Create a new Class that inherits from this class
        Class.extend = function(prop) {
            var _super = this.prototype;

            // Instantiate a base class (but only create the instance,
            // don't run the init constructor)
            initializing = true;
            var prototype = new this();
            initializing = false;

            // Copy the properties over onto the new prototype
            for (var name in prop) {
                // Check if we're overwriting an existing function
                prototype[name] = typeof prop[name] == "function" &&
                    typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                    (function(name, fn) {
                        return function() {
                            var tmp = this._super;

                            // Add a new ._super() method that is the same method
                            // but on the super-class
                            this._super = _super[name];

                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            var ret = fn.apply(this, arguments);
                            this._super = tmp;

                            return ret;
                        };
                    })(name, prop[name]) :
                    prop[name];
            }

            // The dummy class constructor
            function Class() {
                // All construction is actually done in the init method
                if (!initializing && this.init)
                    this.init.apply(this, arguments);
            }

            // Populate our constructed prototype object
            Class.prototype = prototype;

            // Enforce the constructor to be what we expect
            Class.prototype.constructor = Class;

            // And make this class extendable
            Class.extend = arguments.callee;

            return Class;
        };
    })();

    var animations = [];
    var particles = [];

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
    };

    var Particle = Class.extend({
        init: function (position, velocity, color) {
            this.gravity = 0.06;
            this.alpha = 1;
            this.fade = Math.random() * 0.1;

            this.position = {
                x: position.x || 0,
                y: position.y || 0
            };

            this.velocity = {
                x: velocity.x || 0,
                y: velocity.y || 0
            };

            this.color = color;

            this.lastPosition = {
                x: this.position.x,
                y: this.position.y
            };
        },
        
        update: function () {
            this.lastPosition.x = this.position.x;
            this.lastPosition.y = this.position.y;

            this.velocity.y += this.gravity;
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.alpha -= this.fade;
        },
        
        render: function (context) {
            context.save();

            context.globalAlpha = this.alpha;
            context.strokeStyle = this.color;

            context.beginPath();
            context.moveTo(this.lastPosition.x, this.lastPosition.y);
            context.lineTo(this.position.x, this.position.y);
            context.stroke();

            context.restore();
        }
    });

    return {
        registerAnimation: function(animation) {
            animations.push(animation);
        },

        start: function () {
            requestAnimationFrame(animate);
        },

        onFpsUpdate: function (action) {
            fpsStream.subscribe(action);
        },

        Particle: Particle,
        
        addParticle: function (particle) {
            particles.push(particle);
        },
        
        removeParticle: function (particle) {
            particles.splice(particles.indexOf(particle), 1);
        },
        
        renderParticles: function (drawingContext) {
            var index = particles.length;
            while (index--) {
                var particle = particles[index];

                particle.update();
                particle.render(drawingContext);
            }
        }
    };
}));