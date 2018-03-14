
'use strict';

module.exports = {
	Data:  function () { return {}; },
	Build: function (Actions, Stores) {
		return function (res) {
			var THS = this, btnOnClick = function (e) {
					Actions.Nav.select(this.state.page);
					return false;
				}, nav = {}, buttons = {}, pages = {}, styles = [];

			nav = { '/clients': { page: 1, path: '/clients' }, };
			buttons = {
				'Clients': {
					form: "FrmClients",
					id: "SpcClients",
					key: "SpcClients",
					level: 1,
					name: "Clients",
					onClck: btnOnClick,
					page: 1,
					path: "/clients",
					root: "Clients",
					subs: {}
				},
			};
			pages = {
				'/clients': {
					page: 	 1,
					items: 	[{
							tag: 	'Search',
							props: 	 {
								act: 		'/clients',
								key: 		"FrmClients",
								id: 		"FrmClients",
								name: 		"Clients",
								paths: 		['clients'],
								page: 		1,
								method:  	'GET',
								body: 		{
									headers: 	{},
									params: 	{
										Search: {
											'default': "",
											description: "A semi-colon-separated list of search terms",
											matches: {
												"Brand Name ": "Matches ANY {{STRING}} Search Term  (([A-Za-z0-9 ,-]+))",
												"Client ID ": "Matches ONE of the Search Terms (([0-9]+))",
												"Client Name ": "Matches ANY {{STRING}} Search Term  (([A-Za-z0-9 ()]+))",
												"Client Text ID ": "Matches ANY {{STRING}} Search Term  (([A-Za-z0-9-_]+))",
												"Hotel Code ": "Matches ONE of the Search Terms (([A-Za-z0-9-_]+))",
												"IP Address ": "Matches ANY {{IP}} Search Term (([1-][0-9]{,2}(.[0-9]{1,3}){3}))",
												"Navision Code ": "Matches ONE of the Search Terms ((C[0-9]{5,}))",
											},
											required: true,
											to: "param",
											type: {
												List: "Text",
												Separator: ";"
											}
										}
									},
									fills: 		{ Search: '' },
									list: 	{
										1: {
											name: "(DO NOT USE) Demo Hotel"
										}
									}
								},
								'data-point': '/clients',
							},
						}, {
							tag: 	'JSONP',
							props: 	{
								id: 	 Stores.Data.setPath('/clients'),
								page: 	 1,
								content: {}
							}
					}]
				},
			}
			styles = styles.concat(THS.getMainStyle({
				PATH: ['clients'], NAME: 'Clients', PAGE: 1, ROOT: 'Clients'
			}));

			Stores.App.updateStore({
				page: 		{ num: 1, pth: ['Clients'] },
				styles: 	THS.getSortStyle(styles),
				content: 	{
					built: 		true,
					nav: 		nav,
					segments: 	[
						{
							tag: 	'SideBar',
							props: 	{
								name: 	'requests',
								items: 	 buttons
							}
						}, {
							tag: 	'Pages',
							props: 	 {
								name: 	'queries',
								items: 	 pages,
							}
						}
					]
				}
			});

			setTimeout(function () {
				var end = '/hotels/all', req = {
						headers: {
							token: Stores.App.store.toJS().header.user.Token
						}, params: {}, query: {
							at: ['payload','result'],
							id: 'FrmClients',
							limit: 1000, page: 1,
							to: ['payload']
					} 	};
				Actions.Data.send(end, req);
				setTimeout(function () {
					Actions.Data.send(end, req);
				}, 2000)
			}, 1000)
		}
	}
}
