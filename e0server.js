var express = require("express");

var app = express();
var jq = 'jquery-1.7.2.js';

app.get('/hello', function(req, res){
	res.send('Hello World');
});

var KCMaster = ""
var ADMaster = ""
var CLMaster = ""

var PTMaster = ""
var KSMaster = ""
var CTMaster = ""

var CRSlave = ""
var KSSlave = ""
var PTSlave = ""

app.get('/', function(req, res){
	res.send('<html><head> \
		<script src="' + jq + '"></script>\
		<script type="text/javascript">\
		$(document).ready(function(){\
			window.setInterval(getData, 1000);\
		});\
		function getData(){\
			$.getJSON("http://localhost:8000/data", function(data){\
				$("p").remove();\
				$("<p> Kc:" + data.kcmaster + "</p>").appendTo("#info");\
				$("<p> BD_ADDR: " + data.admaster + "</p>").appendTo("#info");\
				$("<p> CLK26: " + data.clmaster + "</p>").appendTo("#info");\
			});\
		}\
		</script>\
		</head>\
		<body><h1> E0 state monitoring server </h1>\
		<div id="info"></div>\
		</body></html>');
});

app.get('/data', function(req, res){
	res.send('{ "kcmaster" : "' + KCMaster + '", ' +
	       	'"admaster" : "' + ADMaster + '", ' +
	       '"clmaster" : "' + CLMaster + '" }');
});

app.get('/' + jq, function(req, res){
	res.sendfile('./' + jq);
});

app.get('/masterDetails', function(req, res){
	if (req.query.kcmaster === undefined)
		res.send("error: kcmaster");
	else if (req.query.admaster === undefined)
		res.send("error: admaster");
	else if (req.query.clmaster === undefined)
		res.send("error: clmaster");
	else {
		res.send("1");
		KCMaster = req.query.kcmaster;
		ADMaster = req.query.admaster;
		CLMaster = req.query.clmaster;
	}
});

app.listen(8000);
console.log('Listening');
