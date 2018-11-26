
'use strict';

module.exports = {
	Data:  		[ 
		function (path, req) { return {}; }, 
	],
	Redirect: 	'settings#user-modes',
	Call: 		function(path, params, query, body, files, user) {
		return {
			method:	'GET',
			path: 	'/user',
			params: { uids: user.Scopes.user_id },
			query:	Assign({},{
						single:true,
						links:['photos','services','settings'],
					}, 	query||{}),
		};
	},
	Build: 		function (Actions, Stores) {
		var THS = this;
		return function (res) {
			var fnull 	  = function(v) { return !!v; },
				PNL 	  = { from: 'Evectr', name: ['Content','Panel'] },
				SVC 	  = { from: 'Evectr', name: ['Service'] },
				RAD  	  = { tag: 'input', props:{id:'closeSvc',name:'svcs',className:'reveal'}},
				BR  	  = { tag: 'br' },
				pdid 	  = res.provider_id,
				photos 	  = res.photos||{},
				services  = res.services||[],
				settings  = res.settings||{},
				modes	  = settings.modes||{},
				provider  = !!modes.provider;
			// -----
			if (!provider) throw new Error('Not a Service Provider');
			// -----
			return Stores.App.singleton.updateStore({
				header:		{
					title: 	{
						cover: 	photos.cover,
						user:	{
							mode:	'edit',
							photo: 	photos.profile,
							uname: 	'',
							name: 	{ First: 'My', Last: 'Services' },
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
							!!services.length ? { // MY SERVICES
								tag: PNL, props: { 
									name:		'services',
									accordian: 	true,
									header: 	{ label: 'Edit Services', icon: 'edit' },
									body:		services.map(function(s){ return {
													tag: SVC, props: Assign({},s,{
														editable: true,
												})	}; })
								}
							} : null, { 		  // ADD NEW SERVICE
								tag: PNL, props: { 
									name:	'add-service',
									header: { label: 'Add a Service', icon: 'folder-plus' },
									align:	'gridSlice',
									form: 	{
										'id':			'add-service-form',
										'data-action': 	'/add/services/'+pdid,
										'method':		'POST',
										'buttons':		[
											{ kind:'submit',label:'Add Service',style:'norm' },
										],
									},
									body:	[
										{ 	tag:	'div',
											props:	{ className: 'spread' },
											items: 	[{
												tag:	{ from: 'Evectr', name: ['Form','Xput'] },
												props:	{
													id: 		'svc-name',
													name: 		'SvcName',
													icon:		'sign',
													kind:		'text',
													placeholder:'Service Name',
													priority:	'*',
													validate: 	{
														pattern: /[\w &|\/:;'"#@!?+,.-]+/,
														invalid: 'Please specify a valid Service Name.',
													},
												}
										}]	},
										{ 	tag:	'div',
											props:	{ className: 'more' },
											items: 	[{
												tag:	{ from: 'Evectr', name: ['Form','Select'] },
												props:	{
													id: 		'svc-type',
													name:		'SvcType',
													icon:		'barcode',
													title:		'Select a Service Type',
													priority:	'*',
													options:	[],
													data:		{ url: '/get/services', id: 'select-type' },
										}	}	]	},
										{ 	tag:	'div',
											props:	{ className: 'eight some' },
											items: 	[{
												tag:	{ from: 'Evectr', name: ['Form','Select'] },
												props:	{
													kind:		'slc-txt',
													id: 		'svc-rate',
													name:		'SvcRate',
													icon:		'dollar-sign',
													reverse:	 true,
													title:		'Rate',
													priority:	'*',
													options:	[],
													data:		{ url: '/get/rate', id: 'select-rate' },
													input:			{
														kind: 		'number',
														id: 		'svc-charge',
														name:		'SvcCharge',
														placeholder:'0.00',
														min:		'0.00',
														max:		'10000.00',
														step:		'0.01',
														validate: 	{
															pattern: /\d{1,5}\.\d{2}/,
															invalid: 'That price ain\'t legit',
														},
													},
										}	}	]	},
										{ 	tag:	'div',
											props:	{ className: 'spread' },
											items: 	[{
												tag:	{ from: 'Evectr', name: ['Form','Area'] },
												props:	{
													id: 		'svc-descr',
													name:		'SvcDescr',
													icon:		'newspaper',
													rows:		 3,
													priority:	'*',
													placeholder:'Use this to provide as many details as possible regarding your Service. This can contain any Rules or Restrictions, Hours of Preparation, etc.',
												}
										}]	}, 
									],	
								}
							}, 
						].filter(fnull),
						other: [
							{	 // ACHIEVEMENTS
								tag: PNL, props: { 
									kind:	'side',
									name:	'achievements',
									header: { label: 'Trust & Achievements', icon: 'trophy' },
									align: 	'gridPair',
									body:	[
										{	tag:	{ from: 'Evectr', name: ['Trusts'] },
											props:	{  
												shields: {
													items: ['identified','credential'],
												},
												rating:	 {
													rating:  4.5,
													strikes: 1,
													count: 	 525,
										},	},	}, 
									],	
								}
							}, { // STATISTICS
								tag: PNL, props: { 
									kind:	'side',
									name:	'statistics',
									header: { label: 'My Stats', icon: 'chart-line' },
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
