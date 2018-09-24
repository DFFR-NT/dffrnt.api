
'use strict';

module.exports = {
	Data:  [
		function (path, req) { return {}; },
	],
	Build: function (Actions, Stores) {
		return function (res) {
			// -----
			return Stores.App.singleton.updateStore({
				content: 	{
					built: 		true,
					nav: 		{},
					segments: 	{
						copy: 	[
							{	 // SEARCH RESULTS
								tag:	{ from: 'Evectr', name: ['Content','Panel'] },
								props:	{ 
									name:	'results',
									header: { label: '4 People Found',  icon: 'search' },
									body: 	[
										{
											tag:	{ 
												from: 'Evectr', name: ['Plaque','Stub'] 
											},
											props:	{
												Account: 'dsun',
												Photo: 	  'public/images/profile.jpg',
												Name: 	  { First: 'Darren', Last: 'Sun' },
												Badges:	  [
													{ kind: 'norm', icon: 'handshake' 	},
													{ kind: 'good', icon: 'shield-alt' 	},
												],
												Age: 	   32,
												Sex: 	  'M',
												Location: { City: 'Calgary', Region: 'Alberta', Country:'Canada' },
												Multis: 	[
													{ 
														kind:	'nope',
														label:	'Catholic',
														value:	 5,
													}, { 
														kind:	'warn',
														label:	'Single',
														value:	'S',
													}, { 
														kind:	'good',
														label:	'Digital arts',
														value:	 10,
													}, { 
														kind:	'info',
														label:	'Canadian',
														value:	 40,
													}, { 
														kind:	'info',
														label:	'Cambodian',
														value:	 78,
													}, 
												],
											},
										}, {
											tag:	{ 
												from: 'Evectr', name: ['Plaque','Stub'] 
											},
											props:	{
												Account: 'mdjoudi',
												Photo: 	  'public/images/profile.jpg',
												Name: 	  { First: 'Marc', Last: 'Djoudi' },
												Badges:	  [
													{ kind: 'norm', icon: 'handshake' 	},
													{ kind: 'good', icon: 'shield-alt' 	},
												],
												Age: 	   32,
												Sex: 	  'M',
												Location: { City: 'Calgary', Region: 'Alberta', Country:'Canada' },
												Multis: 	[
													{ 
														kind:	'good',
														label:	'Computer programming',
														value:	 5,
													}, { 
														kind:	'good',
														label:	'Acting',
														value:	 1,
													}, { 
														kind:	'info',
														label:	'Canadian',
														value:	 40,
													}, { 
														kind:	'info',
														label:	'Algerian',
														value:	 78,
													}, 
												],
											},
										}, {
											tag:	{ 
												from: 'Evectr', name: ['Plaque','Stub'] 
											},
											props:	{
												Account: 'LeShaunJ',
												Photo: 	  'public/images/profile.jpg',
												Name: 	  { First: 'Arian', Last: 'Johnson' },
												Badges:	  [
													{ kind: 'norm', icon: 'handshake' 	},
													{ kind: 'good', icon: 'shield-alt' 	},
												],
												Age: 	   32,
												Sex: 	  'M',
												Location: { City: 'Calgary', Region: 'Alberta', Country:'Canada' },
												Multis: 	[
													{ 
														kind:	'info',
														label:	'Canadian',
														value:	 40,
													}, { 
														kind:	'info',
														label:	'Vincentian',
														value:	 78,
													}, { 
														kind:	'nope',
														label:	'Agnostic',
														value:	 5,
													}, { 
														kind:	'warn',
														label:	'Married',
														value:	'M',
													},  {
														kind:	'good',
														label:	'Digital arts',
														level:	 { label: 8 },
														value:	 10,
													}, { 
														kind:	'good',
														label:	'Basketball',
														more:	'spectative',
														value:	 20,
													}, { 
														kind:	'good',
														label:	'Acting',
														value:	 1,
													}, { 
														kind:	'good',
														label:	'Computer programming',
														value:	 5,
													}, 
												],
											},
										}, {
											tag:	{ 
												from: 'Evectr', name: ['Plaque','Stub'] 
											},
											props:	{
												Account: 'theBigBen',
												Photo: 	  'public/images/profile.jpg',
												Name: 	  { First: 'Ben', Last: 'Ashton' },
												Badges:	  [
													{ kind: 'norm', icon: 'handshake' 	},
													{ kind: 'good', icon: 'shield-alt' 	},
												],
												Age: 	   33,
												Sex: 	  'M',
												Location: { City: 'Calgary', Region: 'Alberta', Country:'Canada' },
												Multis: 	[
													{ 
														kind:	'good',
														label:	'Digital arts',
														value:	 10,
													}, { 
														kind:	'good',
														label:	'Basketball',
														value:	 20,
													}, { 
														kind:	'info',
														label:	'Canadian',
														value:	 40,
													}, { 
														kind:	'info',
														label:	'Vincentian',
														value:	 78,
													}, { 
														kind:	'nope',
														label:	'Agnostic',
														value:	 5,
													}, 
												],
											},
										}, 
									],
								},
							},
						],
						other: 	[
							{ 	 // COMMUNITY
								tag:	{ from: 'Evectr', name: ['Content','Panel'] },
								props: 	{ 
									kind:	'side',
									name:	'filter',
									header: { label: 'Filters',  icon: 'filter' },
									align: 	'spaced',
									body:	[],	
								}
							}, { // TIPS & TRICKS
								tag:	{ from: 'Evectr', name: ['Content','Panel'] },
								props: 	{ 
									kind:	'side',
									name:	'tips-tricks',
									header: { label: 'Tip & Tricks',  icon: 'info-circle' },
									align: 	'spaced',
									body:	[
										{
											tag:	{ 
												from: 'Evectr', name: ['Content','Activity'] 
											},
											props:	{ 
												title: 	'Search for Exact Matches:',
												details:'Quae si potest singula consolando levare, universa quo modo sustinebit?',
											},
										}, {
											tag:	{ 
												from: 'Evectr', name: ['Content','Activity'] 
											},
											props:	{ 
												title: 	'Omit Certain Criteria:',
												details:'Praesertim cum in re publica princeps esse velles ad eamque tuendam cum summa tua dignitate maxime a nobis ornari atque instrui posses.',
											},
										}, 
									],
								}
							}, 
						]
					}
				},
			}, true);
		}
	}
}
