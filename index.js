const fs = require("fs")

var d1 = new Date('2022-2-12 12:51:18')
var messages='';
async function convertToISO(time){
a = new Date(d1.getTime() + time);
a = a.toISOString();
	return a;

}

async function getOneSymblMessage(text,userId, startTime,endTime)
{

	startTime=await convertToISO(startTime)
	endTime=await convertToISO(endTime)
	var data ={

		"payload" : {
			"content" : text,
			"contentType": "text/plain"
		},

		"from":{
			"name":userId,
			"userId":userId
		},
		"duration":{
			"startTime": startTime,
			"endTime": endTime
		}

	}
	messages=messages+','+data;
	return data;
}

async function readGongTranscript(){

	
///input path to gong transcript
	await fs.readFile('./GongTranscript/FabricInfosys.txt', 'utf8', function (err, data) {
		if (err) {
			console.error(err)
			throw "unable to read  file.";
		}
		const obj = JSON.parse(data)
		var final =''
		
		var callTranscripts=obj["callTranscripts"]
		callTranscripts=callTranscripts[0]
		callTranscripts= callTranscripts["transcript"]
		callTranscripts.forEach(function(transcript) {
			var sentences=transcript["sentences"]
			var userId= transcript["speakerId"]
			sentences.forEach((sentence)=>{
				var startTime=sentence["start"];
				var endTime=sentence["end"];
				var text=sentence["text"];
				getOneSymblMessage(text,userId,startTime,endTime).then((data)=>{	
					console.log(data);
					data=','+JSON.stringify(data)
          ///Output file name for Symbl consumable transcript  
					fs.appendFile('message1.txt',data, function (err) {
						if (err) throw err;

					});
					
					
					
				})	
			})
			
		});
		
	});
	

}

readGongTranscript()
