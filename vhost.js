'use strict';

var base = '/games/spacefight';
var path = require('path');
var express = require('express');
var vhost = require('./lib/vdir')(express);
var www = vhost(base);
var app = www.server;
var routes = require('./routes');
var staticFiles = path.join(__dirname, 'public');
console.log("Static files servered from " + staticFiles);

app.configure(function(){
    app.set('port', process.env.PORT || 3003);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(staticFiles));
    app.use(base + '/', express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler());
    app.locals.pretty = true;
});

app.locals.base =  base ;

app.get(base +'/', routes.index);
app.get(base + '/play', routes.play);

module.exports = www;