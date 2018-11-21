
'use strict';

module.exports = {
	Data:  [
		function (path) { 
			return { copy: [], other: [] };
		},
	],
	Call: function(path, params, query, body, files, user) {
		return {
			method:	'GET',
			path: 	'/static',
			params: { name: path.replace(/^\//,'') },
			query:	 query||{},
			body:	 body||{},
			files:	 files||[]
		};
	},
	Build: function (Actions, Stores) {
		return function (res) {
			// -----
			return Stores.App.singleton.updateStore({
				content: 	{
					built: 		true,
					segments: 	{
						sidebar: 	res.sidebar,
						copy: 		res.copy,
						other:		res.other,
					}
				},
			}, true);
		}
	}
}
