var express = require("express");
var request = require("request");
var swig = require("swig");
var qs = require('querystring');

var app = express();
var jq = 'jquery-1.7.2.js';

var logs = {
    "device_1" : [],
    "device_2" : [],
}

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
    res.send(swig.renderFile(__dirname + '/index.html', {
        'jq' : jq, 
        'masterUrl' : masterUrl,
        'slaveUrl' : slaveUrl,
        'KCMaster' : KCMaster, 
        'KCSlave'  : KCSlave,  
        'Kc1_len'  : KCMaster.length,  
        'Kc2_len'  : KCSlave.length,  
    }));
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
			'"ctslave" : "' + CTSlave + '", ' +
			'"logs" : ' + JSON.stringify(logs) + '});');

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

app.post('/log', function(req, res) {
    var body = '';

    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        var POST = qs.parse(body);
    
        var log_entry = {}    

        console.log(POST)

        log_entry["ciphertext"] = new Buffer(POST["ciphertext"], "base64").toString("hex");
        log_entry["isReceiving"] = (POST["is_receiving"] == 'true')
        log_entry["keystream"] = new Buffer(POST["keystream"], "base64").toString("hex");
        log_entry["plaintext"] = POST["plaintext"];
        log_entry["timestamp"] = POST["timestamp"]

        if (req.query.role === "master") {
            logs["device_1"].push(log_entry)
        }
        else if (req.query.role === "slave") {
            logs["device_2"].push(log_entry)
        }

        console.log(log_entry)
    });

	res.send("1");
});

app.listen(8000);
console.log('Listening');
