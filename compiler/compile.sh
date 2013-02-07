node r.js -o build.js
java -jar compiler.jar --js tmp/compile.tmp --compilation_level=ADVANCED_OPTIMIZATIONS \
  --js_output_file ../jsFrames.min.js --externs externs.js