
'use strict';

// ----------------------------------------------------------------------------------------------
// Handle Requires ------------------------------------------------------------------------------

	// Requires ---------------------------------------------------------------------------------

		const os 		 = require('os');
		const fs 		 = require('fs');
		const path 		 = require('path');
		const Assign 	 = require('object-assign');
		const gulp 		 = require('gulp');
		const nodemon 	 = require('gulp-nodemon');
		const babel 	 = require('gulp-babel');
		const cssmin 	 = require('gulp-cssmin');
		const rename 	 = require("gulp-rename");
		const less 		 = require('gulp-less');
		const source 	 = require('vinyl-source-stream');
		const browserify = require('browserify');
		const watchify 	 = require('watchify');
		const exec 		 = require('child_process').exec;
		const map 		 = require('map-stream');
		const redis 	 = require('redis');

	// Variables --------------------------------------------------------------------------------

		const 	JSNS 	 = (obj) => (JSON.stringify(obj, null, '    '));
		const 	LOG 	 = console.log;
		const 	SERIES 	 = gulp.series;
		const 	PARALLEL = gulp.parallel;
		const 	WATCH 	 = (name, source, tasks) => {
			return (done) => {
				gulp.watch(source, PARALLEL(...tasks))
					.on(  'change', (e) => { LOG(`${name} Change  |`, e); })
					.on(   'error', (e) => { LOG(`${name} Error   |`, e); })
					.on( 'nomatch', (e) => { LOG(`${name} NoMatch |`, e); });
				done();
			};
		};

		let 	crashes = null;

	// Configs ----------------------------------------------------------------------------------

		const 	cfgfld	= './config';
		const 	pubFld 	= './public';
		const 	brwFld 	= './main/browser';
		const 	libFld 	= `${brwFld}/lib`;
		const 	opsys 	= { linux: 'nix', darwin: 'nix', win32: 'win' }[os.platform()];
		const 	frwk 	= {
					folders: [ `./node_modules/dffrnt.*` ],
					options: { cwd: `./` },
					location: `./framework`
				};
		const 	conf 	= {
					files: [ `./node_modules/dffrnt.confs/lib/*.cfg.js` ],
					options: { cwd: `./` },
					location: cfgfld
				};
		const 	brow 	= {
					source: 	'bundle.js',
					options:  	{
						entries: [ `${brwFld}/main.js` ],
						debug: true,
						cache: {},
						packageCache: {},
						fullPaths: false
					},
					minifyify:  {
						map: false, uglify: {
							mangle: true,
							compress: {
								sequences: true,
								dead_code: true,
								conditionals: true,
								booleans: true,
								unused: true,
								if_return: true,
								join_vars: true
							}
					} 	},
					location: 	`${pubFld}/js`,
				};
		const 	jsx 	= {
					source: `${libFld}/src/*.jsx`,
					location: libFld,
					presets: ['react','env']
				};
		const 	style 	= {
					css: 	{ src: [
						`${pubFld}/css/*.css`,
						`!${pubFld}/css/*.min.css`
					]	},
					less: 	{ src: `${pubFld}/less/*.less` },
					min: 	{
						showLog: true, compatibility: 'ie8',
						keepSpecialComments: 0, roundingPrecision: -1
					},
					location: `${pubFld}/css`
				};
		const 	redfl 	= {
					cwd: '../REDIS',
					cmd: 'redis-server',
					cfg: 'redis.conf'
				};
		const 	rds 	= {
					nix: {
						proc: redfl.cmd,
						conf: redfl.cfg,
						kill: `ps -ef|grep ${redfl.cmd.replace(/^r/,'[r]')}|awk '{print $2}'|xargs kill -9`,
					},
					win: {
						proc: path.join('win',`${redfl.cmd}.exe`),
						conf: path.join(redfl.cfg),
						kill: `for /f "tokens=2" %i in ('tasklist ^| find "${redfl.cmd}.exe"') do (taskkill /PID %i /F)`,
					}
				}[opsys];

// ----------------------------------------------------------------------------------------------
// Handle Bundle Gulp ---------------------------------------------------------------------------

	// Configs ----------------------------------------------------------------------------------

		// Initialize Framework Directory; if necessary
			gulp.task( 'framework', (done) => {
				let loc = frwk.location;
				if (!fs.existsSync(loc)) fs.mkdirSync(loc), LOG(`Created Framework Directory.`);
				gulp.src(frwk.folders, frwk.options)
					.pipe(map((file, done) => {
						let pth = file.path, nme = file.basename;
						if (!fs.existsSync(`${loc}/${nme}`)) {
							LOG(`Linking Module, [${nme}/], to ${loc} ...`);
							gulp.src(pth).pipe(gulp.symlink(loc));
						};	done(null, file);
					})); 	done();
			});

		// Initialize Configs; if necessary
			gulp.task( 'config', (done) => {
				let max = 0, fld = conf.location;
				if (!fs.existsSync(fld)) fs.mkdirSync(fld), LOG(`Created Config Directory.`);
				gulp.src(conf.files, conf.options)
					.pipe(map((file, done) => {
						let len = file.basename.length;
						max = (len>max?len:max); done(null, file);
					}))
					.pipe(map((file, done) => {
						let nme = file.basename;
						if (!fs.existsSync(`${fld}/${nme}`)) {
							LOG(`Copied default, [${nme.padStart(max)}], to ${fld} ...`);
							gulp.src(file.path).pipe(gulp.dest(fld));
						}; 	done(null, file);
					})); 	done();
			});

		gulp.task('init', SERIES('framework','config'));

	// Convert ----------------------------------------------------------------------------------

		//  JSX to  JS Conversion/Watch
			gulp.task('jsx-make',	(done) => {
				gulp.src(jsx.source)
					.pipe( babel({ presets: jsx.presets, compact: false }))
					.on( 'error', (e) => { LOG('>>> ERROR', e); this.emit('end'); })
					.pipe(gulp.dest(jsx.location));
				done();
			});
			gulp.task('jsx-watch',	WATCH( 'JSX', jsx.source, ['jsx-make']));
			gulp.task('jsx', 		PARALLEL('jsx-make','jsx-watch'));

		// LESS to CSS Conversion/Watch
			gulp.task('css-make',	(done) => {
				gulp.src(style.less.src)
					.pipe(less())
					.pipe(gulp.dest(style.location));
				done();
			});
			gulp.task('css-minify',	(done) => {
				gulp.src(style.css.src)
					// .pipe(sourcemaps.init({ debug: true }))
					.pipe(cssmin(style.min))
					.pipe(rename({ suffix: '.min' }))
					// .pipe(sourcemaps.write({ debug: true }))
					.pipe(gulp.dest(style.location));
				done();
			});
			gulp.task('css-conv', 	SERIES('css-make','css-minify'));
			gulp.task('css-watch',	WATCH('LESS', style.css.src, ['css-conv']));
			gulp.task('css', 		PARALLEL('css-conv','css-watch'));

		// Browserify Concatenation
			gulp.task( 'brow', (done) => {
				function doBundle(watcher) {
					watcher .bundle()
							.pipe(source(brow.source))
							// .pipe( babel({ presets: ['env'], compact: false }))
							.pipe(gulp.dest(brow.location));
					return 	watcher;
				}

				var bundler = new browserify(brow.options)
									.plugin('minifyify', Assign({
										compressPath: p => path.relative(`${__dirname}/..`, p)
									}, 	brow.minifyify)),
					watcher = watchify(bundler);

				doBundle(watcher.on( 'update', () => {
					var start = new Date(), src = brow.source,
						frm1 = '[%s] Updating...', fin,
						frm2 = '[%s] Updated: %ss';
					LOG(frm1, src);
					watcher = doBundle(watcher);
					fin = ((new Date()-start)/1000);
					LOG(frm2, src, fin.toFixed(3));
					return watcher;
				})); done();
			});

		gulp.task('convert', SERIES('jsx', 'css', 'brow'));

	// System -----------------------------------------------------------------------------------

		// REDIS Server Init
			gulp.task('redis', (done) => {
				let RED = redis.createClient();
				RED.on('error', (err) => {
					switch (err.code) {
						// If it failed due to REDIS not running
						case 'ECONNREFUSED':
							exec([`cd ${redfl.cwd} &&`,rds.proc,rds.conf].join(' '), {
								cwd: path.normalize(redfl.cwd)
							}, (err, stdo, stde) => {
								if (!!err) LOG(`REDIS.ERR: ${JSNS(err)}`);
								else LOG(`REDIS.STD: ${JSNS({OUT:stdo,ERR:stde})}`);
							});
						// Not an issue, just need to know if it's UP
						case 'NOAUTH': done(); break;
						// Otherwise, log output; halt execution
						default: LOG(JSNS(err));
					}
				});
				RED.on('ready', () => { LOG('REDIS is running'); done(); });
			});

		// Daemonized Startup
			gulp.task('demon', (done) => {
				let nmon = nodemon({ execMap: {
								js: 'node --harmony',
								tasks: ['demon','main'],
							}})
							.on('crash', () => {
								try { LOG('Crashed ~ !!');
									if ((new Date() - crashes) > 5000) {
										nmon.emit('restart', 1);
									}
								} catch (e) { LOG(e); }
							})
							.on('restart', () => { LOG('Restarted ~ !!'); });
				crashes = new Date(); nmon; done();
			});

		gulp.task( 'system', SERIES('redis', 'demon'));

	// StartUp ----------------------------------------------------------------------------------

		gulp.task('development', SERIES('init','convert','system'));
		gulp.task('production',  SERIES('init','system'));

		switch (process.env.NODE_ENV) {
			case 'production': 	gulp.task('default', SERIES('production' ));
			default: 			gulp.task('default', SERIES('development'));
		}

// ----------------------------------------------------------------------------------------------
