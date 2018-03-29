
'use strict';

// ----------------------------------------------------------------------------------------------
// Handle Requires ------------------------------------------------------------------------------

	// Requires

		import os 			from 'os';
		import fs 			from 'fs';
		import path 		from 'path';
		import gulp 		from 'gulp';
		import nodemon 		from 'gulp-nodemon';
		import babel 		from 'gulp-babel';
		import cssmin 		from 'gulp-cssmin';
		import rename 		from "gulp-rename";
		import less 		from 'gulp-less';
		import source 		from 'vinyl-source-stream';
		import browserify 	from 'browserify';
		import watchify 	from 'watchify';
		import { exec 	  } from 'child_process';
		import map 			from 'map-stream';
		import redis 		from 'redis';

	// Configs

		const 	JSNS 	= (obj) => (JSON.stringify(obj, null, '    '));
		const 	LOG 	= console.log;
		const 	cfgfld	= './config';
		const 	pubFld 	= './public';
		const 	brwFld 	= './main/browser';
		const 	libFld 	= `${brwFld}/lib`;
		const 	opsys 	= { linux: 'nix', darwin: 'nix', win32: 'win' }[os.platform()];
		const 	conf 	= {
					files: [ `./*.js` ],
					options: { cwd: `${cfgfld}/.default` },
					location: cfgfld
				};
		const 	brow 	= {
					entries: [ `${brwFld}/main.js` ],
					source: 'bundle.js', location: `${pubFld}/js`
				};
		const 	jsx 	= {
					source: `${libFld}/src/*.jsx`,
					location: libFld,
					presets: ['react','env']
				};
		const 	css 	= {
					showLog: true, compatibility: 'ie8',
					keepSpecialComments: 0, roundingPrecision: -1
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

	// Variables

		let 	crashes = null;

// ----------------------------------------------------------------------------------------------
// Handle Functions -----------------------------------------------------------------------------

		function runServer (done) {
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
		};

// ----------------------------------------------------------------------------------------------
// Handle Bundle Gulp ---------------------------------------------------------------------------

	// Initialize Configs; if necessary
		gulp.task( 'config', (done) => {
			let max = 0;
			gulp.src(conf.files, conf.options)
				.pipe(map((file, done) => {
					let len = file.basename.length;
					max = (len>max?len:max);
					done(null, file);
				}))
				.pipe(map((file, done) => {
					let bse = file.base, nme = file.basename, fld = conf.location;
					if (!fs.existsSync(`${bse}/../${nme}`)) {
						LOG(`Copied default, [${nme.padStart(max)}], to ${fld} ...`);
						gulp.src(file.path).pipe(gulp.dest(fld));
					};
					done(null, file);
				}));
			done();
		});

	// Browserify Concatenation
		gulp.task( 'brow', (done) => {
			function doBundle(watcher) {
				watcher .bundle()
						.pipe(source(brow.source))
						// .pipe( babel({ presets: ['env'], compact: false }))
						.pipe(gulp.dest(brow.location));
				return 	watcher;
			}

			var bundler = new browserify({
					entries: brow.entries,
					debug: true,
					cache: {},
					packageCache: {},
					fullPaths: false
				})
				.plugin('minifyify', {
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
					},
					compressPath: function (p) {
						return path.relative(`${__dirname}/..`, p);
					}
				}),
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

	//  JSX to  JS Conversion/Watch
		gulp.task( 'jsx-make', (done) => {
			gulp.src(jsx.source)
				.pipe( babel({ presets: jsx.presets, compact: false }))
				.on( 'error', (e) => { LOG('>>> ERROR', e); this.emit('end'); })
				.pipe(gulp.dest(jsx.location));
			done();
		});
		gulp.task( 'jsx-watch', (done) => {
			gulp.watch(jsx.source, gulp.parallel('jsx-make'))
				.on(  'change', (e) => { LOG('JSX Change: ', e); })
				.on(   'error', (e) => { LOG('JSX Error:  ', e); })
				.on( 'nomatch', (e) => { LOG('JSX NoMatch:', e); });
			done();
		});
		gulp.task( 'jsx', gulp.parallel('jsx-make','jsx-watch'));

	// LESS to CSS Conversion/Watch
		// gulp.task( 'css-make', (done) => {
			// gulp.src('./public/less/*.less')
			// 	.pipe(less())
			// 	.pipe(gulp.dest('./public/css'));
			// done();
		// });
		// gulp.task('css-minify', (done) => {
			// gulp.src('./public/css/*.css')
			// 	// .pipe(sourcemaps.init({ debug: true }))
			// 	.pipe(cssmin(css))
			// 	.pipe(rename({ suffix: '.min' }))
			// 	// .pipe(sourcemaps.write({ debug: true }))
			// 	.pipe(gulp.dest('./public/css'));
			// done();
		// });
		// gulp.task( 'css-convert', gulp.parallel('css-make','css-minify'));
		// gulp.task( 'css-watch', (done) => {
			// gulp.watch('./public/less/*.less', ['css-convert'])
			// 	.on( 'change', (event) => {
			// 		LOG('LESS Change:', event.path);
			// 	})
			// 	.on( 'error', (event) => {
			// 		LOG('LESS Error:', 	event.path);
			// 	})
			// 	.on( 'nomatch', (event) => {
			// 		LOG('LESS UnMatched:', event.path);
			// 	}); done();
		// });
		// gulp.task( 'css', gulp.parallel('css-convert','css-watch'));

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
		gulp.task( 'demon', runServer);
		gulp.task( 'system', gulp.series('redis', 'demon'));

	// Nodemon StartUp
		gulp.task( 'main',   gulp.series('jsx'/*, 'css'*/, 'brow'));
		gulp.task('default', gulp.series('config','system','main'));

// ----------------------------------------------------------------------------------------------
