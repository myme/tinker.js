#!/usr/bin/env node

var express = require('express');
var compiless = require('express-compiless');
var fs = require('fs');
var path = require('path');
var uuid = require('uuid');

var configFile = function () {
  var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  return path.join(home, '.tinker.json');
};

var optimist = require('optimist')
  .usage('Usage $0 [files]')
  .default('port', 3000)
  .alias('c', 'config')
  .alias('p', 'port')
  .alias('h', 'help')
  .describe('config', 'Tinker configuration file')
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

var getConfig = function (file, callback) {
  fs.readFile(file, function (err, data) {
    var json;
    if (err && err.code !== 'ENOENT') {
      return callback(err);
    }
    try {
      json = JSON.parse(data || '{}');
    } catch (e) {
      return callback('Illegal JSON format');
    }
    callback(null, json);
  });
};

app.get('/', function (req, res) {
  var id = uuid.v4();
  var config = argv.config || configFile();
  getConfig(config, function (err, data) {
    if (err) {
      throw err;
    }
    res.render('index', {
      id: id,
      mode: argv.mode || data.mode || 'default',
      theme: argv.theme || data.theme || 'default'
    });
  });
  var dir = path.resolve(process.cwd(), path.dirname(config));
  app.use('/' + id, express.static(dir));
});

app.listen(argv.port);
console.log('Listening on http://localhost:' + argv.port);
