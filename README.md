jsFrames
========

A JavaScript library for creating frame-based animations.

**Example usage:**

Register any functions to be called on each frame. The functions accept a single parameter for the timestamp of the current frame.

```javascript
jsFrames.registerAnimation(function (thisFrameTimestamp) {
    // Get the position of your animated items based on thisFrameTimestamp
    // Draw the frame...
});
```

(Optionally), subscribe to get frames per second updates.

```javascript
jsFrames.onFpsUpdate(function (fps) {
    // Display frames per second
});
```

Start the animation.

```javascript
jsFrames.start();
```

See [the project pages](http://ianreah.github.com/jsFrames/) for more details.
