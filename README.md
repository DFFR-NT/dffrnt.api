# dffrnt.api
A project for easy-_ish_ **API** creation and configuration.

## Contents

> 1. [Prequisites](#prequisites)
>    > 1. [Structure](#structure)
> 1. [Setup](#setup)
>    > 1. [Pre-Configuration](#pre-configuration)
>    > 1. [Installation](#installation)
>    > 1. [Post-Configuration](#post-configuration)
>    > 1. [Launching](#launching)
> 1. [Modules](#modules)
>    > 1. [dffrnt.utils](#dffrntutils)
>    > 1. [dffrnt.model](#dffrntmodel)
>    > 1. [dffrnt.route](#dffrntroute)
> 1. [License](#license)

---
## Prequisites
* [NodeJS](https://nodejs.org/en/) (_Latest_)
* [NPM](https://nodejs.org/en/) (_Installed with `NodeJS`_)
* [REDIS](https://redis.io/download) (_See **[Structure](#structure)** below_)
	* _Install this in the same **parent folder** as **this project** under `REDIS/`_
* [MySQL](https://dev.mysql.com/downloads/mysql/) (_v5.6+_)
	* _A `user@%` account is **required** for later configuration_

### Structure

```
Parent_Folder/ (Name NOT important)
   ├── dffrnt.api/ (Project-Root; Name also NOT important)
   │   ├── config/ (Reference only; no need to create these!)
   │   └── ...
   └── REDIS/ (Name important! Don't change this name!!)
```

---
## Setup

### Pre-Configuration
1. Ensure the **[folder structure](#structure)** is setup.
1. Ensure the **[prequisites](#prequisites)** are installed.
	* If the `install method` you chose for `REDIS` installs the files in a default location, be sure to `symlink` that location to the `Parent_Folder/REDIS/` directory.
1. In the `MySQL` database, create a `user@%` for yourself.
	* Be sure to give yourself appropriate permissions.
1. Configure the `redis.conf` file in the `REDIS/` folder:

	```bash
	################################## SECURITY ###################################
	# Require clients to issue AUTH <PASSWORD> before processing any other
	# ...
	# use a very strong password otherwise it will be very easy to break.
	#
	requirepass p@ssw0rd_h3r3!
	```

### Installation
1. [Download](https://github.com/LeShaunJ/dffrnt.api/archive/master.zip) or [`git`](https://github.com/LeShaunJ/dffrnt.api.git) this project into the **parent folder**.
1. In your **command line**, `cd` into the **project folder** location:
	1. Run `chmod +x npm_global.sh` to make it **excutable**.
	1. Run `sudo ./npm_global.sh` to install some important, **global* packages.
	1. These can be use across all projects:

		| Package | Importance | Description |
		| --- | :---: | --- |
		| [babel-cli](https://www.npmjs.com/package/babel-cli) |  `Required`  | A next-gen (`ES6`) JavaScript compiler. |
		| [bower](https://www.npmjs.com/package/bower) |  `Required`  | A package-manager for Browser plugins. |
		| [cors](https://www.npmjs.com/package/cors) |  `Required`  | A `middleware` for `Cross-Origin Resource Sharing`. |
		| [depcheck](https://www.npmjs.com/package/depcheck) |  `Optional`  | A tool for analyzing the dependencies in a project |
		| [express](https://www.npmjs.com/package/express) |  `Required`  | A fast, unopinionated, minimalist web framework for `NodeJS`. |
		| [gulp](https://www.npmjs.com/package/gulp) |  `Required`  | A toolkit that helps automate development workflow tasks. |
		| [less](https://www.npmjs.com/package/less) |  `Required`  | The dynamic stylesheet language. |
		| [less-plugin-clean-css](https://www.npmjs.com/package/less-plugin-clean-css) |  `Required`  | A `gulp` plugin for `LESS -> CSS` using `clean-css`. |
		| [node-gyp](https://www.npmjs.com/package/node-gyp) |  `Required`  | Compiles native addon `modules` for `Node.js`. |
		| [nodemon](https://www.npmjs.com/package/nodemon) |  `Required`  | Will watch for files changes and `restart` your application. |

1. Run `npm install` and allow `npm` to install all the `packages` needed for this `server-side`.
1. Run `bower install` and allow `bower` to install all the `components` needed for this `client-side`.

### Post-Configuration
1. In the `config/` folder, configure the `settings.js` file:

	```javascript
	// ./config/settings.js 
	export default {
	    Debug: true, // Debug‑Mode will display verbose Logs
	    Port: 3001, // This is the Server's listening Port
	    Public: {
	        // Cache‑Age for Browser files
	        Age: 365*86400, 
	        // ...
	    },
	    Session: {
	        // This should be something hard to guess, like a phrase
	        Secret: '¿mYd0GiS!nmYeyE&shEs4yS@uE?',
	        Age:    (((3600*1000)*4)*1),  // TTL for User Sessions
	        REDIS:  {
	            Host: 'localhost', // Or whereever you keep it
	            Port: 6379, // Listening Port
	            // The password you configured earlier
	            Password: 'p@ssw0rd!',
	        },
	        Auth: { /* ... */ }
	    }
	};
	```
1. Still in the `config/` folder, configure the `database.js` file:
	
	```javascript
	// ./config/database.js
	export default {
	    Config: {
	        user:     'user', // The one you created in MySQL
	        database: 'mydatabase', // The DB
	        // ...
	    },
	    Pool: {
	        HeadEx1: {
	            host: 'XXX.XXX.XXX.XXX', // The eVectr IP
	            // The one you created in MySQL 
	            password: 'p@ssw0rd_h3r3!' 
	        },
	    }
	};
	```
1. Back in the `Project_Root/`: 
	* Create the `hidden` file, `.bowerrc`:
	
		```json
		// ./.bowerrc
		{
		  "directory" : "public/comps"
		}
		```
	* Also create the `hidden` file, `.babelrc`:
	
		```json
		// ./.babelrc
		{
		  "presets": ["babel‑preset‑env"],
		  "ignore": "/(node_modules\\/)(?!dffrnt\\.)[^\\/]+(\\/[^\\/]+)*/",
		}
		```

### Launching
1. Lastly, still in the **project root**, run `gulp`+<kbd>ENTER</kbd> and watch the `logs` as the `server` starts up.
	* If there are no glaring `errors`, you're done!
	* Otherwise... Shit... :(
1. In your `browser`, navigate to [localhost:3001/api-explorer](http://localhost:3001/api-explorer) (_or whatever `port` you chose_) and you'll see the **API Exploration UI**. Use this to test your `endpoints` and/or `signle sign-on` functionality.
1. Hit <kbd>CTRL</kbd>+<kbd>C</kbd> to `stop` the server.

---
## Modules

### [dffrnt.utils](https://github.com/DFFR-NT/dffrnt.utils)
> Explination Coming Soon...

### [dffrnt.model](https://github.com/DFFR-NT/dffrnt.model)
> Explination Coming Soon...

### [dffrnt.route](https://github.com/DFFR-NT/dffrnt.route)
> Explination Coming Soon...

---
## License

**MIT License**

_Copyright (c) 2018 DFFRNT Innovations_

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

_THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE._
