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
			$("#button").bind("click", function(){\
				getData();\
			});\
		});\
		function getData(){\
			$.getJSON("http://localhost:8000/data", function(data){\
				$("p").remove();\
				$.each(data.items, function(i, item){\
					$("<p>" + item + "</p>").appendTo("#info");\
				});\
			});\
		}\
		</script>\
		</head>\
		<body>Hello\
		<input id="button" type="submit" value="fetch">\
		<div id="info"></div>\
		</body></html>');
});

app.get('/data', function(req, res){
	res.send('{ "items" : ["' + KCMaster + '", "' + ADMaster + '", "' + CLMaster + '"] }')
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
