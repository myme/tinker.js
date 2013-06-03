#!/usr/bin/env node

var express = require('express');
var compiless = require('express-compiless');
var fs = require('fs');
var path = require('path');

var optimist = require('optimist')
  .usage('Usage $0 [files]')
  .default('mode', 'javascript')
  .default('port', 3000)
  .default('theme', 'default')
  .alias('p', 'port')
  .alias('h', 'help')
  .describe('mode', 'The inital editor mode')
  .describe('port', 'Run server on designated port')
  .describe('theme', 'The inital editor theme')
  .describe('help', 'Show this help text');

var argv = optimist.argv;
if (argv.help) {
  optimist.showHelp();
  process.exit(1);
}

var app = express();
var rootDir = path.join(__dirname, '..');

app.set('views', path.join(rootDir, 'views'));
app.set('view engine', 'jade');

app.use(express.logger());
app.use(compiless({ root: path.join(rootDir, 'src') }));
app.use('/lib', express.static(path.join(rootDir, 'lib')));
app.use('/src', express.static(path.join(rootDir, 'src')));
app.use('/', express.static(path.join(rootDir, 'static')));

var scripts = [
  '/lib/ace.js',
  '/lib/keybinding-vim.js',
  '/lib/coffee-script.js',
  '/lib/elv.min.js',
  '/src/utils.js',
  '/src/tinker.js',
  '/src/tinker_coffee.js',
  '/src/tinker_javascript.js'
];

argv._.forEach(function (filename) {
  app.get('/sources/' + filename, function (req, res) {
    fs.readFile(filename, function (err, data) {
      if (err) {
        throw err;
      }
      res.set({
        'Content-Type': 'text/javascript'
      });
      res.send(200, data);
    });
  });
});

scripts = scripts.concat(argv._.map(function (filename) {
  return '/sources/' + filename;
}));

app.get('/', function (req, res) {
  res.render('index', {
    mode: argv.mode,
    scripts: scripts,
    theme: argv.theme
  });
});

app.listen(argv.port);
console.log('Listening on http://localhost:' + argv.port);
