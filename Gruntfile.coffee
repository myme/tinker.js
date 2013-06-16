module.exports = (grunt) ->

  grunt.initConfig
    copy:
      dist:
        files: [
          # Ace
          expand: true
          cwd: 'components/ace/lib/ace'
          dest: 'static/lib/ace'
          src: '**'
        ,
          # Bootstrap
          expand: true
          cwd: 'components/bootstrap/docs/assets/css/'
          dest: 'static/css/'
          src: 'bootstrap.css'
        ,
          expand: true
          flatten: true
          dest: 'static/lib/'
          src: [
            # Backbone
            'components/backbone/backbone.js'

            # CoffeeScript
            'components/coffee-script/extras/coffee-script.js'

            # Elvis
            'components/elvis/dist/elvis.js'

            # jQuery
            'components/jquery/jquery.js'

            # Markdown
            'components/markdown/lib/markdown.js'

            # Require
            'components/requirejs/require.js'

            # Underscore
            'components/underscore/underscore.js'
          ]
        ,
          # Font awesome
          expand: true
          cwd: 'components/font-awesome/'
          dest: 'static'
          src: [ 'css/**', 'font/**' ]
        ]

  grunt.loadNpmTasks('grunt-contrib-copy')

  grunt.registerTask('default', ['copy'])
