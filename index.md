---
layout: default
title: jsFrames
project_url: https://github.com/ianreah/jsFrames
styles:
  - example-styles.css
---

### jsFrames ###

A JavaScript library for creating frame-based animations.

**Example usage:**

<span id="fps"> </span>

<canvas id="theCanvas"> </canvas>

Register any functions to be called on each frame. The functions accept a single parameter for the timestamp of the current frame.

{% highlight javascript %}
jsFrames.registerAnimation(function (thisFrameTimestamp) {
    // Get the ball position based on thisFrameTimestamp
    var position = ...

   // Draw the frame...
});
{% endhighlight %}

(Optionally), subscribe to get frames per second updates.

{% highlight javascript %}
jsFrames.onFpsUpdate(function (fps) {
    // Display frames per second
});
{% endhighlight %}

Start the animation.

{% highlight javascript %}
jsFrames.start();
{% endhighlight %}

See the [complete JavaScript](js/main.js) for this example.

There is also experimental support for particles with some very basic physics. See [fireworks.js](js/fireworks.js) for the code used to create this example...

<canvas id="fireworks" width="800" height="400"> </canvas>

**Some implementation details:**

The frames are scheduled using the [requestAnimationFrame function](http://creativejs.com/resources/requestanimationframe/) and [a polyfill](https://gist.github.com/1579671) to get around varied support.

<script type="text/javascript" src="js/jquery-1.8.3.min.js"> </script>
<script type="text/javascript" src="js/jsFrames.min.js"> </script>
<script type="text/javascript" src="js/fireworks.js"> </script>
<script type="text/javascript" src="js/main.js"> </script>
