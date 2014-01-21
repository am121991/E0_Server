var express = require("express");
var request = require("request");

var app = express();
var jq = 'jquery-1.7.2.js';

app.get('/hello', function(req, res){
	res.send('Hello World');
});

var KCMaster = "";
var KCSlave = "";

var ADMaster = "";
var CLMaster = "";

var PTMaster = "";
var KSMaster = "";
var CTMaster = "";

var CTSlave = "";
var KSSlave = "";
var PTSlave = "";

var masterUrl = "";
var slaveUrl = "";

app.get('/', function(req, res){
	res.send('<html><head> \
		<script src="' + jq + '"></script>\
		<script type="text/javascript">\
		$(document).ready(function(){\
			window.setInterval(getData, 1000);\
		});\
		function getData(){\
			$.getJSON("http://localhost:8000/data?callback=?", function(data){\
				$("p").remove();\
				$("<p> Master Kc:" + data.kcmaster + "</p>").appendTo("#info");\
				$("<p> Master BD_ADDR: " + data.admaster + "</p>").appendTo("#info");\
				$("<p> Master CLK26: " + data.clmaster + "</p>").appendTo("#info");\
				$("<p> Master Plain Text: " + data.ptmaster + "</p>").appendTo("#info");\
				$("<p> Master Key Stream: " + data.ksmaster + "</p>").appendTo("#info");\
				$("<p> Master Cipher Text: " + data.ctmaster + "</p>").appendTo("#info");\
				$("<p> Slave Kc:" + data.kcslave + "</p>").appendTo("#info");\
				$("<p> Slave Plain Text: " + data.ptslave + "</p>").appendTo("#info");\
				$("<p> Slave Key Stream: " + data.ksslave + "</p>").appendTo("#info");\
				$("<p> Slave Cipher Text: " + data.ctslave + "</p>").appendTo("#info");\
			});\
		}\
		</script>\
		</head>\
		<body><h1> E0 state monitoring server </h1>\
		<form action="setAddress" method="get">\
		Device 1 URL: <input type="text" name="d1url" value="' + masterUrl + '" /><br />\
		Device 2 URL: <input type="text" name="d2url" value="' + slaveUrl + '" /><br />\
		<input type="submit" value="set">\
		</form>\
		<br>\
		<form action="sendkc" method="get">\
		Device 1 Kc: <input id="Kc1_in" type="text" size="33" name="d1kc" value="' + KCMaster +'" \
        onkeyup="$(\'#Kc1_len\').text(this.value.length);">\
        <span id="Kc1_len">0</span> chars<br>\
		Device 2 Kc: <input type="text" size="33" name="d2kc" value="' + KCSlave  +'"\
        onkeyup="$(\'#Kc2_len\').text(this.value.length);">\
        <span id="Kc2_len">0</span> chars<br>\
		<input type="submit" value="send">\
		</form>\
		<br>\
		<form action="sendPT" method="get">\
		Device 1 plaintext: <input type="text" name="pt"><br>\
		<input type="hidden" name="sendee" value="master">\
		<input type="submit" value="send">\
		</form>\
		<br>\
		<form action="sendPT" method="get">\
		Device 2 plaintext: <input type="text" name="pt"><br>\
		<input type="hidden" name="sendee" value="slave">\
		<input type="submit" value="send">\
		</form>\
		<hr>\
		<div id="info"></div>\
		<br>\
		<div id="master"></div>\
		<br>\
		<div id="slave"></div>\
		</body></html>'
	);
});

app.get('/sendPT', function(req, res){ //TODO send data to clients i.e. req.query.pt based on req.query.sendee
	var url = "";
	if (req.query.pt !== undefined){
		if (req.query.sendee === "master"){
			url = masterUrl;
		}
		else if (req.query.sendee === "slave"){
			url = slaveUrl;
		}
		if (url !== ""){
			request.post(
				url + "/message",
				{form: {"plaintext": req.query.pt}},
				function (error, response, body){
					if (!error && response.statusCode == 200){
						console.log(body);
					}
				}
			);
		}
	}
	res.redirect("http://localhost:8000");
});

app.get('/sendkc', function(req, res){
	
    console.log("Hello")

    console.log(req.query.d1kc)

    if (req.query.d1kc !== undefined){
		request.post(
			masterUrl + "/Kc",
			{ form: {"Kc": req.query.d1kc}},
			function (error, response, body){
				if (!error && response.statusCode == 200){
					console.log(body);
				}
			}
		);
        KCMaster = req.query.d1kc;
	}
	if (req.query.d2kc !== undefined){
		request.post(
			slaveUrl + "/Kc",
			{ form: {"Kc": req.query.d2kc}},
			function (error, response, body){
				if (!error && response.statusCode == 200){
					console.log(body);
				}
			}
		);
        KCSlave = req.query.d2kc;
	}
	res.redirect("http://localhost:8000");
});

app.get('/setAddress', function(req,res){
	if (req.query.d1url !== undefined){
		masterUrl = req.query.d1url;
	}
	if (req.query.d2url !== undefined){
		slaveUrl = req.query.d2url;
	}
	res.redirect("http://localhost:8000");
});

app.get('/data', function(req, res){
	if (req.query.callback === undefined){
		res.send(KCMaster + ", " + ADMaster + ", " + CLMaster);
	}
	else {
		res.send(req.query.callback + 
			'({ "kcmaster" : "' + KCMaster + '", ' +
			'"kcslave" : "' + KCSlave + '", ' +
			'"admaster" : "' + ADMaster + '", ' +
			'"clmaster" : "' + CLMaster + '", ' +
			'"ptmaster" : "' + PTMaster + '", ' +
			'"ksmaster" : "' + KSMaster + '", ' +
			'"ctmaster" : "' + CTMaster + '", ' +
			'"ptslave" : "' + PTSlave + '", ' +
			'"ksslave" : "' + KSSlave + '", ' +
			'"ctslave" : "' + CTSlave + '"});');
	}
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

app.get('/plainText', function(req, res){
	if (req.query.role === undefined || req.query.content === undefined){
		res.send("0");
		return;
	}
	else if (req.query.role === "master"){
		PTMaster = req.query.content;
	}
	else {
		PTSlave = req.query.content;
	}
	res.send("1");
});

var qs = require('querystring');

app.post('/keyStream', function(req, res) {
    var body = '';

    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        var POST = qs.parse(body);
        var keyStream = new Buffer(POST["msg"], "base64").toString("hex");
        
        if (req.query.role === "master") {
            KSMaster = keyStream;
        }
        else if (req.query.role === "slave") {
            KSSlave = keyStream;
        }

        console.log(keyStream)
    });

	res.send("1");
});

app.get('/keyStream', function(req, res){
	if (req.query.role === undefined || req.query.content === undefined){
		res.send("0");
		return;
	}
	else if (req.query.role === "master"){
		KSMaster = req.query.content;
	}
	else {
		KSSlave = req.query.content;
	}
	res.send("1");
});

app.get('/cipherText', function(req, res){
	if (req.query.role === undefined || req.query.content === undefined){
		res.send("0");
		return;
	}
	else if (req.query.role === "master"){
		CTMaster = req.query.content;
	}
	else {
		CTSlave = req.query.content;
	}
	res.send("1");
});

app.listen(8000);
console.log('Listening');
