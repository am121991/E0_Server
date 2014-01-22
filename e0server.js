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
var ADSlave = "";
var CLMaster = "";

var PTMaster = "";
var KSMaster = "";
var CTMaster = "";

var CTSlave = "";
var KSSlave = "";
var PTSlave = "";

var masterUrl = "";
var slaveUrl = "";

var url1 = "";
var url2 = "";

app.get('/', function(req, res){
    res.send(swig.renderFile(__dirname + '/index.html', {
        'jq' : jq, 
        'masterUrl' : masterUrl,
        'slaveUrl' : slaveUrl,
        'device_1_Url' : url1,
        'device_2_Url' : url2,
        'KCMaster' : KCMaster, 
        'KCSlave'  : KCSlave,  
        'Kc1_len'  : KCMaster.length,  
        'Kc2_len'  : KCSlave.length,  
    }));
});

app.get('/slave', function(req, res){
    res.send(swig.renderFile(__dirname + '/slave.html', {
        'jq' : jq, 
        'masterUrl' : masterUrl,
        'slaveUrl' : slaveUrl,
        'device_1_Url' : url1,
        'device_2_Url' : url2,
        'KCMaster' : KCMaster, 
        'KCSlave'  : KCSlave,  
        'Kc1_len'  : KCMaster.length,  
        'Kc2_len'  : KCSlave.length,  
    }));
});

app.get('/master', function(req, res){
    res.send(swig.renderFile(__dirname + '/master.html', {
        'jq' : jq, 
        'masterUrl' : masterUrl,
        'slaveUrl' : slaveUrl,
        'device_1_Url' : url1,
        'device_2_Url' : url2,
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
    if (req.query.silent !== undefined) {
        res.send(req.query.sendee + ": " + req.query.pt);
    } else {
        res.redirect("http://localhost:8000");
    }
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
    if (req.query.silent !== undefined) {
        res.send("Slave:  " + KCSlave + "\n" 
               + "Master: " + KCMaster);
    } else {
        res.redirect("http://localhost:8000");
    }
});

app.get('/setAddress', function(req,res){
	if (req.query.d1url !== undefined) {
		if ((req.query.d1url.substr(0, 16) !== "http://127.0.0.1")
            || (req.query.d1url.substr(0, 16) !== "http://localhost")){
            url1 = "http://127.0.0.1" + req.query.d1url;
        } else if (req.query.d1url.substr(0, 7) !== "http://") {
            url1 = "http://" + req.query.d1url;
        } else {
            url1 = req.query.d1url;
        }

        request(url1 + "/isMaster", function(error, response, body) {
            console.log(body); 
            if (body === "true") {
                masterUrl = url1;
            } else {
                slaveUrl = url1;
            }
        });
	}

	if (req.query.d2url !== undefined) {
        if ((req.query.d2url.substr(0, 16) !== "http://127.0.0.1")
            || (req.query.d2url.substr(0, 16) !== "http://localhost")){
            url2 = "http://127.0.0.1" + req.query.d2url;
        } else if (req.query.d2url.substr(0, 7) !== "http://") {
            url2 = "http://" + req.query.d2url;
        } else {
            url2 = req.query.d2url;
        }

        request(url2 + "/isMaster", function(error, response, body) {
            console.log(body); 
            if (body === "true") {
                masterUrl = url2;
            } else {
                slaveUrl = url2;
            }
        });
	}

	if (req.query.silent !== undefined) {
        res.send("Slave:  " + slaveUrl + "\n" 
               + "Master: " + masterUrl);
    } else {
        res.redirect("http://localhost:8000");
    }
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

app.post('/log', function(req, res) {
    var body = '';

    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        var POST = qs.parse(body);
    
        var log_entry = {}    
        log_entry["ciphertext"] = new Buffer(POST["ciphertext"], "base64").toString("hex");
        log_entry["isReceiving"] = (POST["is_receiving"] == 'true')
        log_entry["keystream"] = new Buffer(POST["keystream"], "base64").toString("hex");
        log_entry["plaintext"] = POST["plaintext"];
        log_entry["timestamp"] = POST["timestamp"];

        if (req.query.role === "master") {
            logs["device_1"].push(log_entry);
            //XXX: This is not scheme dummy
            CLMaster = (parseInt("0x" + (new Buffer(POST["CLK"], "utf-8").toString("hex"))));
            ADMaster = POST["BD_ADDR"];
        } else if (req.query.role === "slave") {
            logs["device_2"].push(log_entry);
            ADSlave = POST["BD_ADDR"];;
        }
    });

	res.send("1");
});

app.listen(8000);
console.log('Listening');
