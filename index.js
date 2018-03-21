
// ----------------------------------------------------------------------------------------------
// Handle Requires ------------------------------------------------------------------------------

	// All of our successive `require`s will be Babel'd
	require('babel-register')({
		presets: ['babel-preset-env'],
		ignore:  /(node_modules\/)(?!dffrnt\.)[^\/]+(\/[^\/]+)*/
	});

	// Start the server
	require('./main/server.js');
