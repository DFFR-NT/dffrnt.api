
'use strict';

// ----------------------------------------------------------------------------------------------
// Handle Requires ------------------------------------------------------------------------------

	// System Requires
		// --------------------------------------------
		const {
			colors, Assign, Imm, StrTime, ROOTD, LJ, path, os, fs,
			ARGS, TYPE, EXTEND, HIDDEN, DEFINE, NIL, UoN, IaN, IS,
			ISS, OF, FOLDER, DCT, RGX, FRMT, CLM, CLMNS, ELOGR,
			preARGS, Dbg, LG, TLS, JSN
		} = require('dffrnt.utils');

	// Route/Session Requires
		const 	express 		  = require('express');
		const { Routes, Session } = require('dffrnt.route');
		const { Settings 		} = require('dffrnt.confs');
		const { createServer 	} = require('http');

	// Setup Requires
		let api 	= express(),
			server 	= createServer(api),
			sess 	= Session(server, api),
			port 	= Settings.Port;

// ----------------------------------------------------------------------------------------------
// Setup Server ---------------------------------------------------------------------------------

	// Start the DB Connection; Configure Routes
		// -----------------------------------------
		Routes.Init( api, express, sess, Settings );

	// The http server listens on port 3000
		process.on('uncaughtException', function (err) {
			if (!!err) {
				console.log(err)
				LG.Error(err.code || '????', 'ERROR', err.syscall || err.toString());
			} else {
				LG.Error(err.code || '????', 'ERROR', "Throws Error; Gives you nothing to work with.");
			}
		});
		server.timeout = 0;
		server.listen(port, function (err) {
			if (err) throw err; LG.Server(port, 'Listen', 'initialized', 'yellow');
		});


// ----------------------------------------------------------------------------------------------
