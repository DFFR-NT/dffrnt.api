
module.exports = {
	Config: {
		user:               'ajohnson', // The one you created in MySQL
		database:           'evectr', // The DB
		connectionLimit:    100,
		multipleStatements: false,
		debug:              false,
		keepAlive:          600000
	},
	Pool: {
		Server1: {
			host: '18.216.8.221', // The eVectr IP
			 // The Password one you created in MySQL
			password: 'W{)=cMM6m+tw'
		},
	}
};
