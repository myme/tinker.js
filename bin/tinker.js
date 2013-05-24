#!/usr/bin/env node

var express = require('express');
var compiless = require('express-compiless');
var path = require('path');

var app = express();
var port = 3000;
var rootDir = path.join(__dirname, '..');

app.set('views', path.join(rootDir, 'views'));
app.set('view engine', 'jade');

app.use(express.logger());
app.use(compiless({ root: path.join(rootDir, 'src') }));
app.use('/lib', express.static(path.join(rootDir, 'lib')));
app.use('/src', express.static(path.join(rootDir, 'src')));

app.get('/', function (req, res) {
  res.render('index', {});
});

app.listen(port);
console.log('Listening on http://localhost:' + port);
