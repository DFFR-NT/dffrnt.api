
// ----------------------------------------------------------------------------------------------
// Handle Requires ------------------------------------------------------------------------------

	// All of our successive `require`s will be Babel'd
	require('babel-register')({
		presets: ['babel-preset-env'],
		retainLines: true,
		ignore: function ignore(filename) {
			try {
				var RGX = /(node_modules\/)(?!dffrnt\.)[^\/]+(\/[^\/]+)*/,
					MCH = filename.match(RGX); return !!MCH;
			} catch (e) { return true; }
		}
	});

	// Start the server
	require('./main/server.js');
