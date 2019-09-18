
module.exports = function (global) {


	////////////////////////////////////////////////////////////////////////
	// VARIABLES -----------------------------------------------------------

		require('./utils.js')(global);
		global.RPerf 	= require('react-addons-perf');
		const 	LOG 	= console.log;

		// Requires
		const	React 	= require('react');
		const	RDOM 	= require('react-dom');
		const 	CRC 	= require('create-react-class');
		const	Reflux 	= require('reflux');
		const	IO 		= require('socket.io-client');

		const	Access 	= IO('/api-accessor');
		const	Socket 	= IO(NMESPC);
		const	IOs 	= { Access: Access, Socket: Socket };

		const	Actions = require('./actions.js')(Reflux);
		const	Spaces	= require('./spaces');
		const	Stores  = require('./stores.js')(Reflux, Actions, Spaces, IOs);
		const	DFFRNT  = { "/": function () { return; } };

		// Configs
		const	ExLinks = {};
		const	RLogin 	= '/auth/login';
		const	RLogout = '/auth/logout';
		const	qryOmit = Imm.List(['id','as','at','to','path','offset','kind']);

		// Variables
		let 	Token = null, IsAuthd = false, Receivers = 0, Rejecters = 0;


	////////////////////////////////////////////////////////////////////////
	// UTILITIES -----------------------------------------------------------

		function Agnostic 	(config, key) {
			if (!!config.tag) {
				let TagName = DFFRNT.Elements[config.tag];
				return (<TagName key={key} {...config.props} />);
			} else {
				return null;
			}
		}
		function onLog 		(task) {
			// var LG = function () { console.log("%s%s %s", this.lvl, task, this.name); }
			// setTimeout(LG.bind({ lvl: this.lvl, name: this.name }), 0);
		}
		function onInitial 	() {
			var nme = this.name, cnt = nme.appears('\\.');
			this.lvl = '\t'.dup(cnt); return this.props;
		}
		function onMounted 	() {
			this.componentLog("[] Mounted");
			!!this.addReceiver && this.addReceiver();
		}
		function onProps 	(nextProps) {
			this.componentLog("{} Receiving");
			this.setState(nextProps);
		}
		function onShouldP 	(nextProps, nextState) {
			//
			return ImmIs(FromJS(this.props), FromJS(nextProps)) === false;
		}
		function onShouldS 	(nextProps, nextState) {
			//
			return ImmIs(FromJS(this.state), FromJS(nextState)) === false;
		}
		function onSocket 	(props) {
			var links, socks;
			try {
				links = props.value.replace('SocketLink','')
								   .replace(/\\"/g,'"');
				socks = JSON.parse(links);
				// console.log('SOCKET:', {
				// 	Links: links, Socks: socks
				// })
			} catch (e) {
				console.log(e, links, socks)
			}
 			return {
				sid: 	 props.master,
				key: 	 props.id,
				path: 	 props.path,
				display: props.display,
				link: 	 onRequest(socks),
				point: 	 ('/'+socks.point.join('/')),
				params:  socks.params,
				query: 	 socks.query
			}
		}
		function onRequest 	(obj) {
			var req = obj.point.join('/'), omt = qryOmit,
				map = function (v,k) { return (k+'='+v); },
				flt = function (v,k) { return !omt.contains(k); },
				prm = Imm.Map(obj.params).toList().toArray().join('/'),
				qry = Imm.Map(obj.query).filter(flt).map(map).toArray().join('&');
			return ('/')+(req+(!!prm?'/'+prm:''))+(!!qry?'?'+qry:'');
		}
		const 	 onShould 	= { P: onShouldP, S: onShouldS };


	////////////////////////////////////////////////////////////////////////
	// MIXINS --------------------------------------------------------------

		DFFRNT.Mixins = {
			General: 	{
				getInitialState: 			onInitial,
				componentWillReceiveProps: 	onProps,
				componentDidMount: 			onMounted,
				componentLog: 				onLog,
			},
			Static: 	{
				getInitialState: 			onInitial,
				shouldComponentUpdate: 		onShould.P,
				componentDidMount: 			onMounted,
				componentLog: 				onLog,
			},
			Dynamic: 	{
				getInitialState: 			onInitial,
				componentWillReceiveProps: 	onProps,
				shouldComponentUpdate: 		onShould.S,
				componentDidMount: 			onMounted,
				componentLog: 				onLog,
			},
			MonoSpacer: {
				toMono: 					function (text) {
					let regex = /(?:[{]{2}.*?[}]{2}|[(]{2}.*?[)]{2}|'[^']*?')(?=\s|)|(?:[^{(')}]|([{()}])(?!\1))+/g,
						items = (text.match(regex)||[]);
					return (<span>{items.map((m,i) => {
						let mno = m.match(/^[{]{2}(.+)[}]{2}$/),
							brk = m.match(/^[(]{2}(.+)[)]{2}$/),
							quo = m.match(/^'([^']+)'$/),
							cnd = !!(mno||brk||quo),
							prp = (cnd ? {className:'mono'+(!!brk?' bracket':(!!quo?' quote':''))} : {}),
							val = (cnd ? (mno||brk||quo)[1] : m);
						return (<span key={i} {...prp}>{val}</span>);
					})}</span>);
				},
			},
			Requests: 	{
				Required: 	[],
				Latest: 	{},
				getInitialState: 			onInitial,
				componentDidMount: 			onMounted,
				componentLog: 				onLog,
				setValue: 					function (obj, key, val, def) {
					var mch = new RegExp(key,'i'),
						res = (val || (!!def.match(mch) ? '' : def));
					if (!!res) obj[key] = res;
				},
				setRequest: 				function (params) {
					var THS = this, prms = Imm.Map(params);
					// --------------------------------------------
					Imm.Map(this.refs).map(function (v,k) {
						let sfx = { nrm: '', tag: ';' },
							typ = (!!v.refs.field?'nrm':'tag'),
							fld = v.refs.field||v.refs.taggr.refs.input,
							val = (prms.has(k)?unescape(prms.get(k)):"");
						fld.value = val+(!!val?sfx[typ]:'');
						// if (!!val && typ=='tag') {
						if (typ=='tag') {
							v.refs.taggr.refs.value.value = val;
							v.refs.taggr.tagAdd(true);
						}
					}); THS.hndRequest();
				},
				lenRequest: 				function (typ) {
					return function (p, c) {
						return (p+Number(!c.valid && c.type==typ));
					}
				},
				chkRequest: 				function (req) {
					var req = this.Required, len = req.length,
						ast = req.reduce(this.lenRequest('*'), 0),
						tld = req.reduce(this.lenRequest('~'), 0);
					if (ast > 0 || tld == len) {
						window.alert([
							'<',this.props.paths.join('/'),'>',
							'Must fill in Required Field',
							'[',this.Required
									.map(function (v) { return v.name; })
									.join(' ] or [ '),'].'
						].join(' ')); return false;
					}; this.Latest = req; return true;
				},
				getRequest: 				function (point, fields) {
					let THS = this, prm = {}, qry = {},
						att = ['placeholder','data-to'],
						pth = ['payload']; THS.Required = [];
					Imm.Map(fields).map((v,k) => {
						// let ref = v.refs, fld;
						// if (!!ref.field) {
						// 	fld = ref.field;
						// } else {
						// 	ref = ref.taggr.refs;
						// 	fld = ref.value;
						// 	ref.input.value = fld.value;
						// }
						let fld = v.refs.field||v.refs.taggr.refs.value;
						let key = k.toLowerCase(),
							atr = INPUT.Attrs(fld, att), obj = {},
							plc = atr.placeholder, def = (plc==k?'':plc),
							val = fld.value;
						INPUT.InValid(fld, k, THS.Required);
						switch (atr.dataTo) {
							case 'param': obj = prm; break;;
							case 'query': obj = qry; break;;
						}; THS.setValue(obj, k, val, def);
					});
					return {
						headers: { token: Token }, params: prm,
						query: Assign(qry, {
							id: point, at: pth, to: pth
						})
					};
				},
				hndRequest: 				function (e) {
					Rejecters = 0;
					if (!!e) { e.preventDefault(); e.stopPropagation(); }
					if (!!IsAuthd) {
						// -----------------------------------------
						var fields 	= this.refs, req = {},
							point 	= this.state.act;
						// -----------------------------------------
						req = this.getRequest(point, fields);
						// -----------------------------------------
						if (!this.chkRequest(req)) return false;
						// -----------------------------------------
						// console.log('REQ:', point)
						Actions.Data.send(point, req);
						// -----------------------------------------
					}
					return false;
				},
			},
			Forms: 		{
				toSingle: 		function (fields) {
					let count = 0, form = this.props.name;
					return fields.filter((v) => !v.hidden).map((v,k) => { count++;
						let ref = k.toLowerCase(), prp = Assign({}, v, {
								key: k, name: k, ref: ref,
								form: form, index: count
							}); return <Draft.Field {...prp} />;
					}).toArray();
				},
				toDouble: 		function (fields) {
					let id = 0, index = 0, count = 0, form = this.props.name,
						fld = fields.filter((v) => !v.hidden), len = fld.size,
						first = null, both = null, odd = (len % 2 != 0);
					return fld.map((v,k) => { id++; index++;
						let ref = k.toLowerCase(), prp = Assign({}, v, {
								key: k, name: k, ref: ref,
								form: form, index: index
							});
						if (id == 1 && odd) {
							index=0; return <Draft.Field {...prp} />
						} else if (index % 2 == 0) {
							both = (<div key={count} className='both'>
										{first}<Draft.Field {...prp} />
									</div>);
							first = null; return both;
						} else {
							first = (<Draft.Field {...prp} />);
							count++; both = null;
						}
					}).toArray();
				}
			},
			Pages: 		{
				doReceive: function (data) {
					this.componentLog('{} Receiving |');
					this.setState({ content: data.value });
					this.forceUpdate();
				},
				onReceive: function (id, path, data) {
					if (id === this.state.id) { this.doReceive(data); }
					else { this.addRejecter(); (Rejecters == Receivers) &&
						Actions.App.progress(100);
					}
				},
			},
			Items: 		{
				extClass: { array: 'iterator', object: 'iterator' },
				getInitialState: 			onInitial,
				componentWillReceiveProps: 	onProps,
				shouldComponentUpdate: 		onShould.S,
				componentDidMount: 			onMounted,
				componentLog: 				onLog,
				types: 						{},
				doReceive: function (data) {
					this.componentLog('{} Receiving');
					this.setState(data); this.forceUpdate();
				},
				onReceive: function (id, path, data) {
					var ste = this.state, mst = ste.master, pto, cur, pth, rgx, dth, sth, gti, rej, mch;
					if (mst == data.master) {
						pto = path.slice();
						pth = mst+'/'+ste.path.join('/');
						cur = data.path;
						dth = pto.join("/");
						sth = ste.path;

						if (pth == dth) {
							this.doReceive(data);
						} else if (rgx = new RegExp('^'+pto.join("\\/")+'$'), mch = pth.match(rgx), !!mch) {
							var nth = mch[0].split('/').slice(2), nme = ste.name,
								dta = data.value.getIn(nth, true).Child.toObject();
							// console.log('\tRECD:', dta)
							dta.name = nme; this.doReceive(dta);
						} else if (gti = data.value.getIn(sth, true), !!gti.Child && gti.Child.name == ste.name) {
							// console.log('\tRECD:', sth, gti.Child.toObject())
							this.doReceive(gti.Child.toObject())
						} else { this.addRejecter(); (Rejecters == Receivers) &&
							Actions.App.progress(100);
						}
					}
				},
				hndAccords: 				function (e) {
					e.stopPropagation(); var chk = this.refs.accord;
					chk.checked = !chk.checked; return false;
				},
				isIP: 						function (key, val) {
					// --------------------------------------
					return (key == 'ip' ? Lng2IP(val) : val);
				},
				toSocket: 					onSocket,
				toImage: 					function (val) {
					var dims = '70px'; return {
						backgroundImage: 'url("'+val+'")'
					}
				},
				toValue: 					function (props) {
					var value = props.value, name = props.name, type = props.type, tag = {_:'div'}, elems = [];
					switch (type) {
						case 'date': 	elems = [dateFrm(value)]; break;;
						case 'image': 	elems = [<Bubble 	 key="img" {...{img:value,opts:['lite','large']}} />]; break;;
						case 'email': 	elems = [<NormalLink key="a" kind="email" value={value} safe={true} />]; break;;
						case 'link': 	elems = [<NormalLink key="a" kind="link"  value={value} safe={true} />]; break;;
						case 'socket': 	return  (<SocketLink {...this.toSocket(props)} />);
						case 'array': 	return  (<JSONP.Iter {...value} obj={props.obj} />);
						case 'object': 	return  (<JSONP.Iter {...value} obj={props.obj} />);
						default: 		elems = [<span 		 key="span" className={type}>{this.isIP(name,value)}</span>];
					}
					return (<tag._ key={'val-'+props.id} className="value">{elems||'null'}</tag._>);
				},
			},
			Receivers:  {
				logReceiver: 			function () { this.componentLog('Receivers: '+Receivers); },
				addReceiver: 			function () { Receivers++; this.logReceiver(); },
				remReceiver: 			function () { Receivers--; this.logReceiver(); },
				logRejecter: 			function () { this.componentLog('Rejecters: '+Rejecters); },
				setRejecter: 			function () { Rejecters=0; this.logRejecter(); },
				addRejecter: 			function () { Rejecters++; this.logRejecter(); },
				remRejecter: 			function () { Rejecters--; this.logRejecter(); },
				componentWillUnmount: 	function () { this.remReceiver(); },
			},
			Sockets: 	{
				name: 				'SOCKET',
				getInitialState: 	onInitial,
				request: 			{},
				kind: 	 			{
					int: {
						classes: 'value socketLink',
						tip: 	 '[Double-Click] to Load the Full Result...',
						handles: {
							setRequest: function (e) {
								var props = this.state, qry = props.query, at = ['payload','result'];
								qry.id = props.sid; qry.to = (qry.to||props.path); //qry.at = at;
								if (qry.as=='item') qry.at = qry.to;
								this.request = {
									headers: { token: Token },
									params:  props.params,
									query: 	 qry
								};
							},
							hndRequest: function (e) {
								Rejecters = 0; e.stopPropagation(); e.preventDefault();
								if (!!IsAuthd) {
									var pnt = this.state.point, req = this.request;
									Actions.Data.send(pnt, req);
								}
								return false;
							}
						}
					},
					ext: {
						classes: 'value socketLink exlink',
						tip: 	 '[Double-Click] to Load this Request...',
						handles: {
							setRequest: function (e) {
								var props = this.state, prm = props.params, qry = props.query;
								this.request = Imm.Map(prm).mergeDeep(qry).toObject();
							},
							hndRequest: function (e) {
								Rejecters = 0; e.stopPropagation(); e.preventDefault();
								ExLinks[this.state.sid](this.request);
								return false;
							}
						}
					}
				},
				getRID: 			function () {
					// --------------------------------------------
					return this.state.link.split('/').slice(-1)[0];
				},
				cncRequest: 		function (e) {
					e.stopPropagation(); e.preventDefault();
					return false;
				},
			},
			Phone: 		{
				getLink: 	function getLink (number) {
					var nm = number, ext = nm.Ext;
					return 'tel:'+nm['#']+(!!ext?','+ext:'');
				},
			},
			Taggr: 		{
				/////////////////////////////////////////////////////////////////////////////////////////////////
				// REACTORS
					getInitialState: 			function () {
						let nme  = this.name, cnt = nme.appears('\\.');
						this.lvl = '\t'.dup(cnt);
						return FromJS({
							fcsed: false,
							tags:  [],
							value: {},
							input: {},
							range: [0],
							text:  '',
						})
						.mergeDeep(FromJS(this.props))
						.toJS();
					},
					componentDidMount: 			function onMounted 	() {
						// -------------------------------------------------------
						this.onRefresh(); this.componentLog("[] Mounted");
					},
					componentDidUpdate: 		function () {
						// -------------------------------------------------------
						this.onRefresh(); this.componentLog("[] Updated");
					},
					componentMerge: 			function (props) {
						// -------------------------------------------------------
						return Assign({}, this.state, props);
					},
					componentWillReceiveProps: 	onProps,
					shouldComponentUpdate: 		onShould.S,
					componentLog: 				onLog,
					// componentLog: 				function (task) {
					// 	var LG = function () { console.log("%s%s %s", this.lvl, task, this.name); }
					// 	setTimeout(LG.bind({ lvl: this.lvl, name: this.name }), 0);
					// },

				/////////////////////////////////////////////////////////////////////////////////////////////////
				// CACHE
					Mods: 						{
						Shf: 						false,
						Ctl: 						false,
						Alt: 						false,
						Met: 						false,
					},
					tagOpt: 					[ 'none','must','and','not' ],
					tagMch: 					[ 'none','brand','ctid','code','navision','name' ],
					tagOptWhich: 				{ true:'Mch', false:'Opt' },
					tagDir: 					{ 37:-1, 38:-1, 39:1, 40:1 },
					tagAnchor: 					-1,
					tagSubmit: 					false,

				/////////////////////////////////////////////////////////////////////////////////////////////////
				// EVENTS
					onModifiers: 				function onModifiers (e, log=true) {
						let { Key: Key, Shf: Shf, Ctl: Ctl, Alt: Alt, Met: Met } = this.Mods = {
								Key: e.keyCode, Shf: e.shiftKey, Ctl: e.ctrlKey, Alt: e.altKey, Met: e.metaKey,
							}, Pos = this.tagAnchor;
						if (Shf) { Pos = this.tagAnchor = ((Pos==-1) ? this.tagLast() : Pos); }
						else 	 { Pos = this.tagAnchor = (-1); }
						if (log) {
							//console.log(`Tag [ ANC:${Pos} | KEY:${Key} | SHF:${Shf} | CTL:${Ctl} | ALT:${Alt} | MET:${Met} ]`);
						}
					},
					onKeyUp: 					function onKeyUp 	 (e) { this.onModifiers(e, 0); },
					onKeyDown: 					function onKeyDown 	 (e) {
						e.stopPropagation();
						if (!!!this.refs.input.value) {
							this.onModifiers(e, 1);
							switch (this.Mods.Key) {
								case 35: case 36: this.tagGoto(e); break;;
								case 37: case 39: this.tagMove(e); break;;
								case 38: case 40: this.tagOpts(e); break;;
								case 46: case  8: this.tagBack(e); break;;
							}
						} else if (e.keyCode==13) { this.tagAdd(); }
					},
					onInput:					function onInput 	 (e) {
						let text = this.refs.input.value;
						console.log('INPUTTED!!!!!!');
						if (!!text.match(/^([^;]+;)+.*$/)) this.tagAdd();
					},
					onEnter:					function onEnter 	 (e) {
						e.stopPropagation();
						if (e.keyCode == 13) this.onSave(e);
						return false;
					},
					onEdit:						function onEdit 	 (e) {
						let elm = e.target, idx = this.tagIndex(elm), tag = this.state.tags[idx];
						elm .parentElement.lastChild.firstChild.focus();
						if (!tag.edt) return false;
					},
					onSave:						function onSave 	 (e) {
						e.preventDefault();
						let elm = e.target, val = elm.value, idx = this.tagIndex(elm), nws;
						nws = this.tagSetIn([idx,'txt'], val);
						nws = this.tagSetIn([idx,'edt'], false);
						this.tagUpdate(nws, [idx], 'onEnter');
						return false;
					},
					onWrite:					function onWrite 	 (e) {
						e.stopPropagation();
						let elm = e.target, pos = this.tagIndex(elm), val = elm.value;
						this.tagUpdate(this.tagSetIn([pos,'txt'], val), null, 'onWrite');
						return false;
					},
					onFocus: 					function onFocus 	 (e) {
						var anch = this.state.tags.length,
							next = FromJS(this.state.tags)
										.map((v,i) => v.set('edt',false))
										.toJS();
						this.tagUpdate(next, [anch], 'onFocus',  true);
					},
					onBlur: 					function onBlur 	 (e) {
						// ----------------------------------------
						var trg = e.nativeEvent.relatedTarget;
						if (!!!trg || !!!trg.name.match(/^[A-Z]\w+Tag\d+$/)) {
							this.tagUpdate(null, null, 'onBlur', false);
						}
					},
					onClick: 					function onClick 	 (e) {
						let evt = e.nativeEvent,
							elm = evt.path[0],
							idx = this.tagIndex(elm),
							ted = this.tagGetIn(idx,'edt'),
							tin = this.tagIn(idx);
						// console.log(`\tTag IN ? ${tin} | Tag EDITS ? ${ted}`)
						if (!ted) {
							if (tin) {
								e.stopPropagation(); e.preventDefault();
								let nxt = this.tagSetIn([idx,'edt'], true);
								// console.log('\t\tGoing into Edit Mode.')
								this.tagUpdate(nxt, [idx], 'onClick');
							} else {
								// console.log('\t\tGoing to Selection.')
								this.tagGoto(idx, e);
							}
						}; return false;
					},
					onRefresh: 					function onRefresh 	 () {
						let refcs = this.refs,
							items = Map(refcs)
									.filter((v,k) => !isNaN(k)).toArray()
									.filter((v,i) => v.checked).reverse();
						if (!!this.state.fcsed) {
							if (!!!items.length) { refcs.input.focus(); }
							else {
								let last = items.last, nput = this.tagInput(last);
								if (nput.disabled) last.focus();
								else nput.focus();
							}
						}; 	// console.log('REFRESH:', this.state)
					},

				/////////////////////////////////////////////////////////////////////////////////////////////////
				// UPDATERS
					tagUpdate: 					function (next, range, action, focus) {
						let prop = this.state,
							rnge = (range||prop.range),
							tags = (next||prop.tags),
							fcus = (!!focus),
							text = this.tagJoin(this.tagFormat(tags));
						// -----------------------------------------------------
							// console.log(`${action} NEXT (${focus}):`, this.componentMerge({
							// 	text: text, range: rnge, tags: tags, fcsed: fcus
							// }), next);
						// -----------------------------------------------------
						this.setState(this.componentMerge({
							text: text, range: rnge, tags: tags, fcsed: fcus
						}));
					},
					tagAdd: 					function (reset) {
						let nput = 	this.refs.input,
							vals = 	this.refs.value,
							text = 	nput.value,
							opts =  {'':0,';':0,'!':1,'+':2,'-':3},
							prev = 	!!!reset?this.state.tags||[]:[],
							next = 	prev.concat((text.match(/(?:[^;+]|\\[;+])*[^\\](?:[;+]|$)/g)||[])
													 .map((v,i) => {
														var o = 0, m = [
															v.match(/^((?:[^;]|\\;)+)(;|)$/),
															v.match(/^"((?:\\"|[^"])+)";?$/),
															v.match(/^((?:[^+]|\\\+)+)\+;?$/),
															v.match(/^\[((?:\\[\[\]]|[^\[\]])+)\];?$/),
														];
														switch (true) {
															case !!m[1]: o = 1; break;;
															case !!m[2]: o = 2; break;;
															case !!m[3]: o = 3; break;;
														}
														return {
															txt:m[o][1], opt:o, mch:0, quo:false, edt:false
													}; 	})),
							anch = 	next.length;
						nput.blur();
						this.tagUpdate(next, [anch], 'tagAdd', true);
						nput.value = '';
					},
					tagBack: 					function (e) {
						e.preventDefault();
						let prop = 	this.state,
							rnge = 	prop.range,
							lnth = 	rnge.length,
							tags =  FromJS(prop.tags),
							anch =  (rnge.last||1)-1,
							next = 	[], amnt = '';
						// ---
						if (lnth == 1 && rnge[0] == tags.count()) {
							amnt = 	'One';
							next =  tags.filter((v,i) => !(i==anch))
										.toJS();
						} else {
							amnt = 	'Many';
							next =  tags.filter((v,i) => !this.tagIn(i))
										.toJS();
						}
						// ---
						// console.log(`Deleting ${amnt} | Remaining`, next, rnge);
						anch =  next.length-1;
						this.tagUpdate(next, [anch], 'tagBack', true);
					},
					tagGoto: 					function (idx) {
						let next = this.state.range.concat(),
							mod  = this.Mods; idx = idx||0;
						switch (this.Mods.Key) {
							case 35: idx = this.state.tags.length; break;;
							case 36: idx = 0; break;;
						}
						if (this.tagLimit(idx)) {
							let lmt = ((mod.Ctl||mod.Met)&&!mod.Shf);
							if (this.tagIn(idx)) {
								next = List(next).filter((v,i) => v!=idx);
							} else {
								next = lmt ? next.concat(idx) : [idx];
							}
							this.tagUpdate(null, next, 'tagGoto', true);
						}
					},
					tagMove: 					function (e) {
						let key  = this.Mods.Key,
							move = { 37: -1, 39: 1 },
							prop = this.state,
							l 	 = prop.tags.length,
							last = prop.range.last,
							next = last + move[key],
							rnge = prop.range.concat();
						// console.log(`\tPREV: ${prev} | (${rnge}>=0 && ${rnge}<=${l}) == ${(rnge>=0 && rnge<=l)}`);
						if (this.tagLimit(next)) {
							this.setState(this.componentMerge({
								range: this.tagShift(key, last, next, rnge),
								fcsed: true
							}));
						} else if (key==39) {
							this.tagBlur();
						}
						e.preventDefault();
					},
					tagShift: 					function (key, last, next, range) {
						let res = [next], mod = this.Mods;
						if (mod.Shf&&!mod.Ctl) {
							let rng = List(range), fst = range[0],
								lst = last, nxt = next, pop = {
									L: { '-1': 'push', '1':  'pop' },
									C: { '-1':  'pop', '1': 'push' },
									R: { '-1':  'pop', '1': 'push' },
								},
								anc = this.tagAnchor,
								dir = (fst<next?'R':(fst>next?'L':'C')),
								inc = (nxt-lst).toString(),
								// dir = ((nxt-lst)>),
								wch = pop[dir][inc];
							res = rng[wch](next).toArray();
						}; return res;
					},
					tagBlur: 					function () {
						let anch = this.state.tags.length;
						this.setState(this.componentMerge({ range: [anch] }));
					},
					tagOpts: 					function () {
						let { Key: key, Ctl: ctl } = this.Mods;
						if ([38,40].has(key)) {
							let wch = this.tagOptWhich[ctl],
								ops = this[`tag${wch}`],
								pos = this.state.range.last,
								dir = this.tagDir[key],
								nws = this.tagIncIn(wch, pos, ops, dir);
							// console.log(`\tPOS: ${pos} | OPT: ${opt} | NXT: ${res} |`, this.tagOpt);
							this.tagUpdate(nws, null, 'tagOpts', true);
						}
					},

				/////////////////////////////////////////////////////////////////////////////////////////////////
				// HELPERS
					tagNew: 					function () {
						// -----------------------------------------------------
						return FromJS(this.state.tags);
					},
					tagGetIn: 					function (...path) {
						// -----------------------------------------------------
						return FromJS(this.state.tags).getIn(path);
					},
					tagSetIn: 					function (path, val) {
						// -----------------------------------------------------
						return FromJS(this.state.tags).setIn(path, val).toJS();
					},
					tagIncIn: 					function (which, tag, ops, dir) {
						which = which.toLowerCase();
						let opt = this.tagGetIn(tag, which), nxt = ops.safeIndex(opt, dir);
						return this.tagSetIn([tag, which], nxt);
					},
					tagInput: 					function (elm) {
						// -----------------------------------------------------
						return elm.parentElement.lastChild.children[1];
					},
					tagLast: 					function () {
						// -----------------------------------------------------
						return this.state.range.last;
					},
					tagFormat: 					function (next) {
						var opts = (val) => {
								let txt = `${val.txt
												.replace(/"(\w+)"/g, '$1')
												.replace(/(^\[+|\]+$|[+])/g, '')}`;
								switch (val.opt) {
									case  3: txt = `${txt.replace(/\\(?=[\[\]])/g,'')
														 .replace(/([\[\]])/g,"\\$1")
														 .replace(/^(.+)$/, '[$1]')}`;
													break;;
									case  2: txt = `${txt.replace(/\\(?=\+)/g,'')
														 .replace(/(\+)/g,"\\$1")
														 .replace(/^(.+[^+])$/, '$1+')}`;
													break;;
									case  1: txt = `${txt.replace(/\\(?=")/g,'')
														 .replace(/(")/g,"\\$1")
														 .replace(/^(.*)$/,'"$1"')}`;
													break;;
								}
								// console.log(`\tOPT: ${val.opt} [${this.tagOpt[val.opt]}] | ${txt}`);
								return { txt: txt };
							};
						return 	next.map((v,i) => Assign({}, v,opts(v)));
					},
					tagJoin: 					function (next) {
						// ----------------------------------------------
						return 	next.map((v,i) => v.txt).join(';').replace(/([+];)/g, '+');
					},
					tagIn: 						function (idx) {
						let range = this.state.range,
							reslt = List(range).includes(idx);
						return reslt;
					},
					tagLimit: 					function (idx) {
						let b = 0, e = this.state.tags.length;
						return idx.amid(b,e,1);
					},
					tagIndex: 					function (elm) {
						// --------------------------------
						let idx = INPUT.Attr(elm, 'data-ref');
						return Number(idx || 0);
					},
			}
		}


	////////////////////////////////////////////////////////////////////////
	// COMPONENTS ----------------------------------------------------------

		////////////////////////////////////////////////////////////////////
		const App 			= CRC({
			name: 'APP',
			styled: false,
			mixins: [Reflux.connect(Stores.App,'config')],
			getInitialState: 			onInitial,
			componentLog: 				onLog,
			componentDidUpdate: 		function () { this.componentLog("[] Updated"); },
			render: function () {
				var props 	= this.state.config,
					header 	= props.header,
					navi 	= {page:props.page},
					stat 	= {status:props.status},
					content = props.content,
					loader 	= {progress:props.progress},
					footer 	= props.credits,
					classes = CSS.Flex({
						Dir:'Col',Align:'S',Space:'B',Wrap:0
					}, {
						'loggedIn': 	header.identified,
						'loggedOut': 	!header.identified,
						'pause': 		props.paused,
						'ready': 		props.ready(),
					});
				Token = header.user.Token; IsAuthd = header.identified;
				if (!!props.styles && !this.styled) {
					document.getElementById('navigation').innerHTML = props.styles;
					this.styled = true;
				}
				return (<main id="content" className={classes}>
					<Head {...header}	/>
					<Load {...loader}	/>
					<Navi {...navi}		/>
					<Stat {...stat}		/>
					<Body {...content}	/>
					<Foot {...footer}	/>
					<Load.Wait ready={props.ready()} />
				</main>);
			}
		});

		////////////////////////////////////////////////////////////////////
		const Load 			= CRC({
			name: 'LOAD',
			mixins: [ DFFRNT.Mixins.Dynamic ],
			componentDidUpdate: 		function () {
				if (this.state.progress == '100%') {
					setTimeout(function () { Actions.App.progress(0); }, 500);
				}
			},
			render: function () {
				var props 	= this.state,
					classes = CSS.Flex({Dir:0,Align:'C',Space:'A'}),
					style 	= { minWidth: (props.progress||0) };
				return (
					<div id="loader" className={classes}>
						<div id="bar"><div id="progress" style={style} /></div>
					</div>
				);
			}
		});

		Load.Lock			= CRC({
			name: 		 'LOAD.LOCK',
			mixins: 	[DFFRNT.Mixins.General],
			render: 	  function () {
				var flexes 	 = {Dir:'Col',Align:'C',Space:'C',Wrap:0},
					classes  = CSS.Flex(flexes,'lock','noSelect');
				return (
					<aside className={classes}>
						<div>Welcome!</div>
						<div>Login to get started!</div>
						<div>Your session expired. Gotta login again... :/</div>
						<div>The connection was Lost! :s</div>
					</aside>
				);
			}
		});

		Load.Wait			= CRC({
			name: 'LOAD.WAIT',
			mixins: [ DFFRNT.Mixins.Dynamic ],
			render: function () {
				var props 	= this.state, ready = props.ready,
					classes = classN('wait', { show: !!!ready });
				return /*(!!!ready ?*/ (
					<div className={classes}>
						<div className="rect1" />
						<div className="rect2" />
						<div className="rect3" />
						<div className="rect4" />
						<div className="rect5" />
					</div> ) //: null
				//);
			}
		});

		////////////////////////////////////////////////////////////////////
		const Navi 			= CRC({
			name: 'NAVI',
			mixins: [
				DFFRNT.Mixins.Dynamic,
				Reflux.connect(Stores.Nav,'page')
			],
			render: function () {
				var prp = this.state.page, page = prp.num, pth = prp.pth;
				return (<var id='nav' 	data-page={page}
										data-1={pth[0]||''}
										data-2={pth[1]||''}
										data-3={pth[2]||''} />);
			}
		});

		const Stat 			= CRC({
			name: 'STAT',
			mixins: [DFFRNT.Mixins.Dynamic],
			render: function () {
				var status = this.state.status;
				return (<var id='stat' 	data-value={status} />);
			}
		});

		////////////////////////////////////////////////////////////////////
		const Head 			= CRC({
			name: 				'HEAD',
			mixins: 			[ DFFRNT.Mixins.Static ],
			title: 				"",
			componentDidMount: 	function () {
				// --------------------------------------------------------------
				this.title = document.getElementsByTagName('title')[0].innerText;
			},
			handleLogin: 		function (e) {
				e.stopPropagation();
				var usr = this.refs.email_address, pss = this.refs.password,
					enc = 'Basic '+btoa(usr.value+':'+pss.value),
					req = { headers: { authorization: enc } };
				Actions.Data.auth(RLogin, req, false);
				e.nativeEvent.srcElement.submit();
				usr.value=''; pss.value='';
			},
			handleLogout: 		function (e) {
				e.preventDefault(); e.stopPropagation();
				var req = { headers: { token: Token } };
				Actions.Data.auth(RLogout, req, true);
				return false;
			},
			render: function () {
				var props 	= this.props, 	user 	= props.user,
					profile = user.Profile, prShow 	= 'proShow',
					locate  = window.location, targ = '/login';
				return (<header id='header' className={CSS.Flex({Align:'C',Space:'B',Wrap:0})}>
					<div id="banner" className={CSS.Flex({Align:'C'},'noSelect')}>
						<div id='logo'>&nbsp;</div>
						<div id='title'><span>{this.title}</span></div>
					</div>
					<div id='settings' className={CSS.Flex({Wrap:0,Space:'B'},'noSelect')}>
						{props.identified ? (
							<form target='temp' id='auth' key='auth' method='POST' onSubmit={this.handleLogout}
								  className={CSS.Flex({Wrap:0,Space:'B'})} action='#'>
								<label key='logoutLbl' id='logoutLbl' htmlFor='logout' className='icon sunk fst'>
									<span>Welcome, </span>
									<span id='user'>
										<a>{profile.first_name} </a>
										<i className='fa fa-user' aria-hidden='true' />
									</span>
								</label>
								<Head.Profile {...profile} key='profile' />
								<button key='appsLbl' type='button' id='appdrawer' className='icon sunk'>
									<i className='fa fa-th' aria-hidden='true' />
								</button>
								<div className='auth sunk lst'>
									<i className='fa fa-sign-out' aria-hidden='true' />
									<input name='logout' type='submit' value=' ' />
								</div>
							</form>
						) : ([
							<iframe src="/public/html/login.htm" id="temp" name="temp" style={{display:'none'}} />,
							<form target='temp' id='auth'  key='auth' method='POST' onSubmit={this.handleLogin}
								  className={CSS.Flex({Wrap:0,Space:'B'})} action='/public/html/login.htm' ref='login'>
								<label htmlFor='email_address' id='unameLbl' className='icon'>
									<i className='fa fa-user' aria-hidden='true' />
								</label>
								<span className='sunk fst'>
									<input ref='email_address' name='email_address' autoComplete='on' type='email' />
								</span>
								<label htmlFor='password' id='passwLbl' className='icon sunk lst'>
									<i className='fa fa-key' aria-hidden='true' />
								</label>
								<span className='sunk fst'>
									<input ref='password' name='password' autoComplete='on' type='password' />
								</span>
								<div className='auth sunk lst'>
									<i className='fa fa-sign-in' aria-hidden='true' />
									<input name='login' type='submit' value=' ' />
								</div>
							</form>
						])}
					</div>
				</header>);
			}
		});

		Head.Profile 		= CRC({
			name: 'HEAD.PROFILE',
			mixins: [ DFFRNT.Mixins.Static ],
			render: function () {
				var props 	= this.props,
					// name 	= props.Name,
					// Photo 	= props.Photo,
					// Biz 	= props.Business,
					// BizMap 	= Imm.Map({
					// 	Department: Biz.Department,
					// 	Company: 	Biz.Company,
					// 	Manager: 	Biz.Manager,
					// }),
					// Contact = props.Contact,
					// Email 	= Contact.Email,
					// Distro 	= Map(Email.Distribution),
					// Phone 	= Contact.Phone,
					// Locate 	= Contact.Location,
					cssFlex = CSS.Flex(),
					cssProf = CSS.Flex({Dir:'Col',Align:'S',Wrap:0}),
					cssUser = CSS.Flex({Align:'C',Space:'B',Wrap:0}),
					cssAbt 	= CSS.Flex({Align:'C',Space:'B'}),
					cssInfo = CSS.Flex({Align:'S',Space:'B'});
				return (
					<section id="profile" className={cssProf}>
						<header id="user" className={cssUser}>
							<div id="about" className={cssAbt}>
								<p id="name">
									<span id="first">{props.first_name}</span>
									<span>&nbsp;</span>
									<span id="last">{props.last_name}</span>
								</p>
							</div>
						</header>
					</section>
				);
			}
		});

		////////////////////////////////////////////////////////////////////
		const Body 			= CRC({
			name: 'BODY',
			mixins: [ DFFRNT.Mixins.Static ],
			render: function () {
				var props = this.props, cls = CSS.Flex({Wrap:0,Align:'S'});
				return (<main id='main'className={cls}>
					<Load.Lock />
					<Body.Segments {...props} />
					{/*<Body.View {...props} />*/}
				</main>);
			}
		});
		Body.Segments 		= CRC({
			name: 'BODY.SEGMENTS',
			mixins: [ DFFRNT.Mixins.Static ],
			render: function () {
				var props 	= (this.props.segments||[]);
				// ---
				return (
					<section id='sections' className='sections noSelect'>
						{props.map((v,i) => Agnostic(v, i))}
					</section>
				);
			}
		});
		Body.View 			= CRC({
			name: 'BODY.VIEW',
			render: function () {
				var th = this, props = th.props, content = Imm.Map(props.pages);
				return (
					<section id='viewer' className='noSelect gpu'>
						{content.map((v,k,i) => {
							var name = v.name, pge = v.page, act = v.act, id;
							id = Stores.Data.setPath(act);
							return (
								<div key={name} data-page={pge} className="messages">
									<JSONP content={{}} id={id} key={act} />
								</div>
							);
						}).toArray()}
					</section>
				);
			}
		});

		////////////////////////////////////////////////////////////////////
		const SideBar 	 	= CRC({
			name: 			 'SIDEBAR',
			mixins: 		[ DFFRNT.Mixins.Static ],
			render: 		  function () {
				var props 	= this.props,
					name 	= (props.name||'').replace(/^([^#].*)$/,'#$1'),
					buttons = Imm.Map(props.items);
				return (
					<nav id={name} className='sidebar gpu'>
						{buttons.map(function (v,k) {
							return <SideBar.Bttn {...v} key={v.key} />
						}).toArray()}
					</nav>
				);
			}
		});
		SideBar.Bttn 		= CRC({
			name: 			 'SIDEBAR.BTTN',
			mixins: 		[ DFFRNT.Mixins.Static ],
			render: function () {
				var props = this.props, subsm = Imm.Map(props.subs);
				return (
					<div id={props.id}
						 ref='button'
						 className={'button'+(subsm.size?' multi':'')}
						 data-page={props.page}
						 data-level={props.level}
						 data-root={props.root}
						 data-name={props.name}>
						<label 	data-form={props.form}
								onClick={props.onClck.bind(this)}
						>{props.name}</label>
						{subsm.map(function (v, k, i) {
							return <SideBar.Bttn {...v} />
						}).toArray()}
					</div>
				);
			}
		});

		////////////////////////////////////////////////////////////////////
		const Pages 	 	= CRC({
			name: 			 'PAGES',
			mixins: 		[ DFFRNT.Mixins.Static ],
			render: 		  function () {
				var props 	= this.props,
					name 	= (props.name||'').replace(/^([^#].*)$/,'#$1'),
					pages 	= Imm.Map(props.items);
				return (
					<section id={name} className='pages gpu'>
						{pages.map((p,k) => {
							let prp = {
									key: k, id: k,
									'data-page': p.page,
									className: 'page gpu'
								};
							return (
								<article {...prp}>
									{p.items.map((v,i) => Agnostic(v,i))}
									{/*<Page key={k} {...v} />*/}
								</article>
							);
						}).toArray()}
					</section>
				);
			}
		});
		Pages.Page 	 		= CRC({
			name: 			 'PAGE',
			mixins: 		[ DFFRNT.Mixins.Static ],
			render: 		  function () {
				var props 	= this.props,
					name 	= (props.name||'').replace(/^([^#].*)$/,'#$1'),
					pages 	= Imm.Map(props.items);
				return (
					<article id={name} className='page gpu'>
						{pages.map((p,k) => p.map((v,i) => Agnostic(v,i))).toArray()}
					</article>
				);
			}
		});

		////////////////////////////////////////////////////////////////////
		const Draft 		= CRC({
			name: 			'DRAFT',
			mixins: 		[
				DFFRNT.Mixins.Requests,
				DFFRNT.Mixins.Forms
			],
			render: 		function () {
				var props 	= this.props,
					body 	= props.body,
					fills 	= body.fills,
					point 	= '/'+props.paths.join('/').toLowerCase(),
					params 	= Imm.Map(body.params).filter(function (v,k) { return v.to == 'param' }),
					querys 	= Imm.Map(body.params).filter(function (v,k) { return v.to == 'query' }),
					qryCnt 	= 0, prmCnt = 0,
					exmpls 	= { point: point, items: body.examples },
					frmCls 	= classN({ selected: props.selected }, 'draft'),
					formPrp = {
						className: 		frmCls,
						action: 		'',
						onSubmit: 		this.hndRequest,
						id: 			props.id,
						name: 			props.name,
						method: 		props.method.toLowerCase(),
						'data-point': 	point,
						'data-page': 	props.page,
					};
				ExLinks[point] = this.setRequest;
				return (
					<form {...formPrp}>
						<div className="head">
							<h1>{props.paths.map(function (v, i) {
									var key = v+'.'+i;
									return <span key={key} className="route">{v}</span>;
								})}<sup>{props.method}</sup>
							</h1>
						</div>
						<div className='body'>
							<div>
								<div className='fields'>
									{this.toSingle(params)}
									{this.toDouble(querys)}
								</div>
								<Draft.Case {...exmpls} key="exams" />
							</div>
						</div>
						<div className="foot" id="submit">
							<div>
								<button id="send" name="send" type="submit">Send</button>
							</div>
						</div>
					</form>
				);
			}
		});
		Draft.Field 		= CRC({
			name: 'PAGES.FIELD',
			mixins: [
				DFFRNT.Mixins.Static,
				DFFRNT.Mixins.MonoSpacer
			],
			isType:  	 function (type, param) {
				// ----------------------------------------------------
				return !!param.type && param.type.hasOwnProperty(type);
			},
			fmtType: 	 function (typ) {
				switch (true) {
					case typeof(typ) == 'string': return typ;
					default: switch (true) {
						case typ.hasOwnProperty('List'):
							return 'List <'+typ.List+'[ '+typ.Separator+' ]>';
						case typ.hasOwnProperty('Number'):
							var min = typ.Number.min || 0,
								max = typ.Number.max || Infinity;
							return 'Number ('+min+' >=< '+max+')';
					}
				}; return 'Variant';
			},
			render: 	 function () {
				let props = Object.assign({ matches: {} }, this.props),
					name  = props.name,
					type  = props.type,
					fid   = props.form+'-'+name,
					match = Imm.Map(props.matches||{}).map(function (v,k) {
						return { key: k.trim(), val: v };
					}).toArray(),
					reqrd = INPUT.Priority(props.required),
					ODoEV = props.index%2==0 ? 'even' : 'odd',
					flexC = classN(props.to, ODoEV,'field'),
					flexB = CSS.Flex({Wrap:0},'doc'),
					isTyp = this.isType,
					isNum = isTyp('Number', props),
					isLst = isTyp('List', props),
					focal = name+'Foc',
					input = Assign({
						name: name, id: fid,
						placeholder: (props.default || name),
						'data-priority': reqrd, 'data-to': props.to,
						className: 'paramInput'+(isLst?' taggee':'')
					}, (isNum ? {
						type: 'number',
						min:  type.Number.min,
						max:  type.Number.max,
					} : { type: 'text' }));
				// console.log("FIELD:", props)
				return (
					<div key={name} className={flexC} data-index={props.index}>
						<div className='lbl pair'>
							<label id={fid+'-L'} htmlFor={name}>{name}</label>
						</div>
						<div className='npt pair' data-priority={reqrd}>
							{ isLst ?
								(<Tags  key={name} ref='taggr' {...{
									tags:  [],
									text:  '',
									value: {
										name: 				input.name, // +'Npt',
										id: 				input.id+'Npt',
										placeholder: 		input.placeholder,
										'data-priority': 	input['data-priority'],
										'data-to': 			input['data-to'],
										type: 				'hidden',
									},
									input: {
										name: 				input.name,
										id: 				input.id,
										placeholder: 		input.placeholder,
										type: 				input.type
									},
									range: {},
								}} />) :
								(<input key={name} ref='field' {...input} />)
							}
						</div>
						<div className='help'>
							<div className="hidden">
								<table>
									<tbody>
										<tr id="description">
											<td className="doc"><div>Description</div></td>
											<td className="doc">
												<blockquote className='block doc'>
													<p>{this.toMono(props.description)}</p>
												</blockquote>
											</td>
										</tr>
										<tr id="type">
											<td className="doc"><div>Type</div></td>
											<td className="doc">
												<blockquote className='block doc'>
													<p>{this.fmtType(type)}</p>
												</blockquote>
											</td>
										</tr>
										{!!!match.length ? null : (<tr className="matches">
											<td className="doc"><div>Matches</div></td>
											<td className="doc">
												<blockquote className='block doc'>
													<Table.List {...{data:match}} />
												</blockquote>
											</td>
										</tr>)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				);
			}
		});
		Draft.Case 			= CRC({
			name: 'PAGES.CASE',
			mixins: [ DFFRNT.Mixins.Static ],
			render: function () {
				var THS 	= this, cnt = -1,
					props 	= this.props,
					point 	= props.point,
					href 	= "javascript:void(0);",
					frmCls 	= classN({
						'paramForm': true,
						'selected': !!props.selected
					}),
					data 	= { data: [{key:'Request',val:'Result'}].concat(
						Imm.Map(props.items).map((v,k) => {
						var sck = SOCKET({ link: k });
						var prp = onSocket({
								value: sck, master: point,
								id:    cnt, path:   ['payload','result']
							}); prp.query.kind = 'ext';
						// console.log(prp)
						cnt++; return {
							key: (<SocketLink {...prp} />),
							val: v
						};
					}).toArray()) };
				return (
					<div className="examples">
						<header><h2>Examples</h2></header>
						<Table.List key='cases' {...data} />
					</div>
				);
			}
		});

		////////////////////////////////////////////////////////////////////
		const Search 		= CRC({
			name: 			'SEARCH',
			mixins: 		[
				DFFRNT.Mixins.Static,
				DFFRNT.Mixins.Forms
			],
			render: 		function () {
				var props 	= this.props,
					body 	= props.body,
					fills 	= body.fills,
					point 	= '/'+props.paths.join('/').toLowerCase(),
					params 	= Imm.Map(body.params).filter(function (v,k) { return v.to == 'param' }),
					querys 	= Imm.Map(body.params).filter(function (v,k) { return v.to == 'query' }),
					qryCnt 	= 0, prmCnt = 0,
					lister  = { id: Stores.Data.setPath(props.id), content: body.list },
					frmCls 	= classN({ selected: props.selected }, 'draft'),
					formPrp = {
						className: 		frmCls,
						action: 		'',
						onSubmit: 		this.hndRequest,
						id: 			props.id,
						name: 			props.name,
						method: 		props.method.toLowerCase(),
						'data-point': 	point,
						'data-page': 	props.page,
					};
				return (
					<form {...formPrp}>
						<div className="head">
							<h1>{props.paths.map(function (v, i) {
									var key = v+'.'+i;
									return <span key={key} className="route">{v}</span>;
								})}
							</h1>
						</div>
						<div className='body'>
							<div>
								<div className='fields'>
									{this.toSingle(params)}
									{this.toDouble(querys)}
								</div>
								<Search.List {...lister} key="list" />
							</div>
						</div>
						<div className="foot" id="submit">
							<div></div>
						</div>
					</form>
				);
			}
		});
		Search.List 		= CRC({
			name: 			'SEARCH.LIST',
			mixins: 		[
				DFFRNT.Mixins.Dynamic,
				Reflux.listenTo(Stores.Data,'onReceive'),
				DFFRNT.Mixins.Pages,
				DFFRNT.Mixins.Receivers
			],
			componentDidUpdate: function () { Actions.App.progress(100); },
			render: 		function () {

				var props 	= this.state, contn = [], final = [], lists = {}, status, brands;
				try {
					props.content.map((v,k,i) => {
						var br = v.value.brand.value,
							nm = v.value.name.value,
							st = v.value.status.value,
							el = (<li key={k+'.'+i}>{nm}</li>);
						// -----
						!!!lists[st] 	 && (lists[st] 	   = {});
						!!!lists[st][br] && (lists[st][br] = []);
						lists[st][br].push({ key: k+'.'+i, name: nm });
						// -----
						return el;
					});
					contn = Imm.Map(lists).map((sv,sk,si) => {
						return (<li key={sk+'.'+si}>
							<h3>{sk}</h3>
							<ul>{Imm.Map(sv)
									.sortBy((bv,bk,bi) => bk)
									.map((bv,bk,bi) => {
								return (<li key={bk+'.'+bi}>
									<h4>{bk}</h4>
									<ul>{Imm.List(bv)
											.sortBy((cv,ci) => cv.name)
											.map((cv,ci) => (<li key={cv.key}>{cv.name}</li>))
											.toArray()
									}</ul>
								</li>);
							}).toArray()}</ul>
						</li>);
					}).toArray();
				} catch (e) { contn = []; }
				console.log('\tLISTS:', lists)
				console.log('\tFINAL:', final)
				return (
					<div id={props.id} className="searchList">
						<ul>{contn}</ul>
					</div>
				)
			}
		});

		////////////////////////////////////////////////////////////////////
		const Table			= CRC({
			name: 'TABLE',
			mixins: [ DFFRNT.Mixins.Static ],
			render: 	 function () {
				var data = Imm.Map(this.props||{});
				return (
					<div className='tblLst' >{
						data.map(function (v,k) {
							var ky = k.replace(/(\s+)/g, '');
							return (<div key={ky}>
								<div>{k}</div>
								<div>{v}</div>
							</div>);
						}).toArray()
					}</div>
				);
			}
		});
		Table.List			= CRC({
			name: 'TABLE.LIST',
			mixins: [
				DFFRNT.Mixins.Static,
				DFFRNT.Mixins.MonoSpacer
			],
			render: 	 function () {
				return (
					<div className='tblLst'>{
						(this.props.data||[]).map((v,i) => {
							return (
								<div key={i}>
									<div>{v.key}</div>
									<div>{this.toMono(v.val)}</div>
								</div>
							);
						})
					}</div>
				);
			}
		});


		////////////////////////////////////////////////////////////////////
		const JSONP 		= CRC({
			name: 'JSONP',
			mixins: [
				DFFRNT.Mixins.Dynamic,
				Reflux.listenTo(Stores.Data,'onReceive'),
				DFFRNT.Mixins.Pages,
				DFFRNT.Mixins.Receivers
			],
			CSS: 				function () {
				var prp = this.state, css = {
					roots: 	'.jsonp[data-page="%d"]',
					hghts: 	'%s > .object { min-height: %dpx !important; }',
					hides: 	[
						'%s .accord:checked ~ ul.value > li > .key',
						'%s .accord:checked ~ ul.value > li > .collps:checked ~ ul.value > li > .key',
						'%s .accord:checked ~ ul.value > li > .cbrckt',
						'%s .collps:not(:checked) ~ .key',
						'%s .collps:not(:checked) ~ .cbrckt',
						'%s .collps:not(:checked) ~ ul.value > li > .key',
						'%s > .object > .obrckt',
						'%s > .object > ul.value > li > .key',
						'%s > .object > .cbrckt',
					] 	},
					roots = css.roots.replace(/%d/g, prp.page),
					hghts = css.hghts.replace(/%s/g, roots),
					hides = css.hides.join(', ').replace(/%s/g, roots);
				return { roots, hghts, hides };
			},
			scrHeight: 			0,
			setHeight: 			function (height) { this.scrHeight = height; },
			cssHeight: 			function (height) {
				var css = this.CSS(), scr = height, rts = css.roots, hgt = css.hghts;
				this.refs.hghts.innerHTML = !!height ? hgt.replace(/%d/g, scr) : '';
			},
			setStyle: 			function (EL, ATTR, PREV) {
				var css = this.CSS(), roots = css.roots, JS = this.refs.jsonp,
					TM = '%r li[id="%s"] ~ li', TC = '%r li[id="%s"] ~ li li', TP = '%r li[id="%s"] li li',
					SL = [], LI = null, DF = roots+' .object li', CNT = 0; while (true) {
					if (EL.parentElement === JS) break;
					if (EL.tagName == "LI") {
						LI = (!!PREV ? EL.previousSibling||EL : EL);
						if (!!LI) { CNT++; //console.log('CNT:', CNT, LI.id)
							SL.push(TM.replace(/%r/g, roots).replace(/%s/g, LI.id)); !!PREV &&
							SL.push(TP.replace(/%r/g, roots).replace(/%s/g, EL.id)) && CNT==1 &&
							SL.push(TC.replace(/%r/g, roots).replace(/%s/g, LI.id));
						};
					}; 	EL = EL.parentElement;
				}; 	return ((!!SL.length?SL.join(', \n'):DF)+' { opacity: '+ATTR+'; }');
			},
			setScrTop: 			function (top) {
				var html = this.CSS().roots+' > .object { top: '+top+'px }';
				this.refs.topps.innerHTML = !!top ? html : '';
			},
			getLstRoo: 			function (element) {
				var js = this.refs.jsonp, el = element, res = el;
				while (true) {
					if (el.parentElement === js) break;
					if (el.tagName == "LI") res = el;
					el = el.parentElement;
				}; 	return res.previousSibling;
			},
			getLstTop: 			function (element) {
				var res = 0, js = this.refs.jsonp, el = element;
				while (true) {
					if (el === js) break;
					res += el.offsetTop;
					el = el.offsetParent;
				}; 	return res;
			},
			tmrMouseUp: 		null,
			hndMouseUp: 		function (e) {
				!!this.tmrMouseUp && clearTimeout(this.tmrMouseUp);
				// this.tmrMouseUp = setTimeout(() => {
				// 	this.setHeight(this.refs.jsonp.scrollHeight);
				// 	this.cssHeight(this.scrHeight);
				// }, 500);
			},
			componentDidUpdate: function () {
				// this.setHeight(this.refs.jsonp.scrollHeight);
				Actions.App.progress(100);
			},
			render: 			function () {
				var props = this.state, content = props.content, refrs = this.refs,
					css = this.CSS(), roots = css.roots, hghts = css.hghts, hides = css.hides;
				return (
					<div data-page={props.page} className='jsonp'
						 onWheel={(e) => {
							// var tmp = 'HGT: %d | SCR: %d | TOP: %d | MIN: %d | BTM: %d | OBJ: %d | OBH: %d',
							// 	jsn = refrs.jsonp,
							// 	obj = refrs.objct, obh = 0,
							// 	sch = this.scrHeight,
							// 	inc = 23, pad = inc/2,
							// 	dlt = e.nativeEvent.deltaY,
							// 	hgt = jsn.offsetHeight,
							// 	scr = jsn.scrollHeight,
							// 	top = jsn.scrollTop + dlt,
							// 	btm = top + hgt,
							// 	beg = 0, end = scr - hgt,
							// 	cnt = Math.round(scr/inc, 0),
							// 	spc = Math.round(hgt/inc, 0),
							// 	cur = Math.round(top/inc, 0),
							// 	min = (spc*3)*inc,
							// 	rfr = cur-(spc),
							// 	rfr = rfr>=-1?rfr:0,
							// 	rto = rfr+(spc*3),
							// 	rto = rto<=cnt?rto:cnt,
							// 	tpp = rfr * inc,
							// 	btt = sch-tpp,
							// 	gto = cur * inc, all, sty = '', sel = [];
							// // ---------------------------------
						 // 		e.preventDefault();
							// // SCROLL DEFAULTS -----------------
							// 	if (gto <= beg) {
							// 		// this.setScrTop(0); this.cssHeight(scr);
							// 		jsn.scrollTop = beg; return;
							// 	}
							// 	if (gto >= end) {
							// 		jsn.scrollTop = end; return;
							// 	}
							// 	jsn.scrollTop = gto;
							// // SCROLL INCREMENT ----------------
							// 	// all = document.querySelectorAll(hides);
							// 	// // tpp = this.getLstTop(all[rfr])
							// 	// // btt = sch-tpp;
							// 	// 	// console.log('FROM-TOP: %d',tpp);
							// 	// sel.push(this.setStyle(all[rfr], '1', true)); (btt>=min) &&
							// 	// sel.push(this.setStyle(all[rto], '0 !important'));
							// 	// sty = roots+' li { opacity: 0; }\n'+sel.join('\n');
							// 	// refrs.hides.innerHTML = sty;
							// 	// obh = (obj.childNodes[1].offsetHeight+(inc*2));
							// 	// // if ((tpp+obh)<scr) {
							// 	// // 	this.setScrTop(tpp);
							// 	// // 	this.cssHeight(sch-tpp);
							// 	// // 	console.log('>>>>');
							// 	// // } else {
							// 	// // 	this.cssHeight(0);
							// 	// // 	this.setScrTop(scr-obj.offsetHeight);
							// 	// // 	console.log('<<<<');
							// 	// // }
							// 	// 	console.log(tmp, sch, scr, tpp, min, btt, obj.offsetHeight, obh)
							// 	// 	console.log('\t\tOBJ-INNERH: %d', tpp+obh)
							// 	// 	console.log('\t\tTOP+HEIGHT: %d', tpp+obj.offsetHeight)
							// 	// 	console.log('\tFR: %d of %d |', rfr, cnt, all[rfr]);
							// 	// 	console.log('\tTO: %d of %d |', rto, cnt, all[rto]);
							// return;
						 }} ref="jsonp" >
						<style type="text/css" ref="topps"></style>
						<style type="text/css" ref="hghts"></style>
						<style type="text/css" ref="hides"></style>
						<div className="scrHeight" ref="scrht" />
						<div className="object" ref="objct">
							<span key="obrk" className="obrckt" />
							<JSONP.Iter {...content} id={props.id} key={props.id} hndMouseUp={this.hndMouseUp} />
							<span key="cbrk" className="cbrckt" />
						</div>
					</div>
				);
			},
		});
		JSONP.Iter 			= CRC({
			name: 'JSONP.ITER',
			mixins: [ DFFRNT.Mixins.Dynamic ],
			render: function () {
				var th  = this, props = th.state, size = (props.size || 0), items;
				try {
					// console.log("PROPS:", props.map((k,v) => k))
					items = props/*.slice(0,20)*/.map( function (v,k) {
						// console.log("k,v:", k, v)
						return (<JSONP.Item {...v} key={v.id} hndMouseUp={props.hndMouseUp} />);
					});
				} catch (e) { items = []; }
				// console.log("ITEMS:", items)
				return (
					<ul id={props.id} data-cnt={size} className="value gpu">
						{items}
					</ul>
				);
			}
		});
		JSONP.Item			= CRC({
			name: 'JSONP.ITEM',
			mixins: [
				DFFRNT.Mixins.Items,
				Reflux.listenTo(Stores.Data,'onReceive'),
				DFFRNT.Mixins.Receivers
			],
			componentDidUpdate: function () { Actions.App.progress(100); },
	 		render: function () {
				var props 	= this.state,
					name 	= props.name,
					type 	= props.type,
					value 	= this.isIP(props.name, props.value),
					alone 	= props.alone,
					iter 	= (this.extClass[type]||''),
					checked = ['result','user'].indexOf(name) > -1 ? '' : 'checked',
					classLI = CSS.Flex({Align:'L'/*,Wrap:!!iter*/},type,'gpu',iter),
					classOB = classN("obrckt", { alone: alone }),
					classCB = classN("cbrckt", { alone: alone }),
					collps 	= ('chbx-'+props.id),
					accord 	= ('acrd-'+props.id);
				// -------------------------------------------------
				return (
					<li key={props.id} className={classLI} id={props.id}>
						<input type='checkbox' ref="collps" id={collps} name={collps}
							   key={collps} disabled={alone} className="collps"
							   defaultChecked={checked} />
						<label key={collps+'-L1'} htmlFor={collps} onMouseUp={props.hndMouseUp} />
						{ (props.inside == 'object') ?
							<div className="key" key='KEY' onDoubleClick={this.hndAccords} onMouseUp={props.hndMouseUp}>
								{name}
								<span 	className="colon" key="CLN"
										dangerouslySetInnerHTML={{
											__html: [props.pad.join('&nbsp;')]
										}} />
							</div>
						: null }
						<span key="obrk" className={classOB} />
						<input type='checkbox' id={accord} name={accord}
							   key={accord} ref="accord" className="accord" />
						<span key="elps" className="ellipse">
							{(() => { try { return value.size } catch (e) { return 0; }})()}
						</span>
						{this.toValue(props)}
						<span key="cbrk" className={classCB} />
						<span key="cma" className="comma" />
						<label key={collps+'-L2'}></label>
						<div className="highlight" />
					</li>
				);
			}
		});

		////////////////////////////////////////////////////////////////////
		const Tags 			= CRC({
			name: 				'TAGS',
			mixins: 			[ DFFRNT.Mixins.Taggr ],
			render: 			function () {
				let props 	= (FromJS(this.state||{}).toJS()),
					focused = (!!props.fcsed?' focused':''),
					tags 	= (props.tags ||[]),
					text 	= (props.text ||''),
					value 	= (props.value||{}),
					input 	= (props.input||{}),
					sClick 	= (this.onClick),
					dClick 	= (this.onDblClick);
				if (!!tags.length) input.placeholder = "";
				// console.log('TAGS:', tags);
				return (
					<div className={'taggr paramInput'+focused} ref='tags'
						 onKeyDown={this.onKeyDown} onKeyUp={this.onKeyUp}>{[(!!tags ? (
						<div key='tags' className='tags'>{
							tags.map((v,i) => {
								let id = `${input.name}Tag${i}`,
									md = `${input.name}Mch${i}`,
									od = `${input.name}Opt${i}`,
									mp = this.tagMch[v.mch],
									op = this.tagOpt[v.opt],
									ch = this.tagIn(i),
									ed = !!v.edt,
									tx = v.txt,
									ln = tx.length,
									sz = ln||1; // (ln>1?ln-1:ln);
								return (
									<div key={i} className={'tag'+(op=='and'?' plus':'')} data-ref={i}>
										<input 	key='iL' name={id} className='focal' ref={i}
												type='checkbox' checked={ch} data-ref={i}
												data-mch={mp} data-opt={op} onFocus={this.onEdit} />
										{this.tagMch.map((o,n) => (
											<input 	key={o} name={md} checked={o==mp}
													type='radio' className={'matcher '+o}
													value={o} readOnly={true} data-ref={i} />
										))}
										{this.tagOpt.map((o,n) => (
											<input 	key={o} name={od} checked={o==op}
													type='radio' className={'modifier '+o}
													value={o} readOnly={true} data-ref={i} />
										))}
										<label 	key='tL' htmlFor={id} data-ref={i}
												onClick={sClick} data-ref={i}>
											<span className="field" />
											<input 	data-ref={i}
													name='tag'
													type='text'
													disabled={!ed}
													value={tx}
													onBlur={this.onSave}
													onKeyDown={this.onEnter}
													onChange={this.onWrite}
													size={sz}
											/>
											<span className="option" />
										</label>
									</div>
								);
							})
						}</div> ) : null),
						<input 	key='vals' ref='value' {...value} value={text}
								onChange={(e) => { console.log("I INPUTTED!!!!!!"); }}
								onInput={(e) => { console.log("I INPUTTED!!!!!!"); }}
								/>,
						<input 	key='flds' ref='input' {...input} className='taggee'
								onFocus={this.onFocus} onBlur={this.onBlur} onInput={this.onInput}
								data-value={text} />
					]}</div>
				);
			}
		});


		////////////////////////////////////////////////////////////////////
		const Bubble 		= CRC({
			name: 'BUBBLE',
			mixins: [ DFFRNT.Mixins.Static ],
			render: function () {
				var props 	= this.props||{},
					Opts 	= props.opts||[],
					Name 	= props.name||{First:'',Last:''},
					Photo 	= props.img,
					classes = classN('bubble', Opts),
					Initial = Name.First.replace(/^([A-Z]).+$/, '$1') ||
								(<i className="fa fa-plus" aria-hidden="true"></i>);
				return (
					<div id="pic" className={classes}><div>{!!Photo ?
						<img key="img" className="image" src={Photo} /> : Initial
					}</div></div>
				);
			}
		});

		////////////////////////////////////////////////////////////////////
		const NormalLink 	= CRC({
			name: 		 'NORMALLINK',
			mixins: 	[ DFFRNT.Mixins.Static ],
			href: 			"#",
			onSafeClick: 	function (e) {
				e.preventDefault(); window.open(this.href, "_self"); return false;
			},
			toMail: 	function (val, safe) {
				var prop = { className:'email', href:'#' },
					disp = val, link = INPUT.Email(val);
				if (!!safe) {
					prop.onClick = this.onSafeClick;
					this.href = link; delete prop.href;
				} else { prop.href = link; }
				return (<a {...prop}>{disp}</a>)
			},
			toLink: 	function (val, safe) {
				var prop = { className:'link', href:'#' }, disp = val,
					mtch = val.match(/^<T:(.+?),U:(.+)>$/);
				if (!!mtch) {
					disp = mtch[1];
					if (!!safe) {
						prop.onClick = this.onSafeClick;
						this.href = mtch[2]; delete prop.href;
					} else { prop.href = mtch[2]; }
				}
				return (<a {...prop}>{disp}</a>);
			},
			render: 	function () {
				var prop = this.props, kind = prop.kind,
					hndl = (kind=='email'?'toMail':'toLink');
				return this[hndl](prop.value, prop.safe);
			}
		});
		const SocketLink 	= CRC({
			mixins: 	[ DFFRNT.Mixins.Sockets ],
			toText: 	function (value) {
				return (<span className="sck">{value}</span>);
			},
			toLink: 	function (kind, props) {
				var point = props.point.split('/').slice(1),
					param = Imm.Map(props.params),
					query = Imm.Map(props.query).filter(
						function (v,k) { return !qryOmit.contains(k);
					}), cnt = 0;
				return [
					(point.map(function (v,i) {
						return (<span key={v+i} className='sck pnt'>{v}</span>);
					})),
					((!!param.count()) ?
						param.map(function (v,k) {
							return (<span key={k} className='sck prm'>{
								v.split(';').map(function (p,i) {
									return (<span key={i}>{p}</span>);
								})
							}</span>);
						}).toArray()
					: null),
					((kind == 'ext' && !!query.count()) ?
						<span key='qry' className="sck qry">{
							query.map(function (v,k) {
								cnt++; return [
									<span key={k+'K'+cnt} className='k'>{k}</span>,
									<span key={k+'V'+cnt} className='v'>{v}</span>,
								];
							}).toArray()
						}</span>
					: null)
				];
			},
			render: 	function () {
				var props = this.state,
					kind  = (props.query.kind || 'int'),
					disp  = props.display,
					cnfgs = this.kind[kind],
					hndls = cnfgs.handles,
					attrs = {
						className: 		 cnfgs.classes,
						href: 			 'javascript:void(0);', //props.link,
						title: 			 cnfgs.tip,
						onClick: 		 hndls.hndRequest.bind(this),
						// onClick: 	 	 cnfgs.cncRequest,
					}; hndls.setRequest.bind(this)();
				// console.log('TO:', (props.query.to||[]).join('\\/'))
				return (<a {...attrs}>{!!disp ?
					this.toText(disp) : this.toLink(kind, props)
				}</a>);
			}
		});

		////////////////////////////////////////////////////////////////////
		const PhoneNum 		= CRC({
			name: 		'PHONE',
			mixins: 	[ DFFRNT.Mixins.General, DFFRNT.Mixins.Phone ],
			classes: 	'number',
			render: 	function () {
				var th = this, pr = th.props, nm = pr.number,
					ph = nm['#'].match(/\d+/g), lk = th.getLink(nm);
				return (<span className="phone"><a href={lk}>{ph.map(function (v,i) {
					return (<span key={'NUM'+i} className='number'>{v}</span>);
				})}</a></span>);
			}
		});
		const PhoneExt 		= CRC({
			name: 		'EXT',
			mixins: 	[ DFFRNT.Mixins.General, DFFRNT.Mixins.Phone ],
			classes: 	'number',
			render: 	function () {
				var th = this, pr = th.props, nm = pr.number,
					lk = th.getLink(nm), ext = nm.Ext;
				return (<span className='number'><a href={lk}>{ext||''}</a></span>);
			}
		});
		const Address 		= CRC({
			name: 		'ADDRESS',
			mixins: 	[ DFFRNT.Mixins.General ],
			render: 	function () {
				var th = this, props = th.props;
				return (<address className="address">
					<span className="numeric">{props.City}</span>
					<span>,&nbsp;</span>
					<span className="numeric">{props.Region}</span>
					<span>,&nbsp;</span>
					<span className="numeric">{props.Country}</span>
				</address>);
			}
		});

		////////////////////////////////////////////////////////////////////
		const Foot 			= CRC({
			name: 		'FOOT',
			mixins: 	[ DFFRNT.Mixins.Static ],
			render: 	function () {
				var props 	= this.props,
					cssFoot = CSS.Flex({Dir:'Row',Align:'S',Space:'B',Wrap:0}, 'noSelect'),
					cssCred = CSS.Flex({Dir:'Row',Align:'C',Space:'S',Wrap:0}),
					cssChat = CSS.Flex({Dir:'Row',Align:'R',Space:'E',Wrap:0});
				return (
					<footer id='footer' className={cssFoot}>
						<section id="credits" className={cssCred}>
							<p>
								<span id='copyright'>{new Date().getFullYear()}</span>
								<span id='author'>
									<a key='author' href={'mailto:'+props.contact} target='_blank'>
										{props.author}
									</a>
								</span>
								<span id='company'>
									<a key='company' href={'http://'+props.website} target='_blank'>
										{props.company}
									</a>
								</span>
							</p>
						</section>
						<section id="chatter" className={cssChat}>
							<Bubble {...{opts:['lite','small']}} />
						</section>
					</footer>
				);
			}
		});

		////////////////////////////////////////////////////////////////////
		DFFRNT.Elements 	= {
			App, Head, Load, Navi, Body, Foot,
			SideBar, Pages, Draft, Search, JSONP,
			SocketLink, PhoneNum, PhoneExt,
			Address, Bubble,
		};

		RDOM.render(<App />, document.getElementById('app'));


	////////////////////////////////////////////////////////////////////////
	// SOCKET HANDLES //////////////////////////////////////////////////////

		function SockAuthRoom  (res) { LOG("ROOM | %s", res); 				 }
		function SockConnErr (error) { LOG('CONNECTION ERROR!!', 	 error); }
		function SockConnTO(timeout) { LOG('CONNECTION TIMEOUT!!', timeout); }
		function SockError	 (error) { LOG('SOCKET ERROR!!', 		 error); }
		function SockRConnErr(error) { Actions.App.disconnect({result:{code:4}}); }


		// global.Access = IO('/api-accessor');
		// Access.on('connect', 		Actions.App.connect);
		Access.on('room', 			SockAuthRoom);
		Access.on('receive', 		Actions.Data.receive);
		Access.on('disconnect', 	Actions.App.disconnect);
			// Access.on('connet_error', 	SockConnErr);
			// Access.on('connect_timeout',SockConnErr);
			// Access.on('error', 			SockConnErr);
		Access.on('reconnect_error',SockRConnErr);

		// global.Socket = IO(NMESPC);
		Socket.on('connect', 		Actions.Content.setup);
		Socket.on('setup', 	 		Actions.Content.build);
		Socket.on('receive', 		Actions.Data.receive);
			// Socket.on('connet_error', 	SockConnErr);
			// Socket.on('connect_timeout',SockConnErr);
			// Socket.on('error', 			SockConnErr);

};
