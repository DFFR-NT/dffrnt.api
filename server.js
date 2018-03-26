
'use strict';

// ----------------------------------------------------------------------------------------------
// Handle Requires ------------------------------------------------------------------------------

	// System Requires
		// --------------------------------------------
		import {
			colors, Assign, Imm, StrTime, ROOTD, LJ, path, os, fs,
			ARGS, TYPE, EXTEND, HIDDEN, DEFINE, NIL, UoN, IaN, IS,
			ISS, OF, FOLDER, DCT, RGX, FRMT, CLM, CLMNS, ELOGR,
			preARGS, Dbg, LG, TLS, JSN
		} from 'dffrnt.utils';

	// Route/Session Requires
		import { default as express  } from 'express';
		import { Routes, Session 	 } from 'dffrnt.route';
		import { default as settings } from '../config/settings.js';

	// Setup Requires
		import { createServer } from 'http';
		const 	api 	= express(),
				server 	= createServer(api),
				sess 	= Session(server, api),
				port 	= settings.Port;

// ----------------------------------------------------------------------------------------------
// Setup Server ---------------------------------------------------------------------------------

	// Start the DB Connection; Configure Routes
		// -----------------------------------------
		Routes.Init( api, express, sess, settings );

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
