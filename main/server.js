'use strict';

// ----------------------------------------------------------------------------------------------
// Handle Requires ------------------------------------------------------------------------------

	// System Requires
		// --------------------------------------------
		require('dffrnt.utils')();

	// Route/Session Requires
		var express 	= require('express'),
			router 		= require('dffrnt.route'),
			routes 		= router.Routes,
			sessions 	= router.Session,
			settings 	= require('../config/settings.js')();

	// Setup Requires
		var api 	= express(),
			server 	= require('http').createServer(api),
			sess 	= sessions(server, api),
			port 	= settings.Port;

// ----------------------------------------------------------------------------------------------
// Setup Server ---------------------------------------------------------------------------------

	// Start the DB Connection; Configure Routes
		// -----------------------------------------
		routes.Init( api, express, sess, settings );

	// The http server listens on port 3000
		process.on('uncaughtException', function (err) {
			if (!!err) {
				console.trace(err)
				LG.Error(err.code || '????', 'ERROR', err.syscall || err.toString());
			} else {
				LG.Error(err.code || '????', 'ERROR', "Throws Error; Give no Information.");
			}
		});
		server.timeout = 0;
		server.listen(port, function (err) {
			if (err) throw err; LG.Server(port, 'Listen', 'initialized', 'yellow');
		});


// ----------------------------------------------------------------------------------------------
