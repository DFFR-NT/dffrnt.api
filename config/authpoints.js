
/////////////////////////////////////////////////////////////////////////////////////////////
// THINGS TO KNOW:
	//
	// SQL  - <Object> - See help for dffrnt.model
	// AMP  - <String> - AND character (+), for HTTP queries
	// ORS  - <String> -  OR character (;), for HTTP queries
	// PIP  - <String> -  OR character (|), for  SQL queries
	//
	// UER  - <Array>  - See help for Errors.js in dffrnt.router
	// MSG  - <Array>  - See help for Errors.js in dffrnt.router
	// PRM  - <Array>  - See help for Errors.js in dffrnt.router
	//
	// Docs - <Object> - See help for dffrnt.router
	//
	// LG   - <Object> - See help for dffrnt.utils
	// TLS  - <Object> - See help for dffrnt.utils
	// JSN  - <Object> - See help for dffrnt.utils
	//

/////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT
	export default function () { return { // DO NOT CHANGE/REMOVE!!!
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		Auth: 		{
			Actions: 	{
				// ======================================================================
				Login: {
					Scheme: '/',
					Sub: 	null,
					Doc: 	{
						Methods: 	Docs.Kinds.POST,
						Headers: 	{},
						Examples: 	{ "/": "Starts the {{User}} Session", },
						Params: 	{
							Email:    { type: "Text", description: "The account's {{Email}}",     required: true, to: 'param' },
							Password: { type: "Text", description: "The account's {{Password}}",  required: true, to: 'param' },
						},
					},
					Proc: 	{
						Decrypt: 	true,
						Error: 		'ERROR',
						NoData  	(req, res, next) {
							var THS = this, sess = req.session,
								sid = req.sessionID, acct = req.body.username;
							THS.Passer.authenticate('local-login',  (err, user, info) => {
								var error = err || info;
								switch (true) {
									case !!error: THS.ER(res, MSG.ERROR, error, null); break;;
									case !!!user: THS.ER(res, MSG.EXISTS,   {}, acct); break;;
									default: acct = user.email_address;
										THS.Profile(acct, true, res, user => {
											req.session.user  = { acct:  user.Account, token: user.Token };
											req.session.touch(); req.session.save();
											THS.OK(res, MSG.LOADED.temp, user, null, req.query);
											LG.Server(sid, 'Loaded', acct, 'green');
										}); break;;
								};
							})(req, res, next);
						},
						Main  		(req, res, next) {
							var THS  = this,
								sess = req.session,
								sid  = req.sessionID,
								acct = sess.user.acct;
							if (acct == req.body.username) {
								THS.Profile(acct, true, res, profile => {
									THS.Renew(req);
									THS.OK(res, MSG.RESTORED.temp, profile, null, req.query);
									LG.Server(sid, 'Restored', acct, 'green');
								});
							} else {
								console.log('PROFILE', profile)
								req.session.regenerate(function(err) {
									LG.Server(sid, 'Regenerated', acct, 'red');
									!!err && THS.Login(req, res, next);
								});
							}
						}
					}
				},
				// ======================================================================
				Validate: {
					Scheme: null,
					Sub: 	null,
					Doc: 	{
						Methods: 	Docs.Kinds.MID,
						Headers: 	{ token: Docs.Headers.Token },
					},
					Proc: 		{
						Error: 		'NO_DELETE',
						NoData: 	'INVALID',
						Main  		(req, res, next) {
							var THS  = this,
								sess = req.session,
								sid  = req.sessionID,
								acct = sess.user.acct,
								head = req.headers,
								qry  = req.query||{},
								SSD  = { sessionID: sid }, ERR;
							// ----------------------------------------------------------
							switch (true) {
								case head.token!=sess.user.token:
									acct = sess.user.acct;
									ERR  = MSG.TOKEN;  break;;
								default: ERR = MSG.TOKEN;
									acct = sess.user.acct;
									THS.Renew(req); next(); return;
							}
							// Handle Errors --------------------------------------------
							THS.ER(res, ERR, SSD, (acct||''), qry);
						}
					}
				},
				// ======================================================================
				Check: {
					Scheme: null,
					Sub: 	null,
					Doc: 	{ Methods: 	Docs.Kinds.MID },
					Proc: 		{
						Error: 		'ERROR',
						NoData: 	'INVALID',
						Main  		(req, res, next) {
							var THS  = this,
								sess = req.session,
								sid  = req.sessionID,
								acct = sess.user.acct,
								head = req.headers,
								OUT  = { path: '/auth/logout' },
								SSD  = { sessionID: sid },
								ERR, CDE, MES, ITM;
							// ----------------------------------------------------------
							switch (true) {
								// case !!!sess.user: 		 ERR = MSG.ERROR;  break;;
								case !!!sess.user.token:
									ERR = MSG.EXISTS; break;;
								default:
									THS.sid = req.sessionID;
									THS.Profile(acct, true, res, usr => {
										THS.Renew(req); head.token = usr.Token;
										MES = MSG.PROFILE.temp;
										OUT = { path: '/auth/login' };
										THS.OK(res, MES, usr, acct, OUT);
									}); return;
							}
							// Handle Errors --------------------------------------------
							THS.ER(res, ERR, SSD, (acct||''), OUT);
						}
					}
				},
				// ======================================================================
				Logout: {
					Scheme: '/',
					Sub: 	null,
					Doc: 	{
						Methods: 	Docs.Kinds.POST,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{ "/": "Ends the User Session", },
						Params: 	{},
					},
					Proc: 		{
						Error: 		'ERROR',
						NoData: 	'LOGIN',
						Main  		(req, res, next) {
							var THS  = this, sess = req.session,
								sid  = req.sessionID, acct = sess.user.acct;
							// Remove Session Data
							delete req.session.user; req.session.save();
							// Notify client
							THS.OK(res, MSG.ENDED.temp, { Account: acct }, null, req.query);
							LG.Server(sid, 'Ending', acct, 'green');
						}
					}
				},
			},
			Errors: 	{ BAD_REQ: ['/'] }
		},
	};	};

/////////////////////////////////////////////////////////////////////////////////////////////
