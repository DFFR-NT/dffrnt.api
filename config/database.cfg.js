
module.exports = {
	Config: {
		user:               'username', // The one you created in MySQL
		database:           'evectr', // The DB
		connectionLimit:    100,
		multipleStatements: false,
		debug:              false,
		keepAlive:          600000
	},
	Pool: {
		Server1: {
			host: '127.0.0.1', // The eVectr IP
			 // The Password one you created in MySQL
			password: 'yourp@ssw0rd'
		},
	}
};
