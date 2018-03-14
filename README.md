# dffrnt.api
A project for easy-ish API configuration.

## Contents

1. [Prequisites](#prequisites)
   1. [Structure](#structure)
1. [Installation](#installation)
1. [License](#license)

## Prequisites
* [NodeJS](https://nodejs.org/en/) (_Latest_)
* [NPM](https://nodejs.org/en/) (_Installed with NodeJS_)
* [REDIS](https://redis.io/download) (_See **[Structure](#structure)** below_)
  * Install this in the same **parent folder** as **this project** under "**REDIS/**"
  
### Structure

```
Parent_Folder/ (Name NOT important)
   ├── dffrnt.api/ (Name also NOT important)
   │   ├── config/ (Reference only; no need to create these!)
   │   └── ...
   └── REDIS/ (Name important! Don't change this name!!)
```

## Installation
1. Ensure **folder structure** is setup and **prequisites** are installed.
1. Configure the `redis.conf` file in the `REDIS/` folder:

   ```bash
   ################################## SECURITY ###################################

   # Require clients to issue AUTH <PASSWORD> before processing any other
   # ...
   # use a very strong password otherwise it will be very easy to break.
   #
   requirepass p@ssw0rd_h3r3!
   ```
1. [Download](https://github.com/LeShaunJ/dffrnt.api/archive/master.zip) or [`git`](https://github.com/LeShaunJ/dffrnt.api.git) this project into the appropriate folder.
1. On the **command line**, `cd` into the **project folder** location:
   * Run `chmod +x npm_global.sh` to make it **excutable**.
   * Run `sudo ./npm_global.sh` to install some important global packages (_these can be use across all projects_).
1. Run `npm install` and allow `npm` to install all the packages needed for this project.
1. In the `config/` folder, configure the `settings.js` file:

   ```javascript
   module.exports = function Settings() { return {
        Debug:  true, // For logging
        Port:   3001, // Choose a port of your liking
        Session: {
            Secret: "", // Use a Base64 hash 
            REDIS:  {
                Port:     6379, // This shouldn't change, but if you want
                Password: 'p@ssw0rd_h3r3!', // Use the passowrd configured in redis.conf
            }
        }
   };  };
   ```
1. Create a `user@%` for yourself in the `MySQL` database.
   * Be sure to give yourself appropriate permissions.
   * Back in the `config/` folder, configure the `database.js` file:
   
     ```javascript
     module.exports = {
         Config: {
             user:               'user', // The one you created in MySQL
             database:           'database', // The DB
             // ...
         },
         Pool: {
             HeadEx1: {
                 host: 'XXX.XXX.XXX.XXX', // The eVectr IP
                 password: 'p@ssw0rd_h3r3!' // The one you created in MySQL 
             },
         }
     };
     ```
1. In the **project root**: 
   * Create the `hidden` file `.bowerrc`:
   
      ```json
      {
          "directory" : "public/comps"
      }
      ```
   * Also create the `hidden` file `.babelrc`:
   
      ```json
      {
          "presets": ["es2015"],
          "ignore": "node_modules",
      }
      ```
1. Lastly, still in the **project root**, run `gulp` and watch the `logs` as the `server` starts up.
   * If there are no glaring `errors`, you're done!
   * Otherwise... Shit... :(
   
## License

GNU
