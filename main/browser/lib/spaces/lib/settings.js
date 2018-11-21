
'use strict';

module.exports = {
	Data:  [
		function (path, req) { 
			return   {
				"user_id": 0,
				"display_name": "",
				"email_address": "",
				"name": { "first": "", "last": "" },
				"photos": {
					"profile": "",
					"cover": ""
				},
				"details": {
					"hobbies": null,
					"languages": null,
					"nationalities": null,
					"religion": null,
					"identity": {
						"sex": null,
						"marital": null,
						"gender": null,
						"orient": null,
					},
					"misc": {
						"description": null,
						"education": {
							"institutions": null,
							"description": null
						}
					}
				},
				"location": {
					"id": 0, "label": "",
					"codes": { "region": "", "country": "" }
				},
				"services": [],
				"checks": { "verified": 0, "status": 0, },
				"birth_date": "",
				"member_since": "",
			};
		},
	],
	Call: function(path, params, query, body, files, user) {
		return {
			method:	'GET',
			path: 	'/user',
			params: { uids: user.Scopes.user_id },
			query:	Assign({},{single:true,links:true},query||{}),
			body:	body||{},
			files:	files||[]
		};
	},
	Build: function (Actions, Stores) {
		var THS = this;
		return function (res) {
			var PNL 	= { from: 'Evectr', name: ['Content','Panel'	] },
				BLK 	= { from: 'Evectr', name: ['Content','Block'	] },
				NPUT 	= { from: 'Evectr', name: [   'Form','Xput'		] },
				CHKBOX 	= { from: 'Evectr', name: [   'Form','Checkbox'	] },
				SBMT 	= { from: 'Evectr', name: [   'Form','Button'	] },
				BR  	= { tag: 'br' },
				HR  	= { tag: 'hr', props: { className: 'MTB spread' } },
				SUBMIT 	= function SUBMIT(label, style, start, size) { 
					return {	
						tag:	'div',
						props:	{ className: [start||'one',size||'spread'].join(' ') },
						items: 	[{ 	
							tag:	SBMT,
							props:	{ 
								kind:	'submit',
								styles: [style||'info'],
								block:	 true,
								label:	 label||'Submit',
							},
					}]	
				};	},
				passpat = /[~{(\[!"#$%&'\w|*+,./\:;?@^_`\])}-]{8,}/,
				dta 	= Imm.fromJS(THS.Data[0]()),
				mrg 	= Imm.fromJS(res);
			// -----
			res = dta.mergeDeepWith(
				function(o,n,k) { 
					return (IS(n)=='socket'?o||null:n);
				}, 	mrg
			).toJS();
			// -----
			var photos 			= res.photos||{},
				settings 		= res.settings||{},
				email 			= settings.email,
				timezone 		= settings.timezone,
				language 		= settings.language,
				visibility		= 0,
				visivalue		= 'user-vis-value',
				visibilities 	= (settings.visibility||{})
									.map(function mapVis(v) { 
										var grp = 'user-vis', checked = eval(v.status);
										visibility += (checked?v.value:0);
										return {
											tag: 	'div', 
											props:	{ className: 'half' }, 
											items:  [{
												tag:	CHKBOX,
												props:	{
													id: 		[ grp, v.field ].join('-'),
													name:		  v.field,
													form: 		  grp,
													label:		  v.name+':',
													checked:	  checked,
													value:		  v.value,
													styles: 	['info-y','good-n'],
													yes:		 'Hidden', // ncon: '',
													no:			 'Public', // ycon: '',
													increment:	  visivalue,
													follows:	  v.follows||null,
											}	}]
									};	}),
				modes 			= settings.modes||{};
			// -----
			return Stores.App.singleton.updateStore({
				header:		{
					title: 	{
						cover: 	photos.cover,
						user:	{
							mode:	'edit',
							photo: 	photos.profile,
							uname: 	'',
							name: 	{ First: 'My', Last: 'Settings' },
							badges: [],
							locale: null,
							sex:	null,
							age: 	null,
						},
					},
				},
				content: 	{
					built: 		true,
					segments: 	{
						copy: [
							{ 	  // GENERAL
								tag:	PNL, props: 	{ 
									name:	'settings-general',
									header: { label: 'General',  icon: 'cog', subs: [
										{ name: 'user-modes',   label: 'User Mode' 	},
										{ name: 'user-general', label: 'General' 	},
									]	},
									align:	'gridSlice',
									form: 	{
										'id':			'user-other',
										'data-action': 	'/edit/settings',
										'method':		'PUT',
										'buttons':		[
											{ kind:'submit',label:'Update Settings',style:'norm' },
										],
									},
									body:	[
										{	tag:	BLK, props:  { 
												name: 	'user-modes', 
												header: { fixed: true, label: 'User Mode' },
												align:	'spread gridSlice',
												items: 	[
													!!!modes.provider ? { 	
														tag:	'div',
														props:	{ className: 'half' },
														items: 	[{
															tag:	{ from: 'Evectr', name: ['Form','Checkbox'] },
															props:	{
																id: 		'user-is-transactional',
																name: 		'eTransact',
																label:		'You are a Transactional User:',
																checked:	 Boolean(modes.transactional),
																value:		 1,
																styles: 	['norm-y','info-n'],
														}	}]
													} : null, 	
													{ 	tag:	'div',
														props:	{ className: 'half'+(!!modes.provider?' four':'') },
														items: 	[{
															tag:	{ from: 'Evectr', name: ['Form','Checkbox'] },
															props:	{
																id: 		'user-is-provider',
																name: 		'eProvider',
																label:		'You are a Service Provider:',
																checked:	 Boolean(modes.provider),
																value:		 1,
																styles: 	['good-y','info-n'],
														}	}]
													}, 
												]
										}	}, 
										{ 	tag:   'hr', props:  { className: 'spread' } }, 
										{	tag:	BLK, props:  { 
												name: 	'user-general', 
												header: { fixed: true, label: 'General' },
												align:	'spread gridSlice',
												items: 	[
													{ 	tag:	'div',
														props:	{ className: 'half' },
														items: 	[{	
															tag:	NPUT, props:	{
																id: 		'user-prefered-tz',
																name: 		'eTZone',
																icon:		'clock',
																placeholder:'Prefered Site Timezone',
																tokens:		[{ label: timezone, value: timezone }],
																limit:		 1,
																duplicate:	 true,
																data:		{
																	id:   		'user-prefered-tz-sgst', 
																	url:  		'/locale/timezone',
																	list: 		'/locale/timezone',
																},
														}	}]	
													},
													{ 	tag:	'div',
														props:	{ className: 'half' },
														items: 	[{
															tag:	NPUT, props:	{
																id: 		'user-prefered-lang',
																name: 		'eLang',
																icon:		'language',
																placeholder:'Prefered Site Language',
																tokens:		[{ label: language, value: language }],
																limit:		 1,
																duplicate:	 true,
																data:		{
																	id:   		'user-prefered-lang-sgst', 
																	url:  		'/search/for/languages',
																	list: 		'/get/languages',
																},
														}	}]	
													},
												],
											}
										},
										{ 	tag:   'hr', props:  { className: 'spread' } }, 
									]	
								}
							},	{ // PRIVACY
								tag:	PNL, props: 	{ 
									name:	'settings-privacy',
									header: { label: 'Privacy', icon: 'user-secret' },
									align:	'gridSlice',
									form: 	{
										'id':			 'user-privacy',
										'data-action': 	 '/edit/settings/visibility',
										'method':		 'PUT',
										'buttons':		[
											{ kind:'submit',label:'Update Privacy',style:'good',start:  'one',size:'half' },
											{ kind: 'reset',label: 'Reset Privacy',style:'warn',start:'seven',size:'half' },
										],
									},
									body:	[
										{ tag: BLK, props: { 
											name: 	'user-vis-note', 
											align:	'spread',
											items:	[
												{	tag: 	'p', props: { className: 'text spread' },
													items: 	[
														'This section allows you to select which parts of your Profile are allowed to be shown.',
												]	},
												{	tag: 	'p', props: { className: 'text spread' },
													items: 	[
														'Note that depending on you ', { tag: 'b', items: ['User-Status'] },' (',
														{ tag: 'span', props: { className: 'example' }, items: ['Service-Provider, Transactional'] },
														'), some items are required to be public. This is for Trust & Accountabiliy reasons. Please see our ',
														{ tag: 'a', items: ['Help Section'] }, ' for more information.',
												]	},
										]	}	}
									].concat(visibilities, [ 
										{ 	tag:	'input',
											props:	{
												type:		'hidden',
												name: 		'eVisibles',
												id: 		 visivalue,
												required:	 true,
												value:		 visibility,
										}	},	HR,
									]),	
								}
							},	{ // SECURITY
								tag:	PNL, props: 	{ 
									name:	'settings-security',
									header: { label: 'Security',  icon: 'fingerprint', subs: [
										{ name: 'user-email-change', label: 'Change Email' 		},
										{ name: 'user-pass-change',  label: 'Change Password' 	},
									]	},
									body:	[
										{	tag:	BLK, props:  { 
											name: 	'user-email-change', 
											header: { fixed: true, label: 'Change Your Email' },
											align:	'gridSlice',
											form: 	{
												'id':			'form-user-email',
												'data-action': 	'/edit/settings/email',
												'method':		'PUT',
												'buttons':		[
													{ kind:'submit',label:'Change Email',style:'nope',start:'nine',size:'third' },
												],
											},
											items: 	[
												{ 	tag:	'div',
													props:	{ className: 'most' },
													items: 	[{
														tag:	NPUT, props:	{
															id: 		'user-email',
															kind:		'email',
															name: 		'eEmail',
															icon:		'envelope',
															placeholder:'Email',
															value:		 email,
															priority:	'*',
															validate: 	{
																pattern: /[\w_.-]+@[\w.-]+\.[A-z]{2,}/,
																invalid: 'Come on, that Email is invalid...',
															},
														}
												}]	},
											]
										}	}, HR, 
										{	tag:	BLK, props:  { 
											name: 	'user-pass-change', 
											header: { fixed: true, label: 'Change Your Password' },
											align:	'gridSlice',
											form: 	{
												'id':			'form-user-password',
												'data-action': 	'/edit/settings/password',
												'method':		'PUT',
												'buttons':		[
													{ kind:'submit',label:'Change Password',style:'nope',start:'one',size:'spread' },
												],
											},
											items: 	[
												{ 	tag:	'div',
													props:	{ className: 'spread' },
													items: 	[{
														tag:	NPUT, props:	{
															id: 		'user-pass-current',
															kind:		'password',
															name: 		'Current',
															icon:		'key',
															placeholder:'Current Password',
															complete:	'password',
															priority:	'*',
															validate: 	{
																invalid: 'Obviously, you\'ll need to enter your Current Password...',
															},
														}
												}]	},
												{ 	tag:	'div',
													props:	{ className: 'half' },
													items: 	[{
														tag:	NPUT, props:	{
															id: 		'user-pass-new',
															kind:		'password',
															name: 		'Password',
															icon:		'lock-open',
															placeholder:'New Password',
															complete:	'new-password',
															priority:	'*',
															validate: 	{
																pattern: passpat,
																invalid: 'Must be 8+ characters. No spaces; nothing accented.',
															},
														}
												}]	},
												{ 	tag:	'div',
													props:	{ className: 'half' },
													items: 	[{
														tag:	NPUT, props:	{
															id: 		'user-pass-confirm',
															kind:		'password',
															name: 		'ConfPass',
															icon:		'lock',
															placeholder:'Confirm Password',
															complete:	'new-password',
															priority:	'*',
															validate: 	{
																pattern: passpat,
																invalid: 'This doesn\'t match the other Password.',
															},
														}
												}]	},
											]
										}	}, 
									]
								}
							}, 
						],
						other: [
							{ 	 // TIPS
								tag:	PNL, props: 	{ 
									kind:	'side',
									name:	'tips',
									header: { label: 'Tips',  icon: 'info-circle' },
									align: 	'gridPair',
									body:	[],	
								}
							},
						],
					}
				},
			}, true);
		}
	}
}
