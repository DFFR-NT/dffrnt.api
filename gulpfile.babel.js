
'use strict';

// ----------------------------------------------------------------------------------------------
// Handle Requires ------------------------------------------------------------------------------

	// Requires

		import os 			from 'os';
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
		import { exec } 	from 'child_process';

	// Configs

		const 	pubFld 	= './public';
		const 	brwFld 	= './main/browser';
		const 	libFld 	= `${brwFld}/lib`;
		const 	opsys 	= { linux: 'nix', darwin: 'nix', win32: 'win' }[os.platform()];
		const 	brow 	= {
					entries: [ `${brwFld}/main.js` ],
					source: 'bundle.js', location: `${pubFld}/js`
				};
		const 	jsx 	= { source: `${libFld}/src/*.jsx`, location: libFld };
		const 	css 	= {
					showLog: true, compatibility: 'ie8',
					keepSpecialComments: 0, roundingPrecision: -1
				};
		const 	recwd 	= 'cd ../REDIS &&';
		const 	redis 	= {
					nix: {
						proc: 'redis-server',
						conf: 'redis.conf',
						kill: '{ RID=$(ps -ef|grep [r]edis|awk \'{print $2}\'); [[ -n "${RID}" ]] && kill -9 ${RID} };',
					},
					win: {
						proc: path.join('win','redis-server.exe'),
						conf: path.join('redis.conf'),
						kill: '',
					}
				}[opsys];

	// Variables

		let 	crashes = null;

// ----------------------------------------------------------------------------------------------
// Handle Functions -----------------------------------------------------------------------------

		function runServer () {
			var nmon = nodemon({ execMap: {
				js: "node --harmony"
			}})
			.on('crash', () => {
				try {
					console.log('Crashed ~ !!');
					if ((new Date() - crashes) > 5000) {
						nmon.reset(); runServer();
					}
				} catch (e) { console.log(e); }
			})
			.on('restart', () => {
				console.log('Restarted ~ !!');
			});
			crashes = new Date(); return nmon;
		};

// ----------------------------------------------------------------------------------------------
// Handle Bundle Gulp ---------------------------------------------------------------------------

	// Browserify Concatenation
		gulp.task( 'brow', () => {
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

			return watcher.on( 'update', () => {
					var start = new Date(), src = brow.source,
						frm1 = '[%s] Updating...', fin,
						frm2 = '[%s] Updated: %ss';
					console.log(frm1, src);
					watcher .bundle()
							.pipe(source(src))
							.pipe(gulp.dest(brow.location));
					fin = ((new Date()-start)/1000);
					console.log(frm2, src, fin.toFixed(3));
					return watcher;
				}).bundle()
				  .pipe(source(brow.source))
				  .pipe(gulp.dest(brow.location));
		});

	//  JSX to  JS Conversion/Watch
		gulp.task( 'jsx-make', () => {
			return 	gulp.src(jsx.source)
						.pipe( babel({ presets: ['react','es2015'], compact: false }))
						.on( 'error', (e) => { console.log('>>> ERROR', e); this.emit('end'); })
						.pipe(gulp.dest(jsx.location));
		});
		gulp.task( 'jsx-watch', () => {
			return gulp.watch(jsx.source, gulp.parallel('jsx-make'))
				.on(  'change', (e) => { console.log('JSX Change: ', e.path); })
				.on(   'error', (e) => { console.log('JSX Error:  ', e.path); })
				.on( 'nomatch', (e) => { console.log('JSX NoMatch:', e.path); });
				// .pipe(gulp.dest(jsx.location));
		});
		gulp.task( 'jsx', gulp.parallel('jsx-make', 'jsx-watch'));

	// LESS to CSS Conversion/Watch
		// gulp.task( 'css-make', () => {
		// 	return gulp.src('./public/less/*.less')
		// 			   .pipe(less())
		// 		       .pipe(gulp.dest('./public/css'));
		// });
		// gulp.task('css-minify', () => {
		// 	return gulp.src('./public/css/*.css')
		// 			   // .pipe(sourcemaps.init({ debug: true }))
		// 			   .pipe(cssmin(css))
		// 			   .pipe(rename({ suffix: '.min' }))
		// 			   // .pipe(sourcemaps.write({ debug: true }))
		// 			   .pipe(gulp.dest('./public/css'));
		// });
		// gulp.task( 'css-convert', ['css-make', 'css-minify']);
		// gulp.task( 'css-watch', () => {
		// 	gulp.watch('./public/less/*.less', ['css-convert'])
		// 		.on( 'change', (event) => {
		// 			console.log('LESS Change:', event.path);
		// 		})
		// 		.on( 'error', (event) => {
		// 			console.log('LESS Error:', 	event.path);
		// 		})
		// 		.on( 'nomatch', (event) => {
		// 			console.log('LESS UnMatched:', event.path);
		// 		});
		// });
		// gulp.task( 'css', ['css-convert', 'css-watch']);

	// REDIS Server Init
		gulp.task('redis', () => {
			return exec([recwd,redis.proc,redis.conf].join(' '), {
				cwd: path.normalize('../REDIS')
			}, (err, stdout, stderr) => {
				var res = JSON.stringify({ OUT: stdout, ERR: stderr }, null, '    ');
				if (!!err) console.log("REDIS.ERR: %s", err);
				else console.log("REDIS.STD: ", res);
			});
		});
		gulp.task( 'demon', runServer);

	// Nodemon StartUp
		gulp.task( 'main',   gulp.parallel('jsx'/*, 'css'*/, 'brow'));
		gulp.task('default', gulp.parallel('redis', 'demon', 'main'));

// ----------------------------------------------------------------------------------------------
