

module.exports = function (Reflux, Actions, Spaces, IOs) {

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////

		function secretlyUpdateStore (value) {
			value = FromJS(value||{});
			this.store = this.store.mergeDeep(value);
		}
		function updateStore (value) {
			this.secretlyUpdateStore(value);
			this.trigger(this.store.toJS());
		}
		function getInitialState (temp) {
			return function () {
				this.temps = this.store = FromJS(temp);
				return this.store.toJS();
			}
		}
		function AppMix (temp) {
			return {
				updateStore: 			updateStore,
				secretlyUpdateStore: 	secretlyUpdateStore,
				getInitialState: 		getInitialState(temp)
			};
		}
		function logStore (id) {
			// ----------------------------------------
			console.log.apply(console, ["[#%s]:", id].concat(ARGS(arguments).slice(1)));
		}


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// VARIABLES ////////////////////////////////////////////////////////////////////////////////////////////////////

		const	Access 	 = IOs.Access;
		const	Socket 	 = IOs.Socket;
		const 	RError 	 = '/error';
		const 	RLogin 	 = '/auth/login';
		const 	RLogout  = '/auth/logout';
		const 	RRegen 	 = '/auth/regenerate';
		const 	Selector = {
					Match: 	/%[(]([A-Z]+)[)][ds]/g,
					Parent: 'var[data-page="%(PAGE)d"]#nav ~ main#main',
					Levels: 'var[data-1="%(ROOT)s"][data-%d="%s"]#nav ~ main#main .button[data-root="%(ROOT)s"][data-level="%d"][data-name="%s"] > .button > label',
					Hidden: Imm.Map({
						Root: 	'nav.sidebar > div[data-root="%(ROOT)s"].button',
						Rest: 	'nav.sidebar > div[data-root="%(ROOT)s"].button *',
						Button: 'div[data-page="%(PAGE)d"].button > label',
						Blurs: 	'div:not([data-page="%(PAGE)d"]).button > label',
						Before: 'div:not([data-page="%(PAGE)d"]).button > label:hover::after',
						After: 	'div[data-page="%(PAGE)d"].button > label::after',
						NAfter: 'div:not([data-page="%(PAGE)d"]).button > label::after',
						Others: '> div[data-root="%(ROOT)s"].button ~ div[data-level="1"].button ~ div[data-level="1"].button',
						Editor: '.page:not([data-page="%(PAGE)d"])',
					}),
				};


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// STORES ///////////////////////////////////////////////////////////////////////////////////////////////////////

		var Stores = { App: null, Nav: null, Content: null, Data: null };

		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// STORE.APP     ////////////////////////////////////////////////////////////////////////////////////////
			Stores.App = 	 Reflux.createStore({
				listenables: 	[Actions.App],
				mixins: 		[AppMix({
					ready: 		function () {
						var Store = Stores.App.store.toJS(),
							Chekd = !!Store.header.checked,
							Built = !!Store.content.built,
							Ident = !!Store.header.identified,
							Pause = !!Store.paused;
						return (Chekd && Built && !(!Ident && Pause));
					},
					status: 	4, // 1 = Welcome, 2 = Login, 3 = Expired, 4 = Disconnected
					paused: 	false,
					progress: 	0,
					page: 		{ num: 0, pth: [] },
					style: 		'',
					header: 		{
						checked: 	false,
						identified: false,
						user: 		{
							Account: 'guser',
							Profile: {
								Photo: 	 null,
								Name: 	 { First: 'Guest', Last: 'User' },
								Contact: {
									Email: { Address: '' },
									Location: { City: '', Region: '', Country: '' }
								},
								Scopes:  {}
							},
							Token: 	 null
						},
					},
					content: 	{ built: false, nav: {}, buttons: {}, forms: {} },
					credits: 	{
						author:  'Arian Johnson',
						company: 'eVectr Inc.',
						website: 'eVectr.com',
						contact: 'arian.johnson@evectr.com'
					},
				})],
				isIdentified: 	 function () { return this.store.getIn(['header','identified']); },
				onConnect: 		 function () { this.updateStore({ status: 2 }); },
				onPause: 		 function (pause) { this.updateStore({ paused: !!pause }); },
				onProgress: 	 function (prog, extra) {
					var config = {}; extra = (extra||{});
					switch (true) {
						case !!!prog: 	config = { progress: 0 }; break;;
						default: 	  	config = {
											progress:	(prog+'%'),
											paused: 	(prog<100)
										};
					}
					this.updateStore(Assign(config, extra));
				},
				onIdentify: 	 function (res) {
					var pay = res.payload;
					switch (pay.options.query.path) {
						case RLogin: 	Access.emit('reload');
										this.updateStore({
											status: 1, paused: false, header: {
											identified: true, checked: true,
											user: (pay.result.user||{})
										} 	}); break;;
						case RLogout: 	Access.emit('reload');
										this.onDisconnect(pay);
										break;;
						case RRegen: 	Access.emit('regenerate');
										this.onDisconnect();
										break;;
					}
				},
				onDisconnect: 	 function (pay) {
					var code 	= pay.result.code,
						status 	= !isNaN(code),
						idented = this.isIdentified(),
						store 	= {
							paused: false, header: {
								identified: false, checked: true,
								user: this.temps.getIn(['header','user']).toJS()
							}, status: 2
						};
					if (status && (code!=3||idented)) store.status = code;
					this.updateStore(store);
				},
				getPage: 		 function (path) {
					if (isNaN(parseInt(path))) {
						var nav = this.store.getIn(['content','nav']);
						return nav.find(function (b) { return b.get('path')===path; })
								  .get('page');
					} else { return path; }
				},
				getPath: 		 function (path) {
					var nav = this.store.getIn(['content','nav']),
						gtr = isNaN(parseInt(path))?'path':'page';
					return TC(nav.find(function (b) { return b.get(gtr)===path; })
							  .get('path')).match(/\b(\w+)/g);
				},
			});

		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// STORE.NAV     ////////////////////////////////////////////////////////////////////////////////////////
			Stores.Nav 	   = Reflux.createStore({
				listenables: 	[Actions.Nav],
				onSelect: 		 function (page) {
					// --------------------------------------------------------
					var app = Stores.App, start = NOW(),
						num = app.getPage(page), finish,
						pth = app.getPath(page), total,
						pge = { num: num, pth: pth };
					// --------------------------------------------------------
					app.secretlyUpdateStore({ page: pge }); this.trigger(pge);
					// --------------------------------------------------------
					finish = NOW(); total = ((finish-start)/1000);
					console.log('SELECT: %ss', total.toFixed(3))
				},
			});

		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// STORE.CONTENT ////////////////////////////////////////////////////////////////////////////////////////
			Stores.Content = Reflux.createStore({
				listenables: 	[Actions.Content],
				onSetup: 		 function () {
					var built = Stores.App.store.getIn(['content','built']);
					if (!!!built) Socket.emit('setup');
				},
				onBuild: 		 (Spaces[NMESPC.replace('/','')]||Spaces['dft-page']).Build(Actions, Stores),
				getMainStyle: 	 function (keys) {
					var sel = Selector, mch = sel.Match, parent = sel.Parent, lvl = [sel.Levels],
						res = [], lnh = [3.5,3,2.5], rep = function (mch, $key) {  return keys[$key]; };
					// ----------------------------------------------------------
					sel.Hidden.map(function (v,k,i) {
						var slc = [parent, v], lev = [lvl, v], prp = [];
						// ------------------------------------------------------
						switch (k) {
							case 'Root': 	prp = prp.concat([
									['background','#FFFFFF',false,true],
									['transition','background-color 0s linear',true,true],
								]); break;;
							case 'Rest': 	prp = prp.concat([
								['color','#213745',false,true],
								// ['opacity',1,false,true],
							]); break;;
							case 'Button': 	prp = prp.concat([
									['cursor','default',false,true],
									['border-right','solid 1rem cornFlowerBlue',false,true],
								]); break;;
							case 'Blurs': 	prp = prp.concat([
									['cursor','pointer',false,true],
								]); break;;
							case 'Before': 	prp = prp.concat([
									['color','cornFlowerBlue',false,true],
									['content',"'\\02003\\2022'",false,false],
								]); break;;
							case 'After': 	prp = prp.concat([
									['color','cornFlowerBlue',false,false],
								]); break;;
							case 'NAfter': 	prp = prp.concat([
									['content',"''",false,false],
								]); break;;
							case 'Others': 	prp = prp.concat([
									['box-shadow','none',true,true],
								]); break;;
							default: prp.push(['display','none',false,true]);
						}
						// ------------------------------------------------------
						res.push(CSS.Declare(slc, prp).replace(mch, rep).replace(/\n([\t]|(?=\}))/g, ' '));
					});
					// ----------------------------------------------------------
					keys.PATH.map(function (v,i,a) {
						var prp = [['display','table',false,true],['line-height',lnh[i]+'rem',false,true],['opacity',1,false,true]];
						res.push(CSS.Declare(lvl, prp)  .replace(mch, rep)
									.replace(/%d/g,i+1) .replace(/%s/g,v)
									.replace(/\n([\t]|(?=\}))/g, ' ')
								);
					});
					// ----------------------------------------------------------
					return res;
				},
				getSortStyle: 	 function (styl) {
					var brk = function (sel) { return sel.replace(/^[^{}]+(\{[^{}]+\})$/,'$1'); },
						srt = function (a,b) { a=brk(a); b=brk(b); switch (true) { case a>b: return 1; case a<b: return -1; default: return 0; }; }
					// console.log('SORTSTYLE:', styl.sort(srt).join('\n'))
					return 	styl.sort(srt).join('\n').replace(/^([^{]+)( \{[^{}]+\})(?=\n.*\2)/gm,'$1,');
				},
			});

		/////////////////////////////////////////////////////////////////////////////////////////////////////////
		// STORE.DATA    ////////////////////////////////////////////////////////////////////////////////////////
			Stores.Data    = Reflux.createStore({
				listenables: 	 [Actions.Data],
				defaults: 		 { store: { status: 200, payload: {} } },
				prefix: 		 ["payload","result"],
				sendTime: 		 null,
				stats: 			 {
					Request: {
						Emmitted: 	{},
						Received: 	{},
						State: 		{},
					},
					Time: {
						Calling: 	'0s',
						Iterating: 	'0s',
						Rendering: 	'0s',
						Total:  	'0s',
					},
				},
				onAuth: 		 function (point, data, noProg) {
					this.sendTime = NOW();
					this.stats.Request.Emmitted = data;
					!!!noProg && Actions.App.progress(10, { paused:true });
					requestAnimationFrame((function () {
						// Actions.App.progress(50);
						Access.emit(point, data);
					}).bind(this));
				},
				onSend: 		 function (point, data, noProg) {
					this.sendTime = NOW();
					this.stats.Request.Emmitted = data;
					requestAnimationFrame((function () {
						!!!noProg && Actions.App.progress(50);
						Socket.emit(point, data);
					}).bind(this));
				},
				onReceive: 		 function (data) {
					var qry = data.payload.options.query, pth = qry.path,
						tme = ((NOW() - this.sendTime) / 1000);
					switch (pth) {
						case RError: 	console.log("Error:", data);
										alert(data.payload.result.message);
										Actions.App.progress(100);
										break;;
						case RLogin: 	case RLogout:  case RRegen:
										console.log("Identify:", data);
										Actions.App.identify(data);
										break;;
						default: 		this.stats.Time.Calling = (tme.toFixed(3)+'s');
										this.stats.Request.Received = data.payload;
										setTimeout((function () {
											this.updateStoreIn(qry, data, tme);
										}).bind(this), 0);
					}
				},
				getPath: 		 function (path) {
					var ids = path[0], pth = path.slice(1),
						itm = this.items, sze = Object.keys(itm).length,
						res = (sze > 0 ? [ids].concat(
							pth.filter(function (v,i,a) {
								return itm[ids].hasIn(a.slice(0,i+1));
							})) : path); return res;
				},
				setPath: 	 	 function (id) {
					this.getInitialState();
					var itm = this.items, def = this.defaults.store;
					if (!!!itm[id]) {
						itm[id] = ITEMS.getItems(def, null, id);
					}; return this.getID(id);
				},
				getID: 			 function (path) {
					// --------------------------------
					return this.items[path].payload.id;
				},
				getAt:  		 function (obj, at) {
					// -------------------------------------------------
					return Imm.fromJS(obj, FJS).getIn(at)||Imm.Map({});
				},
				is: 			 function (old, nxt) {
					// ----------------------------------------------------
					return Imm.is(Imm.fromJS(old), Imm.fromJS(nxt))===true;
				},
				has: 			 function (id, data, pfx) {
					try { return this.items[id].getIn(pfx||[]).Child.iterHas(data); }
					catch (e) {  console.log(e); return false; }
				},
				larger: 		 function (old, nxt) {
					// -------------------------------------------------
					var mxr = function (v,k) { try { return v.size||0; } catch (e) { return 0; }; },
						oln = mxr(old.maxBy(mxr)), nln = mxr(nxt.maxBy(mxr)),
						res = oln <= nln; return res;
				},
				setIn: 			 function (qry, data) {
					var ths = this,
						pfx = this.prefix,
						emp = Imm.Map({}),
						id  = qry.id,
						to  = qry.to,
						at  = qry.at,
						pth = [id].concat(to),
						itm = this.items[id],
						raw = this.getAt(data,at).toJS(),
						srt = function (v,k) { return Number(k); },
						wth = function (o,n) { return (
							!!Imm.fromJS(n).size&&!!!Imm.fromJS(o).size?n:o
						); 	}, str, dtr, dta, mrg, dff, dfm, add, rem, state;
					// -------------------------------------------------
					try {

						// console.log('ATTO:', at, pth);
						// console.log('STRE:', itm.store.toJS());

						dtr = data.payload.result,
						str = (itm.store.getIn(pfx)||emp); //.sortBy(srt);
						dta = Imm.fromJS(dtr,FJS); //.sortBy(srt);
						lrg = this.larger(str, dta);

						dff = Dff(str, dta);
						rem = dff.filter(function (v,i) {
									return 	v.get('op')=='remove' &&
											v.get('path').split('/').length == 2;
								 })
								 .map(   function (v,i) {
								 	return 	v.get('path').split('/')[1];
								 })
								 .toArray();

						// str = str.filterNot(function (v,k) { return rem.has(k); });
						dff.filter(function (v,i) {
								return 	v.get('op')=='remove';
							}).map(function (v,k) {
								var p = v.get('path').split('/').slice(1);
								str = str.deleteIn(p);
							});
						mrg = (lrg?dta.mergeDeepWith(wth,str):str.mergeDeepWith(wth,dta)); //.sortBy(srt);
						dfm = Dff(str, mrg);
						add = dfm.filter(function (v,i) { return v.get('op')=='add';    }).size;

						// console.log('ADDs:', dfm.size > 1 && add == dfm.size);

						console.log('MERG ('+mrg.size+'):',{
							STRE: str.toJS(),
							DATA: dta.toJS(),
							MERG: mrg.toJS(),
							DIFM: dfm.toJS(),
							DIFF: dff.toJS(),
							HAS:  this.has(id,dta,pfx),
							ADD:  add,
							REM:  rem,
						});

						if (dfm.size == 0) {
							console.log('\t\t\tRECYCLE')
							state = itm.getIn(to);
						} else if (dfm.size == 1 || str.size == 0) {
							// var obj = Imm.fromJS(data,FJS).setIn(pfx,mrg).getIn(at).toJS()
							console.log('\t\t\tSET-ITM') //, obj)
							state = itm.setIn(to,raw) //,obj);
						} else if (pfx.has(to.last)) {
							var obj = Imm.fromJS(data,FJS).setIn(pfx,mrg).getIn(at).toJS()
							console.log('\t\t\tSET-PAY', obj)
							state = itm.setIn(to,obj);
						} else {
							console.log('\t\t\tUPDATER')
							state = itm.update(to,dfm,mrg.toJS(),pfx);
						}

						// console.log('ITEMS:', itm.store.toJS());
						console.log('STATE:', { id: state.Child.id, path: pth, state: state });
						return { id: state.Child.id, path: pth, state: state };
					} catch (e) { console.log(e); return null; }
				},
				updateStoreIn: 	 function (qry, data, dur) {
					var THS = this, STR = this.store, ITM = this.items,
						res = {}, ret = {}, iT, rT, fT, sT = NOW();
					// -------------------------------------------------
						res = this.setIn(qry, data);
						if (!!!res) { Actions.App.progress(100); return; }
						ret = res.state.Child.toObject();
							// console.log(ALLSTUFF.toJS())
						iT  = NOW(-sT, 1000);
					// -------------------------------------------------
						sT = NOW(); THS.trigger(ret.id, res.path, ret);
						// setTimeout(function () { THS.trigger(ret.id, ret); }, 500);
						rT = NOW(-sT, 1000); fT = (dur+iT+rT);
					// --------------------------------------------------
						THS.setStats(res.path, iT, rT, fT, ret);
					// -------------------------------------------------
				},
				setStats: 		 function (path, iterTime, rendTime, fullTime, state) {
					var stats = this.stats, lg = this.log;
					setTimeout(function () {
						stats.Time.Iterating 	= iterTime.toFixed(3)+'s';
						stats.Time.Rendering 	= rendTime.toFixed(3)+'s';
						stats.Time.Total 		= fullTime.toFixed(3)+'s';
						stats.Request.State 	= state;
						lg(path.join('/'), Object(stats));
					}, 	0);
				},
				toJS: 			 function (obj) {
					try { return obj.toJS(); }
					catch (er) { return obj; }
				},
				getInitialState: function () {
					if (!!!this.items) {
						this.temps = Imm.fromJS({});
						this.items = {};
					}; return {};
				},
				log: 			 logStore,
			});

	return Stores;
};
