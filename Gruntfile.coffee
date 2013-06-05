module.exports = (grunt) ->

  grunt.initConfig
    copy:
      dist:
        files: [
          expand: true
          flatten: true
          dest: 'static/lib/'
          src: [
            # ==========
            # Ace
            'components/ace-builds/src/ace.js'
            'components/ace-builds/src/keybinding-vim.js'
            'components/ace-builds/src/theme-idle_fingers.js'
            'components/ace-builds/src/theme-twilight.js'
            'components/ace-builds/src/mode-coffee.js'
            'components/ace-builds/src/worker-coffee.js'
            'components/ace-builds/src/mode-javascript.js'
            'components/ace-builds/src/worker-javascript.js'
            'components/ace-builds/src/mode-markdown.js'

            # Backbone
            'components/backbone/backbone.js'

            # CoffeeScript
            'components/coffee-script/extras/coffee-script.js'

            # Elvis
            'components/elvis/dist/elv.js'

            # jQuery
            'components/jquery/jquery.js'

            # Markdown
            'components/markdown/lib/markdown.js'

            # Require
            'components/requirejs/require.js'

            # Underscore
            'components/underscore/underscore.js'
          ]
        ]

  grunt.loadNpmTasks('grunt-contrib-copy')

  grunt.registerTask('default', ['copy'])
