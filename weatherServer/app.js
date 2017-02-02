var http = require('http');
var url = require('url');
var querystring = require('querystring');
var SerialPort = require("serialport");
var schedule = require('node-schedule');
var request = require('request');

try {
	var port = new SerialPort("/dev/ttyAMA0", { baudRate: 9600 , parser: SerialPort.parsers.readline('\n')});
} catch (err) {
	console.log("Error Serial port");
}	

var tmpInt = 0;
var stationRSSI = 0;

var tmpExt = 0;
var last_Sonde = 0;
var sondeRSSI = 0;

var tmpImpr = 0;

var pingpong = 0;
var lastime = 0;

var pos = 0;
var mesure  = [0,0,0,0,0,0,0,0,0,0];


port.on('data', function (data) {  	 
	try {
		var tab = data.split(" ");
		mesure[pos] = ((1025 - tab[0]) / 1025)*61.4;
		
		if (pos < 9) {
			pos ++;
		}else{
			pos = 0;
		}
		
	} catch (err) {
		console.log("Error Serial port");		
	}	
});

 
var octoprintAPIKey = '0B825C5C50D2499D91E84B15351E012E';
function updateDataFromOctoprintAPI(){
	try {
		request('http://192.168.1.61:5000/api/printer/tool?apikey=' + octoprintAPIKey, function (error, response, body) {
			if (!error && response.statusCode == 200) {						 
				tmpImpr = JSON.parse(body).tool0.actual-2;
			}else{
				console.log("Fail calling octoprint Api");
			}
		});
	} catch (err) {
		console.log("Error Xplanet");
	}
}

var xplanetCron = schedule.scheduleJob('*/10 * * * * *', function(){
	updateDataFromOctoprintAPI();
});
updateDataFromOctoprintAPI();


var xplanetCron = schedule.scheduleJob('*/1 * * * *', function(){
  try {
	var exec = require('child_process').exec;
		exec('xplanet -output /var/www/html/xplanet/xplanet_moon.jpg -body moon -geometry 250x250', function(err, stdout, stderr) {
			lastime = new Date();
		});	
	} catch (err) {
		console.log("Error Xplanet");
	}
});

var weatherAPIKey = 'e4426549d9d56a97c840d61bce1b1355';
var dailyJSON = '';
var forecastJSON = '';
var weatherJSON = '';
function updateDataFromAPI(){	
	try {
		console.log("update weather");
		/*request('http://api.openweathermap.org/data/2.5/forecast/daily?q=Draveil,fr&appid=' + weatherAPIKey, function (error, response, body) {
			if (!error && response.statusCode == 200) {			
				dailyJSON = JSON.parse(body);
			}else{
				console.log("Fail calling daily Weather Api");
			}
		});*/
			
		request('http://api.openweathermap.org/data/2.5/forecast?q=Draveil,fr&appid=' + weatherAPIKey, function (error, response, body) {
			if (!error && response.statusCode == 200) {
			  forecastJSON = JSON.parse(body);
			}else{
				console.log("Fail calling forecast Weather Api");
			}
		});
		/*	
		request('http://api.openweathermap.org/data/2.5/weather?q=Draveil,fr&appid=' + weatherAPIKey, function (error, response, body) {
			if (!error && response.statusCode == 200) {		 
			  weatherJSON = JSON.parse(body);
			}else{
				console.log("Fail calling weather Weather Api");
			}
		});*/
	} catch (err) {
		console.log("Error Xplanet");
	}
}
var weatherAPICron = schedule.scheduleJob('0 */1 * * *', function(){
	updateDataFromAPI();
});
updateDataFromAPI();


function trucTmp(tmp){
	tmp = Math.trunc(tmp*10)/10;  
	if (tmp == Math.trunc(tmp)){
		tmp = tmp + ".0";
	}
	return tmp;
}

var todo = '';
var server = http.createServer(function(req, res) {
	try {
		  
		var params = querystring.parse(url.parse(req.url).query);
		var page = url.parse(req.url).pathname;		  
		  
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
		res.setHeader('Access-Control-Allow-Credentials', true); // If needed
		
		res.writeHead(200, {"Content-Type": "application/json"}); 
		
		var data;
		
		if(page == '/reload'){	
		
			todo = 'reload';
			data = {succes: true};
			
		}else if(params['temp'] && params['wifi']){	 
		
			var date = new Date();
			console.log('Time: ' + date.getHours() + ':' + date.getMinutes() + ' Data: ' + params['temp']);
			tmpExt = params['temp'];			
			last_Sonde = date.getHours() + ':' + date.getMinutes();
			sondeRSSI = params['wifi'];
			
			data = {succes: true};
			
		}else{					 
			  
			//Moyenne of the tmp
			tmpInt = 0;	  
			for (i = 0; i < mesure.length; i++) {
				tmpInt += mesure[i];
			}
			tmpInt = tmpInt / mesure.length;
			
			//Trunc the tmp for display
			tmpInt = trucTmp(tmpInt);	
			tmpExt = trucTmp(tmpExt);
			tmpImpr = trucTmp(tmpImpr);
			  			  
			data = { 
				succes: true,
				tmpInt: tmpInt, 
				tmpExt: tmpExt, 
				tmpImpr: tmpImpr,
				timeSonde: last_Sonde, 
				stationRSSI: stationRSSI, 
				sondeRSSI: sondeRSSI, 				
				ping: pingpong, lastime: lastime,
				dailyJSON: dailyJSON,
				forecastJSON: forecastJSON,
				weatherJSON: weatherJSON,
				todo: todo
			};  

			todo = '';
		 
		}/*else{
			data = {succes: false};
		}*/
		
		var json = JSON.stringify(data);  
		res.end(json);
  
	} catch (err) {
		console.log("Error Answer request");
	}
});

server.listen(8085);
