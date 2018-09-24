'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (Reflux, Actions, Spaces, IOs) {

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// SOCKET HANDLES ///////////////////////////////////////////////////////////////////////////////////////////////

	function SockAuthRoom(res) {
		LOG("ROOM | %s", res);
	}
	function SockConnErr(error) {
		LOG('CONNECTION ERROR!!', error);
	}
	function SockConnTO(timeout) {
		LOG('CONNECTION TIMEOUT!!', timeout);
	}
	function SockError(error) {
		LOG('SOCKET ERROR!!', error);
	}
	function SockRConnErr(error) {
		Actions.App.disconnect({ result: { code: 4 } });
	}

	function runAccess() {
		try {
			if (IOs.Access.connected) return;
		} catch (e) {}
		IOs.Access = IOs.IO(NMESPC.host + '/accessor');
		if (IOs.Access) {
			IOs.Access.on('connect', Actions.App.connect);
			IOs.Access.on('room', SockAuthRoom);
			IOs.Access.on('receive', Actions.Data.receive);
			IOs.Access.on('disconnect', Actions.App.disconnect);
			// IOs.Access.on('connet_error',    SockConnErr);
			// IOs.Access.on('connect_timeout',	SockConnErr);
			// IOs.Access.on('error',           SockConnErr);
			IOs.Access.on('reconnect_error', SockRConnErr);
		}
	}
	function runSocket() {
		if (!!IOs && !!IOs.IO) {
			IOs.Socket = IOs.IO(NMESPC.host + '/' + NMESPC.name);
			if (!!IOs.Socket) {

				Reflux.initStore(Stores.App);
				Reflux.initStore(Stores.Nav);
				Reflux.initStore(Stores.Content);
				Reflux.initStore(Stores.Data);

				IOs.Socket.on('connect', Actions.Content.setup);
				IOs.Socket.on('build', Actions.Content.build);
				IOs.Socket.on('receive', Actions.Data.receive);
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

	var RError = '/error';
	var RLogin = '/auth/login';
	var RLogout = '/auth/logout';
	var RRegen = '/auth/regenerate';
	var Build = {};

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// STORES ///////////////////////////////////////////////////////////////////////////////////////////////////////

	var Stores = {
		App: null, Nav: null, Content: null, Data: null,
		Run: { Access: runAccess, Socket: runSocket },
		ISO: {}
	};

	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	// STORE.DEFAULT ////////////////////////////////////////////////////////////////////////////////////////

	var AppMix = function (_Reflux$Store) {
		_inherits(AppMix, _Reflux$Store);

		function AppMix(defaults) {
			_classCallCheck(this, AppMix);

			var _this = _possibleConstructorReturn(this, (AppMix.__proto__ || Object.getPrototypeOf(AppMix)).call(this));

			_this.temps = defaults;
			_this.state = _this.setInitialState(defaults);
			return _this;
		}

		_createClass(AppMix, [{
			key: 'setInitialState',
			value: function setInitialState(defaults) {
				var dflts = FromJS(defaults),
				    inits = FromJS(Stores.ISO),
				    state = dflts.mergeDeep(inits);
				return state.toJS();
			}
		}, {
			key: 'updateStore',
			value: function updateStore(value, receive) {
				this.secretlyUpdateStore(value);
				if (!!receive) return this.state;
			}
		}, {
			key: 'secretlyUpdateStore',
			value: function secretlyUpdateStore(value) {
				var state = void 0,
				    imval = FromJS(value || {});
				state = FromJS(this.state).mergeDeep(imval);
				this.setState(state.toJS());
			}
		}, {
			key: 'reset',
			value: function reset() {
				this.state = this.temps;
			}
		}]);

		return AppMix;
	}(Reflux.Store);

	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	// STORE.APP     ////////////////////////////////////////////////////////////////////////////////////////


	Stores.App = function (_AppMix) {
		_inherits(_class, _AppMix);

		function _class() {
			_classCallCheck(this, _class);

			var _this2 = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, {
				ready: function ready() {
					var Store = Stores.App.singleton.state,
					    Chekd = !!Store.header.checked,
					    Built = !!Store.content.built,
					    Ident = !!Store.header.identified,
					    Pause = !!Store.paused;
					return Chekd && Built && !(!Ident && Pause);
				},
				status: 1, // 1 = Welcome, 2 = Login, 3 = Expired, 4 = Disconnected
				paused: false,
				progress: 0,
				page: { num: 0, pth: [] },
				style: '',
				header: {
					title: '',
					checked: true,
					identified: false,
					user: {
						Account: '--{{ACCOUNT}}--',
						Profile: {
							Photo: '--{{PHOTO}}--',
							Name: {
								First: '--{{NAME.FIRST}}--',
								Last: '--{{NAME.LAST}}--'
							},
							Age: 0,
							Sex: 'I',
							Email: '--{{EMAIL}}--',
							Location: {
								City: '--{{LOCATION.CITY}}--',
								Region: '--{{LOCATION.REGION}}--',
								Country: '--{{LOCATION.COUNTRY}}--'
							},
							Scopes: {}
						},
						Token: null
					},
					messages: {},
					alerts: {},
					admin: {}
				},
				content: { built: false, nav: {}, buttons: {}, forms: {} },
				footer: {
					credits: {
						author: 'Arian Johnson',
						company: 'eVectr Inc.',
						website: 'eVectr.com',
						contact: 'arian.johnson@evectr.com'
					},
					chats: [{ kind: 'user', name: { First: 'Arian', Last: 'Johnson' } }, { kind: 'user', name: { First: 'Darren', Last: 'Sun' } }, { kind: 'user', name: { First: 'Marc', Last: 'Djoudi' } }, { kind: 'user', name: { First: 'Sarah', Last: 'Jefferson' } }, { kind: 'user', name: { First: 'Ricardo', Last: 'Mora' } }, { kind: 'user', name: { First: 'Sean', Last: 'Kim' } }, { kind: 'user', name: { First: 'Yosef', Last: 'Ben Zaid' } }, { kind: 'user', name: { First: 'Farhan', Last: 'Bhatti' } }, { kind: 'user', name: { First: 'Rodrigo', Last: 'Lopez' } }, { kind: 'user', name: { First: 'Pritesh', Last: 'Patel' } }]
				}
			}));

			_this2.listenables = [Actions.App];
			return _this2;
		}

		_createClass(_class, [{
			key: 'isIdentified',
			value: function isIdentified() {
				return this.state.header.identified;
			}
		}, {
			key: 'onConnect',
			value: function onConnect() {
				this.updateStore({ status: 2 });
			}
		}, {
			key: 'onPause',
			value: function onPause(pause) {
				this.updateStore({ paused: !!pause });
			}
		}, {
			key: 'onProgress',
			value: function onProgress(prog, extra) {
				var config = {};extra = extra || {};
				switch (true) {
					case !!!prog:
						config = { progress: 0 };break;;
					default:
						config = {
							progress: prog + '%',
							paused: prog < 100
						};
				};this.updateStore(Assign(config, extra));
			}
		}, {
			key: 'onIdentify',
			value: function onIdentify(res) {
				var THS = this,
				    pay = res.payload,
				    usr = {};
				switch (pay.options.query.path) {
					case RLogin:
						IOs.Access.emit('reload');
						usr = pay.result.user || {};
						this.updateStore({
							status: 1, paused: false,
							header: {
								identified: true,
								checked: true,
								user: usr
							} });
						break;;
					case RLogout:
						IOs.Access.emit('reload');
						this.onDisconnect(pay);
						break;;
					case RRegen:
						IOs.Access.emit('regenerate');
						this.onDisconnect();
						break;;
				};
				requestAnimationFrame(function () {
					var accss = Spaces['api-accessor'],
					    space = Spaces[NMESPC.name] || Spaces['dft-page'];
					// accss.Build(Actions, Stores)(usr, TITLE);
					// space.Build(Actions, Stores)(Build);
					Stores.Content.render();
				});
			}
		}, {
			key: 'onDisconnect',
			value: function onDisconnect(pay) {
				var code = (pay.result || {}).code,
				    status = !isNaN(code),
				    idented = this.isIdentified(),
				    store = {
					paused: false, header: {
						identified: false, checked: true,
						user: this.temps.header.user
					}, status: 2
				};
				if (status && (code != 3 || idented)) store.status = code;
				this.updateStore(store);
			}
		}, {
			key: 'getPage',
			value: function getPage(path) {
				if (isNaN(parseInt(path))) {
					var nav = FromJS(this.state.content.nav);
					return nav.find(function (b) {
						return b.get('path') === path;
					}).get('page');
				} else {
					return path;
				}
			}
		}, {
			key: 'getPath',
			value: function getPath(path) {
				var nav = FromJS(this.state.content.nav),
				    gtr = isNaN(parseInt(path)) ? 'path' : 'page';
				return TC(nav.find(function (b) {
					return b.get(gtr) === path;
				}).get('path')).match(/\b(\w+)/g);
			}
		}]);

		return _class;
	}(AppMix);Stores.App.id = 'App';

	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	// STORE.NAV     ////////////////////////////////////////////////////////////////////////////////////////
	Stores.Nav = function (_Reflux$Store2) {
		_inherits(_class2, _Reflux$Store2);

		function _class2() {
			_classCallCheck(this, _class2);

			var _this3 = _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).call(this));

			_this3.listenables = [Actions.Nav];
			return _this3;
		}

		_createClass(_class2, [{
			key: 'onSelect',
			value: function onSelect(page) {
				// --------------------------------------------------------
				var app = Stores.App.singleton,
				    start = NOW(),
				    num = app.getPage(page),
				    finish,
				    pth = app.getPath(page),
				    total,
				    pge = { page: { num: num, pth: pth } },
				    ste = this.state;
				// --------------------------------------------------------
				app.secretlyUpdateStore(pge);
				this.setState(pge);
				// --------------------------------------------------------
				finish = NOW();total = (finish - start) / 1000;
				console.log('PAGE: %d (%s) | %ss', ste.page.num, ste.page.pth, total.toFixed(3));
			}
		}]);

		return _class2;
	}(Reflux.Store);Stores.Nav.id = 'Nav';

	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	// STORE.CONTENT ////////////////////////////////////////////////////////////////////////////////////////
	Stores.Content = function (_Reflux$Store3) {
		_inherits(_class3, _Reflux$Store3);

		function _class3() {
			_classCallCheck(this, _class3);

			var _this4 = _possibleConstructorReturn(this, (_class3.__proto__ || Object.getPrototypeOf(_class3)).call(this));

			_this4.state = {};
			_this4.listenables = [Actions.Content];
			return _this4;
		}

		_createClass(_class3, [{
			key: 'onSetup',
			value: function onSetup() {
				try {
					var built = Stores.App.singleton.state.content.built;
					if (!!!built) IOs.Socket.emit('setup');
				} catch (e) {
					IOs.Socket.emit('setup');
				}
			}
		}, {
			key: 'onBuild',
			value: function onBuild(res) {
				console.log('Build', res);
				Stores.App.singleton.updateStore(res);
				runAccess();
			}
		}]);

		return _class3;
	}(Reflux.Store);Stores.Content.id = 'Content';

	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	// STORE.DATA    ////////////////////////////////////////////////////////////////////////////////////////
	Stores.Data = function (_Reflux$Store4) {
		_inherits(_class4, _Reflux$Store4);

		function _class4() {
			_classCallCheck(this, _class4);

			var _this5 = _possibleConstructorReturn(this, (_class4.__proto__ || Object.getPrototypeOf(_class4)).call(this));

			_this5.prefix = ["payload", "result"];
			_this5.sendTime = null;
			_this5.stats = {
				Request: {
					Emmitted: {},
					Received: {},
					State: {}
				},
				Time: {
					Calling: '0s',
					Iterating: '0s',
					Rendering: '0s',
					Total: '0s'
				}
			};
			_this5.defaults = { store: { status: 200, payload: {} } };
			_this5.temps = Imm.fromJS({});
			_this5.state = {};
			_this5.jids = {};
			_this5.listenables = [Actions.Data];
			return _this5;
		}

		_createClass(_class4, [{
			key: 'onAuth',
			value: function onAuth(point, data, noProg) {
				console.log('HELLO');
				this.sendTime = NOW();
				this.stats.Request.Emmitted = data;
				!!!noProg && Actions.App.progress(99, { paused: true });
				requestAnimationFrame(function () {
					IOs.Access.emit(point, data);
				}.bind(this));
			}
		}, {
			key: 'onSend',
			value: function onSend(point, data, noProg) {
				this.sendTime = NOW();
				this.stats.Request.Emmitted = data;
				requestAnimationFrame(function () {
					!!!noProg && Actions.App.progress(99);
					IOs.Socket.emit(point, data);
				}.bind(this));
			}
		}, {
			key: 'onReceive',
			value: function onReceive(data) {
				var qry = data.payload.options.query,
				    pth = qry.path,
				    tme = (NOW() - this.sendTime) / 1000;
				switch (pth) {
					case RError:
						console.log("Error:", data);
						alert(data.payload.result.message);
						Actions.App.progress(100);
						break;;
					case RLogin:case RLogout:case RRegen:
						console.log("Identify:", data);
						Actions.App.identify(data);
						break;;
					default:
						this.stats.Time.Calling = tme.toFixed(3) + 's';
						this.stats.Request.Received = data.payload;
						setTimeout(function () {
							this.updateStoreIn(qry, data, tme);
						}.bind(this), 0);
				}
			}
		}, {
			key: 'getPath',
			value: function getPath(path) {
				var ids = path[0],
				    pth = path.slice(1),
				    itm = this.state,
				    sze = Object.keys(itm).length,
				    res = sze > 0 ? [ids].concat(pth.filter(function (v, i, a) {
					return itm[ids].hasIn(a.slice(0, i + 1));
				})) : path;return res;
			}
		}, {
			key: 'setPath',
			value: function setPath(id) {
				var itms = this.state,
				    itm,
				    jid,
				    def = this.defaults.store;
				if (!!!itms[id]) {
					jid = 'jsonp-' + Object.keys(itms).length;
					itm = ITEMS.getItems(def, null, id);
					itm.payload = new ITEM('payload', {}, itm, null, jid);
					this.setState(_defineProperty({}, id, itm));
					this.jids[id] = itm.payload.id;
				};return this.jids[id];
			}
		}, {
			key: 'getID',
			value: function getID(path) {
				// --------------------------------
				return this.jids[id];
			}
		}, {
			key: 'getAt',
			value: function getAt(obj, at) {
				// -------------------------------------------------
				return Imm.fromJS(obj, FJS).getIn(at) || Imm.Map({});
			}
		}, {
			key: 'is',
			value: function is(old, nxt) {
				// ----------------------------------------------------
				return Imm.is(Imm.fromJS(old), Imm.fromJS(nxt)) === true;
			}
		}, {
			key: 'has',
			value: function has(id, data, pfx) {
				try {
					return this.state[id].getIn(pfx || []).Child.iterHas(data);
				} catch (e) {
					console.log(e);return false;
				}
			}
		}, {
			key: 'larger',
			value: function larger(old, nxt) {
				try {
					// -------------------------------------------------
					if ((typeof old === 'undefined' ? 'undefined' : _typeof(old)) == (typeof nxt === 'undefined' ? 'undefined' : _typeof(nxt))) return true;
					// -------------------------------------------------
					var mxr = function mxr(v, k) {
						try {
							return v.size || 0;
						} catch (e) {
							return 0;
						};
					},
					    oln = mxr(old.maxBy(mxr)),
					    nln = mxr(nxt.maxBy(mxr)),
					    res = oln <= nln;return res;
				} catch (e) {
					return true;
				}
			}
		}, {
			key: 'setIn',
			value: function setIn(qry, data) {
				var ths = this,
				    pfx = ths.prefix,
				    emp = Imm.Map({}),
				    isc = ['object', 'array'],
				    id = qry.id,
				    to = qry.to,
				    at = qry.at,
				    pth = [id].concat(to),
				    itm = ths.state[id],
				    raw = ths.getAt(data, at).toJS(),
				    wth = function wth(o, n) {
					return !!Imm.fromJS(n).size && !!!Imm.fromJS(o).size ? n : o;
				},
				    str,
				    dtr,
				    dta,
				    mrg,
				    dff,
				    dfm,
				    add,
				    rem,
				    state,
				    sis,
				    dis,
				    lrg;
				// -------------------------------------------------
				try {
					dtr = data.payload.result, str = itm.store.getIn(pfx) || emp;
					dta = Imm.fromJS(dtr, FJS);
					sis = IS(str);dis = IS(dta);
					// ---------------------------------------------
					if (isc.has(sis) && isc.has(dis)) {
						// -----------------------------------------
						lrg = ths.larger(str, dta);
						dff = Dff(str, dta);
						rem = dff.filter(function (v, i) {
							return v.get('op') == 'remove' && v.get('path').split('/').length == 2;
						}).map(function (v, i) {
							return v.get('path').split('/')[1];
						}).toArray();
						dff.filter(function (v, i) {
							return v.get('op') == 'remove';
						}).map(function (v, k) {
							var p = v.get('path').split('/').slice(1);
							str = str.deleteIn(p);
						});
						mrg = lrg ? dta.mergeDeepWith(wth, str) : str.mergeDeepWith(wth, dta);
						dfm = Dff(str, mrg);
						add = dfm.filter(function (v, i) {
							return v.get('op') == 'add';
						}).size;
						// console.log('MERG ('+mrg.size+'):',{
						// STRE: str.toJS(),
						// DATA: dta.toJS(),
						// MERG: mrg.toJS(),
						// DIFM: dfm.toJS(),
						// DIFF: dff.toJS(),
						// HAS:  this.has(id,dta,pfx),
						// ADD:  add,
						// REM:  rem,
						// QRY:  qry,
						// });
						// -----------------------------------------
						if (dfm.size == 1 || str.size == 0) {
							console.log('\t\t\tSET-ITM', raw);
							state = itm.setIn(to, raw);
						} else {
							console.log(at, data, pfx, mrg.toJS());
							var obj = Imm.fromJS(data, FJS).setIn(pfx, mrg).getIn(at).toJS();
							console.log('\t\t\tSET-PAY', obj);
							state = itm.setIn(to, obj);
						};
						// -----------------------------------------
					} else {
						console.log(data.payload);
						data.payload.result = data.payload.result.toString();
						state = itm.setIn(to, data.payload);
					}
					// ---------------------------------------------
					console.log('STATE:', { id: state.Child.id, path: pth, state: state });
					// ---------------------------------------------
					return { id: state.Child.id, path: pth, state: state };
				} catch (e) {
					console.log(e);return null;
				}
			}
		}, {
			key: 'updateStoreIn',
			value: function updateStoreIn(qry, data, dur) {
				var THS = this,
				    STR = this.state,
				    res = {},
				    ret = {},
				    iT,
				    rT,
				    fT,
				    sT = NOW();
				// -------------------------------------------------
				res = this.setIn(qry, data);
				if (!!!res) {
					Actions.App.progress(100);return;
				}
				ret = res.state.Child.toObject();
				iT = NOW(-sT, 1000);
				// -------------------------------------------------

				console.log('RECIEVED:', ret);

				sT = NOW();

				THS.setState(this.state);

				rT = NOW(-sT, 1000);fT = dur + iT + rT;
				// --------------------------------------------------
				THS.setStats(res.path, iT, rT, fT, ret);
				// -------------------------------------------------
			}
		}, {
			key: 'setStats',
			value: function setStats(path, iterTime, rendTime, fullTime, state) {
				var stats = this.stats,
				    lg = this.logStore;
				setTimeout(function () {
					stats.Time.Iterating = iterTime.toFixed(3) + 's';
					stats.Time.Rendering = rendTime.toFixed(3) + 's';
					stats.Time.Total = fullTime.toFixed(3) + 's';
					stats.Request.State = state;
					lg(path.join('/'), Object(stats));
				}, 0);
			}
		}, {
			key: 'logStore',
			value: function logStore(id) {
				// ----------------------------------------
				console.log.apply(console, ["[#%s]:", id].concat(ARGS(arguments).slice(1)));
			}
		}, {
			key: 'toJS',
			value: function toJS(obj) {
				try {
					return obj.toJS();
				} catch (er) {
					return obj;
				}
			}
		}]);

		return _class4;
	}(Reflux.Store);Stores.Data.id = 'Data';

	return Stores;
};