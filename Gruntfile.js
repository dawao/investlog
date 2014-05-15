module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        "pkg":              grunt.file.readJSON("package.json"),
        uglify: {
              options: {
                mangle: {
                    except: ['jQuery', 'Backbone']
                  },
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                sourceMap: true,
                sourceMapName: 'js/sourcemap.map'
              },
              build: {
                src: ["slickgrid/lib/jquery.event.drag-2.2.js",
                'slickgrid/*.js', 
                'slickgrid/plugins/*.js', '!slickgrid/slick.dataview.js',
                'js/bootstrap-slickgrid.js','js/fun.js'],
                dest: 'js/<%= pkg.name %>.min.js'
              }
        }
 

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    //grunt.loadNpmTasks("grunt-contrib-jshint");
    //grunt.loadNpmTasks("grunt-contrib-copy");
    //grunt.loadNpmTasks("grunt-contrib-clean");
    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['uglify']);
};
