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
            'components/ace-builds/src-min/ace.js'
            'components/ace-builds/src-min/keybinding-vim.js'
            'components/ace-builds/src-min/theme-idle_fingers.js'
            'components/ace-builds/src-min/theme-twilight.js'
            'components/ace-builds/src-min/mode-coffee.js'
            'components/ace-builds/src-min/worker-coffee.js'
            'components/ace-builds/src-min/mode-javascript.js'
            'components/ace-builds/src-min/worker-javascript.js'
            'components/ace-builds/src-min/mode-markdown.js'

            # CoffeeScript
            'components/coffee-script/extras/coffee-script.js'

            # Markdown
            'components/markdown/lib/markdown.js'

            # Elvis
            'components/elvis/dist/elv.min.js'
          ]
        ]

  grunt.loadNpmTasks('grunt-contrib-copy')

  grunt.registerTask('default', ['copy'])
