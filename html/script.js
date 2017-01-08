/* Varable globale */
var meteo_timeout;
var horloge_timeout;
var ping_timeout;
var xplanet_timeout;
var station_url = 'http://192.168.1.9:8085';


//xplanet
function xplanet () {
  var now = new Date().getTime();
  
  // préchargement des images
  var img_moon  = $("<img />").attr("src", "xplanet/xplanet_moon.jpg?"+now);
  // affichage des nouvelles images à l'écran
  $("#img_moon").attr("src", "xplanet/xplanet_moon.jpg?"+now);
  
  ping_timeout = setTimeout("xplanet()", 60000);    
}


//Horloge
var dows  = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
var mois2  = ["janv", "f&eacute;v", "mars", "avril", "mai", "juin", "juillet", "ao&ucirc;t", "sept", "oct", "nov", "d&eacute;c"];
function horloge() {
  now          = new Date;
  heure        = now.getHours();
  min          = now.getMinutes();
  sec          = now.getSeconds();
  jour_semaine = dows[now.getDay()];
  jour         = now.getDate();
  mois         = mois2[now.getMonth()];
  annee        = now.getFullYear();

  if (sec < 10){sec0 = "0";}else{sec0 = "";}
  if (min < 10){min0 = "0";}else{min0 = "";}
  if (heure < 10){heure0 = "0";}else{heure0 = "";}

  horloge_heure   = heure + ":" + min0 + min;
  horloge_date    = "<span class='horloge_grey'>" + jour_semaine + "</span> " + jour + " " + mois + " <span class='horloge_grey'>" + annee + "</span>";
  horloge_content = "<div class='horloge_heure'>" + horloge_heure + "</div><div class='horloge_date'>" + horloge_date + "</div>";

  $("#horloge").html(horloge_content);

  horloge_timeout = setTimeout("horloge()", 10000);
}


// Update
var forecastJSON = '';
function update() {
		
  $.getJSON(station_url, function(data) {	  
	  
	  if (mesure.length > 10){
		 mesure.splice(0, 1);
	  }	  
	  mesure.push(data.tmpInt);
	  
	  if (mesure2.length > 10){
		 mesure2.splice(0, 1);
	  }
	  mesure2.push(data.tmpExt);	  
	  
	  drawCurve();
	  
	  $("#tempint").html(data.tmpInt + "°");	
	  $("#tempext").html(data.tmpExt + "°");
	  $("#tempimpr").html(data.tmpImpr + "°");		  
	  
	  $("#sondeAlive").html("Sonde: " + data.timeSonde + " signal: " + data.sondeRSSI );
	  //if(timeSonde){
		//$("#ping").css('color', 'red');
	  //} else {
		$("#ping").css('color', 'green');  
	  //}
	  
	  if (JSON.stringify(forecastJSON) != JSON.stringify(data.forecastJSON)){
		  console.log(data.forecastJSON);
		  forecastJSON = data.forecastJSON;
		  initPrev();
	  }
	  
	  //data.wifi_strength;	  
	  //data.ping;		
	  
	  if(data.todo == 'reload'){
		  location.reload(); 
	  }
	  
  });   
   
  var started = new Date().getTime();
  var http = new XMLHttpRequest();

  http.open("GET", "http://www.google:80", true);
  http.onreadystatechange = function() {
    if (http.readyState == 4) {
      var ended = new Date().getTime();
      var milliseconds = ended - started;      
	  $("#ping").html("Ping : "+ milliseconds + "ms");	
	  $("#ping").css('color', 'green');  
    }
  };
  
  try {
    http.send(null);
  } catch(exception) {
    $("#ping").html("Ping : Error");	  
	$("#ping").css('color', 'red');
  }  

  ping_timeout = setTimeout("update()", 5000);
	
}


var mesure = [];
var mesure2 = [];
function drwSegment(startx,pas,val1,val2,maxV,minV,maxX,maxY,color,add,lineSize,context){		
	
	var y1 = maxY - ((val1-minV)/maxV)*maxY;
	var y2 = maxY - ((val2-minV)/maxV)*maxY;
	var x1 = startx;
	var x2 = startx+pas;	
	
	context.beginPath();
	context.lineWidth = lineSize/2;	
	context.strokeStyle = 'white';	
	context.arc(x1, y1, 5, 0, 2 * Math.PI, true);	
	context.fillStyle = color;	
    context.fill();
	context.stroke();
	
	context.beginPath();
	context.lineWidth = lineSize;
	context.strokeStyle = color;
	context.quadraticCurveTo(x1,y1,x2,y2);	
	context.stroke();
		
	context.beginPath();
	context.fillStyle = color;	
	context.font=(lineSize*6)+"px Verdana";
	context.fillText(Math.trunc(val1)+add,x1-5,y1-20);	
	context.stroke();
	
	context.beginPath();
	context.lineWidth = lineSize;
	context.strokeStyle = color;
	context.quadraticCurveTo(x1,y1,x2,y2);	
	context.stroke();	
}



function drawCurve() {
  
	var canvas = document.getElementById("graph");
	var context = canvas.getContext('2d');	
	var width = canvas.width = document.getElementById('graph').clientWidth;
	var height = canvas.height = document.getElementById('graph').clientHeight;	
	var tmpMax = 30;
	var tmpMin = 10;
  
	context.clearRect(0, 0, width, height);
	context.fillStyle = 'rgba(255,255,255,0.3)';
	context.fillRect(0,0,width,height);	
  
	var last = 0;
	for (i = 0; i < mesure.length-1; i++) {	
	
	    var pas = width/mesure.length; 		
		var y1 = (height+tmpMin) - (mesure[i]*(height/tmpMax));
		var y2 = (height+tmpMin) - (mesure[i+1]*(height/tmpMax));
		
		drwSegment(last,pas,(mesure[i]), (mesure[i+1]),40,0,width,height,'red','°',2,context);		
		drwSegment(last,pas,(mesure2[i]), (mesure2[i+1]),40,0,width,height,'blue','°',2,context);	
		
		last += pas;	
	} 
}


function initPrev() {
  
	// premier
	var canvas = document.getElementById("graphPrev");
	var context = canvas.getContext('2d');	
	var width = canvas.width = document.getElementById('graphPrev').clientWidth;
	var height = canvas.height = document.getElementById('graphPrev').clientHeight;	
  
    context.clearRect(0, 0, width, height);
	context.fillStyle = 'rgba(255,255,255,0.3)';
	context.fillRect(0,0,width,height);		
	
	// Second	
	var canvas2 = document.getElementById("pres");
	var context2 = canvas2.getContext('2d');	
	var width2 = canvas2.width = document.getElementById('pres').clientWidth;
	var height2 = canvas2.height = document.getElementById('pres').clientHeight;	
  
    context2.clearRect(0, 0, width2, height2);
	context2.fillStyle = 'rgba(255,255,255,0.3)';
	context2.fillRect(0,0,width2,height2);		
  
	if (forecastJSON.list){
		
		var now = new Date;
		var dayID = now.getDay()+1;	
		var lasth = 25;
		
		var last = 7;
		var last2 = 7;
		for (i = 0; i < forecastJSON.list.length-2; i++) {
			
			var pas = 2*(width/forecastJSON.list.length+2);			

			var time = forecastJSON.list[i].dt_txt.split(" ")[1].split(":");			
			var start = 50;
			//Haut
			if (time[0] == 0){
				context.beginPath();
				context.fillStyle = 'white';	
				context.font="bold "+30+"px Verdana";
				context.fillText(dows[dayID].toUpperCase(),last+pas+10,35);	
				context.stroke();
				if (dayID<6){
					dayID++;
				}else{
					dayID=0;
				}
				start = 10;
			}
			lasth = time[0];
		
			//Bas
			context.beginPath();
			context.fillStyle = 'white';	
			context.font=20+"px Verdana";
			context.fillText(time[0]+"h",last+pas-20,height-20);	
			context.stroke();			
			
			//Graduation
			context.beginPath();
			context.lineWidth = 1;
			context.strokeStyle = 'white';
			context.quadraticCurveTo(last+pas,start,last+pas,height-50);	
			context.stroke();
			
			drwSegment(last,pas,(forecastJSON.list[i].main.temp - 273.15), (forecastJSON.list[i+2].main.temp - 273.15),50,-10,width,height,'yellow','°',4,context);
			drwSegment(last,pas,forecastJSON.list[i].main.humidity,forecastJSON.list[i+2].main.humidity,150,0,width,height,'blue','%',4,context);
			

			var pas2 = 8.7*(width2/forecastJSON.list.length+2);
			drwSegment(last2,pas2,forecastJSON.list[i].main.pressure,forecastJSON.list[i+2].main.pressure,1070,960,width2,height2,'green','',4,context2);
			
			i++;
			last += pas;
			last2 += pas2;
		}
	}
	
}


/* Appel */
horloge();
update();
xplanet();
