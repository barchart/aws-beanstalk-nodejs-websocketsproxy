'use strict';

/*!
 * proxyserver: a node.js websocket to other proxy server
 * Copyright(c) 2014 Barchart.com, Inc. All Rights Reserved.
 */

/*
 * The file is called app.js so that it conforms, more or
 * less, to the way AWS ElasticBeanstalk is set up.
 *
 * The important files in this folder are:
 * app.js (this file)
 * package.json (which contains all of the dependencies)
 * .gitignore
 */

/*
 * Core includes.
 */
 
var express = require('express');
var http = require('http');
var net = require('net');
var WebSocketServer = require('ws').Server;


var settings = {
	"port" : process.env.PORT || 8081,
	"documentRoot" : __dirname,
	"proxies" : {
		"jerq" : {
			"server" : "qs-us-e-01.aws.barchart.com",
			"port" : 7500
		}
	}
};


var app = express();
app.use(express.static(settings.documentRoot));


var server = http.createServer(app);
server.listen(settings.port);

console.log('Proxy Server running on ' + server.address().port);


var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws) {
	var proxy = settings.proxies[ws.upgradeReq.url.substring(1)];

	if (proxy) {
		var client = net.connect(
		{
			host: proxy.server,
			port: proxy.port
		},
	    function() { // 'connect' listener
		});

		client.on('data', function(data) {
			ws.send(data.toString(), function() { });
		});

		client.on('end', function() {
			ws.close();
		});

		client.on('error', function(er) {
			client.end();
			ws.close();
		});

		ws.on('close', function() {
			client.end();
		});

		ws.on('message', function(message) {
			client.write(message);
			client.write("\r\n");
		});
	}
	else
		console.log('Unable to find proxy for "' + ws.upgradeReq.url + '"');
});

