'use strict';

module.exports = function (Reflux, Actions, Spaces, IOs) {

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// SOCKET HANDLES ///////////////////////////////////////////////////////////////////////////////////////////////

		function SockAuthRoom  (res) { LOG("ROOM | %s", res); 				 }
		function SockConnErr (error) { LOG('CONNECTION ERROR!!', 	 error); }
		function SockConnTO(timeout) { LOG('CONNECTION TIMEOUT!!', timeout); }
		function SockError	 (error) { LOG('SOCKET ERROR!!', 		 error); }
		function SockRConnErr(error) { Actions.App.disconnect({result:{code:4}}); }

		function runAccess() {
			try { if (IOs.Access.connected) return; } catch(e) {}
			IOs.Access = IOs.IO(`${NMESPC.host}/accessor`);
			if (IOs.Access) {
				IOs.Access.on('connect', 		Actions.App.connect);
				IOs.Access.on('room', 			SockAuthRoom);
				IOs.Access.on('receive', 		Actions.Data.receive);
				IOs.Access.on('disconnect', 	Actions.App.disconnect);
					// IOs.Access.on('connet_error',    SockConnErr);
					// IOs.Access.on('connect_timeout',	SockConnErr);
					// IOs.Access.on('error',           SockConnErr);
				IOs.Access.on('reconnect_error',SockRConnErr);
			}
		}
		function runSocket() {
			if (!!IOs && !!IOs.IO) {
				IOs.Socket = IOs.IO(`${NMESPC.host}/${NMESPC.name}`);
				if (!!IOs.Socket) {

					Reflux.initStore(Stores.App);
					Reflux.initStore(Stores.Nav);
					Reflux.initStore(Stores.Content);
					Reflux.initStore(Stores.Data);

					IOs.Socket.on('connect', 		Actions.Content.setup);
					IOs.Socket.on('build', 	 		Actions.Content.build);
					IOs.Socket.on('receive', 		Actions.Data.receive);
					// IOs.Socket.on('uploaded', 		Actions.Data.receive);
					// ?????
						// Socket.on('connet_error', 	SockConnErr);
						// Socket.on('connect_timeout',SockConnErr);
						// Socket.on('error', 			SockConnErr);
				}
			}
		}


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// VARIABLES ////////////////////////////////////////////////////////////////////////////////////////////////////
		
		const 	RError 	 = '/error';
		const 	RLogin 	 = '/auth/login';
		const 	RCheck 	 = '/auth/check';
		const 	RLogout  = '/auth/logout';
		const 	RReload  = '/auth/reload';
		const 	RRenew   = '/auth/renew';
		const 	RSave    = '/auth/save';
		const 	RRegen 	 = '/auth/regenerate';
		const 	Build 	 = {};

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// STORES ///////////////////////////////////////////////////////////////////////////////////////////////////////

		const Stores = { 
			App: null, Nav: null, Content: null, Data: null, 
			Run: { Access: runAccess, Socket: runSocket },
			ISO: {}, 
		};

		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// STORE.DEFAULT ////////////////////////////////////////////////////////////////////////////////////////

			class AppMix extends Reflux.Store {

				constructor			(defaults) {
					super(); this.temps = defaults;
					this.state = this.setInitialState(defaults);
				}

				setInitialState 	(defaults) {
					var dflts = FromJS(defaults),
						inits = FromJS(Stores.ISO),
						state = dflts.mergeDeep(inits);
					return state.toJS();
				}

				updateStore 		(value, receive) {
					this.secretlyUpdateStore(value);
					if (!!receive) return this.state;
				}
				secretlyUpdateStore (value) {
					let state, imval = FromJS(value||{});
					state = FromJS(this.state).mergeDeep(imval);
					this.setState(state.toJS());
				}

				reset() { this.state = this.temps; }

			}

		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// STORE.APP     ////////////////////////////////////////////////////////////////////////////////////////
			Stores.App 		= class extends AppMix {

				constructor		() {
					super({
						ready: 		function () {
							var Store = Stores.App.singleton.state,
								Chekd = !!Store.header.checked,
								Built = !!Store.content.built,
								Ident = !!Store.header.identified,
								Pause = !!Store.paused;
							return (Chekd && Built && !(!Ident && Pause));
						},
						status: 	1, // 1 = Welcome, 2 = Login, 3 = Expired, 4 = Disconnected
						paused: 	false,
						progress: 	0,
						page: 		{ num: 0, pth: [] },
						style: 		'',
						header: 		{
							title:		'',
							checked: 	true,
							identified: false,
							user: 		{
								Account: '--{{ACCOUNT}}--',
								Profile: {
									Photo: 	 '--{{PHOTO}}--',
									Name: 	 { 
										First: 	'--{{NAME.FIRST}}--', 
										Last: 	'--{{NAME.LAST}}--' 
									},
									Age: 	 0,
									Sex: 	'I',
									Email: 	'--{{EMAIL}}--', 
									Location: 	{ 
										City: 	'--{{LOCATION.CITY}}--', 
										Region: '--{{LOCATION.REGION}}--', 
										Country:'--{{LOCATION.COUNTRY}}--' 
									}
								},
								Scopes:  {},
								Token: 	 null
							},
							messages:	{},
							alerts:		{},
							admin:		{},
							searches: 	[],
						},
						content: 	{ built: false, nav: {}, buttons: {}, forms: {} },
						footer: 	{
							credits: 	{
								author:  'Arian Johnson',
								company: 'eVectr Inc.',
								website: 'eVectr.com',
								contact: 'arian.johnson@evectr.com'
							},
							chats:		[
								{kind:'user',name:{First:  'Arian',Last:  'Johnson'}},
								{kind:'user',name:{First: 'Darren',Last:      'Sun'}},
								{kind:'user',name:{First:   'Marc',Last:   'Djoudi'}},
								{kind:'user',name:{First:  'Sarah',Last:'Jefferson'}},
								{kind:'user',name:{First:'Ricardo',Last:     'Mora'}},
								{kind:'user',name:{First:   'Sean',Last:      'Kim'}},
								{kind:'user',name:{First:  'Yosef',Last: 'Ben Zaid'}},
								{kind:'user',name:{First: 'Farhan',Last:   'Bhatti'}},
								{kind:'user',name:{First:'Rodrigo',Last:    'Lopez'}},
								{kind:'user',name:{First:'Pritesh',Last:    'Patel'}},
							]
						},
					});
					this.listenables = [Actions.App];
				}

				isIdentified 	() { return this.state.header.identified; }
				onConnect 		() { this.updateStore({ status: 2 }); }
				onPause 		(pause) { this.updateStore({ paused: !!pause }); }
				onProgress	 	(prog, extra) {
					var config = {}; extra = (extra||{});
					switch (true) {
						case !!!prog: 	config = { progress: 0 }; break;;
						default: 	  	config = {
											progress:	(prog+'%'),
											paused: 	(prog<100)
										};
					}; 	this.updateStore(Assign(config, extra));
				}
				onIdentify	 	(ret) {
					var THS = this, 
						loc = window.location,
						pay = ret.payload, 
						opt = pay.options, usr = {},
						qry = opt.query||opt.body,
						res = pay.result,
						nxt = res.next,
						rdr = null, dsp;
					IOs.Access.emit(nxt[0], nxt[1]);
					switch (qry.path) {
						case RLogin: 	usr = (pay.result.user||{});
										dsp = usr.Scopes.display_name;
										rdr = `/${dsp.toLowerCase()}`;
						case RCheck:	THS.updateStore({
											status: 1, paused: false, 
											header: {
												identified: true, 
												checked: true,
												user: usr
										} 	}); 
										(!!rdr)&&(loc.href = rdr);
										break;;
						case RLogout: 	THS.onDisconnect(pay);
										loc.href = '/login';
										break;;
					};
				}
				onDisconnect 	(pay) {
					var code 	= (pay.result||{}).code,
						status 	= !isNaN(code),
						idented = this.isIdentified(),
						store 	= {
							paused: false, header: {
								identified: false, checked: true,
								user: this.temps.header.user
							}, status: 2
						};
					if (status && (code!=3||idented)) store.status = code;
					this.updateStore(store);
				}
				getPage 		(path) {
					if (isNaN(parseInt(path))) {
						var nav = FromJS(this.state.content.nav);
						return nav.find(function (b) { return b.get('path')===path; })
								  .get('page');
					} else { return path; }
				}
				getPath 		(path) {
					var nav = FromJS(this.state.content.nav),
						gtr = (isNaN(parseInt(path))?'path':'page');
					return TC(nav.find(function (b) { return b.get(gtr)===path; })
							  .get('path')).match(/\b(\w+)/g);
				}

			}; Stores.App.id 		= 'App';

		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// STORE.NAV     ////////////////////////////////////////////////////////////////////////////////////////
			Stores.Nav 		= class extends Reflux.Store {

				constructor		() {
					super(); this.listenables = [Actions.Nav];
				}

				onSelect 		(page) {
					// --------------------------------------------------------
					var app = Stores.App.singleton, start = NOW(),
						num = app.getPage(page), finish,
						pth = app.getPath(page), total,
						pge = {page:{num:num,pth:pth}},
						ste = this.state;
					// --------------------------------------------------------
					app.secretlyUpdateStore(pge); 
					this.setState(pge);
					// --------------------------------------------------------
					finish = NOW(); total = ((finish-start)/1000);
					console.log('PAGE: %d (%s) | %ss', 
						ste.page.num, ste.page.pth, 
						total.toFixed(3))
				}

			}; Stores.Nav.id 		= 'Nav';

		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// STORE.CONTENT ////////////////////////////////////////////////////////////////////////////////////////
			Stores.Content 	= class extends Reflux.Store {

				constructor		() {
					super(); this.state = {};
					this.listenables = [Actions.Content];
				}
				
				onSetup 		() {
					try { var built = Stores.App.singleton.state.content.built;
						if (!!!built) IOs.Socket.emit('setup');
					} catch (e) { IOs.Socket.emit('setup'); }
				}
				onBuild 		(res) { 
					console.log('Build', res);
					Stores.App.singleton.updateStore(res)
					requestAnimationFrame(function () {
						// var accss =  Spaces['accessor'],
						// 	space = (Spaces[NMESPC.name]||Spaces['default']);
						// accss.Build(Actions, Stores)(usr, TITLE);
						// space.Build(Actions, Stores)(Build);
						Stores.Content.render();
					});
					runAccess(); 
				}

			}; Stores.Content.id 	= 'Content';

		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// STORE.DATA    ////////////////////////////////////////////////////////////////////////////////////////
			Stores.Data 	= class extends Reflux.Store {
				constructor		() {
					super();
					this.prefix   	 = ["payload","result"];
					this.statDef 	 = FromJS({
						Request: {
							Emmitted: 	{},
							Received: 	{},
							State: 		{},
						},
						Time: {
							Start: 		 null,
							Calling: 	'0s',
							Iterating: 	'0s',
							Rendering: 	'0s',
							Total:  	'0s',
							End: 		 null,
						},
					});
					this.stats		 = {};
					this.defaults 	 = { store: { status: 200, payload: {} } };
					this.temps 		 = Imm.fromJS({});
					this.state 		 = {};
					this.jids 		 = {};
					this.listenables = [Actions.Data];
				}
				
				onAuth  		(point, data, noProg) {
					this.time(data);
					!!!noProg && Actions.App.progress(99, { paused:true });
					requestAnimationFrame((function () {
						IOs.Access.emit(point, data);
					}).bind(this));
				}
				onSend  		(point, data, noProg) {
					this.time(data);
					requestAnimationFrame((function () {
						!!!noProg && Actions.App.progress(99);
						IOs.Socket.emit(point, data);
					}).bind(this));
				}
				onReceive 		(data) {
					var opt = data.payload.options, 
						qry = opt.query||opt.body,
						pth = qry.path, id = qry.id, 
						str, tme;
					switch (pth) {
						case RError: 	console.log("Error:", data);
										alert(data.payload.result.message);
										Actions.App.progress(100);
										break;;
						case RLogin: 	case RCheck: case RLogout: case RRegen:
										console.log("Identify:", data);
										Actions.App.identify(data);
										break;;
						default: 		str = this.stats[id].Time.Start;
										tme = ((NOW() - str) / 1000);
										this.stats[id].Time.Calling = (tme.toFixed(3)+'s');
										this.stats[id].Request.Received = data.payload;
										setTimeout((function () {
											this.updateStoreIn(qry, data, tme);
										}).bind(this), 0);
					}
				}

				is  			(old, nxt) {
					// ----------------------------------------------------
					return Imm.is(FromJS(old), FromJS(nxt))===true;
				}
				has  			(id) {
					try { return !!(this.state[id]||{}).stamp; }
					catch (e) { console.log(e); return false; }
				}

				poll 			(id) {
					if (this.has(id)) this.setState({ 
						[id]: this.state[id] 
					});
				}
				place			(id, data = {}) {
					let THS = this, state = THS.state[id]||{};
					this.setState({ [id]: Assign(
						state, data, { stamp: new Date() }
					) 	});
				}
				clear 			(id) {
					this.setState({ [id]: { 
						stamp: new Date(), items: [] 
					} 	});
				}
				time			(data) {
					let {query,body} = data, id = (query||body).id;
					this.stats[id] = this.statDef.toJS();
					this.stats[id].Time.Start = NOW();
					this.stats[id].Request.Emmitted = data;
				}

				setIn  			(qry, data) {
					let THS = this, { id, to, at } = qry,
						dta = FromJS(data).getIn(to||THS.prefix), 
						def = { 'object': Map({}), 'array': List([]) }, 
						ste = FromJS(THS.state), typ = IS(dta.toJS()), 
						nvl = def[typ], res = {};
					// -------------------------------------------------
					try { 
						// ---------------------------------------------
							// console.log({ 
								// DATA: 	dta.toJS(),
								// STRE: 	ste.getIn([id],nvl).toJS(),
								// MRGE: 	ste.getIn([id],nvl)
								// 			.mergeDeep(dta)
								// 			.toJS(),
							// });
							// res = 	ste.setIn([id], 
										// ste	.getIn([id],nvl)
											// .mergeDeep(dta)
									// ).toJS();
							res = ste.setIn([id], Map({
								stamp: new Date(), 
								items: dta
							}	)	).toJS();
						// ---------------------------------------------
							return res;
					} catch (e) { console.log(e); return null; }
				}
				updateStoreIn  	(qry, data, dur) {
					var THS = this, res = {}, iT, rT, fT, sT = NOW();
					// -------------------------------------------------
						res = this.setIn(qry, data);
							// if (!!!res) { Actions.App.progress(100); return; }
						iT  = NOW(-sT, 1000);
					// -------------------------------------------------
						sT  = NOW(); THS.setState(res);
						rT  = NOW(-sT, 1000); fT = (dur+iT+rT);
					// --------------------------------------------------
						THS.setStats(qry.id, qry.path, iT, rT, fT, res);
					// -------------------------------------------------
				}
				setStats 		(id, path, iterTime, rendTime, fullTime, state) {
					var stats = this.stats[id], lg = this.logStore;
					setTimeout(function () {
						stats.Time.Iterating 	= iterTime.toFixed(3)+'s';
						stats.Time.Rendering 	= rendTime.toFixed(3)+'s';
						stats.Time.Total 		= fullTime.toFixed(3)+'s';
						stats.Time.End 			= NOW();
						stats.Request.State 	= FromJS(state).toJS();
						lg(path, stats);
					}, 	0);
				}
				
				logStore (id) {
					// ----------------------------------------
					console.log.apply(console, ["[#%s]:", id].concat(ARGS(arguments).slice(1)));
				}

				toJS  			(obj) {
					try { return obj.toJS(); }
					catch (er) { return obj; }
				}

			}; Stores.Data.id 		= 'Data';
	
	return Stores;
};