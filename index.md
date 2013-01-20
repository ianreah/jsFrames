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

Start the animation. (`startAnimation` returns a timestamp for the start of the animation.)

{% highlight javascript %}
var startTime = jsFrames.start();
{% endhighlight %}

See the [complete JavaScript](js/main.js) for this example.

**Some implementation details:**

The frames are scheduled using the [requestAnimationFrame function](http://creativejs.com/resources/requestanimationframe/) and [a polyfill](https://gist.github.com/1579671) to get round varied support.

<script type="text/javascript" src="js/jquery-1.8.3.min.js"> </script>
<script type="text/javascript" src="js/jsFrames.min.js"> </script>
<script type="text/javascript" src="js/main.js"> </script>
