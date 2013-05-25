#!/usr/bin/env node
/*jshint es5: true */

var express = require('express');
var compiless = require('express-compiless');
var path = require('path');

var optimist = require('optimist')
  .usage('Usage $0 [files]')
  .default('port', 3000)
  .alias('p', 'port')
  .alias('h', 'help')
  .describe('port', 'Run server on designated port')
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

app.get('/', function (req, res) {
  res.render('index', {});
});

app.listen(argv.port);
console.log('Listening on http://localhost:' + argv.port);
