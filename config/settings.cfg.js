
module.exports = {
	Debug: 	true,
	Port: 	3001,
	Public: {
		Folder:  'public',
		Age: 	 365*86400,
		Matcher: /\?(?:\w+=.+)$/,
		Headers: null,
	},
	Session: {
		Secret: "jy24xsFDWU5jYnZ2MNFmtCvJOhcDoxlL",
		Age: 	(((1000*60*60)*24)*30),
		REDIS: 	{
			Host: 		'localhost',
			Port: 		6379,
			Password: 	'Pion33r247',
		},
		Auth: {
			Flush: 	false,
			SQL: 	{
				Login: 	 "SELECT email_address, user_pass FROM users WHERE email_address = ?",
				Profile: "SELECT * FROM users WHERE email_address = ?"
			},
			Format: {
				Account: 'email_address',
				Profile: "*",
				Scopes: [
					'user_id',
					'display_name',
					'email_address',
					'user_pass',
				]
			}
		},
		Limits: {
			All: {
				"IP/Day": {
					total: 5000, method: 'all',
					lookup: ['connection.remoteAddress'],
				},
				"API/Second": {
					total: 50,   method: 'all',
					lookup: ['connection.remoteAddress'],
					omit: [
						'/locale/',
						'/locale/search/',
						'/locale/search/city/',
						'/locale/search/region/',
						'/locale/search/country/',
						'/locale/timezone/',
						'/hobbies/search/',
						'/languages/search/',
						'/nationalities/search/',
						'/religions/search/',
						'/genders/search/'
					]
				},
				"TokenIP/Day": {
					total: 2500, method: 'all', 
					lookup: ['headers.token', 'connection.remoteAddress']
				}
			},
			Optional: {
				"New/Day": {
					total: 3,    method: 'post',
					lookup: ['connection.remoteAddress']
				},
				"Tries/Day": {
					total: 5,    method: 'post', 
					lookup: ['connection.remoteAddress']
				},
				"Tries/Second": {
					total: 5,     method: 'post', 
					lookup: ['connection.remoteAddress']
				},
				"Constant/Second": {
					total: 200,   method: 'get',
					lookup: ['connection.remoteAddress']
				}
			}
		}
	}
};
