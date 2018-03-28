
export default {
    Config: {
        user:               'myusername', // The one you created in MySQL
        database:           'mydatabase', // The DB
        connectionLimit:    100,
        multipleStatements: false,
        debug:              false,
        keepAlive:          300000
    },
    Pool: {
        HeadEx1: {
            host: '127.0.0.1', // The eVectr IP
			 // The Password one you created in MySQL 
            password: 'p@ssw0rd_h3r3!'
        },
    }
};
