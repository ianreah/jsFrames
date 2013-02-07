// RequireJS (or similar AMD loader):
var define = {
    "amd": {
        "jQuery": {}
    }
}

// The library doesn't use jQuery or underscore but by including
// externs for their top-level, single-letter aliases here it
// will stop the compiler from using these symbols in its
// renaming so preventing any collisions if the library is used
// alongside either jQuery or underscore.
function $(arg1, arg2) {}
function _(obj) {};