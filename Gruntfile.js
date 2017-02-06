module.exports = function(grunt) {

  //load grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project confg tasks
  grunt.initConfig({

    //Read the package.json file
    pkg: grunt.file.readJSON('package.json'),

    // Minify the CSS files
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'dist/css/style.css': ['src/css/style.css']
        }
      }
    },

    // Minify the javascript file
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/js/app.js': ['src/js/app.js']
        }
      }
    },

    // Minify html
    htmlmin: {                                     // Task
      dist: {                                      // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
          'dist/index.html': 'src/index.html',
        }
      },
      dev: {
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },                                       // Another target
        files: {
          'dist/index.html': 'src/index.html'
        }
      }
    },

    // Inline the CSS into the index.html file
    inlinecss: {
      main: {
        options: {},
        files: {
          'dist/index.html': 'src/index.html'
        }
      }
    }

  });


  // NO needed as using "load-grunt-tasks"

  // Tell grunt to use the plugins
    // grunt.loadNpmTasks('grunt-contrib-clean');
    // grunt.loadNpmTasks('grunt-inline-css');
    // grunt.loadNpmTasks('grunt-contrib-htmlmin');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks('grunt-contrib-imagemin');
    // grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Register the tasks as default actions for the 'grunt' command
  grunt.registerTask('default',['cssmin', 'htmlmin', 'inlinecss', 'uglify']);
};