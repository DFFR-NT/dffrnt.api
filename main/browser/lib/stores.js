'use strict';

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
				Reflux.initStore(Stores.App(LOCKER));
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
	var RCheck = '/auth/check';
	var RLogout = '/auth/logout';
	var RReload = '/auth/reload';
	var RRenew = '/auth/renew';
	var RSave = '/auth/save';
	var RRegen = '/auth/regenerate';
	var Build = {};

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// STORES ///////////////////////////////////////////////////////////////////////////////////////////////////////

	var Stores = {
		Apps: {}, App: null, Nav: null, Content: null, Data: null,
		Run: { Access: runAccess, Socket: runSocket },
		ISO: {}
	};

	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	// STORE.APP     ////////////////////////////////////////////////////////////////////////////////////////
	Stores.App = function App(LID) {
		if (!!!Stores.Apps[LID]) {
			Stores.Apps[LID] = function (_Reflux$Store) {
				_inherits(_class, _Reflux$Store);

				function _class() {
					_classCallCheck(this, _class);

					var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

					var defaults = {
						ready: function ready() {
							var Store = Stores.Apps[LID].singleton.state,
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
									}
								},
								Scopes: {},
								Token: null
							},
							messages: {},
							alerts: {},
							admin: {},
							searches: []
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
					};
					_this.temps = FromJS(defaults);
					_this.state = _this.setInitialState(defaults);
					_this.listenables = [Actions.App];
					return _this;
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
					value: function onIdentify(ret) {
						var THS = this,
						    loc = window.location,
						    pay = ret.payload,
						    opt = pay.options,
						    usr = {},
						    qry = opt.query || opt.body,
						    res = pay.result,
						    nxt = res.next,
						    rdr = null,
						    dsp;
						IOs.Access.emit(nxt[0], nxt[1]);
						switch (qry.path) {
							case RLogin:
								usr = pay.result.user || {};
								dsp = usr.Scopes.display_name;
								rdr = '/' + dsp.toLowerCase();
							case RCheck:
								THS.updateStore({
									status: 1, paused: false,
									header: {
										identified: true,
										checked: true,
										user: usr
									} });
								!!rdr && (loc.href = rdr);
								break;;
							case RLogout:
								THS.onDisconnect(pay);
								loc.href = '/login';
								break;;
						};
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
								user: this.temps.getIn(['header', 'user']).toJS()
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
				}, {
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
						this.state = this.temps.toJS();
					}
				}]);

				return _class;
			}(Reflux.Store);Stores.Apps[LID].id = LID;
		};return Stores.Apps[LID];
	};

	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	// STORE.NAV     ////////////////////////////////////////////////////////////////////////////////////////
	Stores.Nav = function (_Reflux$Store2) {
		_inherits(_class2, _Reflux$Store2);

		function _class2() {
			_classCallCheck(this, _class2);

			var _this2 = _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).call(this));

			_this2.listenables = [Actions.Nav];
			return _this2;
		}

		_createClass(_class2, [{
			key: 'onSelect',
			value: function onSelect(page) {
				// --------------------------------------------------------
				var app = Stores.Apps[LOCKER].singleton,
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

			var _this3 = _possibleConstructorReturn(this, (_class3.__proto__ || Object.getPrototypeOf(_class3)).call(this));

			_this3.state = {};
			_this3.listenables = [Actions.Content];
			return _this3;
		}

		_createClass(_class3, [{
			key: 'onSetup',
			value: function onSetup() {
				try {
					var built = Stores.Apps[LOCKER].singleton.state.content.built;
					if (!!!built) IOs.Socket.emit('setup');
				} catch (e) {
					IOs.Socket.emit('setup');
				}
			}
		}, {
			key: 'onBuild',
			value: function onBuild(res) {
				console.log('Build', res);
				Stores.Apps[LOCKER].singleton.updateStore(res);
				requestAnimationFrame(function () {
					// var accss =  Spaces['accessor'],
					// 	space = (Spaces[NMESPC.name]||Spaces['default']);
					// accss.Build(Actions, Stores)(usr, TITLE);
					// space.Build(Actions, Stores)(Build);
					Stores.Content.render();
				});
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

			var _this4 = _possibleConstructorReturn(this, (_class4.__proto__ || Object.getPrototypeOf(_class4)).call(this));

			_this4.prefix = ["payload", "result"];
			_this4.statDef = FromJS({
				Request: {
					Emmitted: {},
					Received: {},
					State: {}
				},
				Time: {
					Start: null,
					Calling: '0s',
					Iterating: '0s',
					Rendering: '0s',
					Total: '0s',
					End: null
				}
			});
			_this4.stats = {};
			_this4.defaults = { store: { status: 200, payload: {} } };
			_this4.temps = Imm.fromJS({});
			_this4.state = {};
			_this4.jids = {};
			_this4.listenables = [Actions.Data];
			return _this4;
		}

		_createClass(_class4, [{
			key: 'onAuth',
			value: function onAuth(point, data, noProg) {
				this.time(data);
				!!!noProg && Actions.App.progress(99, { paused: true });
				requestAnimationFrame(function () {
					IOs.Access.emit(point, data);
				}.bind(this));
			}
		}, {
			key: 'onSend',
			value: function onSend(point, data, noProg) {
				this.time(data);
				requestAnimationFrame(function () {
					!!!noProg && Actions.App.progress(99);
					IOs.Socket.emit(point, data);
				}.bind(this));
			}
		}, {
			key: 'onReceive',
			value: function onReceive(data) {
				var opt = data.payload.options,
				    qry = opt.query || opt.body,
				    pth = qry.path,
				    id = qry.id,
				    str,
				    tme;
				switch (pth) {
					case RError:
						console.log("Error:", data);
						alert(data.payload.result.message);
						Actions.App.progress(100);
						break;;
					case RLogin:case RCheck:case RLogout:case RRegen:
						console.log("Identify:", data);
						Actions.App.identify(data);
						break;;
					default:
						str = this.stats[id].Time.Start;
						tme = (NOW() - str) / 1000;
						this.stats[id].Time.Calling = tme.toFixed(3) + 's';
						this.stats[id].Request.Received = data.payload;
						setTimeout(function () {
							this.updateStoreIn(qry, data, tme);
						}.bind(this), 0);
				}
			}
		}, {
			key: 'is',
			value: function is(old, nxt) {
				// ----------------------------------------------------
				return Imm.is(FromJS(old), FromJS(nxt)) === true;
			}
		}, {
			key: 'has',
			value: function has(id) {
				try {
					return !!(this.state[id] || {}).stamp;
				} catch (e) {
					console.log(e);return false;
				}
			}
		}, {
			key: 'poll',
			value: function poll(id) {
				if (this.has(id)) this.setState(_defineProperty({}, id, this.state[id]));
			}
		}, {
			key: 'place',
			value: function place(id) {
				var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

				var THS = this,
				    state = THS.state[id] || {};
				this.setState(_defineProperty({}, id, Assign(state, data, { stamp: new Date() })));
			}
		}, {
			key: 'clear',
			value: function clear(id) {
				this.setState(_defineProperty({}, id, {
					stamp: new Date(), items: []
				}));
			}
		}, {
			key: 'time',
			value: function time(data) {
				var query = data.query,
				    body = data.body,
				    id = (query || body).id;

				this.stats[id] = this.statDef.toJS();
				this.stats[id].Time.Start = NOW();
				this.stats[id].Request.Emmitted = data;
			}
		}, {
			key: 'setIn',
			value: function setIn(qry, data) {
				var THS = this,
				    id = qry.id,
				    to = qry.to,
				    at = qry.at,
				    dta = FromJS(data).getIn(to || THS.prefix),
				    def = { 'object': Map({}), 'array': List([]) },
				    ste = FromJS(THS.state),
				    typ = IS(dta.toJS()),
				    nvl = def[typ],
				    res = {};
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
					})).toJS();
					// ---------------------------------------------
					return res;
				} catch (e) {
					console.log(e);return null;
				}
			}
		}, {
			key: 'updateStoreIn',
			value: function updateStoreIn(qry, data, dur) {
				var THS = this,
				    res = {},
				    iT,
				    rT,
				    fT,
				    sT = NOW();
				// -------------------------------------------------
				res = this.setIn(qry, data);
				// if (!!!res) { Actions.App.progress(100); return; }
				iT = NOW(-sT, 1000);
				// -------------------------------------------------
				sT = NOW();THS.setState(res);
				rT = NOW(-sT, 1000);fT = dur + iT + rT;
				// --------------------------------------------------
				THS.setStats(qry.id, qry.path, iT, rT, fT, res);
				// -------------------------------------------------
			}
		}, {
			key: 'setStats',
			value: function setStats(id, path, iterTime, rendTime, fullTime, state) {
				var stats = this.stats[id],
				    lg = this.logStore;
				setTimeout(function () {
					stats.Time.Iterating = iterTime.toFixed(3) + 's';
					stats.Time.Rendering = rendTime.toFixed(3) + 's';
					stats.Time.Total = fullTime.toFixed(3) + 's';
					stats.Time.End = NOW();
					stats.Request.State = FromJS(state).toJS();
					lg(path, stats);
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