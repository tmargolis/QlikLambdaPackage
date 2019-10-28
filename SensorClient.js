var ioclient = require('socket.io-client')('http://localhost:44444');
var uniqueRandomArray=require('random-item');
const Promise = require('bluebird');
const qsocks = require('qsocks');
var intervalGenSecs=0.1;
var intervalGenMs=intervalGenSecs*1000; //every x milliseconds for typical sensor readings
var sensorClassArray = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P');
var sensorClass=uniqueRandomArray(sensorClassArray);
sensorIdArray=new Array('A123', 'B234', 'C535', 'D254','E559','F023','G737', 'H344', 'I743', 'J554','K534','L024','M232','N020','O255','P723');
var sensorId = uniqueRandomArray(sensorIdArray);
var readValue=0;
var readValuePrev1=0;
var timeStamp=Math.floor(Date.now() / 1000);
var timeString=new Date();
var secondsPassed=0;
var eventArray=[];
var positionNum=0;
var anomalyFg=0;
var generateFg=1;
var widgetId=1; 
var statusCode='';
var statusCodePrev='';
var failValue=0;
var failValuePrev=0;
var readCounter=0;
var readCounterBtwFail=0;
var failValueTest=0;
var meetsFailCriteria=0;
var conveyorSection=0;

ioclient.on('generateDataYN', function(data) {
    generateFg=data;
});

setInterval(function() { console.log("It's been "+intervalGenSecs+" seconds, sending out a reading"); 
	if (generateFg===1) {
		readCounter=readCounter+1;

		// incriment widget IDs every 10th sensor reading
		if(readCounter % 10 == 0){
			widgetId=widgetId+1;
		}

		// sensorIdArray=sensorIdArray;
		// sensorId = sensorIdArray[positionNum-1];
		// sensorClass=sensorClassArray[positionNum-1];

		readValue=Math.floor(Math.random() * 30) + 1987;

		timeStamp=Math.floor(Date.now() / 1000);
		timeString=new Date();

		sensorValues = {
				'sensorid':sensorId,
				'timestamp': timeStamp, 
				'timestring': timeString,
				'read_id':readCounter,
				'readvalue':readValue, 
				'sensorclass':sensorClass, 
				'sensorposition':positionNum, 
				'widgetId':widgetId, 
				'conveyorsection':conveyorSection
			};

		ioclient.emit('sensoremit',sensorValues);
		console.log('sensorValues',sensorValues);
    } else {
		console.log('not generating sensor data');
	}

}, intervalGenMs);
