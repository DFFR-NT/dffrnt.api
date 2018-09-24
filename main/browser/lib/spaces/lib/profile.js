
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
	Call: function(path, params, query, body, files) {
		return {
			Request: {
				method:	'GET',
				path: 	'/user',
				params: { account: path.replace(/^\//,'') },
				query:	Assign({},{single:true,links:true},query||{}),
				body:	body||{},
				files:	files||[]
			}, 
			Recursions: [
				['links','photos'		],
				['links','misc'			],
				['links','services'		],
				['links','hobbies'		],
				['links','languages'	],
				['links','nationalities'],
				['links','religion'		],
				['links','identity'		],
			],
		};
	},
	Build: function (Actions, Stores) {
		var THS = this;
		return function (res) {
			var dta = Imm.fromJS(THS.Data[0]()),
				mrg = Imm.fromJS(res);
			// -----
			res = dta.mergeDeepWith(
				function(o,n,k) { 
					return (IS(n)=='socket'?o||null:n);
				}, 	mrg
			).toJS();
			// -----
			var photos 			= res.photos||{},
				details 		= res.details||{},
				misc			= details.misc||{},
				description		= misc.description||'',
				education		= misc.education||{},
				institutions	= education.institutions,
				edudesc			= education.edudesc,
				hobbies			= details.hobbies,
				languages		= details.languages,
				nationalities	= details.nationalities,
				religion		= details.religion,
				identity		= details.identity||{},
				marital			= { 
									M: { value: 'M', label: 'Married'			},
									S: { value: 'S', label: 'Single'			},
									R: { value: 'R', label: 'In a Relationship'	},
								}[identity.marital],
				gender			= null, //identity.gender,
				orient			= identity.orient;

			function fnull(v) { return !!v; }
			
			// -----
			return Stores.App.singleton.updateStore({
				header:		{
					title: 	{
						cover: 	photos.cover,
						user:	{
							photo: 	photos.profile,
							uname: 	res.display_name,
							name: 	res.name,
							badges: [],
							locale: res.location.label,
							sex:	identity.sex,
							age: 	(
								res.birth_date ? Math.abs(new Date(
									new Date().getTime() - 
									new Date(res.birth_date)
										.getTime()
								).getUTCFullYear() - 1970): 0
							),
						},
					},
				},
				content: 	{
					built: 		true,
					nav: 		{},
					segments: 	{
						copy: [
							{	 // ABOUT ME
								tag:	{ from: 'Evectr', name: ['Content','Panel'] },
								props: 	{ 
									name:	'about',
									header: { label: 'About Me',  	icon: 'smile' },
									body:	[
										{
											tag:	'p',
											props:	{ className: 'text' },
											items: 	description.split(/\n/g),
										}, { tag: 'br' }, !!hobbies ? {
											tag:	{ 
												from: 'Evectr', name: ['Content','Multis'] 
											},
											props:	{ 
												name: 	'hobbies',
												kind:	'good',
												size:	 1,
												items: 	hobbies.map(function (v,k) {
													var url = '/hobbies/'+v.label;
													return Assign({},v,{
														href: url, level: {
															href: 	url+'/'+v.level,
															label:	v.level,
														}, more: Boolean(!!v.more)
													})
												}),
											},
										} : null,
									].filter(fnull),		
								}
							}, { // MY SERVICES
								tag:	{ 
									from: 'Evectr', name: ['Content','Panel'] 
								},
								props: 	{ 
									name:	'services',
									header: { label: 'My Services', icon: 'handshake' },
									body:	[],	
								}
							}, { // OTHER INFO
								tag:	{ 
									from: 'Evectr', name: ['Content','Panel'] 
								},
								props: 	{ 
									name:	'info',
									header: { label: 'Other Info',  icon: 'briefcase' },
									align: 	'gridPair',
									body:	[
										!!languages ? {
											tag:	{ 
												from: 'Evectr', name: ['Content','Multis'] 
											},
											props:	{ 
												name: 	'languages',
												align: 	'split',
												header:	{ label: 'Language' },
												kind:	'info',
												size:	 1,
												items: 	languages.map(function (v,k) {
													var url = '/languages/'+v.label;
													return Assign({},v,{
														href: url, level: {
															href: 	url+'/'+v.level,
															label:	v.level,
														}, more: Boolean(!!v.more)
													})
												}),
											},
										} : null, !!nationalities ? {
											tag:	{ 
												from: 'Evectr', name: ['Content','Multis'] 
											},
											props:	{ 
												name: 	'background',
												align: 	'split',
												header:	{ label: 'Background' },
												kind:	'info',
												size:	 1,
												items: 	nationalities.map(function (v,k) {
													return Assign({},v,{href: '/nationalities/'+v.label})
												}),
											},
										} : null, !!religion ? {
											tag:	{ 
												from: 'Evectr', name: ['Content','Multis'] 
											},
											props:	{ 
												name: 	'spirituality',
												align: 	'split',
												header:	{ label: 'Spirituality' },
												kind:	'nope',
												size:	 1,
												items: 	[
													Assign({},religion,{href:'/religion/'+religion.label}),
												],
											},
										} : null, !!(marital||orient||gender) ? {
											tag:	{ 
												from: 'Evectr', name: ['Content','Multis'] 
											},
											props:	{ 
												name: 	'status',
												align: 	'split',
												header:	{ label: 'Status' },
												kind:	'warn',
												size:	 1,
												items: 	[
													!!marital ? Assign({},marital,{href:'/marital/'+marital.label}) : null,
													!!orient  ? Assign({}, orient,{href: '/orient/'+ orient.label}) : null,
													!!gender  ? Assign({}, gender,{href: '/gender/'+ gender.label}) : null,
												].filter(fnull),
											},
										} : null, !!institutions ? {
											tag:	{ 
												from: 'Evectr', name: ['Content','List'] 
											},
											props:	{ 
												name: 	'education',
												align: 	'spread',
												style: 	'bare',
												header:	{ label: 'Education' },
												items: 	institutions.split(/\n/g),
											},
										} : null,  
									].filter(fnull),	
								}
							}, 
						],
						other: [
							{	 // ACHIEVEMENTS
								tag:	{ 
									from: 'Evectr', name: ['Content','Panel'] 
								},
								props: 	{ 
									kind:	'side',
									name:	'achievements',
									header: { label: 'Trust & Achievements',  icon: 'trophy' },
									align: 	'gridPair',
									body:	[
										{
											tag:	{ 
												from: 'Evectr', name: ['Trusts'] 
											},
											props:	{  
												shields: {
													items: ['identified','credential'],
												},
												rating:	 {
													rating:  4.5,
													strikes: 1,
													count: 	 525,
												},
											},
										}, 
									],	
								}
							}, { // COMMUNITY
								tag:	{ 
									from: 'Evectr', name: ['Content','Panel'] 
								},
								props: 	{ 
									kind:	'side',
									name:	'community',
									header: { label: 'My Community',  icon: 'users' },
									align: 	'gridPair',
									body:	[
										{
											tag:	{ 
												from: 'Evectr', name: ['Content','Person'] 
											},
											props:	{ 
												name: 	'Ben Ashton',
												img:	'public/images/profile.jpg',
												href:	'theBigBen',
											},
										}, {
											tag:	{ 
												from: 'Evectr', name: ['Content','Person'] 
											},
											props:	{ 
												name: 	'Marc Djoudi',
												img:	'public/images/profile.jpg',
												href:	'mdjoudi',
											},
										}, {
											tag:	{ 
												from: 'Evectr', name: ['Content','Person'] 
											},
											props:	{ 
												name: 	'Darren Sun',
												img:	'public/images/profile.jpg',
												href:	'dsun',
											},
										}, 
									],	
								}
							}, { // ACTIVITY
								tag:	{ 
									from: 'Evectr', name: ['Content','Panel'] 
								},
								props: 	{ 
									kind:	'side',
									name:	'activity',
									header: { label: 'Recent Activity',  icon: 'compress' },
									align: 	'spaced',
									body:	[
										{
											tag:	{ 
												from: 'Evectr', name: ['Content','Activity'] 
											},
											props:	{ 
												title: 	'Comment to Marc Djoudi',
												details:'Quae si potest singula consolando levare, universa quo modo sustinebit?',
											},
										}, {
											tag:	{ 
												from: 'Evectr', name: ['Content','Activity'] 
											},
											props:	{ 
												title: 	'Review for Darren Sun',
												details:'Praesertim cum in re publica princeps esse velles ad eamque tuendam cum summa tua dignitate maxime a nobis ornari atque instrui posses.',
											},
										}, 
									],	
								}
							}, 
						],
					}
				},
			}, true);
		}
	}
}
