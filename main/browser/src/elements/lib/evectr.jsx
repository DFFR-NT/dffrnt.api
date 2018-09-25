'use strict';

module.exports = function Comps(COMPS) {

	////////////////////////////////////////////////////////////////////////
	// CONSTANTS -----------------------------------------------------------

		const 	MX 			= COMPS.Mixins;
		const 	Mix 		= COMPS.Mix;
		const 	Agnostic 	= COMPS.Agnostic;
		const 	Actions 	= COMPS.Actions;
		const 	Reflux 		= COMPS.Reflux;
		const 	React 		= COMPS.React;
		const 	Frag 		= React.Fragment;
		const 	RDOM 		= COMPS.RDOM;
		const 	FA 			= COMPS.FA;
		const 	iURL 		= COMPS.iURL;
		const 	joinV 		= COMPS.joinV;
		const 	PAGE 		= NMESPC.page;

		const 	EV 			= {};

		// Configs
		const	RLogin 		= '/auth/login';
		const	RLogout 	= '/auth/logout';

		function getBasic 	(user, pass) {
			COMPS.Basic = 'Basic '+btoa(user.value+':'+pass.value);
			return COMPS.Basic;
		}

	////////////////////////////////////////////////////////////////////////
	// MIXINS --------------------------------------------------------------
	////////////////////////////////////////////////////////////////////////
	// COMPONENTS ----------------------------------------------------------

		// IMPORTS /////////////////////////////////////////////////////////

			const {
				Tags, Bubble, NormalLink, SocketLink, 
				PhoneNum, PhoneExt, Address, 
			} = COMPS.Elements.Stock;

		// APP     /////////////////////////////////////////////////////////
			EV.App 				= class App 		extends Mix('Reflux',MX.General) {
				constructor(props) {
					super(props)
					this.name = 'APP';
					this.store = COMPS.Stores.App;
				}

				render() {
					var props 	= this.state,
						header 	= props.header,
						title 	= header.title,
						user 	= header.user,
						uname 	= user.Scopes.display_name,
						content = props.content,
						footer 	= props.footer,
						iCover 	= PAGE.type=='cover',
						classes = classN({
							'gridMain':		true,
							'loggedIn': 	header.identified,
							'loggedOut': 	!header.identified,
							'pause': 		props.paused,
							'ready': 		props.ready(),
						},	PAGE.type||'');
					
					COMPS.Token 	= header.user.Token; 
					COMPS.IsAuthd 	= header.identified;

					return (
						<main id="content" className={classes}>
							<Search />
							{iCover?(
								<React.Fragment>
									<Cover img={title.cover} />
									<Plaque {...title.user} />
								</React.Fragment>
							):(
								<React.Fragment>
									<Title {...{
										kind: 		'page', 
										size: 		'large', 
										mode: 		'shadow-only', 
										title: 		 title,
									}}/>
									<hr className="gridItemDivide"/>
								</React.Fragment>
							)}
							<Foot {...footer} />
							<Content {...content} />
							<Head home={footer.credits.website} 
								  user={user.Profile.Name} 
								  alerts={header.alerts}
								  messages={header.messages} 
								  admin={header.admin} />
							<Threads {...footer} />
						</main>
					);
				}
			};

		// HEAD    /////////////////////////////////////////////////////////
			EV.Head 			= class Head 		extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'HEAD';
				}

				render() {
					let props = this.props, 
						home  = props.home,
						msgs  = props.messages,
						alert = props.alerts,
						admin = props.admin,
						style = { 
							backgroundImage: `url('public/images/Logo.png')` 
						};
					return (
						<header className="gridItemHeader gridHeader" id="header">
							{/* <!-- BANNER --> */}
								<section className="noSelect gridItemBranding flex flexDirRow flexSpaceB" id="banner" role="banner">
									<a href={`http://${home}`}>
										<div id="logo" className="gpu" style={style} role="logo"></div>
									</a>
									<Head.Login />
								</section>
							{/* <!-- NAVIGATION --> */}
								<nav className="gridItemNav gridTabs compact" tabIndex="0" role="menubar">
									<div className="gridDrop">
										<label role="menuitem">
											<a id="gotoSearch" className={FA('search')} href="#app"></a>
										</label>
									</div>
									<Head.Drop {...msgs} />
									<Head.Drop {...alert} />
									<Head.Drop {...admin} />
									<input type="radio" className="ctrl" name="navDrops" id="navNone" tabIndex="1" defaultChecked/>
								</nav>
						</header>
					);
				}
			};
			EV.Head.defaultProps = {
				home: 			'',
				user: 			{ First: '', Last: '' },
				messages:		[],
				notifications:	[],
			};

			EV.Head.Login		= class Login	 	extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props)
					this.name = 'HEAD.LOGIN';
					this.handleLogin = this.handleLogin.bind(this);
				}

				handleLogin(e) {
					e.stopPropagation(); 
					var usr = this.refs.email_address, pss = this.refs.password,
						enc = getBasic(usr, pss),
						req = { headers: { authorization: enc } };
					Actions.Data.auth(RLogin, req, false);
					e.nativeEvent.srcElement.submit();
					usr.value=''; pss.value='';
				}

				render() {
					var THS = this, src = "/public/html/login.htm";
					return ([
						<iframe key='autocomp' src={src} id="temp" name="temp" style={{display:'none'}} />,
						<form target='temp' id='auth'  key='auth' method='POST' onSubmit={this.handleLogin}
							className={CSS.Flex({Wrap:0,Space:'B'})} action={src} ref='login'>
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
					]);
				}
			};

			EV.Head.Logout 		= class Logout	 	extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props)
					this.name = 'HEAD.LOGOUT';
				}

				handleLogout(e) {
					e.preventDefault(); e.stopPropagation();
					var req = { headers: { token: COMPS.Token } };
					Actions.Data.auth(RLogout, req, true);
					return false;
				}
				render() {
					var props = this.props;
					return (
						<form target='temp' id='auth' key='auth' method='POST' onSubmit={this.handleLogout}
							className={CSS.Flex({Wrap:0,Space:'B'})} action='#'>
							<div className='auth sunk lst'>
								<i className='fa fa-sign-out' aria-hidden='true' />
								<input name='logout' type='submit' value=' ' />
							</div>
						</form>
					);
				}
			};

			EV.Head.Drop 		= class Drop		extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'DROP';
				}

				render() {
					let props = this.props, 
						group = props.group, 
						id 	  = props.id, 
						tab   = props.tab, 
						icon  = props.icon,
						label = props.label,
						igroup= props.igroup,
						items = props.items,
						all   = (!!props.all?{
									id:   `${igroup}-${items.length}`,
									href: props.all,
								}:null),
						DItem = Head.Drop[props.kind];
					return (
						<div className="gridDrop">
							<input type="radio" className="reveal" name={group} id={id} aria-hidden="true" tabIndex={tab} />
							<label className="reveal" role="menuitem" aria-expanded="false" htmlFor={id}>
								<i className={FA(icon)}></i>
								{!!label?(<span className="hidden-xs hidden-sm">{label}</span>):null}
							</label>
							<div className="drop reveal" role="menu">
								<div className="menu">
									{items.map((v,i) => {
										let id = `${igroup}-${i}`;
										return (<DItem key={id} id={id} tab={tab} {...v}/>);
									}).concat(!!all?[
										<Head.Drop.ALL key={all.id} id={all.id} group={igroup} tab={tab} />
									]:[])}
								</div>
							</div>
						</div>
					);
				}
			};
			EV.Head.Drop.defaultProps = {
				group:	null, 
				id:		null, 
				tab:	'0', 
				icon:	null, 
				label:	'',
				igroup:	'',
				items:	[],
				all:	'',
			};
			
			EV.Head.Drop.MSG 	= class MSG			extends Mix('Pure',  MX.Static) {
				constructor(props) { super(props); this.name = 'MSG'; }

				render() {
					let props 	= this.props, 
						group 	= props.group,
						id 		= props.id,
						tab 	= props.tab,
						label 	= props.label, 
						time 	= props.time,
						detail 	= props.detail,
						href 	= props.href;
					return (
						<React.Fragment>
							<input type="radio" className="ctrl" name={group} id={id} aria-hidden="true" tabIndex={tab} />
							<a role="menuitem" href={href}>
								<div className="message prev">
									<header>
										<strong>{label}</strong>
										<span className="pull-right muted">
											<em>{time}</em>
										</span>
									</header>
									<div>{detail}</div>
								</div>
							</a>
						</React.Fragment>
					);
				}
			};
			EV.Head.Drop.MSG.defaultProps = {
				group:	null, 
				id:		null, 
				tab:	'0', 
				icon:	null, 
				label:	'',
				time:	'',
				detail:	'',
				href:	'#',
			};

			EV.Head.Drop.ALRT 	= class ALRT		extends Mix('Pure',  MX.Static) {
				constructor(props) { super(props); this.name = 'ALRT'; }

				render() {
					let props 	= this.props, 
						group 	= props.group,
						id 		= props.id,
						tab 	= props.tab,
						icon 	= props.icon,
						time 	= props.time,
						label 	= props.label,
						href 	= props.href;
					return (
						<React.Fragment>
							<input type="radio" className="ctrl" name={group} id={id} aria-hidden="true" tabIndex={tab} />
							<a role="menuitem" href={href}>
								<div className="notification">
									<i className={FA(icon)}></i>{` ${label}`.trim()}
									<span className="pull-right muted small">{time}</span>
								</div>
							</a>
						</React.Fragment>
					);
				}
			};
			EV.Head.Drop.ALRT.defaultProps = {
				group:	null, 
				id:		null, 
				tab:	'0', 
				icon:	null, 
				time:	'',
				label:	'',
				href:	'#',
			};

			EV.Head.Drop.BTN 	= class BTN			extends Mix('Pure',  MX.Static) {
				constructor(props) { super(props); this.name = 'BTN'; }

				render() {
					let props 	= this.props, 
						group 	= props.group,
						id 		= props.id,
						tab 	= props.tab,
						icon 	= props.icon, 
						label 	= props.label,
						href 	= props.href;
					return (
						<React.Fragment>
							<input type="radio" className="ctrl" name={group} id={id} aria-hidden="true" tabIndex={tab} />
							<a role="menuitem" href={href}><label htmlFor={id}>
								<i className={FA(icon)}></i>{` ${label}`.trim()}</label>
							</a>
						</React.Fragment>
					);
				}
			};
			EV.Head.Drop.BTN.defaultProps = {
				group:	null, 
				id:		null, 
				tab:	'0', 
				icon:	null, 
				label:	'',
				href:	'#',
			};

			EV.Head.Drop.ALL 	= class ALL			extends Mix('Pure',  MX.Static) {
				constructor(props) { super(props); this.name = 'ALL'; }

				render() {
					let props 	= this.props, 
						group 	= props.group,
						id 		= props.id,
						tab 	= props.tab,
						icon 	= props.icon,
						label 	= props.label,
						href 	= props.href;
					return (
						<React.Fragment>
							<input type="radio" className="ctrl" name={group} id={id} aria-hidden="true" tabIndex={tab} />
							<a href={href} className="seeAll" role="menuitem" >
								<div className="msg all"><strong>{label}</strong> <i className={FA(icon)}></i></div>
							</a>
						</React.Fragment>
					);
				}
			};
			EV.Head.Drop.ALL.defaultProps = {
				group:	null, 
				id:		null, 
				tab:	'0', 
				icon:	'angle-right', 
				label:	'Read All Messages',
				href:	'#',
			};

		// SEARCH  /////////////////////////////////////////////////////////
			EV.Search 			= class Search 		extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'SEARCH';
				}

				render() {
					let id		= "search",
						classes = "gridItemSearch gridSearch norm-b";
					return (
						<form id={id} name={id} method="POST" action="/results" className={classes}>
							<div className="tkn norm"><span><i className={FA('search')}></i></span></div>
							<input 	type="search" id="search-box" name="search-box" autoComplete="off" 
									placeholder="Search for anything (Well, not anything, but...)" 
									className="gridItemSearchBox"/>
							<button type="submit" id="search-go"  name="search-go"  className="tkn norm">
								<span>GO</span>
							</button>
						</form>
					);
				}
			}

		// COVER   /////////////////////////////////////////////////////////
			EV.Cover 			= class Cover 		extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'COVER';
				}

				render() {
					let props 	= this.props,
						img 	= props.img||'',
						style 	= (!!img ? { 
							backgroundImage: `url('${img}')` 
						} : null);
					return (
						<header className="gridItemCover">
							<div className="gpu" style={style}></div>
						</header>
					);
				}
			}
			EV.Cover.defaultProps = {
				image: ''
			}

		// TITLE  /////////////////////////////////////////////////////////

			EV.Title 			= class Title 		extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'TITLE';
				}

				getSub(subtitle, isShadow) {
					let res = Assign(
						{ label: '', badges: []}, 
						FromJS(subtitle||{}).toJS()
					);
					if (!!res.label  ) res.label  = ['\u000a(',res.label,')'];
					if (!!!res.badges) res.badges = [];
					else if (isShadow) res.badges = res.badges.map(v => (
						v.kind = v.kind.split('').reverse().join(''),v)
					);	return res;
				}
				getFull(isShadow, title, subtitle) {
					return (isShadow?[title].concat(subtitle.label).join(''):null);
				}
				getAttrs(isShadow, id, title, subtitle) {
					return {
						className: 			classN('gridItemName',isShadow?'d':''),
						'aria-hidden': 		isShadow.toString(),
						'aria-labelledby': 	isShadow?null:id,
						'data-full':		this.getFull(isShadow, title, subtitle),
					};
				}
				getTitle(props, isShadow = false, size = 'large') {
					let id 		 = props.id,
						kind 	 = props.kind||'page',
						title 	 = props.title,
						subtitle = this.getSub(props.subtitle, isShadow),
						isUser 	 = kind=='user',
						shadow 	 = isShadow?'noShadow':null,
						attrs	 = this.getAttrs(isShadow, id, title, subtitle),
						subs     = (isUser?(
							<sup aria-hidden="true">
								<span>{subtitle.label[1]||''}</span>
								<React.Fragment>
									{subtitle.badges.map((v,i) =>
										<Trusts.Badge key={`badge-${i}`} {...v}/>
									)}
								</React.Fragment>
							</sup>
						):null);
					
					return (size!='small' ? (
						<header {...attrs}>
							<div className={shadow}>
								<h1 id={isShadow?null:id} className="gpu">
									<span className="trunc">{title}</span>
									{subs}
								</h1>
							</div>
						</header>
					) : (
						<React.Fragment>
							<h3 className="gpu"><span className="trunc">{title}</span></h3>
							<h3>{subs}</h3>
						</React.Fragment>
					));
				} 

				render() {
					let props = this.props, size = props.size,
						isShadow = (props.mode=='shadowed'),
						isOnly   = (props.mode=='shadow-only');
					return (
						<React.Fragment>
							{isShadow?this.getTitle(props, true, size):null}
							{this.getTitle(props, isOnly, size)}
						</React.Fragment>
					);
				}
			}
			EV.Title.defaultProps = {
				id:			'pageTitle',
				kind: 		'page', 
				mode: 		'shadowed', 
				title: 		'...',
				size:		'large',
			}

		// PLAQUE  /////////////////////////////////////////////////////////
			
			EV.Plaque 			= class Plaque 		extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'PLAQUE';
				}

				render() {
					let props 	= this.props,
						pic		= props.photo,
						uname	= props.uname,
						fname	= props.name,
						badges	= props.badges,
						locale	= props.locale,
						age		= props.age,
						sex 	= { 
							M: 'mars', F: 'venus', I: 'transgender-alt' 
						}[props.sex];
					return (
						<React.Fragment>
							{/* <!-- PROFILE PHOTO --> */}
								<header className="gridItemPic d">
									<Bubble kind="user" name={fname} img={pic} opts={['small','er','lite']} />
								</header>
								<header className="gridItemPic">
									<Bubble kind="user" name={fname} img={pic} opts={['huge','cutout']} id="profile_picture"/>
								</header>
							{/* <!-- PROFILE INFO  --> */}
								<Title {...{
									id:			'profileName',
									kind: 		'user', 
									mode: 		'shadowed', 
									title: 		 joinV(props.name),
									subtitle: 	{ label: uname, badges: badges },
								}}/>
								<header className="gridItemInfo PLR">
									<div className="noShadow">
										<h4>{locale}</h4>
										<h6>{!!sex?<i className={FA(sex)}></i>:null}
											{!!age?<React.Fragment>
												{age}<sup>years old</sup>
											</React.Fragment>:null}
										</h6>
									</div>
								</header>
							{/* <!-- PROFILE JOIN  --> */}
								<header className="gridItemJoin">
									<div className="cutout">
										<button className="tkn good large block" type="submit">
											<span><i className={FA('user-plus')}></i> Join my Community</span>
										</button>
									</div>
								</header>
						</React.Fragment>
					);
				}
			};

			EV.Plaque.Stub 		= class Stub 		extends EV.Plaque {
				constructor(props) {
					super(props); this.name = 'STUB';
				}

				render() {
					let props 	= this.props,
						pic		= props.Photo,
						user	= props.Account,
						name	= joinV(props.Name),
						badges	= props.Badges,
						locale	= joinV(props.Location,', '),
						age		= props.Age,
						sex 	= { 
							M: 'mars', F: 'venus', I: 'transgender-alt' 
						}[props.Sex],
						multis	= props.Multis;

					return (
						<a className="gridStub spread">
							{/* <!-- STUB PHOTO --> */}
								<Bubble kind="user" opts={['medium','dark']} name={props.Name} img={pic}/>
							{/* <!-- STUB INFO  --> */}
								<Title {...{
									kind: 		'user', 
									size: 		'small', 
									mode: 		 null, 
									title: 		 name,
									subtitle: 	{ label: user, badges: badges },
								}}/>
								<h6 className="trunc">{locale}</h6>
								<h6>{!!sex?<i className={FA(sex)}></i>:null}
									{!!age?<React.Fragment>
										{age}<sup>years old</sup>
									</React.Fragment>:null}
								</h6>
								<div><div>{multis.map((v,i) => (
									<Content.Multi key={`stub-${i}`} weight="small" {...v}/>
								))}</div></div>
						</a>
					);
				}
			};

			EV.Plaque.defaultProps = {
				Account: '--{{ACCOUNT}}--',
				Photo: 	 '--{{PHOTO}}--',
				Name: 	 { 
					First: 	'--{{NAME.FIRST}}--', 
					Last: 	'--{{NAME.LAST}}--' 
				},
				Badges:  [],
				Age: 	 0,
				Sex: 	'I',
				Email: 	'--{{EMAIL}}--', 
				Location: 	{ 
					City: 	'--{{LOCATION.CITY}}--', 
					Region: '--{{LOCATION.REGION}}--', 
					Country:'--{{LOCATION.COUNTRY}}--' 
				},
			};
			EV.Plaque.Stub.defaultProps = {
				Account: '--{{ACCOUNT}}--',
				Photo: 	 '--{{PHOTO}}--',
				Name: 	 { 
					First: 	'--{{NAME.FIRST}}--', 
					Last: 	'--{{NAME.LAST}}--' 
				},
				Badges:  [],
				Age: 	 0,
				Sex: 	'I',
				Location: 	{ 
					City: 	'--{{LOCATION.CITY}}--', 
					Region: '--{{LOCATION.REGION}}--', 
					Country:'--{{LOCATION.COUNTRY}}--' 
				},
				Multis:	[],
			};

		// CONTENT /////////////////////////////////////////////////////////
			EV.Content 			= class Content 	extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'CONTENT';
				}

				getSideBar(copy, other) {
					let dflts = { label: '', href: '#', icon: null },
						items = copy.concat(other);
					return items.map(v => {
						let prps = v.props||{}, head = prps.header,
							href = {href:`#${prps.name}`};
						return (!!head?Assign({},dflts,head,href):null);
					}).filter(v=>!!v); 
				}

				render() {
					let { SideBar, Copy, Other  } = Content;
					let props = this.props, sgmnt = props.segments,
						copy  = sgmnt.copy, other = sgmnt.other,
						sideb = (!!sgmnt.sidebar?sgmnt.sidebar:
								this.getSideBar(copy,other));
					return (
						<section className="gridItemContent gridContent">
							<SideBar {...{ name: 'sidebar', items: sideb }} />
							<Copy    {...{ name:    'copy', items:  copy }} />
							<Other   {...{ name:   'other', items: other }} />
						</section>
					);
				}
			};

			EV.Content.SideBar 	= class SideBar 	extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'SIDEBAR';
				}

				render() {
					let props = this.props, name = props.name, bttns = props.items;
					return (
						<nav id={name} className="gridItemSidebar gridMenu">
							{bttns.map((v,i) => (
								<Frag key={i}>
									<label key={`sbttn-${i}`} className={classN("btn",!!v.small?'sub':null)}>
										<a href={v.href}>{`${v.label} `}
											{!!v.icon?(<i className={FA(v.icon)}></i>):null}
										</a>
									</label>
									{(v.subs||[]).map((s,k) => (
										<label key={`sbttn-${i}${k}`} className="btn sub">
											<a href={`#${s.name}`}>{`${s.label} `}
												{!!s.icon?(<i className={FA(s.icon)}></i>):null}
											</a>
										</label>
									))}
								</Frag>
							))}
						</nav>
					);
				}
			};

			EV.Content.Copy 	= class Copy 		extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'COPY';
				}

				render() {
					let props = this.props, name = props.name, panels = props.items;
					return (
						<section id={name} className="gridItemCopy PLR">
							{panels.map((v,i) => Agnostic(v, i))}
						</section>
					);
				}
			};

			EV.Content.Other 	= class Other	 	extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'OTHER';
				}

				render() {
					let props = this.props, name = props.name, panels = props.items;
					return (
						<aside id={name} className="gridItemOther" aria-hidden="true">
							{panels.map((v,i) => Agnostic(v, i))}
						</aside>
					);
				}
			};

			EV.Content.Panel 	= class Panel 		extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'PANEL';
				}

				render() {
					let props = this.props,   name  = props.name, 
						head  = props.header, body  = props.body,
						accrd = !!props.accordian?'accordian':null,
						kind  = classN("panel",props.kind||''), 
						fixed = !!head.fixed?'fixed':null,
						align = props.align||'';
					return (
						<section id={name} className={kind}>
							{!!head?<header className={classN('heading',fixed)}>
								<h3>{head.label}{!!head.icon?<i className={FA(head.icon)}></i>:null}</h3>
							</header>:null}
							<article className={classN('body',align,accrd)}>
								{body.map((v,i) => Agnostic(v, i))}
							</article>
						</section>
					);
				}
			};

			EV.Content.Slab 	= class Slab 		extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'SLAB';
				}

				render() {
					let props = this.props,   
						id    = props.id, 
						IDs   = {
							svc: 	`showSvc-${id}`,
							info: 	`showSvcInfo-${id}`,
						},
						kind  = props.kind, 
						name  = props.name, 
						desc  = props.description, 
						dllar = (<span className="muted">$</span>),
						slash = (<span className="muted">/</span>),
						chrg  = {
							Free:	 c => ('Free!'),
							Flat:	 c => (<Frag key="chrg">{dllar}{c}</Frag>),
							Hourly:	 c => (<Frag key="chrg">{dllar}{c}{slash}hour</Frag>),
							Daily:	 c => (<Frag key="chrg">{dllar}{c}{slash}daily</Frag>),
							Monthly: c => (<Frag key="chrg">{dllar}{c}{slash}monthly</Frag>),
							Quote:	 c => ('Quote'),
						}[props.rate](props.charge);
					return (
						<div key={IDs.svc} className="panel slab block">
							<input type="checkbox" id={IDs.svc} name={IDs.svc} className="reveal"/>
							<label className="heading reveal tkn info block" htmlFor={IDs.svc}>
								<h6>{name}<span className="mirror">{kind}</span></h6>
							</label>
							<div className="body gridSlice gap reveal" aria-hidden="true">
								<div className="greedy">{
								  	desc.match(/(\S[\S\s]+?)(?=\n\n|$)/g).map((p,i) => (
										<p key={`${IDs.svc}-${i}`} className="lead">
											{p.match(/([^\n]+)(?=\n|$)/g).map((t,k)=>
												<React.Fragment key={`${i}-${k}`}>{t}<br/></React.Fragment>
											)}
										</p>
									)	)
								}</div>
								<div className="sliver gridR"><h5><dt>{chrg}</dt></h5></div>
								<button className="tkn block good some"><span><i className="fas fa-credit-card"></i> Inquire</span></button>
								<label className="tkn block norm more reveal" htmlFor={IDs.info}><span><i className="fas fa-binoculars"></i> Get more Info</span></label>
								<input type="checkbox" id={IDs.info} name={IDs.info} className="reveal"/>
								<div className="reveal spread">
									<p><small>Check out any relavent <b>Documents</b>, <b>Credentials</b>, <b>Images</b> &amp; <b>Links</b> regarding this Service below!</small></p>
									<br/>
									<Content.TabTab id={id} />
								</div>
							</div>
						</div>
					);
				}
			};

			EV.Content.TabTab 	= class TabTab 		extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'TABTAB';
				}

				render() {
					let props = this.props,   
						id    = props.id, 
						IDs   = {
							main: 	`svcTab-${id}`,
							doc: 	`svcTabDoc-${id}`,
							crd: 	`svcTabCrd-${id}`,
							img: 	`svcTabImg-${id}`,
							lnk: 	`svcTabLnk-${id}`,
						},
						items = [];
					return (
						<div className="tabs flex flexDirColR">
							<div className="tabBody">
								<div>
									<input type="radio" id={IDs.doc} name={IDs.main} className="reveal" defaultChecked/>
									<div className="table spread reveal">
										<div className="column nowrap">
											<div className="trunc head">Document</div>
											<div className="trunc">
												<a href="/doc/2/CanadaUnlocking%20Receipt%20(05-21-16).pdf" target="_blank">CanadaUnlocking Receipt (05-21-16).pdf</a>
											</div>
										</div>
										<div className="column">
											<div className="trunc head">Description</div>
											<div className="trunc"><p>I unlock phones....</p></div>
										</div>
									</div>
								</div>
								<div>
									<input type="radio" id={IDs.crd} name={IDs.main} className="reveal"/>
									<div className="table spread reveal">
										<div className="column nowrap">
											<div className="trunc head">Credential</div>
											<div className="trunc">
												<a href="/doc/2/3)%20Government%20IDs.pdf" target="_blank">3) Government IDs.pdf</a>
											</div>
										</div>
										<div className="column">
											<div className="trunc head">Description</div>
											<div className="trunc">
												<p>I am who I say I am. If I wasn't, then why would I say I am?</p>
												<p>Seriously, I'm actually asking...</p>
											</div>
										</div>
									</div>
								</div>
								<div>
									<input type="radio" id={IDs.img} name={IDs.main} className="reveal"/>
									<div className="table spread reveal">
										<div className="column nowrap">
											<div className="trunc head">Image</div>
											<div className="trunc">
												<a href="/doc/2/XYFVFD_1_0711154234526_S.jpg" target="_blank">XYFVFD_1_0711154234526_S.jpg</a>
											</div>
										</div>
										<div className="column">
											<div className="trunc head">Description</div>
											<div className="trunc">
												<p>This is me and my boo at the One World Trade Center.</p>
											</div>
										</div>
									</div>
								</div>
								<div>
									<input type="radio" id={IDs.lnk} name={IDs.main} className="reveal"/>
									<div className="table spread reveal">
										<div className="column nowrap">
											<div className="trunc head">Link</div>
											<div className="trunc">
												<a href="http://Facebook.com/LeShaunJohn" target="_blank">Facebook.com/LeShaunJohn</a>
											</div>
											<div className="trunc">
												<a href="http://Instagram.com/LeShaunJohn" target="_blank">Instagram.com/LeShaunJohn</a>
											</div>
										</div>
										<div className="column">
											<div className="trunc head">Description</div>			
											<div className="trunc">
												<p>Hit me up on my Facebook, y'all.</p>
											</div>
											<div className="trunc">
												<p>Check out my 'Gram, y'all.</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<nav className="gridTabs buttons" role="tabgroup">
								<label htmlFor={IDs.doc}><span className="hidden thin">Documents </span><i className="fas fa-file fa-fw hidden wide"></i></label>
								<label htmlFor={IDs.crd}><span className="hidden thin">Credentials </span><i className="fas fa-id-card fa-fw hidden wide"></i></label>
								<label htmlFor={IDs.img}><span className="hidden thin">Images </span><i className="fas fa-images fa-fw hidden wide"></i></label>
								<label htmlFor={IDs.lnk}><span className="hidden thin">Links </span><i className="fas fa-link fa-fw hidden wide"></i></label>
							</nav>
						</div>
					);
				}
			};

			EV.Content.Block 	= class Block 		extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'HEADED';
				}

				render() {
					let props = this.props,   name  = props.name, 
						head  = props.header, items = props.items,
						align = props.align||null;
					return (
						<div id={name} className={classN('block',align)}>
							{!!head?<h4 key={name}>
								{head.label}<i className={FA(head.icon)}></i>
							</h4>:null}
							{items.map((v,i) => Agnostic(v, i))}
						</div>
					);
				}
			};

		// MULTI   /////////////////////////////////////////////////////////

			EV.Content.Multi 	= class Multi	 	extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'MULTI';
				}

				getText(props, lvl = false) {
					let cls = { 
							'className': lvl?'lvl':null,
							'data-more': props.adjct||null,
						},
						lnk = props.hasOwnProperty('href'),
						lbl = props.label||'...';
					return (lnk ?
						<a href={props.href||'#'} {...cls}>{lbl}</a> :
						<span {...cls}>{lbl}</span>
					);
				}

				render() {
					let props 	= this.props, 
						kind 	= props.kind, 
						lvl		= props.hasOwnProperty('level'),
						weight 	= props.weight||'',
						size	= `data-x${props.size||1}`,
						attrs	= {
							'type': 		"button",
							'className':	`multi tkn ${kind} ${weight}`.trim(),
							'value':		 props.value||null,
							[size]:			'', 
						};
					return (
						<button {...attrs}>
							<React.Fragment>
								{this.getText(props)}{lvl ? 
								 this.getText(props.level,true):
								 null}
							</React.Fragment>
						</button>
					);
				}
			};

			EV.Content.Multis 	= class Multis	 	extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'MULTIS';
				}

				render() {
					let props 	= this.props, 
						name	= props.name,
						align	= props.align||'spread',
						flex  	= classN(['flex','flexSpaceS','flexDirRow','flexWrap']),
						head 	= props.header,
						items	= props.items||[],
						attrs	= {
							kind: 	props.kind,
							size: 	props.size,
							weight: props.weight
						};
					return (
						<div className={align}>
							{!!head?<h5>{head.label}</h5>:null}
							<div className={flex}>{items.map((v,i) => (
								<Content.Multi key={`multi-${name}-${i}`} {...attrs} {...v}/>
							))}</div>
						</div>
					);
				}
			};

		// LISTS   /////////////////////////////////////////////////////////

			EV.Content.List 	= class List	 	extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'LIST';
				}

				render() {
					let props 	= this.props, 
						name	= props.name,
						align	= props.align||'spread',
						style	= props.style||'bare',
						head 	= props.header,
						items	= props.items||[],
						kind 	= props.kind;
					return (
						<div className={align}>
							{!!head?<h5>{head.label}</h5>:null}
							<ul className={style}>
								{items.map((v,i) => {
									let id = `li-${name}-${i}`;
									return (<li key={id} id={id} className={kind}>{v||'...'}</li>);
								})}
							</ul>
						</div>
					);
				}
			};

			EV.Content.Person	= class Person		extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'PERSON';
				}

				render() {
					let props 	= this.props, 
						name	= props.name||'... ...',
						classes	= classN('bubble', 'small', props.style||'lite', 'gpu'),
						img 	= { backgroundImage: `url('${props.img||''}')` },
						href	= props.href||'';
					return (
						<a href={href} className="stub small">
							<div className={classes} style={img}></div>
							<dt>{name}</dt>
						</a>
					);
				}
			};

			EV.Content.Activity	= class Activity	extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'ACTIVITY';
				}

				render() {
					let props = this.props, title = props.title||'...', details	= props.details||'...';
					return (<dl><dt>{title}</dt><dd className="ellipsis">{
						IS(details)==='object'?Agnostic(details,'detail'):details
					}</dd></dl>);
				}
			};

		// TRUSTS  /////////////////////////////////////////////////////////

			EV.Trusts 			= class Trusts		extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'TRUSTS';
					this.keyNames = ['shield','br','rating']
										.map(v=>`trust-${v}`);
				}

				render() {
					let keys 	= this.keyNames,
						props 	= this.props, 
						shields = props.shields||[], 
						items 	= shields.items,
						size 	= shields.size,
						rating	= props.rating,
						both 	= !!rating&&!!items.length;
					return (
						<React.Fragment>
							{items.map((v,i)=>
								<Trusts.Shield key={`${keys[0]}-${i}`} kind={v} size={size}/>
							)
							.concat(both?[<br key={keys[1]}/>]:[])
							.concat(!!rating?[
								<Trusts.Rating key={keys[2]} {...rating}/>
								]:[]
							)}
						</React.Fragment>
					);
				}
			};
			
			EV.Trusts.Shield	= class Shield		extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'SHIELD';
				}

				render() {
					let props = this.props, kind = props.kind, size = props.size, 
						classes	= classN('shield', kind||'invalid', size||'large');
					return (<label className={classes}><i></i><span></span></label>);
				}
			};

			EV.Trusts.Badge		= class Badge		extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'BADGE';
				}

				render() {
					let props = this.props, 
						icon = props.icon, kind = props.kind, size = props.size, 
						classes = classN('badge', kind||'norm', size||'sm');
					return (
						<div key={`badge-${1}`} className={classes}>
							<i className={FA(icon)}></i>
						</div>
					);
				}
			};

			EV.Trusts.Rating	= class Rating		extends Mix('Pure',  MX.Static) {
				constructor(props) {
					let len = {length:5}, inc = ((v,i)=>i+1);
					super(props); this.name = 'RATING';
					this.points = Array.from(len,inc).reverse();
					this.attrs  = [
						'data-rating-half',
						'data-rating',
						'data-strike'
					];
				}

				getCount(count) { 
					let cnt = count.toString(),
						len = cnt.length-1,
						zro = [cnt[0]].concat(Array.from({length:len},()=>0)),
						flr = parseInt(zro.join(''));
					return Math.floor(count/flr)*flr; 
				}
				getStrikes(strikes) { return Array.from({length:strikes||0},(v,i)=>(i+1)); }
				getRatings(rating,strikes) {
					let P = this.attrs; return v => {
						let rt = rating, ps = parseInt(Math.ceil(rt)), attr = {};
						if (ps==v) attr[P[Number(v==rt)]]='';
						if (strikes.has(v)) attr[P[2]]='';
						return (<label key={`star-${v}`} {...attr}></label>)
					}
				}

				render() {
					let props 	= this.props,
						points 	= this.points,
						rating 	= props.rating, 
						strikes = this.getStrikes(props.strikes), 
						count 	= this.getCount(props.count);
					return (
						<div className="spread">
							<label className="rating" data-cnt={count}>
								<div>{points.map(this.getRatings(rating,strikes))}</div>
							</label>
						</div>
					);
				}
			};

		// FOOT    /////////////////////////////////////////////////////////
			EV.Foot 			= class Foot		extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'FOOT';
				}

				render() {
					let props = this.props, crdts = props.credits,
						bgImg = { backgroundImage: `url('public/images/Logo.sm.white.png')` };
					return (
						<footer className="gridItemFooter">
							<section className="gridFooter noSelect gpu" style={bgImg}>
								{/* <!-- CONTACT --> */}
								<section id="contact" className="gridItemContact gridContact">
									<a href="about">About</a>
									<a href="help">Help</a>
									<a href="safety">Safety</a>
									<a href="privacy">Privacy</a>
									<a href="terms">Terms</a>
								</section>
								{/* <!-- CREDITS --> */}
								<section id="credits" className='gridItemCredits'>
									<p>
										<span id='copyright'>{new Date().getFullYear()}</span>
										<span id='company'>
											<a key='company' href={`http://${crdts.website}`}>
												{crdts.company}
											</a>
										</span>
									</p>
								</section>
							</section>
						</footer>
					);
				}
			};

		// THREADS /////////////////////////////////////////////////////////
			EV.Threads 			= class Threads		extends Mix('Pure',  MX.Static) {
				constructor(props) {
					super(props); this.name = 'THREADS';
				}

				render() {
					var props 	= this.props,
						chats	= props.chats.reverse(),
						optns 	= Imm.fromJS({opts:['lite','small']});
					return (
						<section className="noSelect gridItemChat gridThreads" id="footer">
							<div className="gridItemThreads" id="chatter">
								<Bubble {...optns.mergeDeep(Imm.fromJS({kind:'more',opts:['dark']})).toJS()} />
								{chats.map((b,i)=><Bubble key={`chat${i}`} style={{gridColumn:i+2}} 
													{...optns.mergeDeep(Imm.fromJS(b)).toJS()}/>)}
								<Bubble {...optns.mergeDeep(Imm.fromJS({kind: 'add',opts:['dark']})).toJS()} />
							</div>
						</section>
					);
				}
			};

		// EXPORTS /////////////////////////////////////////////////////////
			
			const { 
				Head, Search, Cover, Title, Plaque, 
				Content, Trusts, Foot, Threads 
			} = EV;

			COMPS.Elements.Evectr = EV;

};
