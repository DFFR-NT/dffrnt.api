# dffrnt.api
A project for easy-ish *API* creation and configuration.

## Contents

> 1. [Prequisites](#prequisites)
>    > 1. [Structure](#structure)
> 1. [Setup](#setup)
>    > 1. [Pre-Configuration](#pre-configuration)
>    > 1. [Installation](#installation)
>    > 1. [Post-Configuration](#post-configuration)
>    > 1. [Launching](#launching)
> 1. [License](#license)

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

## Setup

### Pre-Configuration
1. Ensure the **[folder structure](#structure)** is setup.
1. Ensure the **[prequisites](#prequisites)** are installed.
   * If the `install method` you chose for `REDIS` installs the files in a default location, be sure to `symlink` that location to the `Parent_Folder/REDIS/` directory.
1. In the `MySQL` database, create a `user@%` for yourself.
   * Be sure to give yourself appropriate permissions.
1. Configure the `redis.conf` file in the `REDIS/` folder:

   ```bash
   ################################## SECURITY ###################################
   # Require clients to issue AUTH <PASSWORD> before processing any other
   # ...
   # use a very strong password otherwise it will be very easy to break.
   #
   requirepass p@ssw0rd_h3r3!
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
   module.exports = function Settings() {
       return {
           Debug: true, // For logging
           Port: 3001, // Choose a port of your liking
           Session: {
               Secret: "", // Use a Base64 hash 
               REDIS: {
                   // This shouldn't change, but if you want
                   Port: 6379, 
                   // Use the passowrd configured in redis.conf
                   Password: 'p@ssw0rd_h3r3!',
               }
           }
       };  
   };
   ```
1. Still in the `config/` folder, configure the `database.js` file:
   
     ```javascript
     module.exports = {
         Config: {
             user:'user',// The one you created in MySQL
             database:'database',// The DB
             // ...
         },
         Pool: {
             HeadEx1: {
                 host:'XXX.XXX.XXX.XXX',// The eVectr IP
                 // The one you created in MySQL 
                 password:'p@ssw0rd_h3r3!' 
             },
         }
     };
     ```
1. Back in the `Project_Root/`: 
   * Create the `hidden` file, `.bowerrc`:
   
      ```json
      {
          "directory" : "public/comps"
      }
      ```
   * Also create the `hidden` file, `.babelrc`:
   
      ```json
      {
          "presets": ["es2015"],
          "ignore": "node_modules",
      }
      ```

### Launching
1. Lastly, still in the **project root**, run `gulp` and watch the `logs` as the `server` starts up.
   * If there are no glaring `errors`, you're done!
   * Otherwise... Shit... :(
1. In your `browser`, navigate to [localhost:3001/api-explorer](http://localhost:3001/api-explorer) (_or whatever `port` you chose_) and you'll see the **API Exploration UI**. Use this to test your `endpoints` and/or `signle sign-on` functionality.
1. Hit <kbd>CTRL</kbd>+<kbd>C</kbd> to `stop` the server.
   
## License

MIT
