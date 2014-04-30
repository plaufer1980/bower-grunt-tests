'use strict';
var lrSnippet = require('connect-livereload')({port: 35729});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};
module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.initConfig({
    watch: {
      less: {
        files: ['app/style/*.less'],
        tasks: ['less:server']
      },
      livereload: {
        options: {
           livereload: 35729
        },
        files: [
          'app/*.htm',
          'app/style/*.less',
          'app/script/*.js',
        ]
      }
    },
    connect: {
      options: {
        port: 8080,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, 'app'),
              lrSnippet
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>/index.htm'
      }
    },
    less: {
      server: {
        options: {
          paths: ['app/components/bootstrap/less', 'app/style']
        },
        files:{    
          'app/style/main.css': 'app/style/main.less' 
        }
      }
    }
  });
  grunt.registerTask('server', function (target) {
    grunt.task.run([
      'less:server',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });
};
