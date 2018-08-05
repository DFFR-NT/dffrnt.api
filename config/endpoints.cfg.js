
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

	module.exports = function () { // DO NOT CHANGE/REMOVE!!!
		
		const 	rgnme = /^[a-z]+(?:-[a-z]+)?(?: (?:[sj]r.|[0-9](?:st|nd|rd|th)))?$/i,
				rgcur = new RegExp(`^[^\\s\\d]{0,3}(\\d+(,\\d{2,3})*([.]\\d{2})?)$`),
				optns = {
							Sex: [
								{ value: 'M', label: 'Male'		},
								{ value: 'F', label: 'Female'	},
								{ value: 'I', label: 'Intersex'	},
							],
							Marital: [
								{ value: 'M', label: 'Married'		},
								{ value: 'R', label: 'Relationship'	},
								{ value: 'S', label: 'Single'		},
							],
							SvcType: [
								{ value: '01100', label: 'Accounting/Tax' 		},
								{ value: '01101', label: 'Artist' 				},
								{ value: '01102', label: 'Child Care' 			},
								{ value: '01103', label: 'Cleaner' 				},
								{ value: '01104', label: 'Cooking/Catering' 	},
								{ value: '01105', label: 'Designing' 			},
								{ value: '01106', label: 'DJ' 					},
								{ value: '01107', label: 'Entertainment' 		},
								{ value: '01108', label: 'Equipment Rental' 	},
								{ value: '01109', label: 'Fitness' 				},
								{ value: '01110', label: 'Installation' 		},
								{ value: '01111', label: 'Labour' 				},
								{ value: '01112', label: 'Massage/Chiropractic' },
								{ value: '01113', label: 'Mobile Services' 		},
								{ value: '01114', label: 'Moving/Delivery' 		},
								{ value: '01115', label: 'Pet Sitting' 			},
								{ value: '01116', label: 'Photography' 			},
								{ value: '01117', label: 'Teaching/Tutoring' 	},
								{ value: '01118', label: 'Tech Support' 		},
								{ value: '01119', label: 'Tour Guide' 			},
								{ value: '01120', label: 'Translation' 			},
								{ value: '01121', label: 'Web/Programming' 		},							
							],
							SvcRate: [
								{ value: 'Free',	label: 'Free'		},
								{ value: 'Flat',	label: 'Flat'		},
								{ value: 'Hourly',	label: 'Hourly'		},
								{ value: 'Daily',	label: 'Daily'		},
								{ value: 'Monthly',	label: 'Monthly'	},
								{ value: 'Quote',	label: 'Quote'		},
							],
							Context: [
								{ value: 'VT', label: 'Service Type' 		},
								{ value: 'VD', label: 'Service Description' },
								{ value: 'VC', label: 'Service Charge' 		},
								{ value: 'VR', label: 'Service Rate' 		},
								{ value: 'LC', label: 'Locale' 				},
								{ value: 'HB', label: 'Hobby' 				},
								{ value: 'LG', label: 'Language' 			},
								{ value: 'NL', label: 'Nationality' 		},
								{ value: 'RL', label: 'Religion' 			},
								{ value: 'SX', label: 'Sex' 				},
								{ value: 'MS', label: 'Marital Status' 		},
								{ value: 'OR', label: 'Orientation' 		},
								{ value: 'GD', label: 'Gender' 				},
							],
							RUnits:  [
								{ value: 'K', label: 'Kilometers' 	},
								{ value: 'M', label: 'Miles' 		}
							]
						},
				cntxt = optns.Context.map(v=>v.value).join(PIP),
				cntxr = /\b([A-Z]{2})@((?:[^@;]|\\[;@])+)(?=;|$)/g,
				cntxp = {	LC: 'lid',
							VT: 'svctype',   VD: 'svcdescr',
							VC: 'svccharge', VR: 'svcrate',
							HB: 'hids',      LG: 'lgids',
							NL: 'nids',      RL: 'Rids',
							GD: 'gids',      SX: 'sex',
							MS: 'marital',   OR: 'oids',
							AG: 'age' },
				cntxb = function cntxb(vals, next, join = ORS) {
							return 	vals.split(',').concat([next])
										.filter(v=>!!v).join(join);
						}
				ftxts = function ftxts(term) {
							let x =[/\w+/g, /("(?:\\"|[^"])+")/g],
								a = term.match(x[1])||[],
								r =[term.replace(x[1],'')
										.split(/[,\s]+/)
										.filter((v,i)=>!!v&&!a.has(v))
										.join(', ')
										.replace(/(\b\S+?\b)(?!,)/g, '+(<$1* >"$1")')
										.replace(/(\b\S+?\b),/g, '+"$1"'),
									(!!a.length?a.join(' +'):'')
										.replace(/(^.+$)/,'+$1')];
							return r.filter(v=>!!v).join(' ');
						}
				merge = function merge(main, ...others) {
							let oth = others.map(v=>Imm.fromJS(v));
							return Imm.fromJS(main).mergeDeep(...oth).toJS();
						},
				hdden = function name(param) {
							let hid = Imm.fromJS({ Desc:{hidden:true}});
							return Imm.fromJS(param).mergeDeep(hid).toJS();
						},
				uname = function uname(param) { 
							return function Format(cls) { 
								return ((cls[param]||'').match(/^[\w_.-]+$/)||[''])[0]; 
							};	
						},
				email = function email(param) { 
							return function Format(cls) { 
								return ((cls[param]||'').match(/^[\w_.-]+@[\w_.-]+\.[A-z]+$/)||[''])[0]; 
							};	
						},
				pword = function pword(required, param) { return {
							Default: '',
							Format(cls) { return (cls[param]||''); },
							Desc: 	{
								type: "Password", to: 'query', required: required,
								description: "A valid {{Password}}", matches: {
									"Password": 'Inserts/Updates a {{Password}} ((\\S+))'
								},
							}
						};	},
				image = function image(param, name) { return {
							Default: 'NULL',
							Format(cls) { 
								return ((cls[param]||'').match(/^\d+$/)||[''])[0]; 
							},
							Desc: 	{
								type: "Number", to: 'query', required: true,
								description: "A valid {{Image ID}}", matches: {
									[`${name} Image`]: `Updates the {{${name} Image}} of the {{User}} (([0-9]+))`
								},
							}
						};	},
				lcale = function lcale() {
							return function Parse(res) {
								var RQ = this.RQ, QY = this.QY;
								return 	Imm.Map(JSN.Objectify(
											res, RQ.Key, RQ.Columns, QY
										)).map(v=>v.user).toJS();
							};
						},
				loctn = function loctn(kind = 'param') {
							return {
								Default: '',
								Format 	(cls) { return cls.lid||'o.location'; },
								Desc: 	{
									description: 'A valid {{Locale ID}}',
									type: "Number", to: kind, required: false, 
									matches: { 'Locale ID': 'Matches a valid {{LID}} (([0-9]+))' },
								}
							};
						},
				multi = function multi(param, name, edit, column, required = false, dflt = '', kind = 'param') { 
							return (!!edit ?
								function Format(cls) {
									let regx = [/^\d+@\d+$/,/^\d+$/], 
										json = `d.profile_${name}`,
										rslt = '', k = "'$.", d = `\n${'    '.dup(6)}`,
										edts = SQL.BRKT(SQL.LIST([cls[param]],
												[{ split: ORS, equals:  true, join: `,${k}`,  match: regx[0] }],
												[],[(m=>(s=m.split('@'),`${s[1]}',${s[0]}`))]
											),[`${k}`,""], ","), 
										rems = SQL.BRKT(SQL.LIST([cls[param]],
												[{ split: ORS, equals:  true, join: `',${k}`, match: regx[1] }],
												[],[]),[`${k}`,"'"], ",");
									rslt = (!!edts ? `JSON_SET(${d}\t${json},${d}    ${edts}${d})`: json);
									if (!!rems) rslt = `JSON_REMOVE(${rslt},${rems})`;				
									return rslt;
								} : {
									Default: '',
									Format   (cls) {
										return SQL.CLAUSE(column,'IN',SQL.BRKT(
											SQL.LIST(cls[param],[{ 
												split:   ORS, match: /^\d+$/, 
												equals: true, join:  ',' 
											}], null), ["(",")"], PIP),
										'AND')||dflt;
									},
									Desc: 	 {
										description: `A semi-colon-separated list of {{${name} IDs}}`,
										type: { List: "Number", Separator: ORS }, 
										to: kind, required: required, matches: { 
											[`${name} ID`]: `Matches ANY of the {{${name} ID}} Items (([0-9]+))` 
										},
									}
								}
							);
						},
				slval = function slval(select, value) {
							return (select.Desc.type.Select
										 .filter(v=>value==v.value)
										 .length > 0 ? value : '');
						},
				slect = function slect(param, clause, quotes = true) {
							return function Format(cls) { 
								let val = slval(this,cls[param]||''), quo = (!!quotes?"'":""); 
								return (!!val ? `+ (${clause} ${quo}${val}${quo})` : '');	
							};
						},
				scuid = function scuid(hidden = false, required = false) {
							return merge(dflts.UID, { Desc: { 
									required: required,
									hidden:   hidden,
									to:       'query'
							}	}	);
						},
				sterm = function sterm(name, to = 'param', required = false, matches = {}, param = 'term') {
							return {
								Default: '',
								Format 	(cls) {
									let term = (cls[param]||this.Default),
										mtch = term.match(rgcur), res;
									res = (!!mtch ? mtch[0] : ftxts(term));	
									cls.rawterm = term; return res;
								},
								Desc: 	{
									description: `A {{Search Term}} for the {{${name}}}`,
									type: "Text", to: to, required: required, matches: matches
								}
							}
						},
				scqry = function scqry(TAG, QRY, VERB) {
							let CNT, CQY, BEG, END, TG = 'S.tag', 
								TB = `\n${' '.dup(17)}`, SP = ' '.dup(13),
								TYP = TYPE(TAG, Array); 
							// Build Counters ---------------------------------------------- //
								if (TYP) { // Multi  Counters
									let CSE = TAG.map(v=>{ let C = `@CNT_${v}`;
											return `${TG} = '${v}' THEN ${C}:=${C}+1`;
										});
									CNT = `(CASE${TB}WHEN ${CSE.join(`${TB}WHEN `)}\n${SP}END)`; 
									CQY = `${TAG.map(v=>`@CNT_${v}:=0`).join(',')}`;
								} else {   // Single Counters
									CNT =  `@CNT_${TAG}`; CQY = `${CNT}:=0`; 
									CNT += `:=${CNT}+1`; TG  = `'${TAG}' AS tag`;
								}
							// Build Verbage ----------------------------------------------- //
								VERB = ( !TYP ? `'${VERB}' AS verb` : `S.verb` );
							// Build Wrapper Statemnets ------------------------------------ //
								BEG = 	`SELECT  S.score, ${CNT} AS idx, S.verb,`
										.split('\n').concat([
										`        S.value, S.tag, S.label, S.description`,
										"FROM    (",
										"    SELECT Q.* FROM (",
										`         SELECT  (S.score+(S.score/S.len)) AS score, ${VERB}, S.value,`,
										`                 ${TG}, S.label, S.description`,
										"         FROM    ("
										]);
								END = [ `         ) AS S, (SELECT ${CQY}) C`,
									  	"    ) AS Q ORDER BY Q.score DESC",
									  	`) AS S`,
									  	":LIMIT: :PAGE:"];
							// Build & Return Query ---------------------------------------- //
								return BEG.concat(QRY.map(v=>`${SP}${v}`),END);
						};

		const 	dflts = {
					// BASICS ===================================================================
						UID: 		{
							Default: '',
							Format 	(cls) { return cls.uid||'0'; },
							Desc: 	{
								description: 'A valid {{User ID}}', type: "Number", to: 'param',
								required: true, matches: { 'User ID': 'Matches the {{User ID}} (([0-9]+))' },
							}
						},
						UIDs: 		{
							Default: '',
							Format 	(cls) { return (cls.uids||'0').toString().split(';').join(','); },
							Desc: 	{
								type: { List: "Number", Separator: ORS }, to: 'param',
								description: 'A semi-colon-separated list of valid {{User IDs}}',
								required: null, matches: { 'User ID': 'Matches ANY of the {{UID}} Items (([0-9]+))' },
							}
						},
						MD5: 		{
							Default: '',
							Format 	(cls) { return ((cls.md5||'').match(/^[A-Fa-f0-9]+$/)||[''])[0]; },
							Desc: 	{
								description: "An {{MD5 Checksum}} Record", 
								type: "Text", to: 'param', required: true, matches: {
									'MD5 Checksum': 'The {{MD5 Checksum}} of the {{User}} (([\\w@_.-]+))'
								},
							}
						},
						Email: 		{
							Default: '',
							Format:  email('email'),
							Desc: 	 {
								description: "The user's {{Email Address}}", 
								type: "Email", to: 'param', required: null, matches: {
									'Email Address': 'The {{Email Address}} to check (([\\w@_.-]+))'
								},
							}
						},
						Username: 	{
							Default: '',
							Format:  uname('username'),
							Desc: 	 {
								description: "The user's {{Display Name}}", 
								type: "Text", to: 'param', required: null, matches: {
									'Display Name': 'The {{Display Name}} to check (([\\w_.-]+))'
								},
							}
						},
						Age: 		{
							Default: '',
							Format 	(cls) { 
								let rgx = /^1[3-9]|[2-9][0-9]+$/, age = (cls.age||'').match(rgx);
								return (!!age?`AND getAgeFromStr(u.birth_date)  >=  ${age[0]}`:'AND true');
							},
							Desc: 	{
								description: "The user's {{Age}}", 
								type: { Number: { min: 13, max: 99 } }, 
								style: 'half', to: 'query', required: false, matches: {
									'Age': 'Matches the {{Age}} of the {{User}} (([0-9]+))'
								},
							}
						},
						LID:		loctn(),
						LIDs: 		multi( 'lids',      'Locale', false,              's.id', false),
						HIDs: 		multi( 'hids',       'Hobby', false,        'h.hobby_id', false),
						LGIDs: 		multi('lgids',    'Language', false,     'l.language_id', false),
						NIDs: 		multi( 'nids', 'Nationality', false,  'n.nationality_id', false),
						RIDs: 		multi( 'rids',    'Religion', false,     'r.religion_id', false),
						GIDs: 		multi( 'gids',      'Gender', false,       'g.gender_id', false),
						OIDs: 		multi( 'oids', 'Orientation', false,       'o.orient_id', false),
						Sex: 		{
							Default: '',
							Format 	(cls) { return (cls.sex||'').match(/^(?:M|F|I|)$/)[0]; },
							Desc: 	{
								description: "The user's {{Sex}}", type: { Select: optns.Sex }, 
								style: 'half', to: 'query', required: false, matches: {
									'Sex': 'Matches the {{Sex}} of the {{User}} ((M|F|I))'
								},
							}
						},
						Marital: 	{
							Default: '',
							Format 	(cls) { return (cls.marital||'').match(/^(?:M|R|S|)$/)[0]; },
							Desc: 	{
								description: "The user's {{Marital Status}}", type: { Select: optns.Marital }, 
								style: 'half', to: 'query', required: false, matches: {
									'Marital Status': 'Matches the {{Marital Status}} of the {{User}} ((M|R|S))'
								},
							}
						},
					// EDITORS ==================================================================
						eEmail: 	{
							Default: '',
							Format 	(cls) { return ((cls.eemail||'').match(/^[\w_.-]+@[\w_.-]+\.[A-z]+$/)||[''])[0]; },
							Desc: 	{
								description: "The user's {{Email Address}}", 
								type: "Text", to: 'query', required: false, matches: {
									'Email Address': 'The {{Email Address}} of the {{User}} (([\\w@_.-]+))'
								},
							}
						},
						ePicture: 	image('epicture','Picture'),
						eCover: 	image('ecover',  'Cover'),
						eHIDs: 		{
							Default: '',
							Format:  multi('ehids','hobbies', true),
							Desc: 	 {
								type: { List: "Number", Separator: ORS }, 
								description: "The user's {{Hobby Edits}}",
								style: 'full', to: 'query', required: false, matches: {
									'Hobby Edits': 'Matches the {{Hobby Edits}} for the {{User}} (([0-9]+(?:@[0-9]+)?))'
								},
							}
						},
						eLGIDs: 	{
							Default: '',
							Format:  multi('elgids','languages', true),
							Desc: 	 {
								type: { List: "Number", Separator: ORS }, 
								description: "The user's {{Languages Edits}}", 
								style: 'full', to: 'query', required: false, matches: {
									'Languages Edits': 'Updates the {{Languages Edits}} for the {{User}} (([0-9]+(?:@[0-9]+)?))'
								},
							}
						},
						eNIDs: 		{
							Default: '',
							Format(cls) {
								var regx = [/^\d+@[0-1]$/,/^\d+$/,/('\$\[[0-1]\]'(?:,\d+|(?=,|$)))/g], 
									prms = (cls.enids||'').match(/^((?:[\d@]+(?:;|$)){0,2})/)[1],
									json = `d.profile_nationalities`, k = "'$[", 
									rslt = '', d = `\n${'    '.dup(6)}`, t = ' '.dup(8), e = ' '.dup(4)
									edts = (SQL.BRKT(SQL.LIST([prms],
											[{ split: ORS, equals: true, join: `,${k}`,  match: regx[0] }],
											[],[(m=>(s=m.split('@'),`${s[1]}]',${s[0]}`))]
											),[`${k}`,""], ",").match(regx[2])||[]).join(','),
									rems = (SQL.BRKT(SQL.LIST([prms],
											[{ split: ORS, equals: true, join: `',${k}`, match: regx[1] }],
											[],[]),[`${k}`,"]'"], ",").match(regx[2])||[]).join(',');
								rslt = (!!edts ? `JSON_SET(${d}${t}${json},${d}${e.dup(3)} ${edts}${d}${e})`: json);
								if (!!rems) rslt = `JSON_REMOVE(${rslt},  ${rems})`;				
								return rslt;
							},
							Desc: 	{
								type: { List: "Number", Separator: ORS }, 
								description: "Up to 2 {{Nationalities Edits}}", 
								style: 'half', to: 'query', required: false, matches: {
									'Nationalities Edits': 'Updates the {{Nationalities Edits}} for the {{User}} (([0-9]+(?:@[0-9]+)?))'
								},
							}
						},
						eRID: 		{
							Default: 'NULL',
							Format 	(cls) { return cls.erid||this.Default; },
							Desc: 	{
								description: "The user's {{Religion ID}}", style: 'half', 
								type: "Number", to: 'query', required: false, matches: {
									'Religion ID': 'Matches the {{Religion ID}} of the {{User}} (([0-9]+))'
								},
							}
						},
						eOID: 		{
							Default: 'NULL',
							Format 	(cls) { return cls.eoid||this.Default; },
							Desc: 	{
								description: "The user's {{Orientation ID}}", style: 'half', 
								type: "Number", to: 'query', required: false, matches: {
									'Orientation ID': 'Matches the {{Orientation ID}} of the {{User}} (([0-9]+))'
								},
							}
						},
						eGID: 		{
							Default: 'NULL',
							Format 	(cls) { return cls.egid||this.Default; },
							Desc: 	{
								description: "The user's {{Gender ID}}", style: 'half', 
								type: "Number", to: 'query', required: false, matches: {
									'Gender ID': 'Matches the {{Gender ID}} of the {{User}} (([0-9]+))'
								},
							}
						},
						eDescr: 	{
							Default: '',
							Format 	(cls) { return cls.edescr; },
							Desc: 	{
								type: "TextArea", to: 'query', style: 'full', required: false,
								description: "The user's {{Description}}", matches: {
									'Description': 'Updates the {{Description}} of the {{User}} (([\S\s]+))'
								},
							}
						},
						eEdu: 		{
							Default: '',
							Format 	(cls) { return cls.eedu; },
							Desc: 	{
								type: "TextArea", to: 'query', style: 'full', required: false,
								description: "The user's {{Education}}", matches: {
									'Education': 'Updates the {{Education}} of the {{User}} (([\S\s]+))'
								},
							}
						},
						eEduDescr: 	{
							Default: '',
							Format 	(cls) { return cls.eedudescr; },
							Desc: 	{
								type: "TextArea", to: 'query', style: 'full', required: false,
								description: "The user's {{Education Description}}", matches: {
									'Education Description': 'Updates the {{Education Description}} of the {{User}} (([\S\s]+))'
								},
							}
						},
					// SEARCH ===================================================================
						sLID: 		loctn('query'),					
						sHIDs: 		multi( 'hids',       'Hobby', false,       'h.hobby_id', false, 'AND NULL', 'query'),
						sLGIDs: 	multi('lgids',    'Language', false,    'l.language_id', false, 'AND NULL', 'query'),
						sNIDs: 		multi( 'nids', 'Nationality', false, 'n.nationality_id', false, 'AND NULL', 'query'),
						sRIDs: 		multi( 'rids',    'Religion', false,    'r.religion_id', false, 'AND NULL', 'query'),
						sGIDs: 		multi( 'gids',      'Gender', false,      'g.gender_id', false, 'AND NULL', 'query'), 
						sOIDs: 		multi( 'oids','Orientations', false,      'o.orient_id', false, 'AND NULL', 'query'), 
						Radius: 	{
							Default: 25,
							Format 	(cls) { return cls.radius||this.Default; },
							Desc: 	{
								type: { Number: { min: 25, max: 500, step: 25 } }, 
								description: "The {{Radius}} for the {{Locale}}", 
								to: 'query', required: false, matches: {
									'Radius': 	'Specifies the {{Radius}}, unless omitted (([1-5]?[0-9]{1,3}|6[0-3][0-7][0-1]))',
								},
							}
						},
						Units: 		{
							Default: 'K',
							Format 	(cls) { 
								let units = slval(this,(cls.units||this.Default)), rdius = (cls.radius||25);
								cls.radius = (units=='K' ? rdius : rdius*1.60934); return '';
							},
							Desc: 	{
								type: { Select: optns.RUnits }, 
								description: "The {{Units}} for the {{Locale Radius}}", 
								to: 'query', required: false, matches: {
									'Unit': 'Either {{Kilometers}} or {{Miles}}, unless omitted ((K|M))',
								},
							}
						},
					// SERVICES =================================================================
						SIDs: merge(multi( 'sids','Service Type', false,'s.service_cpc_code', false),{
										description: "The Provider's {{Service Type}}", 
										type: { Select: optns.SvcType }, 
										style: 'half', to: 'query', required: false, matches: {
											'Service Type Code': 'Matches a valid {{Service Type Code}} ((0[0-9]{4}))'
										},
									}),
						CIDs: 		multi( 'cids',    'Currency', false,     'c.currency_id', false),
						SvcDescr: 	{
							Default: '',
							Format 	(cls) { 
								let val = (cls.svcdescr ? ftxts(cls.svcdescr) : '');
								return (!!val ? `+ (MATCH(s.provider_svc_name,s.provider_svc_descr) AGAINST ('${val}' IN BOOLEAN MODE))` : '');
							},
							Desc: 	{
								type: "Text", to: 'query', style: 'full', required: false,
								description: "A Service {{Description}}", matches: {
									'Service Description': 'Matches the contents in a Service\'s {{Service Description}} (([^\\n]+))'
								},
							}
						},
						SvcType: 	{
							Default: 	'',
							Format:		slect('svctype','s.provider_svc_type      ='),
							Desc: 		{
								description: "The Provider's {{Service Type}}", type: { Select: optns.SvcType }, 
								style: 'half', to: 'query', required: false, matches: {
									'Service Type Code': 'Matches a valid {{Service Type Code}} (([0-9]+))'
								},
							}
						},
						SvcCharge: 	{
							Default: 	'',
							Format 		(cls) { 
								let val = ((cls.rate||'').match(/^\d+(?:[.]\d{1,2})$/)||[''])[0];
								return (!!val ? `+ (s.provider_svc_charge   <= ${val})` : '');
							},
							Desc: 		{
								description: "The provider's {{Rate}}", 
								type: { Number: { min: 0.00, step: 0.10 } }, 
								style: 'half', to: 'query', required: false, matches: {
									'Rate': 'Matches the {{Charge}} of the {{Service}} (([0-9](?:[.][0-9]{1,2})))'
								},
							}
						},
						SvcRate: 	{
							Default: 	'',
							Format:		slect('svcrate','s.provider_svc_rate      ='),
							Desc: 		{
								description: "The provider's {{Rate}}", type: { Select: optns.SvcRate }, 
								style: 'half', to: 'query', required: false, matches: {
									'Rate': 'Matches the {{Rate}} of the {{Service}} (([\\w/ ]+))'
								},
							}
						},
				}

		// console.log(
			// scqry('MS', [
				// "SELECT   m.misc_value       AS value,",
				// "         m.misc_tag         AS tag,",
				// "         m.misc_label       AS label,",
				// "         m.misc_description AS description,",
				// "         m.misc_verb        AS verb,",
				// "         MATCH(m.misc_label) AGAINST",
				// "         (':TERM:' IN BOOLEAN MODE) AS score,",
				// "         m.len",
				// "FROM     misc m",
				// "WHERE    LENGTH(':TERM:') > 4",
				// "AND      MATCH(m.misc_label) AGAINST",
				// "         (':TERM:' IN BOOLEAN MODE)",
				// "LIMIT    10",
			// ], 'Is')
		// )
		
		/////////////////////////////////////////////////////////////////////////////////////
		return { 
			// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
			__DEFAULTS: 	dflts,
			// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
			Search: 		{
				Actions: 	{
					// ======================================================================
					Suggest: {
						Scheme: `/(:term([^\\n\\t]+)|:context((?:(?:${cntxt})@([^@;]|\\[;@])+(;|$))+)/:term([^\\n\\t]+))/`,
						Limits: ["Constant/Second"],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:term:calg": [
									"Suggests any  {{Service Type}}, {{Locale}}, {{Hobby}}, {{Language}}, {{Nationality}},",
									"{{Religion}}, {{Orientation}}, {{Gender}} that match the {{Serach Term}}, 'calg*'."
								].join(' '),
								"/:context:LG@124;HB@32;LG@142;VT@01120;SX@F/:term:New York": [
									"Suggests {{Search Terms}} matching, 'New York', omitting any",
									"that match the previously selected {{Search Terms}}",
									"within the {{Search Context}}",
								].join(', '),
							},
						},
						Query:	[
							"SELECT  R.score, R.verb,",
							"        CONCAT(R.tag,'@',R.value) AS value,",
							"        R.label, R.description",
							"FROM    (SELECT @OTRM:=':RAWTERM:', @TLEN:=LENGTH(':RAWTERM:')) AS OT, (",
							"    SELECT V.* FROM (",
							"        SELECT 100 AS score, 1 AS idx, 'Service Matches' AS verb, ",
							"        @OTRM AS value, 'VD' AS tag, @OTRM AS label, '' AS description",
							"    ) V",
							"    UNION",
							"    SELECT A.* FROM (",
							"        :/Services/Search:",
							"        UNION",
							"        :/Locale/Search:",
							"        UNION",
							"        :/Hobbies/Search:",
							"        UNION",
							"        :/Languages/Search:",
							"        UNION",
							"        :/Nationalities/Search:",
							"        UNION",
							"        :/Religions/Search:",
							"        UNION",
							"        :/Orientations/Search:",
							"        UNION",
							"        :/Genders/Search:",
							"        UNION",
							"        :/Misc/Search:",
							"    ) A WHERE @TLEN >= 3",
							"    UNION",
							"    :/Services/Charge:",
							")   R :CONTEXT:",
							"ORDER BY R.idx, R.score DESC",
							"LIMIT 10",
						],
						Params: { 
							Context: {
								Default: '',
								Format	 (cls) { 
									if (!!cls.context) {
										let cntx = cls.context, res;
										res = cntx.replace(cntxr,(M,K,V)=>{
											return `'${K}@${V.split(/,\b/).join(`','${K}@`)}'`;
										}).split(/;(?=')/).join(','); 
										return `\nWHERE   CONCAT(R.tag,'@',R.value) NOT IN (${res})`;
									} else {
										return this.Default;
									}
								},
								Desc: 	{
									description: 'The {{Context}} of the previous {{Search Terms}}',
									type: { List: 'Text' }, // type: { Select: optns.Context }, 
									to: 'param', required: false, matches: {
										'VT': 'Matches the {{Context}} of a {{Service Type}} ((VT))',
										'VD': 'Matches the {{Context}} of a {{Service Description}} ((VD))',
										'VC': 'Matches the {{Context}} of a {{Service Charge}} ((VC))',
										'VR': 'Matches the {{Context}} of a {{Service Rate}} ((VR))',
										'LC': 'Matches the {{Context}} of a {{Locale}} ((LC))',
										'HB': 'Matches the {{Context}} of a {{Hobby}} ((HB))',
										'LG': 'Matches the {{Context}} of a {{Language}} ((LG))',
										'NL': 'Matches the {{Context}} of a {{Nationality}} ((NL))',
										'RL': 'Matches the {{Context}} of a {{Religion}} ((RL))',
										'SX': 'Matches the {{Context}} of a {{Sex}} ((SX))',
										'MS': 'Matches the {{Context}} of a {{Marital Status}} ((MS))',
										'OR': 'Matches the {{Context}} of a {{Orientation}} ((OR))',
										'GD': 'Matches the {{Context}} of a {{Gender}} ((GD))',
									}
								}
							},
							Term:  sterm('Search', 'param', true, {
								'Service Type': 		'Matches the {{Service Type}} (([A-z0-9,/.-]+))',
								'Service Charge': 		'Matches the {{Service Charge}} ((\\w?\\d+(\\.\\d{2})?\\w?))',
								'Service Rate': 		'Matches the {{Service Rate}} (([A-z0-9,/.-]+))',
								'Locale': 				'Matches the {{Locale}} (([A-z0-9,/.-]+))',
								'Hobby': 				'Matches the {{Hobby}} (([A-z0-9,/.-]+))',
								'Language': 			'Matches the {{Language}} (([A-z0-9,/.-]+))',
								'Nationality': 			'Matches the {{Nationality}} (([A-z0-9,/.-]+))',
								'Religion': 			'Matches the {{Religion}} (([A-z0-9,/.-]+))',
								'Sex': 					'Matches the {{Sex}} (([A-z0-9,/.-]+))',
								'Marital Status': 		'Matches the {{Marital Status}} (([A-z0-9,/.-]+))',
								'Orientation': 			'Matches the {{Orientation}} (([A-z0-9,/.-]+))',
								'Gender': 				'Matches the {{Gender}} (([A-z0-9,/.-]+))',
							}), 
							RawTerm: {
								Default: '',
								Format	 (cls) { return cls.rawterm; },
								Desc: 	{
									description: 'The {{raw}} {{Search Terms}}', type: 'Text', 
									to: 'query', hidden: true, required: false, matches: {}
								}
							},
							ID: true
						}
					},
					// ======================================================================
					Advanced: {
						Scheme: '/',
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"?=14&lid=2717431&svctype=01120": [
									'Executes a {{Search}} for  the {{User}} at {{User ID}}: {{14}}, located in',
									'New York ({{LID}}: {{2717431}}) who provides a Translation {{Service}}.'
								].join(' ')
							},
						},
						Query: [
							"SELECT     S.*",
							"FROM       (",
							"    SELECT     u.user_id, (",
							"                   COUNT(DISTINCT s.provider_svc_id)*10 +",
							"                   COUNT(DISTINCT h.hobby_id) +",
							"                   COUNT(DISTINCT l.language_id) +",
							"                   COUNT(DISTINCT n.nationality_id) +",
							"                   !ISNULL(r.religion_id) +",
							"                   !ISNULL(g.gender_id) +",
							"                   !ISNULL(o.orient_id)",
							"               ) AS score,",
							`               ${SQL.SOCKET({link:'/user/:uids:%s', columns:['u.user_id']})} AS user`,
							"    FROM      (SELECT * FROM users WHERE user_id = :UID:) AS x",
							"    INNER JOIN user_profile_details   d  ON x.user_id                = d.user_fk",
							"    INNER JOIN users               AS u  ON x.user_id               <> u.user_id",
							"                                        AND chkRadDist(u.location,x.user_id,:LID:,:RADIUS:)",
							"                                        :AGE:",
							"    INNER JOIN user_profile_details   p  ON u.user_id                = p.user_fk",
							"                                        AND chkREGEXP('(M|F|I)',':SEX:',p.profile_sex)",
							"                                        AND chkREGEXP('(M|R|S)',':MARITAL:',p.profile_marital_status)",
							"    INNER JOIN user_settings          t  ON u.user_id                = t.user_fk",
							"    LEFT  JOIN user_visibility_objs   v  ON u.user_id                = v.user_fk AND true",
							"    LEFT  JOIN user_provider_details  i  ON u.user_id                = i.user_fk",
							"    LEFT  JOIN user_provider_services s  ON t.is_provider            = 1",
							"                                        AND i.provider_detail_id     = s.user_provider_fk",
							"                                        AND (0",
							"                                            :SVCTYPE:",
							"                                            :SVCCHARGE:",
							"                                            :SVCRATE:",
							"                                            :SVCDESCR:",
							"                                            ) > 0",
							"    LEFT  JOIN hobbies                h  ON chkJSVIS(v.obj,'user_hobbies')",
							"                                        :HIDS:",
							"                                        AND chkJSOBJ(p.profile_hobbies,h.hobby_id)",
							"    LEFT  JOIN languages              l  ON chkJSVIS(v.obj,'user_languages')",
							"                                        :LGIDS:",
							"                                        AND chkJSOBJ(p.profile_languages,l.language_id)",
							"    LEFT  JOIN nationalities          n  ON chkJSVIS(v.obj,'user_nationalities')",
							"                                        :NIDS:",
							"                                        AND chkJSARR(p.profile_nationalities,n.nationality_id)",
							"    LEFT  JOIN religions              r  ON chkJSVIS(v.obj,'user_religion')",
							"                                        :RIDS:",
							"                                        AND r.religion_id = p.profile_religion",
							"    LEFT  JOIN genders                g  ON chkJSVIS(v.obj,'user_gender')",
							"                                        :GIDS:",
							"                                        AND g.gender_id = p.profile_orient",
							"    LEFT  JOIN orients                o  ON chkJSVIS(v.obj,'user_orient')",
							"                                        :OIDS:",
							"                                        AND o.orient_id = p.profile_orient",
							"    GROUP BY   u.user_id",
							")   S",
							"ORDER BY   S.score DESC",
							":LIMIT: :PAGE:"
						],
						Params: {
							LID: 		dflts.sLID,
							SvcType:	dflts.SvcType,
							SvcDescr:	dflts.SvcDescr,
							SvcCharge:	dflts.SvcCharge,
							SvcRate:	dflts.SvcRate,
							HIDs: 		dflts.sHIDs,
							LGIDs: 		dflts.sLGIDs,
							NIDs: 		dflts.sNIDs,
							Marital: 	dflts.Marital,
							Sex: 		dflts.Sex,
							RIDs: 		dflts.sRIDs,
							GIDs: 		dflts.sGIDs,
							Age: 		dflts.Age,
							OIDs: 		dflts.sOIDs,
							UID: 		scuid(), 
							Units: 		true, 
							Radius: 	true, 
							Page:		true,
							Limit: 		true,
							ID: 		true,
						},
						Parse   (res) {
							var RQ = this.RQ, QY = this.QY, ret, avg, MAP, C;
							ret = JSN.Objectify(res, RQ.Key, RQ.Columns, QY);
							MAP = Imm.Map(ret); C = MAP.size;
							avg = (MAP.reduce((s,v)=>s+v.score,0)/C);
							return 	MAP	.filter(v=>(v.score>=avg))
										.map(v=>v.user)
										.toJS();
						},
						Key: 	'user_id'
					},
					// ======================================================================
					"/": {
						Scheme: '/:terms(([A-Z]{2}@([^@;]|\\[;@])+(;|$))+)/',
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:terms:LG@124;HB@32;LG@142;LC@2717431;VT@01120;SX@F?uid=14": [
									"Finds New York City ({{LC@2717431}}) Females ({{SX@F}})",
									"who provide Translation ({{VT@01120}}) service",
									"speaks French ({{LG@142}}) & English ({{LG@124}})",
									"and enjoy Reading ({{HB@32}})",
								].join(', '),
								"/:terms:LG@83?uid=14&page=3&limit=10": [
									"Displays the 3rd {{Page}} ––",
									"at a {{Limit}} of 'ten' {{Users}} results per {{Page}} ––",
									"who speak Chinese ({{LG@83}}) in the {{User's}} own {{Location}}",
								].join(' '),
							},
						},
						Query:  [":/Search/Advanced:"],
						Params: {
							Terms: 		{
								Default: '',
								Format 	(cls) {
									let trms = (cls.terms||this.Default);
									trms.replace(cntxr,(M,K,V)=>{
										let P = cntxp[K], cur = (cls[P]||'');
										cls[P] = cntxb(cur, V);
									}); return null;
								},
								Desc: 	{
									description: '{{Search Terms}} for the {{Query}}',
									type: { List: "Text" }, to: 'param', required: true, matches: {
										'Locale': 				'Matches the {{Locale}}, unless omitted (([A-z0-9,/.-]+))',
										'Service Type': 		'Matches the {{Service Type}}, unless omitted (([A-z0-9,/.-]+))',
										'Service Description': 	'Matches the {{Service Description}}, unless omitted (([A-z0-9,/.-]+))',
										'Service Charge': 		'Matches the {{Service Charge}}, unless omitted ((\\w?\\d+(\\.\\d{2})?\\w?))',
										'Service Rate': 		'Matches the {{Service Rate}}, unless omitted (([A-z0-9,/.-]+))',
										'Hobby': 				'Matches the {{Hobby}}, unless omitted (([A-z0-9,/.-]+))',
										'Language': 			'Matches the {{Language}}, unless omitted (([A-z0-9,/.-]+))',
										'Nationality': 			'Matches the {{Nationality}}, unless omitted (([A-z0-9,/.-]+))',
										'Religion': 			'Matches the {{Religion}}, unless omitted (([A-z0-9,/.-]+))',
										'Sex': 					'Matches the {{Sex}}, unless omitted (([A-z0-9,/.-]+))',
										'Marital Status': 		'Matches the {{Marital Status}}, unless omitted (([A-z0-9,/.-]+))',
										'Orientation': 			'Matches the {{Orientation}}, unless omitted (([A-z0-9,/.-]+))',
										'Gender': 				'Matches the {{Gender}}, unless omitted (([A-z0-9,/.-]+))',
									}
								}
							},
							LID: 		hdden(dflts.sLID),
							Units: 		hdden(dflts.Units), 
							Radius: 	hdden(dflts.Radius),
							SvcType:	hdden(dflts.SvcType),
							SvcDescr:	hdden(dflts.SvcDescr),
							SvcCharge:	hdden(dflts.SvcCharge),
							SvcRate:	hdden(dflts.SvcRate),
							HIDs: 		hdden(dflts.sHIDs),
							LGIDs: 		hdden(dflts.sLGIDs),
							NIDs: 		hdden(dflts.sNIDs),
							RIDs: 		hdden(dflts.sRIDs),
							GIDs: 		hdden(dflts.sGIDs),
							Sex: 		hdden(dflts.Sex),
							Marital: 	hdden(dflts.Marital),
							OIDs: 		hdden(dflts.sOIDs),
							Age: 		hdden(dflts.Age),
							UID: 		hdden(scuid()),  
							Page:		true,
							Limit: 		true,
							ID: 		true,
						},
						Parse   (res) {
							// var RQ = this.RQ, QY = this.QY, ret, avg, MAP, C;
							// ret = JSN.Objectify(res, RQ.Key, RQ.Columns, QY);
							// MAP = Imm.Map(ret); C = MAP.size;
							// avg = (MAP.reduce((s,v)=>s+v.score,0)/C);
							// return 	MAP	.filter(v=>(v.score>=avg))
							// 			.map(v=>v.user)
							// 			.toJS();
							var RQ = this.RQ, QY = this.QY, ret;
							ret = JSN.Objectify(res, RQ.Key, RQ.Columns, QY);
							return Imm.Map(ret).map(v=>v.user).toJS();
						},
						Key: 	'user_id'
					}
				},
				Errors: 	{ BAD_REQ: ['/'] }
			},
			User: 			{
				Actions: 	{
					// ======================================================================
					Visibility: {
						Scheme: '/:uids(\\d(?:[\\d;]*\\d)?)/',
						Sub: 	['settings'],
						Routes: ['settings'],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Visibility}} of the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{User}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT    v.user_fk as user_id, JSON_OBJECT(",
							"              'visibility', JSON_COMPACT(CONCAT('[',",
							"                  GROUP_CONCAT(JSON_COMPACT(JSON_OBJECT(",
							"                      'id',      f.id,    'kind',  f.type,",
							"                      'field',   f.field, 'name',  f.name,",
							"                      'level',   f.level, 'value', f.value,",
							"                      'follows', COALESCE(f.follows,''),",
							"                      'status',  IF(v.value & f.value, 'true', 'false')",
							"                  )   ) SEPARATOR ','),",
							"          ']'))) As settings",
							"FROM      user_visibilities   v",
							"LEFT JOIN visibility_fields   f ON f.level > 1",
							"WHERE     v.user_fk IN (:UIDS:)",
							"GROUP BY  v.user_fk ORDER BY f.id"
						],
						Params: { UIDs: true, ID: true, Page: true, Limit: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Settings: {
						Scheme: '/:uids(\\d(?:[\\d;]*\\d)?)/',
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Settings}} of the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_id, JSON_COMPACT(",
							"               JSON_INSERT(JSON_OBJECT(",
							"                   'email',      u.email_address,",
							"                   'timezone',   s.timezone,",
							"                   'language',   l.language_name,",
							`                   'visibility', ${SQL.SOCKET({link:'/user/settings/visibility/:uids:%s',columns:['u.user_id']})}`,
							"               ),",
							"               '$.modes',               JSON_OBJECT(),",
							"               '$.modes.admin',         s.is_admin,",
							"               '$.modes.transactional', s.is_transactional,",
							"               '$.modes.provider',      s.is_provider",
							"           )) AS settings",
							"FROM       users 			u",
							"INNER JOIN user_settings 	s ON u.user_id      = s.user_fk",
							"INNER JOIN languages       l ON s.language_id  = l.language_id",
							"WHERE      u.user_id IN (:UIDS:)",
							"GROUP BY   u.user_id :LIMIT: :PAGE:"

						],
						Params: { UIDs: true, ID: true, Page: true, Limit: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Misc: {
						Scheme: '/:uids(\\d(?:[\\d;]*\\d)?)/',
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Returns the {{Misc}} of the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_fk AS user_id, JSON_COMPACT(IF(v.value & 8192, ",
							"               JSON_OBJECT('misc', JSON_OBJECT(",
							"           		'description', u.profile_description",
							"           	)),",
							"               JSON_INSERT(",
							"                   JSON_OBJECT('misc', JSON_OBJECT(",
							"               		'description', u.profile_description",
							"               	)), '$.misc.education', JSON_OBJECT(),",
							"               	'$.misc.education.institutions', u.profile_education,",
							"               	'$.misc.education.description',  u.profile_edu_descr",
							"           ))) AS details",
							"FROM       user_profile_details  AS u",
							"LEFT  JOIN user_visibilities     AS v ON u.user_fk = v.user_fk",
							"WHERE      u.user_fk IN (:UIDS:)",
							"GROUP BY   u.user_fk :LIMIT: :PAGE:",
						],
						Params: { UIDs: true, ID: true, Page: true, Limit: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Identity: {
						Scheme: '/:uids(\\d(?:[\\d;]*\\d)?)/',
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Returns the {{Identity}} of the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_fk AS user_id, JSON_SET(",
							"               JSON_OBJECT('identity', JSON_OBJECT(",
							"                   'sex','','marital','',",
							"                   'gender',JSON_OBJECT('value','','label',''),",
							"                   'orient',JSON_OBJECT('value','','label','')",
							"           	)   ),",
							"           	'$.identity.sex',          getVis(v.value, 2048, u.profile_sex),",
							"           	'$.identity.gender.value', getVis(v.value, 1024, CAST(g.gender_id AS CHAR(20))),",
							"           	'$.identity.gender.label', getVis(v.value, 1024, g.gender_name),",
							"           	'$.identity.orient.value', getVis(v.value, 1024, CAST(o.orient_id AS CHAR(20))),",
							"           	'$.identity.orient.label', getVis(v.value, 1024, o.orient_name),",
							"           	'$.identity.marital',      getVis(v.value, 4096, u.profile_marital_status)",
							"           ) AS details",
							"FROM       user_profile_details  AS u",
							"LEFT  JOIN user_visibilities     AS v ON u.user_fk = v.user_fk",
							"INNER JOIN genders               AS g ON u.profile_identity = g.gender_id",
							"INNER JOIN orients               AS o ON u.profile_orient   = o.orient_id",
							"WHERE      u.user_fk IN (:UIDS:) :LIMIT: :PAGE:",
						],
						Params: { UIDs: true, ID: true, Page: true, Limit: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Religion: {
						Scheme: '/:uids(\\d(?:[\\d;]*\\d)?)/',
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Religion}} of the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_fk AS user_id, JSON_SET(",
							"               JSON_OBJECT('religion', JSON_OBJECT('value',NULL,'label','')),",
							"           	'$.religion.value', CAST(r.religion_id AS CHAR(20)),",
							"           	'$.religion.label', r.religion_name",
							"           ) AS details",
							"FROM       user_profile_details  AS u",
							"LEFT  JOIN user_visibilities     AS v ON u.user_fk = v.user_fk",
							"INNER JOIN religions             AS r ON u.profile_religion = r.religion_id",
							"                                     AND !(COALESCE(v.value,0) & 512)",
							"WHERE      u.user_fk IN (:UIDS:) :LIMIT: :PAGE:",
						],
						Params: { UIDs: true, ID: true, Page: true, Limit: true },
						Links: 	[],
						Key: 	'user_id',
					},				
					// ======================================================================
					Nationalities: {
						Scheme: '/:uids(\\d(?:[\\d;]*\\d)?)/',
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Nationalities}} of the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_fk AS user_id, JSON_COMPACT(",
							"           CONCAT('{\"nationalities\":[',",
							"               IF(n.nationality_id, GROUP_CONCAT(JSON_OBJECT(",
							"                   'value', CAST(n.nationality_id AS INT),",
							"                   'label', n.nationality_name",
							"               ) SEPARATOR ','),''),",
							"           ']}')) as details",
							"FROM       user_profile_details AS u",
							"LEFT  JOIN user_visibilities    AS v ON u.user_fk  = v.user_fk AND true",
							"LEFT  JOIN nationalities        AS n ON !(COALESCE(v.value,0) & 256)",
							"                                    AND JSON_CONTAINS(",
							"                                         u.profile_nationalities,",
							"                                         n.nationality_id)",
							"WHERE      u.user_fk IN (:UIDS:)",
							"GROUP BY   u.user_fk :LIMIT: :PAGE:"
						],
						Params: { UIDs: true, ID: true, Page: true, Limit: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Languages: {
						Scheme: '/:uids(\\d(?:[\\d;]*\\d)?)/',
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Languages}} of the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_fk AS user_id, CONCAT('{\"languages\":[',",
							"           IF(l.language_id, GROUP_CONCAT(JSON_OBJECT(",
							"               'value', CAST(l.language_id AS INT),",
							"               'label', l.language_name,",
							"               'level', CAST(JSON_VALUE(",
							"                    u.profile_languages, CONCAT('$.',l.language_id)",
							"                ) AS INT)",
							"           ) SEPARATOR ','),''),']}') as details",
							"FROM       user_profile_details AS u",
							"LEFT  JOIN user_visibilities    AS v ON u.user_fk  = v.user_fk AND true",
							"LEFT  JOIN languages            AS l ON !(COALESCE(v.value,0) & 128)",
							"                                    AND JSON_CONTAINS(",
							"                                            JSON_KEYS(u.profile_languages),",
							"                                            JSON_QUOTE(CONVERT(l.language_id,CHAR(5)",
							"                                        )))",
							"WHERE      u.user_fk IN (:UIDS:)",
							"GROUP BY   u.user_fk :LIMIT: :PAGE:",
						],
						Params: { UIDs: true, ID: true, Page: true, Limit: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Hobbies: {
						Scheme: '/:uids(\\d(?:[\\d;]*\\d)?)/',
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Hobbies}} of the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_fk AS user_id, CONCAT('{\"hobbies\":[',",
							"           IF(h.hobby_id, GROUP_CONCAT(JSON_OBJECT(",
							"               'value', CAST(h.hobby_id AS INT),",
							"               'label', h.hobby_name,",
							"                'kind', h.hobby_type,",
							"                'more', EXISTS( SELECT * FROM hobbies b",
							"                                WHERE  b.hobby_name = h.hobby_name",
							"                                AND    b.hobby_id <> h.hobby_id),",
							"               'level', CAST(JSON_VALUE(",
							"                    u.profile_hobbies, CONCAT('$.',h.hobby_id)",
							"               ) AS INT)",
							"           ) SEPARATOR ','),''),']}') as details",
							"FROM       user_profile_details AS u",
							"LEFT  JOIN user_visibilities    AS v ON u.user_fk  = v.user_fk AND true",
							"LEFT  JOIN hobbies              AS h ON !(COALESCE(v.value,0) & 64)",
							"                                    AND JSON_CONTAINS(",
							"                                            JSON_KEYS(u.profile_hobbies),",
							"                                            JSON_QUOTE(CONVERT(h.hobby_id,CHAR(5)",
							"                                        )))",
							"WHERE      u.user_fk IN (:UIDS:)",
							"GROUP BY   u.user_fk :LIMIT: :PAGE:",
						],
						Params: { UIDs: true, ID: true, Page: true, Limit: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Details: {
						Scheme: '/:uids(\\d(?:[\\d;]*\\d)?)/',
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Details}} of the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_id, JSON_OBJECT(",
							`               'hobbies',       ${SQL.SOCKET({link:'/user/details/hobbies/:uids:%s',      columns:['u.user_id']})},`,
							`               'languages',     ${SQL.SOCKET({link:'/user/details/languages/:uids:%s',    columns:['u.user_id']})},`,
							`               'nationalities', ${SQL.SOCKET({link:'/user/details/nationalities/:uids:%s',columns:['u.user_id']})},`,
							`               'religion',      ${SQL.SOCKET({link:'/user/details/religion/:uids:%s',     columns:['u.user_id']})},`,
							`               'identity',      ${SQL.SOCKET({link:'/user/details/identity/:uids:%s',     columns:['u.user_id']})},`,
							`               'misc',          ${SQL.SOCKET({link:'/user/details/misc/:uids:%s',         columns:['u.user_id']})}`,
							"           ) AS details",
							"FROM       users     AS u",
							"WHERE      u.user_id IN (:UIDS:)",
							":LIMIT: :PAGE:"
						],
						Params: { UIDs: true, ID: true, Page: true, Limit: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Photos: {
						Scheme: '/:uids(\\d(?:[\\d;]*\\d)?)/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Returns the {{Images}} of the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_fk AS user_id, JSON_OBJECT(",
							"               'profile', u.profile_picture,",
							"               'cover',   u.profile_cover",
							"           ) AS photos",
							"FROM       user_profile_details  AS u",
							"WHERE      u.user_fk IN (:UIDS:)",
							":LIMIT: :PAGE:",
						],
						Params: { UIDs: true, ID: true, Page: true, Limit: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					"/": {
						Scheme: '/(:account([\\w\\d_;-]+)|:uids(\\d+(?:[\\d;]*\\d)?))/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:account:ajohnson": "Displays the {{Users}} with a {{User Name}} of 'ajohnson'",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_id, u.display_name,",
							"           getVis(v.value, 1, u.email_address) AS email_address,",
							"           JSON_OBJECT(",
							"               'first', getVis(v.value, 2, u.first_name),",
							"               'last',  getVis(v.value, 4, u.last_name)",
							"           ) AS name,",
							`           ${SQL.SOCKET({link:'/user/photos/:uids:%s',		columns:['u.user_id']})} AS photos,`,
							"           IF(v.value & 32, JSON_OBJECT(), JSON_OBJECT(",
							"               'id',    u.location,",
							"               'label', getLocale(l.city, l.region, l.country),",
							"               'codes', JSON_OBJECT(",
							"                   'region',  UPPER(r.code),",
							"                   'country', UPPER(f.code)",
							"           )))             AS location,",
							"           JSON_OBJECT(",
							`               'hobbies',       ${SQL.SOCKET({link:'/user/details/hobbies/:uids:%s',      columns:['u.user_id']})},`,
							`               'languages',     ${SQL.SOCKET({link:'/user/details/languages/:uids:%s',    columns:['u.user_id']})},`,
							`               'nationalities', ${SQL.SOCKET({link:'/user/details/nationalities/:uids:%s',columns:['u.user_id']})},`,
							`               'religion',      ${SQL.SOCKET({link:'/user/details/religion/:uids:%s',     columns:['u.user_id']})},`,
							`               'identity',      ${SQL.SOCKET({link:'/user/details/identity/:uids:%s',     columns:['u.user_id']})},`,
							`               'misc',          ${SQL.SOCKET({link:'/user/details/misc/:uids:%s',         columns:['u.user_id']})}`,
							"           ) AS details,",
							`           ${SQL.SOCKET({link:'/provider/:uids:%s',     columns:['u.user_id']})} AS provider,`,
							`           ${SQL.SOCKET({link:'/user/settings/:uids:%s',columns:['u.user_id']})} AS settings,`,
							"           JSON_OBJECT(",
							"               'verified',  u.verified, ",
							"               'status',    u.status, ",
							"               'tour_done', u.tour_done",
							"           ) AS checks,",
							"           getVis(v.value, 16, u.birth_date) AS birth_date,",
							"           u.inserted_at   AS member_since",
							"FROM       users           AS u",
							"LEFT  JOIN user_visibilities  v ON u.user_id = v.user_fk",
							"LEFT  JOIN search_locale   AS l ON u.location = l.id",
							"LEFT  JOIN regions         AS r ON r.id = l.region_id",
							"LEFT  JOIN countries       AS f ON f.id = r.country_id",
							"WHERE      u.user_id       IN (:UIDS:)",
							"OR         u.display_name  IN :ACCOUNT:",
							":LIMIT: :PAGE:"
						],
						Params: {
							UIDs: 	 true,
							Account: {
								Default: "",
								Format 	(cls) {
									return SQL.BRKT(SQL.LIST([cls.account],
										[{ split: ORS, match: /^[A-Za-z0-9_-]+|$/, equals: true, join: '","' }]),
									['("','")'], PIP)||"('')";
								},
								Desc: 	{
									type: { List: "Text", Separator: ORS },
									to: 'param', required: null,
									description: "The user's {{Display Name}}",
									matches: {
										'Display-Name': 'Matches the {{Display Name}} of the {{User}} (([A-Za-z0-9_-]+))'
									},
								}
							}, 	Single: true, ID: true, Page: true, Limit: true
						},
						Links: 	[],
						Parse  	(res) {
							var lnk = ['hobbies','languages','nationalities','religion','identity','misc'],
								RQ  = this.RQ;
							// if (IDs = res.map((v,i)=>v.user_id), IDs) { 
								// var prm = `:uids:${IDs.join(';')}`;
								// lnk.map((l,i)=>{
								// 	var qry = `?as=item&&to=["payload","result"]`;
								// 	RQ.links[l]=SQL.SOCKET({link:`/user/${l}/${prm}${qry}`});
								// 	console.log(RQ.links[l])
								// });
							// };
							return JSN.Objectify(res, RQ.Key, RQ.Columns, this.QY);
						},
						Key: 	'user_id',
					}
				},
				Errors: 	{ BAD_REQ: ['/'] }
			},
			Update: 		{
				Actions: 	{
					// ======================================================================
					Visibility: {
						Scheme: '/:uids(\\d*)/',
						Limits: ["Tries/Second"],
						Sub: 	['settings'],
						Routes: ['settings'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Visibility}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE user_visibilities v",
							"SET    v.value   = COALESCE(NULLIF(:EVISIBLES:,-1), v.value)",
							"WHERE  v.user_fk = :UIDS:;",
							":/User/Visibility:"
						],
						Params: { 
							eVisibles: {
								Default: -1,
								Format 	(cls) { 
									let val = cls.evisibles, dft = this.Default;
									return (!isNaN(val)&&val%8===0?val:dft); 
								},
								Desc: 	{
									description: "The user's {{Timezone}}",
									type: "Text", to: 'query', required: false, matches: {
										'Timezone': 'Updates the {{Timezone}} of the {{User}} ((M|R|S))'
									},
								}
							}, UIDs: true, Single: true 
						},
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Settings: {
						Scheme: '/:uids(\\d*)/',
						Limits: ["Tries/Second"],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Settings}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_settings s",
							"INNER JOIN users         u ON s.user_fk = u.user_id",
							"SET        u.email_address    = COALESCE(NULLIF(':EEMAIL:',  ''), u.email_address),",
							"           s.timezone         = COALESCE(NULLIF(':ETZONE:',  ''), s.timezone),",
							"           s.language_id      = COALESCE(NULLIF( :ELANG:,    -1), s.language_id),",
							"           s.is_provider      = COALESCE(NULLIF( :EPROVIDER:,-1), s.is_provider),",
							"           s.is_transactional = COALESCE(NULLIF( :ETRANSACT:,-1), s.is_transactional)",
							"WHERE      s.user_fk IN (:UIDS:);",
							":/User/Settings:"
						],
						Params: { 
							eEmail: true,
							eTZone: {
								Default: '',
								Format 	(cls) { 
									let val = (cls.etzone||this.Default);
									return (TZ.zones[val]||val); 
								},
								Desc: 	{
									description: "The user's {{Timezone}}",
									type: "Text", to: 'query', required: false, matches: {
										'Timezone': 'Updates the {{Timezone}} of the {{User}} (([\\w@/_-]+))'
									},
								}
							},
							eLang: {
								Default: -1,
								Format 	(cls) { return (!isNaN(cls.elang) ? cls.elang : this.Default); },
								Desc: 	{
									description: "The user's {{Site Language}}",
									type: "Number", to: 'query', required: false, matches: {
										'Site Language': 'Updates the {{Site Language}} of the {{User}} (([\\w(,) -]+))'
									},
								}
							},
							eProvider: {
								Default: -1,
								Format 	(cls) { return Number(Boolean(cls.eprovider||this.Default)); },
								Desc: 	{
									description: "The user's {{Provider Status}}",
									type: "Number", to: 'query', required: false, matches: {
										'Provider Status': 'Updates the {{Provider Status}} of the {{User}} ((0|1|true|false))'
									},
								}
							},
							eTransact: {
								Default: -1,
								Format 	(cls) { return Number(Boolean(cls.etransact||this.Default)); },
								Desc: 	{
									description: "The user's {{Transaction Status}}",
									type: "Number", to: 'query', required: false, matches: {
										'Transaction Status': 'Updates the {{Transaction Status}} of the {{User}} ((0|1|true|false))'
									},
								}
							}, UIDs: true, Single: true 
						},
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Education: {
						Scheme: '/:uids(\\d*)/',
						Limits: ["Tries/Second"],
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Misc}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details  AS d",
							"SET        d.profile_education = COALESCE(",
							"               NULLIF(':EEDU:',''),",
							"               d.profile_education),",
							"           d.profile_edu_descr = COALESCE(",
							"               NULLIF(':EEDUDESCR:',''),",
							"               d.profile_edu_descr)",
							"WHERE      d.user_fk IN (:UIDS:);",
							":/User/Misc:"
						],
						Params: { eEdu: true, eEduDescr: true, UIDs: true, Single: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Description: {
						Scheme: '/:uids(\\d*)/',
						Limits: ["Tries/Second"],
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Misc}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details  AS d",
							"SET        d.profile_description = COALESCE(",
							"               NULLIF(':EDESCR:',''),",
							"               d.profile_description)",
							"WHERE      d.user_fk IN (:UIDS:);",
							":/User/Misc:"
						],
						Params: {
							eDescr: true, UIDs: true, Single: true
						},
						Links: 	[],
						Parse  	(res) {
							var RQ  = this.RQ, keys = Object.keys(res); 
							keys.map((k,i)=>{ 
								let det = JSON.parse(res[k].details),
									ins = det.misc.education.institutions;
								det.misc.education.institutions = ins.split(/\n|,\s+/g);
								res[k].details = det;
							});
							return JSN.Objectify(res, RQ.Key, RQ.Columns, this.QY);
						},
						Key: 	'user_id',
					},
					// ======================================================================
					Marital: {
						Scheme: '/:uids(\\d*)/',
						Limits: ["Tries/Second"],
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Identity}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details  AS d",
							"SET        d.profile_marital_status = COALESCE(",
							"               NULLIF(':MARITAL:',''),d.profile_marital_status",
							"           )",
							"WHERE      d.user_fk IN (:UIDS:);",
							":/User/Identity:"
						],
						Params: { Marital: true, UIDs: true, Single: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Sex: {
						Scheme: '/:uids(\\d*)/',
						Limits: ["Tries/Second"],
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Identity}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details  AS d",
							"SET        d.profile_sex = COALESCE(NULLIF(':SEX:',''),d.profile_sex)",
							"WHERE      d.user_fk IN (:UIDS:);",
							":/User/Identity:"
						],
						Params: { Sex: true, UIDs: true, Single: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Gender: {
						Scheme: '/:uids(\\d*)/',
						Limits: ["Tries/Second"],
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Identity}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details  AS d",
							"LEFT  JOIN genders               AS g ON g.gender_id = :EGID:",
							"LEFT  JOIN orients               AS o ON o.orient_id = :EOID:",
							"SET        d.profile_identity = COALESCE(g.gender_id, d.profile_gender),",
							"           d.profile_orient   = COALESCE(o.orient_id, d.profile_orient)",
							"WHERE      d.user_fk         IN (:UIDS:);",
							":/User/Identity:"
						],
						Params: { eGID: true, eOID: true, UIDs: true, Single: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Religion: {
						Scheme: '/:uids(\\d*)/',
						Limits: ["Tries/Second"],
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Religion}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details  AS d",
							"LEFT  JOIN religions             AS r ON r.religion_id = :ERID:",
							"SET        d.profile_religion = COALESCE(r.religion_id, d.profile_religion)",
							"WHERE      d.user_fk         IN (:UIDS:);",
							":/User/Religion:"
						],
						Params: { eRID: true, UIDs: true, Single: true },
						Links: 	[],
						Key: 	'user_id',
					},				
					// ======================================================================
					Nationalities: {
						Scheme: '/:uids(\\d*)/',
						Limits: ["Tries/Second"],
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Nationalities}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details AS u",
							"INNER JOIN (",
							"    SELECT     d.user_fk, CONCAT('[',",
							"                   GROUP_CONCAT(h.nationality_id SEPARATOR ','),",
							"               ']') as nationalities",
							"    FROM       user_profile_details AS d",
							"    INNER JOIN (",
							"        SELECT     d.user_fk, JSON_COMPACT(",
							"                       :ENIDS:",
							"                   ) AS profile_nationalities",
							"        FROM       user_profile_details AS d",
							"        WHERE      d.user_fk IN (:UIDS:)",
							"    ) AS E ON d.user_fk = E.user_fk",
							"    LEFT  JOIN nationalities AS h ON ",
							"        JSON_CONTAINS(E.profile_nationalities,h.nationality_id)",
							"    GROUP BY   d.user_fk",
							") P ON u.user_fk = P.user_fk",
							"SET    u.profile_nationalities = P.nationalities",
							"WHERE  u.user_fk = P.user_fk;",
							":/User/Nationalities:"
						],
						Params: { eNIDs: true, UIDs: true, Single: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Languages: {
						Scheme: '/:uids(\\d*)/',
						Limits: ["Tries/Second"],
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Languages}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details AS u",
							"INNER JOIN (",
							"    SELECT     d.user_fk, CONCAT('{\"', GROUP_CONCAT(",
							"                   h.language_id, '\":', CAST(JSON_VALUE(",
							"                        E.profile_languages, CONCAT('$.',h.language_id)",
							"                   ) AS INT)",
							"               SEPARATOR ',\"'),'}') as languages",
							"    FROM       user_profile_details AS d",
							"    INNER JOIN (",
							"        SELECT     d.user_fk, JSON_COMPACT(",
							"                       :ELGIDS:",
							"                   ) AS profile_languages",
							"        FROM       user_profile_details AS d",
							"        WHERE      d.user_fk IN (:UIDS:)",
							"    )                    AS E ON d.user_fk = E.user_fk",
							"    LEFT  JOIN languages AS h ON JSON_CONTAINS(",
							"                                     JSON_KEYS(E.profile_languages),",
							"                                     JSON_QUOTE(CONVERT(h.language_id,CHAR(5)",
							"                                 )))",
							"    GROUP BY   d.user_fk",
							") P ON u.user_fk = P.user_fk",
							"SET    u.profile_languages = P.languages",
							"WHERE  u.user_fk = P.user_fk;",
							":/User/Languages:"
						],
						Params: { eLGIDs: true, UIDs: true, Single: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Hobbies: {
						Scheme: '/:uids(\\d*)/',
						Limits: ["Tries/Second"],
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Hobbies}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details AS u",
							"INNER JOIN (",
							"    SELECT     d.user_fk, CONCAT('{\"', GROUP_CONCAT(",
							"                   h.hobby_id, '\":', CAST(JSON_VALUE(",
							"                        E.profile_hobbies, CONCAT('$.',h.hobby_id)",
							"                   ) AS INT)",
							"               SEPARATOR ',\"'),'}') as hobbies",
							"    FROM       user_profile_details AS d",
							"    INNER JOIN (",
							"        SELECT     d.user_fk, JSON_COMPACT(",
							"                       :EHIDS:",
							"                   ) AS profile_hobbies",
							"        FROM       user_profile_details AS d",
							"        WHERE      d.user_fk IN (:UIDS:)",
							"    )                  AS E ON d.user_fk = E.user_fk",
							"    LEFT  JOIN hobbies AS h ON JSON_CONTAINS(",
							"                                   JSON_KEYS(E.profile_hobbies),",
							"                                   JSON_QUOTE(CONVERT(h.hobby_id,CHAR(5)",
							"                               )))						  ",
							"    GROUP BY   d.user_fk",
							") P ON u.user_fk = P.user_fk",
							"SET    u.profile_hobbies = P.hobbies",
							"WHERE  u.user_fk = P.user_fk;",
							":/User/Hobbies:"
						],
						Params: { eHIDs: true, UIDs: true, Single: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Details: {
						Scheme: '/:uids(\\d*)/',
						Limits: ["Tries/Second"],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Details}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							":/Update/Hobbies:", 		":/Update/Languages:",
							":/Update/Nationalities:",	":/Update/Religion:",
							":/Update/Sex:",			":/Update/Marital:",
							":/Update/Gender:",			":/Update/Description:",
							":/Update/Education:"
						],
						Params: {
							eHIDs:		true, eLGIDs:	true,
							eNIDs:		true, eRID:		true,
							Marital: 	true, Sex: 		true,
							eGID: 		true, eOID: 	true, 
							eDescr:		true, eEdu:		true, 
							eEduDescr:	true, UIDs:		true, 
							// Single:		true,
						},
						Links: 	[],
						Parse  	(res) { 
							var ret = Imm.Map({}); res.map(v=>{
								ret = ret.mergeDeep(Imm.fromJS(Imm.Map(v).toJS()))
							}); return ret.toJS();
						},
						Key: 	'user_id'
					},
					// ======================================================================
					Cover: {
						Scheme: '/:uids(\\d*)/',
						Limits: ["Tries/Second"],
						Sub: 	['photos'],
						Routes: ['photos'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Cover Image}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details  AS d",
							"LEFT  JOIN user_photos           AS i ON d.user_fk = i.user_fk",
							"                                     AND i.id      = :ECOVER:",
							"SET        d.profile_cover    = COALESCE(i.id, d.profile_cover)",
							"WHERE      d.user_fk IN (:UIDS:);",
							":/User/Photos:"
						],
						Params: { eCover: true, UIDs: true, Single: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Picture: {
						Scheme: '/:uids(\\d*)/',
						Limits: ["Tries/Second"],
						Sub: 	['photos'],
						Routes: ['photos'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Profile Image}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details  AS d",
							"LEFT  JOIN user_photos           AS i ON d.user_fk = i.user_fk",
							"                                     AND i.id      = :EPICTURE:",
							"SET        d.profile_picture  = COALESCE(i.id, d.profile_picture)",
							"WHERE      d.user_fk IN (:UIDS:);",
							":/User/Photos:"
						],
						Params: { ePicture: true, UIDs: true, Single: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Photos: {
						Scheme: '/:uids(\\d*)/',
						Limits: ["Tries/Second"],
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Photos}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [":/Update/Picture:",":/Update/Cover:",":/User/Photos:"],
						Params: { ePicture: true, eCover: true, UIDs: true, Single: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					"/": {
						Scheme: '/:uids(\\d*)/',
						Limits: ["Tries/Second"],
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{User Info}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     users         AS u",
							"LEFT  JOIN users         AS d ON d.user_id NOT IN (:UIDS:) AND d.display_name = 'EUSERNAME'",
							"LEFT  JOIN search_locale AS l ON l.id = :ELOCATION:",
							"SET        u.display_name = COALESCE(NULLIF(':EUSERNAME:', 'NULL',  d.display_name), u.display_name),",
							"           u.first_name   = COALESCE(NULLIF(':EFIRSTNAME:','NULL'), u.first_name),",
							"           u.last_name    = COALESCE(NULLIF(':ELASTNAME:', 'NULL'), u.last_name),",
							"           u.birt_hdate   = COALESCE(NULLIF(':EBIRTHDATE:','NULL'), u.birt_hdate),",
							"           u.location     = COALESCE(l.id, u.location)",
							"WHERE      u.user_id IN (:UIDS:);",
							":/User:"
						],
						Params: {
							eUserName: 	{
								Default: 'NULL',
								Format:  uname('eusername'),
								Desc: 	 {
									type: "Text", to: 'query', required: false,
									description: "The user's {{Display Name}}", matches: {
										'Display Name': 'Updates the {{Display Name}} of the {{User}} (([\\w_.-]+))'
									},
								}
							},
							eFirstName: {
								Default: 'NULL',
								Format 	(cls) { return ((cls.efirstname||'').match(rgnme)||[''])[0].toTitleCase(); },
								Desc: 	{
									type: "Text", to: 'query', required: false,
									description: "The user's {{First Name}}", matches: {
										'First Name': `Updates the {{First Name}} of the {{User}} (([A-z0-9 .-]))`
									},
								}
							},
							eLastName: 	{
								Default: 'NULL',
								Format 	(cls) { return ((cls.elastname||'').match(rgnme)||[''])[0].toTitleCase(); },
								Desc: 	{
									type: "Text", to: 'query', required: false,
									description: "The user's {{Last Name}}", matches: {
										'Last Name': `Updates the {{Last Name}} of the {{User}} (([A-z0-9 .-]))`
									},
								}
							},
							eBirthDate: {
								Default: 'NULL',
								Format 	(cls) { 
									let fyr = (new Date()).getFullYear(), mn = fyr-13, mx = fyr+120;
										rgx = RegExp('^(0\d|1[0-2])-([0-2]\d|3[0-1])-(\d{4})$'),
										dts = ((cls.elastname||'').match(rgx)||['']), yr;
									if (!!dts && dts.length == 4) {
										if (yr=Number(dts[3]), yr>=mn && yr<=mx) dts.shift();
										else dts = []; }; return dts.join('-'); 
								},
								Desc: 	{
									type: "Text", to: 'query', required: false,
									description: "The user's {{Birthdate}}", matches: {
										'Birthdate': 'Updates the {{Birthdate}} of the {{User}} ((\\d{2}-\\d{2}-\\d{4}))'
									},
								}
							},
							eLocation: 	{
								Default: -1,
								Format 	(cls) { return cls.elocation },
								Desc: 	{
									type: "Number", to: 'query', required: false,
									description: "The user's {{Location}}", matches: {
										'Location': 'Updates the {{Location}} of the {{User}} ((\\d{2}+))'
									},
								}
							}, UIDs: true, Single: true 
						},
						Links: 	[],
						Parse  	(res) {
							var lnk = ['hobbies','languages','nationalities','religion','identity','misc'],
								RQ  = this.RQ;
							// if (IDs = res.map((v,i)=>v.user_id), IDs) { 
								// var prm = `:uids:${IDs.join(';')}`;
								// lnk.map((l,i)=>{
								// 	var qry = `?as=item&&to=["payload","result"]`;
								// 	RQ.links[l]=SQL.SOCKET({link:`/user/${l}/${prm}${qry}`});
								// 	console.log(RQ.links[l])
								// });
							// };
							return JSN.Objectify(res, RQ.Key, RQ.Columns, this.QY);
						},
						Key: 	'user_id',
					}
				},
				Errors: 	{ BAD_REQ: ['/'] }
			},
			Locale: 		{
				Actions: 	{
					// ======================================================================
					Radius: {
						Scheme: '/:lid(\\d+)/',
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:lid:312844": "Returns the {{Locales}} within a 25km {{Radius}} of 'Calgary, Canada' ({{LID:312844}})",
								"/:radius:50/:lid:312844": "Returns the {{Locales}} within a 50km {{Radius}} of 'Calgary, Canada' ({{LID:312844}})",
								"?page=3": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Locales}} per {{Page}}",
							},
						},
						Query: [
							"SELECT     R.*, ROUND(ACOS(",
							"               (SIN(@radLAT) * SIN(RADIANS(R.latitude))) + (",
							"                   COS(@radLAT) * COS(RADIANS(R.latitude)) * ",
							"                   COS(RADIANS(R.longitude) - @radLON)",
							"           )   ) * @RE, 1) AS distance",
							"FROM       (",
							"    SELECT   M.* FROM cities M, (",
							"        SELECT getRadians(:UID:,':LID:',:RADIUS:) region_id",
							"    )   X",
							"    WHERE    M.latitude  BETWEEN @minLAT AND @maxLAT",
							"    AND      M.longitude BETWEEN @minLON AND @maxLON",
							"    AND      M.region_id = X.region_id",
							")   R",
							"WHERE      (ACOS(",
							"               (SIN(@radLAT) * SIN(RADIANS(R.latitude))) + (",
							"                   COS(@radLAT) * COS(RADIANS(R.latitude)) * ",
							"                   COS(RADIANS(R.longitude) - @radLON)",
							"           )   ) * @RE) < @RAD",
							"ORDER BY   distance",
							":LIMIT: :PAGE:",
						],
						Params: {
							LID:  true, Units: true, Radius: true, UID: scuid(true),
							Page: true, Limit: true, ID:     true
						},
						Links: 	[],
						Key: ''
					},
					// ======================================================================
					Country: {
						Scheme: '/:term([\\w\\d,;.-]+)/',
						Limits: ["Constant/Second"],
						Sub: 	['search'],
						Routes: ['search'],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:term:camer": "Searches for any {{Countries}} matching 'camer' (like 'Cameroon')",
								"?page=3": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Locales}} per {{Page}}",
							},
						},
						Query: [
							"SELECT  S.value, S.label",
							"FROM    (",
							"    SELECT  s.id AS value, CONCAT_WS(', ',",
							"                COALESCE(NULLIF(s.city,   ''),NULL),",
							"                COALESCE(NULLIF(s.region, ''),NULL),",
							"                COALESCE(NULLIF(s.country,''),NULL)",
							"            ) AS label,",
							"            MATCH(s.country) AGAINST (':TERM:' IN BOOLEAN MODE) AS score,",
							"            LENGTH(CONCAT(s.country)) AS length",
							"    FROM    search_locale s",
							"    WHERE   MATCH(s.country) AGAINST (':TERM:' IN BOOLEAN MODE)",
							"    LIMIT   1000",
							") AS S",
							"ORDER BY (S.score/S.length) DESC",
							":LIMIT: :PAGE:",
						],
						Params: {
							Term: {
								Default: '',
								Format 	(cls) {
									return cls.term.split(/,\s*/)
													.filter((v,i) => !!v).join(', ')
													.replace(/((?:\b\w+\b)(?!,))/g, '+$1*')
													.replace(/((?:\b\w+\b)(?=,))/g, '+$1');
								},
								Desc: 	{
									type: "Text", to: 'param', required: true,
									description: "A {{Search Term}} for the {{Country}}",
									matches: {
										'Country': 	'Matches the {{Country}}, unless omitted (([A-z0-9,.-]+))',
									},
								}
							},
							Page: true, Limit: true, ID: true
						},
						Links: 	[],
						Key: ''
					},
					// ======================================================================
					Region: {
						Scheme: '/:term([\\w\\d,;.-]+)/',
						Limits: ["Constant/Second"],
						Sub: 	['search'],
						Routes: ['search'],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:term:misiss": "Searches for any {{Regions}} matching 'misiss' (like 'Mississippi')",
								"?page=10": "Displays the 10th {{Page}} at a {{Limit}} of 'ten' {{Locales}} per {{Page}}",
							},
						},
						Query: [
							"SELECT  S.value, S.label",
							"FROM    (",
							"    SELECT  s.id AS value, CONCAT_WS(', ',",
							"                COALESCE(NULLIF(s.city,   ''),NULL),",
							"                COALESCE(NULLIF(s.region, ''),NULL),",
							"                COALESCE(NULLIF(s.country,''),NULL)",
							"            ) AS label,",
							"            MATCH(s.region) AGAINST (':TERM:' IN BOOLEAN MODE) AS score,",
							"            LENGTH(CONCAT(s.region)) AS length",
							"    FROM    search_locale s",
							"    WHERE   MATCH(s.region) AGAINST (':TERM:' IN BOOLEAN MODE)",
							"    LIMIT   1000",
							") AS S",
							"ORDER BY (S.score/S.length) DESC",
							":LIMIT: :PAGE:",
						],
						Params: {
							Term: {
								Default: '',
								Format 	(cls) {
									return cls.term.split(/,\s*/)
													.filter((v,i) => !!v).join(', ')
													.replace(/((?:\b\w+\b)(?!,))/g, '+$1*')
													.replace(/((?:\b\w+\b)(?=,))/g, '+$1');
								},
								Desc: 	{
									type: "Text", to: 'param', required: true,
									description: "A {{Search Term}} for the {{Region}}",
									matches: {
										'Region': 'Matches the {{Region}}, unless omitted (([A-z0-9,.-]+))',
									},
								}
							},
							Page: true, Limit: true, ID: true
						},
						Links: 	[],
						Key: ''
					},
					// ======================================================================
					City: {
						Scheme: '/:term([\\w\\d,;.-]+)/',
						Limits: ["Constant/Second"],
						Sub: 	['search'],
						Routes: ['search'],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:term:calgar": "Searches for any {{Cities}} matching 'calgar' (like 'Calgary')",
								"?page=7": "Displays the 7th {{Page}} at a {{Limit}} of 'ten' {{Locales}} per {{Page}}",
							},
						},
						Query: [
							"SELECT  S.value, S.label",
							"FROM    (",
							"    SELECT  s.id AS value, CONCAT_WS(', ',",
							"                COALESCE(NULLIF(s.city,   ''),NULL),",
							"                COALESCE(NULLIF(s.region, ''),NULL),",
							"                COALESCE(NULLIF(s.country,''),NULL)",
							"            ) AS label,",
							"            MATCH(s.city) AGAINST (':TERM:' IN BOOLEAN MODE) AS score,",
							"            LENGTH(CONCAT(s.city)) AS length",
							"    FROM    search_locale s",
							"    WHERE   MATCH(s.city) AGAINST (':TERM:' IN BOOLEAN MODE)",
							"    LIMIT   1000",
							") AS S",
							"ORDER BY (S.score/S.length) DESC",
							":LIMIT: :PAGE:",
						],
						Params: {
							Term: {
								Default: '',
								Format 	(cls) {
									return cls.term.split(/,\s*/)
													.filter((v,i) => !!v).join(', ')
													.replace(/((?:\b\w+\b)(?!,))/g, '+$1*')
													.replace(/((?:\b\w+\b)(?=,))/g, '+$1');
								},
								Desc: 	{
									type: "Text",
									to: 'param', required: true,
									description: "A {{Search Term}} for the {{City}}",
									matches: {
										'City': 'Matches the {{City}}, unless omitted (([A-z0-9,.-]+))',
									},
								}
							},
							Page: true, Limit: true, ID: true
						},
						Links: 	[],
						Key: ''
					},
					// ======================================================================
					Timezone: {
						Scheme: '/:term(.+)/',
						Limits: ["Constant/Second"],
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query (cls) {
							var TZone = Object.keys(TZ.zones), 
								pgx   = /[^\d]/g, tgx = /(\[|[.({/})?+]|\])/g,
								term  = new RegExp(`^(.*)(${cls.Term.replace(tgx,'\\$1')})(.*)$`),
								page  = Number(cls.Page .replace(pgx,'')),
								limit = Number(cls.Limit.replace(pgx,''));
							return [ null,
								TZone	.filter(v=>!!v.match(term))
										.map(v=>({ m: v.match(term), k: v }))
										.map(v=>({ m: v.m[1]+v.m[3], k: v.k }))
										.sort((a,b)=>{ switch (true) {
											case a.m < b.m: return -1;
											case a.m > b.m: return  1;
											default:		return  0;
										};	}).map(v=>v.k).slice(page,limit)
							];
						},
						Params: {
							Term: {
								Default: '',
								Format 	(cls) { return cls.term; },
								Desc: 	{
									description: "A {{Search Term}} for the {{Timezone}}",
									type: "Text", to: 'param', required: true, matches: {
										'Timezone': 'Matches the {{Timezone}}, unless omitted ((\\b[A-z0-9/+-]+\\b))',
									},
								}
							},
							Page: true, Limit: true, ID: true
						},
						Links: 	[],
						Key: ''
					},
					// ======================================================================
					Search: {
						Scheme: '/(:term([\\w\\d,;.-]+)(?:/:in((?:(?:city|region|country)(?=;|$))*))?)/',
						Limits: ["Constant/Second"],
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:account:ajohnson": "Displays the {{Users}} with a {{User Name}} of 'ajohnson'",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: 	scqry('LC', [
									"SELECT   s.id AS value, s.label, '' AS description,",
									"         MATCH(s.city,s.region,s.country)",
									"         AGAINST (':TERM:' IN BOOLEAN MODE) AS score,",
									"         s.len",
									"FROM     search_locale s",
									"WHERE    MATCH(s.city,s.region,s.country)",
									"         AGAINST (':TERM:' IN BOOLEAN MODE)",
									"LIMIT    10",
								], 'Lives in'),
						Params: {
							Term: sterm('Locale', 'param', true, {
								'City': 	'Matches the {{City}}, unless omitted (([A-z0-9,.-]+))',
								'Region': 	'Matches the {{Region}}, unless omitted (([A-z0-9,.-]+))',
								'Country': 	'Matches the {{Country}}, unless omitted (([A-z0-9,.-]+))',
							}), Page: true, Limit: true, ID: true
						},
						Links: 	[],
						Key: ''
					},
					// ======================================================================
					"/": {
						Scheme: '/:lids((?:\\d+)(?=;|$))?/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:lid:312844": "Displays the {{Locale}} at the {{LID}}, 312844 (Calgary, Alberta, Canada)",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Locales}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT s.id AS value, CONCAT_WS(', ',",
							"           COALESCE(NULLIF(s.city,   ''),NULL),",
							"           COALESCE(NULLIF(s.region, ''),NULL),",
							"           COALESCE(NULLIF(s.country,''),NULL)",
							"       ) AS label",
							"FROM   search_locale s",
							"WHERE  true :LIDS:",
							":LIMIT: :PAGE:",
						],
						Params: { LIDs: true, Page: true, Limit: true, ID: true },
						Links: 	[]
					}
				},
				Errors: 	{ BAD_REQ: [
					'/',
					'/search/',
					'/search/city',
					'/search/region',
					'/search/country'
				] }
			},
			Hobbies: 		{
				Actions: 	{
					// ======================================================================
					Locale: {
						Scheme: '/((?:/:lid(\\d(?:[\\d;]+))/:hids(\\d(?:[\\d;]+))|/:hids(\\d(?:[\\d;]+)))?)/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14/:hid:1": "Returns the {{Users}} whose {{Hobbies}} match the {{HID}}, 1 in the same {{Locale}} as the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: 	[
							"SELECT     u.user_id,",
							`           ${SQL.SOCKET({link:'/user/:uids:%s', columns:['u.user_id']})} AS user`,
							"FROM      (SELECT * FROM users WHERE user_id = :UID:) AS o",
							"INNER JOIN user_profile_details AS d ON o.user_id   = d.user_fk",
							"INNER JOIN users                AS u ON u.user_id  <> :UID:",
							"                                    AND chkRadDist(u.location,:UID:,:LID:,:RADIUS:)",
							"INNER JOIN user_profile_details AS p ON u.user_id   = p.user_fk",
							"LEFT  JOIN user_visibilities    AS v ON u.user_id   = v.user_fk AND true",
							"INNER JOIN hobbies              AS h ON !(COALESCE(v.value,0) & 64)",
							"                                    :HIDS:",
							"                                    AND JSON_CONTAINS(",
							"                                            JSON_KEYS(p.profile_hobbies),",
							"                                            JSON_QUOTE(CONVERT(h.hobby_id,CHAR(5)",
							"                                        )))",
							"GROUP BY   u.user_id",
							":LIMIT: :PAGE:",
						],
						Params: { 
							HIDs: multi(
								'hids', 'Hobby', false, 'h.hobby_id', false, [
									"AND JSON_CONTAINS(",
									"        JSON_KEYS(d.profile_hobbies),",
									"        JSON_QUOTE(CONVERT(h.hobby_id,CHAR(5)",
									"    )))",
								].join(`\n${'    '.dup(10)}`)
							),	
							LID:  true, UID:   scuid(), Units: true, Radius: true, 
							Page: true, Limit: true,    ID:    true 
						},
						Links: 	[],
						Parse:  lcale(),
						Key: 	'user_id'
					},
					// ======================================================================
					Search: {
						Scheme: '/:term([\\w\\d,;.-]+)/',
						Limits: ["Constant/Second"],
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:term:basketball": "Displays the {{Hobbies}} with a {{Hobby Name}} matching 'basketball'",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Hobbies}} results per {{Page}}",
							},
						},
						Query: 	scqry('HB', [
									"SELECT   h.hobby_id   AS value,",
									"         h.hobby_name AS label,",
									"         h.hobby_type AS description,",
									"         MATCH(h.hobby_name) AGAINST",
									"         (':TERM:' IN BOOLEAN MODE) AS score,",
									"         h.len",
									"FROM     hobbies h",
									"WHERE    MATCH(h.hobby_name) AGAINST",
									"         (':TERM:' IN BOOLEAN MODE)",
									"LIMIT    10",
								], 'Likes'),
						Params: {
							Term: sterm('Hobby Name', 'param', true, {
								'Hobby Name':'Matches the name of the {{Hobby}}, (([A-z0-9,.-]+))',
							}),	Page: true, Limit: true, ID: true
						},
						Links: 	[],
						Key: ''
					},
					// ======================================================================
					"/": {
						Scheme: '/:hids((?:\\d+)(?=;|$))?/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:hid:3;4": "Returns the {{Hobby}} at the {{HIDs}}, 3 and 4",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Hobbies}} results per {{Page}}",
							},
						},
						Query: 	[
							"SELECT   h.hobby_id   AS value,",
							"         h.hobby_name AS label,",
							"         h.hobby_type AS type",
							"FROM     hobbies h",
							"WHERE    true :HIDS:",
							":LIMIT: :PAGE:",
						],
						Params: { HIDs: true, Page: true, Limit: true, ID: true },
						Links: 	[]
					}
				},
				Errors: 	{ BAD_REQ: ['/'] }
			},
			Languages: 		{
				Actions: 	{
					// ======================================================================
					Locale: {
						Scheme: '/((?:/:lid(\\d(?:[\\d;]+))/:lgids(\\d(?:[\\d;]+))|/:lgids(\\d(?:[\\d;]+)))?)/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								":lgid:1?uid=14": "Returns the {{Users}} whose {{Languages}} match the {{LGID}}, 1, in the same {{Locale}} as the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: 	[
							"SELECT     u.user_id,",
							`           ${SQL.SOCKET({link:'/user/:uids:%s', columns:['u.user_id']})} AS user`,
							"FROM      (SELECT * FROM users WHERE user_id = :UID:) AS o",
							"INNER JOIN user_profile_details AS d ON o.user_id  = d.user_fk",
							"INNER JOIN users                AS u ON u.user_id  <> :UID:",
							"                                    AND chkRadDist(u.location,:UID:,:LID:,:RADIUS:)",
							"INNER JOIN user_profile_details AS p ON u.user_id  = p.user_fk",
							"LEFT  JOIN user_visibilities    AS v ON u.user_id  = v.user_fk AND true",
							"INNER JOIN languages            AS l ON !(COALESCE(v.value,0) & 128)",
							"                                    :LGIDS:",
							"                                    AND JSON_CONTAINS(",
							"                                            JSON_KEYS(p.profile_languages),",
							"                                            JSON_QUOTE(CONVERT(l.language_id,CHAR(5)",
							"                                        )))",
							"GROUP BY   u.user_id",
							":LIMIT: :PAGE:"
						],
						Params: { 
							LGIDs: multi(
								'lgids', 'Language', false, 'l.language_id', false, [
									"AND JSON_CONTAINS(",
									"        JSON_KEYS(d.profile_languages),",
									"        JSON_QUOTE(CONVERT(l.language_id,CHAR(5)",
									"    )))",
								].join(`\n${'    '.dup(10)}`)
							),	
							LID:  true, UID:   scuid(), Units: true, Radius: true, 
							Page: true, Limit: true,    ID:    true 
						},
						Links: 	[],
						Parse:  lcale(),
						Key: 	'user_id'
					},
					// ======================================================================
					Search: {
						Scheme: '/:term([\\w\\d,;.-]+)/',
						Limits: ["Constant/Second"],
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:term:basketball": "Displays the {{Languages}} with a {{Language Name}} matching 'basketball'",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Languages}} results per {{Page}}",
							},
						},
						Query: 	scqry('LG', [
									"SELECT   l.language_id   AS value,",
									"         l.language_name AS label,",
									"                      '' AS description,",
									"         MATCH(l.language_name) AGAINST",
									"         (':TERM:' IN BOOLEAN MODE) AS score,",
									"         l.len",
									"FROM     languages l",
									"WHERE    MATCH(l.language_name) AGAINST",
									"         (':TERM:' IN BOOLEAN MODE)",
									"GROUP BY l.language_name",
									"LIMIT    10",
								], 'Speaks'),
						Params: {
							Term: sterm('Language Name', 'param', true, {
								'Language Name':'Matches the name of the {{Language}}, (([A-z0-9,.-]+))',
							}),	Page: true, Limit: true, ID: true
						},
						Links: 	[],
						Key: ''
					},
					// ======================================================================
					"/": {
						Scheme: '/:lgids((?:\\d+)(?=;|$))?/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:hid:3;4": "Returns the {{Language}} at the {{LGIDs}}, 3 and 4",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Languages}} results per {{Page}}",
							},
						},
						Query: 	[
							"SELECT   l.language_id   AS value,",
							"         l.language_name AS label",
							"FROM     languages l",
							"WHERE    true :LGIDS:",
							":LIMIT: :PAGE:",
						],
						Params: { LGIDs: true, Page: true, Limit: true, ID: true },
						Links: 	[]
					}
				},
				Errors: 	{ BAD_REQ: ['/'] }
			},
			Nationalities: 	{
				Actions: 	{
					// ======================================================================
					Locale: {
						Scheme: '/((?:/:lid(\\d(?:[\\d;]+))/:nids(\\d(?:[\\d;]+))|/:nids(\\d(?:[\\d;]+)))?)/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:nid:1?uid=14": "Returns the {{Users}} whose {{Nationalities}} match the {{NID}}, 1, in the same {{Locale}} as the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: 	[
							"SELECT     u.user_id,",
							`           ${SQL.SOCKET({link:'/user/:uids:%s', columns:['u.user_id']})} AS user`,
							"FROM      (SELECT * FROM users WHERE user_id = :UID:) AS o",
							"INNER JOIN user_profile_details AS d ON o.user_id   = d.user_fk",
							"INNER JOIN users                AS u ON u.user_id  <> :UID:",
							"                                    AND chkRadDist(u.location,:UID:,:LID:,:RADIUS:)",
							"INNER JOIN user_profile_details AS p ON u.user_id   = p.user_fk",
							"LEFT  JOIN user_visibilities    AS v ON u.user_id   = v.user_fk AND true",
							"INNER JOIN nationalities        AS n ON !(COALESCE(v.value,0) & 256)",
							"                                    :NIDS:",
							"                                    AND JSON_CONTAINS(",
							"                                         p.profile_nationalities,",
							"                                         n.nationality_id)",
							"GROUP BY   u.user_id",
							":LIMIT: :PAGE:",
						],
						Params: { 
							NIDs: multi(
								'nids', 'Nationality', false, 'n.nationality_id', false, [
									"AND JSON_CONTAINS(",
									"     d.profile_nationalities,",
									"     n.nationality_id)",
								].join(`\n${'    '.dup(10)}`)
							),	
							LID:  true, UID:   scuid(), Units: true, Radius: true, 
							Page: true, Limit: true,    ID:    true 
						},
						Links: 	[],
						Parse:  lcale(),
						Key: 	'user_id'
					},
					// ======================================================================
					Search: {
						Scheme: '/:term([\\w\\d,;.-]+)/',
						Limits: ["Constant/Second"],
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:term:canadian": "Displays the {{Nationalities}} with a {{Nationality Name}} matching 'canadian'",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Nationalities}} results per {{Page}}",
							},
						},
						Query: 	scqry('NL', [
									"SELECT   n.nationality_id      AS value,",
									"         n.nationality_name    AS label,",
									"         n.nationality_country AS description,",
									"         MATCH(n.nationality_name) AGAINST",
									"         (':TERM:' IN BOOLEAN MODE) AS score,",
									"         n.len",
									"FROM     nationalities n",
									"WHERE    MATCH(n.nationality_name) AGAINST",
									"         (':TERM:' IN BOOLEAN MODE)",
									"LIMIT    10",
								], 'Is'),
						Params: {
							Term: sterm('Nationality Name', 'param', true, {
								'Nationality Name':'Matches the name of the {{Nationality}}, (([A-z0-9,.-]+))',
									'Country Name':'Matches the name of the {{Nation}} itself, (([A-z0-9,.-]+))',
							}),	Page: true, Limit: true, ID: true
						},
						Links: 	[]
					},
					// ======================================================================
					"/": {
						Scheme: '/:nids((?:\\d+)(?=;|$))?/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:hid:3;4": "Returns the {{Nationality}} at the {{NIDs}}, 3 and 4",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Nationalities}} results per {{Page}}",
							},
						},
						Query: 	[
							"SELECT   n.nationality_id          AS value,",
							"         n.nationality_name        AS label",
							"FROM     nationalities n",
							"WHERE    true :NIDS:",
							":LIMIT: :PAGE:",
						],
						Params: { NIDs: true, Page: true, Limit: true, ID: true },
						Links: 	[]
					}
				},
				Errors: 	{ BAD_REQ: ['/'] }
			},
			Religions: 		{
				Actions: 	{
					// ======================================================================
					Locale: {
						Scheme: '/((?:/:lid(\\d(?:[\\d;]+))/:rids(\\d(?:[\\d;]+))|/:rids(\\d(?:[\\d;]+)))?)/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:rid:1?uid=14": "Returns the {{Users}} whose {{Religions}} match the {{RID}}, 1, in the same {{Locale}} as the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_id,",
							`           ${SQL.SOCKET({link:'/user/:uids:%s', columns:['u.user_id']})} AS user`,
							"FROM      (SELECT * FROM users WHERE user_id = :UID:) AS o",
							"INNER JOIN user_profile_details AS d ON o.user_id   = d.user_fk",
							"INNER JOIN users                AS u ON u.user_id  <> :UID:",
							"                                    AND chkRadDist(u.location,:UID:,:LID:,:RADIUS:)",
							"INNER JOIN user_profile_details AS p ON u.user_id   = p.user_fk",
							"LEFT  JOIN user_visibilities    AS v ON u.user_id   = v.user_fk AND true",
							"INNER JOIN religions            AS r ON !(COALESCE(v.value,0) & 512)",
							"                                    :RIDS:",
							"                                    AND r.religion_id = p.profile_religion",
							"GROUP BY   u.user_id",
							":LIMIT: :PAGE:",
						],
						Params: { 
							RIDs: multi(
								'rids', 'Religion', false, 'r.religion_id', false,
								'AND r.religion_id = d.profile_religion'
							),	
							LID:  true, UID:   scuid(), Units: true, Radius: true, 
							Page: true, Limit: true,    ID:    true 
						},
						Links: 	[],
						Parse:  lcale(),
						Key: 	'user_id'
					},
					// ======================================================================
					Search: {
						Scheme: '/:term([\\w\\d,;.-]+)/',
						Limits: ["Constant/Second"],
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:term:islam": "Displays the {{Religions}} with a {{Religion Name}} matching 'islam'",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Religions}} results per {{Page}}",
							},
						},
						Query: 	scqry('RL', [
									"SELECT   r.religion_id   AS value,",
									"         r.religion_name AS label,",
									"                      '' AS description,",
									"         MATCH(r.religion_name) AGAINST",
									"         (':TERM:' IN BOOLEAN MODE) AS score,",
									"         r.len",
									"FROM     religions r",
									"WHERE    MATCH(r.religion_name) AGAINST",
									"         (':TERM:' IN BOOLEAN MODE)",
									"LIMIT    10",
								], 'Practices'),
						Params: {
							Term: sterm('Religion Name', 'param', true, {
								'Religion Name':'Matches the name of the {{Religion}}, (([A-z0-9,.-]+))',
							}),	Page: true, Limit: true, ID: true
						},
						Links: 	[],
						Key: ''
					},
					// ======================================================================
					"/": {
						Scheme: '/:rids((?:\\d+)(?=;|$))?/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:hid:3;4": "Returns the {{Religion}} at the {{RIDs}}, 3 and 4",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Religions}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT   r.religion_id   AS value,",
							"         r.religion_name AS label",
							"FROM     r.religions",
							"WHERE    true :RIDS:",
							":LIMIT: :PAGE:",
						],
						Params: { RIDs: true, Page: true, Limit: true, ID: true },
						Links: 	[]
					}
				},
				Errors: 	{ BAD_REQ: ['/'] }
			},
			Orientations: 	{
				Actions: 	{
					// ======================================================================
					Locale: {
						Scheme: '/((?:/:lid(\\d(?:[\\d;]+))/:oids(\\d(?:[\\d;]+))|/:oids(\\d(?:[\\d;]+)))?)/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:oids:1?uid=14": "Returns the {{Users}} whose {{Orientation}} match the {{OID}}, 1, in the same {{Locale}} as the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_id,",
							`           ${SQL.SOCKET({link:'/user/:uids:%s', columns:['u.user_id']})} AS user`,
							"FROM      (SELECT * FROM users WHERE user_id = :UID:) AS o",
							"INNER JOIN user_profile_details AS d ON o.user_id   = d.user_fk",
							"INNER JOIN users                AS u ON u.user_id  <> :UID:",
							"                                    AND chkRadDist(u.location,:UID:,:LID:,:RADIUS:)",
							"INNER JOIN user_profile_details AS p ON u.user_id   = p.user_fk",
							"LEFT  JOIN user_visibilities    AS v ON u.user_id   = v.user_fk AND true",
							"INNER JOIN orients              AS o ON !(COALESCE(v.value,0) & 1024)",
							"                                    :OIDS:",
							"                                    AND o.orient_id = p.profile_orient",
							"GROUP BY   u.user_id",
							":LIMIT: :PAGE:",
						],
						Params: { 
							OIDs: multi(
								'oids', 'Orientations', false, 'o.orient_id', false,
								'AND o.orient_id = d.profile_orient'
							),	
							LID:  true, UID:   scuid(), Units: true, Radius: true, 
							Page: true, Limit: true,    ID:    true 
						},
						Links: 	[],
						Parse:  lcale(),
						Key: 	'user_id'
					},
					// ======================================================================
					Search: {
						Scheme: /:term([\\w\\d,;.-]+)/,
						Limits: ["Constant/Second"],
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:term:cisgender": "Displays the {{Orientations}} with a {{Orientation Name}} matching 'cisgender'",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Orientations}} results per {{Page}}",
							},
						},
						Query: 	scqry('OR', [
									"SELECT   o.orient_id          AS value,",
									"         o.orient_name        AS label,",
									"         o.orient_description AS description,",
									"         MATCH(o.orient_name) AGAINST",
									"         (':TERM:' IN BOOLEAN MODE) AS score,",
									"         o.len",
									"FROM     orients o",
									"WHERE    MATCH(o.orient_name) AGAINST",
									"         (':TERM:' IN BOOLEAN MODE)",
									"LIMIT    10",
								], 'Is'),
						Params: {
							Term: sterm('Orientation Name', 'param', true, {
								'Orientation Name':'Matches the name of the {{Orientation}}, (([A-z0-9,.-]+))',
							}),	Page: true, Limit: true, ID: true
						},
						Links: 	[],
						Key: ''
					},
					// ======================================================================
					"/": {
						Scheme: '/:oids((?:\\d+)(?=;|$))?/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:oids:3;4": "Returns the {{Orientation}} at the {{OIDs}}, 3 and 4",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Orientations}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT   o.orient_id          AS value,",
							"         o.orient_name        AS label,",
							"         o.orient_description AS description",
							"FROM     orients o",
							"WHERE    true :OIDS:",
							":LIMIT: :PAGE:",
						],
						Params: { OIDs: true, Page: true, Limit: true, ID: true },
						Links: 	[]
					}
				},
				Errors: 	{ BAD_REQ: ['/'] }
			},
			Genders: 		{
				Actions: 	{
					// ======================================================================
					Locale: {
						Scheme: '/((?:/:lid(\\d(?:[\\d;]+))/:gids(\\d(?:[\\d;]+))|/:gids(\\d(?:[\\d;]+)))?)/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:gids:1?uid=14": "Returns the {{Users}} whose {{Genders}} match the {{GID}}, 1, in the same {{Locale}} as the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_id,",
							`           ${SQL.SOCKET({link:'/user/:uids:%s', columns:['u.user_id']})} AS user`,
							"FROM      (SELECT * FROM users WHERE user_id = :UID:) AS o",
							"INNER JOIN user_profile_details AS d ON o.user_id   = d.user_fk",
							"INNER JOIN users                AS u ON u.user_id  <> :UID:",
							"                                    AND chkRadDist(u.location,:UID:,:LID:,:RADIUS:)",
							"INNER JOIN user_profile_details AS p ON u.user_id   = p.user_fk",
							"LEFT  JOIN user_visibilities    AS v ON u.user_id   = v.user_fk AND true",
							"INNER JOIN genders              AS g ON !(COALESCE(v.value,0) & 1024)",
							"                                    :GIDS:",
							"                                    AND g.gender_id = p.profile_identity",
							"GROUP BY   u.user_id",
							":LIMIT: :PAGE:",
						],
						Params: { 
							GIDs: multi(
								'gids', 'Gender', false, 'g.gender_id', false,
								'AND g.gender_id = d.profile_identity'
							),	
							LID:  true, UID:   scuid(), Units: true, Radius: true, 
							Page: true, Limit: true,    ID:    true 
						},
						Links: 	[],
						Parse:  lcale(),
						Key: 	'user_id'
					},
					// ======================================================================
					Search: {
						Scheme: '/:term([\\w\\d,;.-]+)/',
						Limits: ["Constant/Second"],
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:term:cisgender": "Displays the {{Genders}} with a {{Gender Name}} matching 'cisgender'",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Genders}} results per {{Page}}",
							},
						},
						Query: 	scqry('GD', [
									"SELECT   g.gender_id          AS value,",
									"         g.gender_name        AS label,",
									"         g.gender_description AS description,",
									"         MATCH(g.gender_name) AGAINST",
									"         (':TERM:' IN BOOLEAN MODE) AS score,",
									"         g.len",
									"FROM     genders g",
									"WHERE    MATCH(g.gender_name) AGAINST",
									"         (':TERM:' IN BOOLEAN MODE)",
									"LIMIT    10",
								], 'Identifies as'),
						Params: {
							Term: sterm('Gender Name', 'param', true, {
								'Gender Name':'Matches the name of the {{Gender}}, (([A-z0-9,.-]+))',
							}),	Page: true, Limit: true, ID: true
						},
						Links: 	[],
						Key: ''
					},
					// ======================================================================
					"/": {
						Scheme: '/:gids((?:\\d+)(?=;|$))?/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:gids:3;4": "Returns the {{Gender}} at the {{GIDs}}, 3 and 4",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Genders}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT   g.gender_id          AS value,",
							"         g.gender_name        AS label,",
							"         g.gender_description AS description",
							"FROM     genders g",
							"WHERE    true :GIDS:",
							":LIMIT: :PAGE:",
						],
						Params: { GIDs: true, Page: true, Limit: true, ID: true },
						Links: 	[]
					}
				},
				Errors: 	{ BAD_REQ: ['/'] }
			},
			Services: 		{
				Actions: 	{
					// ======================================================================
					Charge:   {
						Scheme: '/:term([^\\s\\d]{0,3}(\\d+(,\\d{2,3})*([.]\\d{2})?)?)/',
						Limits: ["Constant/Second"],
						Sub: 	['search'],
						Routes: ['search'],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:term:¥10,000": "Displays the {{Currency}} infomation for Japanese Yen ({{¥}})",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Currencies}} results per {{Page}}",
							},
						},
						Query:  /* scqry('VC',  */[
							"SELECT   COALESCE(S.score/S.len,0) AS score,   S.idx,  'For' AS verb,",
							"         CONCAT_WS(';', S.value, @CHARGE)     AS value, 'VC' AS tag,",
							"         CONCAT('VC@', CONCAT_WS('',S.label,@CHFORM), ' ', S.code)  AS label,",
							"         S.description",
							"FROM     (",
							"    SELECT   y.currency_id                 AS value,",
							"             y.currency_symbol             AS label,",
							"             y.currency_name               AS description,",
							"             y.currency_code               AS code,",
							"             @CHARGE                       AS charge,",
							"             (y.currency_symbol = @SYMBOL) AS score,",
							"             COALESCE(LENGTH(@SYMBOL),1)   AS len,",
							"             @CNT_CHG:=@CNT_CHG+1          AS idx",
							"    FROM     currencies y, (SELECT @CNT_CHG:=0,",
							"                 @ISCHRG:=(':TERM:' REGEXP '^[^\\s\\d]{0,3}[\\\\d,.]*$'),",
							"                 @SYMBOL:=REGEXP_REPLACE(':TERM:','[\\\\d,.]', ''),",
							"                 @CHARGE:=NULLIF(REGEXP_REPLACE(':TERM:','[^\\\\d.]', ''),''),",
							"                 @CHFORM:=NULLIF(REGEXP_REPLACE(':TERM:','[^\\\\d.,]',''),'')",
							"             ) c",
							"    WHERE    (@ISCHRG AND @SYMBOL = '')",
							"    OR       y.currency_symbol = @SYMBOL",
							"    LIMIT    10",
							") AS S",
							":LIMIT: :PAGE:",
						]/* , 'For') */,
						Params: {
							Term: sterm('Currency Name', 'param', true, {
								'Currency Name':'Matches the name of the {{Currency}}, (([^\\s\\d]{0,3}(\\d+(,\\d{2,3})*([.]\\d{2})?)?))',
							}),	Page: true, Limit: true, ID: true
						},
						Links: 	[],
						Key: ''
					},
					// ======================================================================
					Provider: {
						Scheme: '/:term([^\\s\\d]{0,3}(\\d+(,\\d{2,3})*([.]\\d{2})?)?)/',
						Limits: ["Constant/Second"],
						Sub: 	['search'],
						Routes: ['search'],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:term:DJ Frico": "Searches for the {{Provider Service}} whose {{Service Name}} or {{Service Description}} matches, '{{DJ}}'",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Provider Services}} results per {{Page}}",
							},
						},
						Query:  scqry('VD', [
									"SELECT   p.provider_svc_id    AS value,",
									"         p.provider_svc_name  AS label,",
									"         p.provider_svc_descr AS description,",
									"         MATCH(p.provider_svc_name,p.provider_svc_descr) AGAINST",
									"         (':TERM:' IN BOOLEAN MODE) AS score,",
									"         LENGTH(p.provider_svc_name) AS len",
									"FROM     user_provider_services p",
									"WHERE    MATCH(p.provider_svc_name,p.provider_svc_descr) AGAINST",
									"         (':TERM:' IN BOOLEAN MODE)",
									"LIMIT    10",
								], 'Runs'),
						Params: {
							Term: sterm('Provider Service', 'param', true, {
								'Service Name':'Matches the {{Name}} of the {{Provider Service}}, (([A-z0-9,/.-]+))',
								'Service Description':'Matches the {{Description}} of the {{Provider Service}}, (([A-z0-9,/.-]+))',
							}),	Page: true, Limit: true, ID: true
						},
						Links: 	[],
						Key: ''
					},
					// ======================================================================
					Currencies: {
						Scheme: '/:cids((?:\\d+)(?=;|$))?/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:cids:3;4": "Returns the {{Currency}} at the {{CIDs}}, 3 and 4",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Currencies}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT   y.currency_id     AS value, y.currency_symbol    AS label,",
							"         CONCAT(y.currency_name,' (',y.currency_code,')') AS description",
							"FROM     currencies y WHERE true :CIDS:",
							":LIMIT: :PAGE:",
						],
						Params: { CIDs: true, Page: true, Limit: true, ID: true },
						Links: 	[]
					},
					// ======================================================================
					Locale: {
						Scheme: '/((?:/:lid(\\d(?:[\\d;]+))/:sids(\\d(?:[\\d;]+))|/:sids(\\d(?:[\\d;]+)))?)/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14/:sids:1": "Returns the {{Providers}} whose {{Service Type}} match the {{SIDs}}, 1, in the same {{Locale}} as the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_id,",
							`           ${SQL.SOCKET({link:'/user/:uids:%s', columns:['u.user_id']})} AS user`,
							"FROM      (SELECT * FROM users WHERE user_id = :UID:) AS o",
							"INNER JOIN users                  AS u ON u.user_id           <> :UID:",
							"                                      AND chkRadDist(u.location, :UID:,:LID:,:RADIUS:)",
							"INNER JOIN user_provider_details  AS d ON u.user_id            = d.user_fk",
							"INNER JOIN user_provider_services AS s ON s.user_provider_fk   = d.provider_detail_id",
							"                                      AND s.provider_svc_type IN (':SIDS:')",
							"GROUP BY   u.user_id",
							":LIMIT: :PAGE:",
						],
						Params: { 
							SIDs:   true, LID:  true, UID:   scuid(), Units: true, 
							Radius: true, Page: true, Limit: true,    ID:    true 
						},
						Links: 	[],
						Parse:  lcale(),
						Key: 	'user_id'
					},
					// ======================================================================
					Search: {
						Scheme: '/:term([\\w\\d,;.-]+)/',
						Limits: ["Constant/Second"],
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:term:labour": "Displays the {{Service Type}} matching 'labour'",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Services}} results per {{Page}}",
							},
						},
						Query: 	scqry('VT', [
									"SELECT   t.service_id          AS value,",
									"         t.service_description AS label,",
									"                            '' AS description,",
									"         MATCH(t.service_description) AGAINST",
									"         (':TERM:' IN BOOLEAN MODE) AS score,",
									"         t.len",
									"FROM     services t",
									"WHERE    MATCH(t.service_description) AGAINST",
									"         (':TERM:' IN BOOLEAN MODE)",
									"LIMIT    10",
								], 'Provides'),
						Params: {
							Term: sterm('Service Type', 'param', true, {
								'Service Type':'Matches the name of the {{Gender}}, (([A-z0-9,.-]+))',
							}),	Page: true, Limit: true, ID: true
						},
						Links: 	[],
						Key: ''
					},
					// ======================================================================
					"/": {
						Scheme: '/:sids((?:\\d+)(?=;|$))?/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:sids:3;4": "Returns the {{Service Type}} at the {{SIDs}}, 3 and 4",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Service Types}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT   s.service_id AS value,",
							"         s.service_description AS label",
							"FROM     services s",
							"WHERE    true :SIDS:",
							":LIMIT: :PAGE:",
						],
						Params: { SIDs: true, Page: true, Limit: true, ID: true },
						Links: 	[]
					}
				},
				Errors: 	{ BAD_REQ: ['/'] }
			},
			Misc: 			{
				Actions: 	{
					// ======================================================================
					Search: {
						Scheme: '/:term([\\w\\d,;.-]+)/',
						Limits: ["Constant/Second"],
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:term:male": "Displays the {{Misc}} with a {{Misc Name}} matching 'male'",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Misc}} results per {{Page}}",
							},
						},
						Query:  scqry(['SX','MS','VR'], [
									"SELECT   m.misc_value       AS value,",
									"         m.misc_tag         AS tag,",
									"         m.misc_label       AS label,",
									"         m.misc_description AS description,",
									"         m.misc_verb        AS verb,",
									"         MATCH(m.misc_label) AGAINST",
									"         (':TERM:' IN BOOLEAN MODE) AS score,",
									"         m.len",
									"FROM     misc m",
									"WHERE    MATCH(m.misc_label) AGAINST",
									"         (':TERM:' IN BOOLEAN MODE)",
									"LIMIT    10",
								]),
						Params: {
							Term: sterm('Misc Name', 'param', true, {
								'Misc Name':'Matches the name of the {{Misc}}, (([A-z0-9,.-]+))',
							}),	Page: true, Limit: true, ID: true
						},
						Links: 	[],
						Key: ''
					},
					// ======================================================================
					"/": {
						Scheme: '/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{},
							Examples: 	{},
						},
						Query: [],
						Params: {},
						Links: 	[]
					}
				},
				Errors: 	{ BAD_REQ: ['/'] }
			},
			Signup: 		{
				Actions: 	{
					// ======================================================================
					Valid: {
						Scheme: '/:uid(\\d+)/',
						Limits: ['Tries/Day'],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{},
							Examples: 	{
								"/:uid:14": "Returns TRUE if the {{User}} with the {{UID}}, 14, is validated; otherwise, FALSE."
							},
						},
						Query: [
							"SELECT (CASE WHEN u.validated = 1",
							"             THEN 'true' ELSE 'false'",
							"       END) AS validated",
							"FROM   users u WHERE u.user_id = :UID:"
						],
						Params: { ID: true, UID: true },
						Parse  	(res) { return res[0].validated; }
					},
					// ======================================================================
					Validate: {
						Scheme: '/:md5([A-Fa-f0-9]+)/',
						Limits: ['Tries/Day'],
						Doc: 	{ 
							Methods: 	Docs.Kinds.GET, 
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{ "/:md5:a35f64aa9fb86ba2b556d7d585122a4a": 
								"Validates the new {{User}} account with the {{Validation Record}}, 'a35f64aa9fb86ba2b556d7d585122a4a'",
							}
						},
						Query: [
							"SET @VREC = (",
							"    SELECT  v.user_fk FROM user_validations v",
							"    WHERE   v.validation_auth = ':MD5:'",
							");",
							"UPDATE users u SET u.validated = 1 WHERE u.user_id = @VREC;",
							":/Signup/Valid:"
						],
						Params: { MD5: true },
						Parse  	(res) { return res[0].exists; }
					},
					// ======================================================================
					"/": {
						Scheme: '/',
						Limits: ['New/Day'],
						Doc: 	{ Methods: Docs.Kinds.POST, Examples: {} },
						Query: [
							"INSERT INTO users (",
							"    email_address, user_pass",
							") SELECT i.email, MD5(i.pass) FROM (",
							"    SELECT ':EEMAIL:'   AS email,",
							"           ':PASSWORD:' AS  pass,",
							"           ':CONFPASS:' AS  conf",
							") AS i WHERE NOT EXISTS(",
							"    SELECT u.user_id FROM users u ",
							"    WHERE  u.email_address = i.email",
							") AND NOT (",
							"    NULLIF(i.pass,'') OR NULLIF(i.conf,'')",
							") IS NULL AND i.pass = i.conf;",
							":/Exists/Email:"
						],
						Params: { 
							eEmail: true, 
							Password: pword(true, 'password'), 
							ConfPass: pword(true, 'confpass') 
						},
						Parse  	(res) { return res[0].exists; }
					}
				},
				Errors: 	{ BAD_REQ: ['/'] }
			},
			Exists: 		{
				Actions: 	{
					// ======================================================================
					Email: {
						Scheme: '/:email([\\w_.-]+@[\\w_.-]+\\.[A-z]+)/',
						Limits: ["Constant/Second"],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{},
							Examples: 	{
								"/:email:leshaun.j@mail.com": "Determines if the {{Email}}, 'leshaun.j@mail.com' is tied to a {{User}}",
							},
						},
						Query: [
							"SELECT (CASE WHEN EXISTS(",
							"	SELECT email_address FROM users",
							"	WHERE email_address = ':EMAIL:'",
							") THEN 'true' ELSE 'false' END) AS `exists`;"
						],
						Params: { ID: true, Email: true },
						Parse  	(res) { return res[0].exists; }
					},
					// ======================================================================
					Username: {
						Scheme: '/:username([\\w_.-]+)/',
						Limits: ["Constant/Second"],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{},
							Examples: 	{
								"/:username:LeShaunJ": "Determines if the {{Display Name}}, 'LeShaunJ' is tied to a {{User}}",
							},
						},
						Query: [
							"SELECT (CASE WHEN EXISTS(",
							"	 SELECT display_name FROM users",
							"	 WHERE display_name = ':USERNAME:'",
							") THEN 'true' ELSE 'false' END) AS `exists`;"
						],
						Params: { ID: true, Username: true },
						Parse  	(res) { return res[0].exists; }
					},
					// ======================================================================
					"/": {
						Scheme: '/:username([\\w_.-]+)|:email([\\w_.-]+@[\\w_.-]+\\.[A-z]+)/',
						Limits: ["Constant/Second"],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{},
							Examples: 	{
								"/:username:LeShaunJ": "Determines if the {{Display Name}}, 'LeShaunJ' is tied to a {{User}}",
								"/:email:leshaun.j@mail.com": "Determines if the {{Email}}, 'leshaun.j@mail.com' is tied to a {{User}}",
							},
						},
						Query: [
							":/Exists/Username:",
							":/Exists/Email:"
						],
						Params: { ID: true, Username: true, Email: true },
						Parse  	(res) { return (!!res.filter(v=>JSON.parse(v.exists)).length).toString(); }
					}
				},
				Errors: 	{ BAD_REQ: ['/'] }
			},
		};	
	};

/////////////////////////////////////////////////////////////////////////////////////////////
