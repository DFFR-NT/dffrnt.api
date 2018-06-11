
module.exports = {
	Config: {
		user:               'myuser', // The one you created in MySQL
		database:           'evectr', // The DB
		connectionLimit:    100,
		multipleStatements: false,
		debug:              false,
		keepAlive:          600000
	},
	Pool: {
		Server1: {
			host: 'X.X.X.X', // The eVectr IP
			 // The Password one you created in MySQL
			password: 'mypassword'
		},
	}
};
