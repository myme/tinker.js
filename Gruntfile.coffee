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
          expand: true
          cwd: 'components/font-awesome/build/assets/font-awesome'
          dest: 'static'
          src: [ 'css/**', 'font/**' ]
        ]

  grunt.loadNpmTasks('grunt-contrib-copy')

  grunt.registerTask('default', ['copy'])
