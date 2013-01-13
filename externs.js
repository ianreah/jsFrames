// This prevents the closure compiler from using the $ symbol
// when renaming items on the global object. (Otherwise, it 
// can cause problems when I try to use the library and jQuery.)
var $;

// TODO: This seems a bit flaky - is there a better solution?
// For example, if I wanted to use the library with underscore.js
// I would have to add "var _" to here. What about any other
// potential conflicts I haven't thought about?
