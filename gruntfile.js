'use strict';


module.exports = function(grunt) {

	var certs = {
		port: 9000
	};

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			reload: {
				files: [
					'app/views/**',
					'gruntfile.js',
					'server.js',
					'app/**/*.js',
					'public/build/**',
					'public/styles/**'
				],
				options: {
					livereload: certs,
				},
			},
			js: {
				files: ['gruntfile.js', 'server.js', 'app/**/*.js', 'public/js/**'],
				tasks: ['jshint']
			},
			publicjs: {
				files: ['public/js/**'],
				tasks: ['uglify:publicjs']
			}
		},

		jshint: {
			all: {
				src: ['gruntfile.js', 'server.js', 'app/**/*.js', 'public/js/app.js'],
				options: {
					jshintrc: true
				}
			}
		},

		uglify: {

			publicjs: {
				files: {
					'public/build/app.min.js': [
						// Global init
						'public/js/init.js',
						// Libs
						'public/lib/jQuery-linkify/dist/jquery.linkify.min.js',
						// App
						'public/js/app.js'
					]
				}
			}

		},

		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					args: [],
					ignored: ['public/**'],
					watchedExtensions: ['js'],
					nodeArgs: ['--debug'],
					delayTime: 1,
					env: {
						PORT: 3000
					},
					cwd: __dirname
				}
			}
		},

		concurrent: {
			tasks: ['nodemon', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		}
	});

	//Load NPM tasks
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');

	//Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	//Default task(s).
	grunt.registerTask('default', ['jshint', 'uglify:publicjs', 'concurrent']);
	grunt.registerTask('publish', ['uglify:publicjs']);
};