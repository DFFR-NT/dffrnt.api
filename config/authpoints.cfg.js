
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
	module.exports = function () { return { // DO NOT CHANGE/REMOVE!!!
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		Auth: 		{
			Actions: 	{
				// ======================================================================
				Login: {
					Scheme: '/',
					Limits: ['Tries/Day'],
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
						Decrypt: 	 true,
						Error: 		 'ERROR',
						async NoData (req) {
							let THS  = this, user,
								sess = req.session,
								sid  = req.sessionID, 
								body = req.body,
								acct = body.username;
							// ----------------------------------------------------------
								function LogUserIn(THS, req) {
									return new Promise((resolve, reject) => {
										THS.Passer.authenticate('local-login', (err, user, info) => {
											let error = err || info;
											switch (true) {
												case !!error: reject([MSG.ERROR, error, null]);
												case !!!user: reject([MSG.EXISTS,   {}, acct]);
												default: resolve(user);
											};
										})(req);
									});
								}
							// ----------------------------------------------------------
							try { 
								user = await LogUserIn(THS, req);

								acct = user.email_address;
								user = await THS.Profile(acct, true);

								sess.user  = { 
									id:		user.Scopes.user_id, 
									acct:	user.Account, 
									token:	user.Token, 
								};	sess.touch(); sess.save();
								
								LG.Server(sid, 'Loaded', acct, 'green');

								delete body.username; delete body.password;

								return [
									MSG.LOADED.temp, 
									user, null, body
								]; 
							// Handle Errors --------------------------------------------
							} catch (err) { throw err; }
						},
						async Main   (req) {
							let THS  = this, 
								sess = req.session,
								sid  = req.sessionID,
								user = sess.user,
								acct = user.acct,
								body = req.body;
							// ----------------------------------------------------------
							try {
								if (acct == body.username) {
									user = await THS.Profile(acct, true);

									THS.Renew(req); 
									delete user.Scopes.user_pass;
									delete body.username;
									delete body.password;
									LG.Server(sid, 'Restored', acct, 'green');

									return [
										MSG.RESTORED.temp, 
										user, null, body
									];
								} else {
									return await new Promise(resolve => {
										req.session.regenerate(err => {
											LG.Server(sid, 'Regenerated', acct, 'red');
											if (!!err) resolve(THS.Login(req));
											resolve([
												MSG.RESTORED.temp, 
												user, null, body
											]);
										});
									});
								}
							// Handle Errors --------------------------------------------
							} catch (err) { throw err; }
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
					Proc: 	{
						Error: 		'NO_DELETE',
						NoData: 	'INVALID',
						async Main  (req) {
							let THS  = this,
								sess = req.session,
								sid  = req.sessionID,
								user = sess.user,
								uid  = user.id,
								acct = user.acct,
								head = req.headers,
								spc  = req.originalUrl,
								bdy  = req.body||{},
								prm  = req.params||{},
								SSD  = { sessionID: sid }, ERR;
							// ----------------------------------------------------------
							try {
								switch (true) {
									case head.token!==user.token: 
										throw [MSG.TOKEN, SSD, (acct||''), bdy];
									case !!spc.match(/^\/update/): 
										prm.uids = uid; bdy.single = 'true';
									case !!!prm.uid && !!!bdy.uid: 
										bdy.uid  = uid;
									default: 
										THS.Renew(req);
										return true;
								}
							// Handle Errors --------------------------------------------
							} catch (err) { throw err; }
						}
					}
				},
				// ======================================================================
				Check: {
					Scheme: null,
					Sub: 	null,
					Doc: 	{ Methods: 	Docs.Kinds.MID },
					Proc: 	{
						Error: 		'ERROR',
						NoData: 	'INVALID',
						async Main  (req) {
							let THS  = this,
								sess = req.session,
								sid  = req.sessionID,
								user = sess.user,
								acct = user.acct,
								head = req.headers,
								bdy  = req.body,
								OUT  = { path: '/auth/logout' },
								IN   = { path: '/auth/login'  },
								SSD  = { sessionID: sid },
								ERR, CDE, MES, ITM;
							// ----------------------------------------------------------
							try {
								switch (true) {
									case !!!sess.user.token:
										throw [MSG.EXISTS, SSD, (acct||''), OUT];
									default:
										THS.sid = req.sessionID;
										user = await THS.Profile(acct, true);

										THS.Renew(req); 
										head.token = user.Token;
										delete user.Scopes.user_pass;

										return [
											MSG.PROFILE.temp, 
											user, acct, 
											Assign(IN, bdy),
										];
								};	
							// Handle Errors --------------------------------------------
							} catch (err) { throw err; }
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
					Proc: 	{
						Error: 		 'ERROR',
						NoData: 	 'LOGIN',
						async Main   (req) {
							let THS  = this, 
								sess = req.session,
								sid  = req.sessionID, 
								bdy  = req.body,
								acct = sess.user.acct;

							try {
								// Remove Session Data
								delete req.session.user; req.session.save();
								// Notify client
								LG.Server(sid, 'Ending', acct, 'green');
								return [
									MSG.ENDED.temp, 
									{ Account: acct }, 
									null, bdy
								];
							// Handle Errors --------------------------------------------
							} catch (err) { throw [MSG.ERROR, {}, {}, bdy]; }
						}
					}
				},
			},
			Errors: 	{ BAD_REQ: ['/'] }
		},
	};	};

/////////////////////////////////////////////////////////////////////////////////////////////
