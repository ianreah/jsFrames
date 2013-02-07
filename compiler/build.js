({
	name: '../jsFrames',
	out: 'tmp/compile.tmp',
	optimize: 'none',
	
	wrap: {
		endFile: 'wrap.end'
	},
	
	paths: {
		'rx.time': '../third-party/rx.time',
		rx: '../third-party/rx'
	}
})