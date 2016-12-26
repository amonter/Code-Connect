var fs = require("fs");
//vaebug = require('debug')
var path = require('path');
var mongo = require('mongodb');
var monk = require('monk');
var db2 = monk('localhost:27017/globalsouth');
//var db = monk('amonter5:espana6248@54.175.50.182:27017/globalsouth');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('NHpudxhV9HV6zakj7-gH0A');
var readline = require('linebyline'),
      rl = readline('partners_2.csv');

var count = 0;
var la;

//checkEmail();
//connectMongo();

var filePath = path.join(__dirname, 'templates.txt');
var lines = [];


var contents = fs.readFileSync(filePath, 'utf8');
readContent();
function readContent (){
	var allTextLines = contents.split(/\r\n|\n/);
        for (var i=0; i<allTextLines.length; i++) {
                var data = allTextLines[i].split(',');

                    var tarr = [];
                    for (var j=0; j<data.length; j++) {
                        if(data[j].length > 0){
				tarr.push(data[j]);
			}
                    }
                lines.push(tarr);
        }
        //console.log(lines); 
}




rl.on('line', function(line, lineCount, byteCount) {
	 var elements = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                if (lineCount > 0){
                        //console.log(elements[0]+" "+elements[1]+" "+elements[2]);
                        var theEmail = elements[1].split(',');
                        var template  = elements[7];
                        var formatText = elements[8];
			var formatting = '';
			if (formatText.length > 1) formatting = formatText.split(',');
                        var collection = db2.get('people');

                        collection.findOne({email : theEmail}, function (err, doc) {
                                if(doc) {
                                        //console.log(doc.email[0]);
                                        for (var j=0; j<lines.length; j++){
                                                //console.log(template);
                                                if (lines[j][0] == template){
                                                        //console.log(formatting);
                                                        //console.log(formatting.length);
                                                        if (formatting.length > 0){
                                                                console.log(formatting);
                                                        } else {
                                                                console.log(lines[j][1]);
                                                        }
                                                }
                                        }
                                        //console.log(doc.company+" company "+theName);         
                                } else {
                                        console.log('record not found');
                                }
                        })
		}	
	}).on('error', function(e) {
	// something went wrong 
	console.log("error for sure");
});


rl.on('end', function () {
	//console.log("END "+la);
});

function connectMongo(){
	var collection = db2.get('people');
	collection.find({}, function (err, doc) {
		console.log(doc[0]);
	});
}

function checkEmail(){
	//web-yPcyzu@mail-tester.com
	//sendMail('Petra', 'web-7NLcV8@mail-tester.com', "", "");
}

function sendMail (name, email, update, followup) {

console.log(name+" "+email+" \n "+ update+" \n ");
var template_name = "catch-up";
var template_content = [{
        "name": "example name",
        "content": "example content"
}];

var message = {
			"html": "",
			"text": "",
			"subject": "",
			"from_email": "a@latamtechmeetup.com",
			"merge": true,
			"merge_language": "mailchimp",
			"merge_vars": [{
			"rcpt": email,
			"vars": [{
				"name": "firstname",
				"content": name}
			]}],
		    "from_name": "Adrian Avendano",
		    "to": [{
			    "email": email,
			    "name": "",
			    "type": "to"
			}],
		    "headers": {
			"Reply-To": "a@latamtechmeetup.com"
		    }
	};

	mandrillSend(message, template_name, template_content);
}


function mandrillSend(message, template_name, template_content) {
	console.log("madrill mandrill");
	var async = true;
	var ip_pool = "Main Pool";
	var send_at = "";
	mandrill_client.messages.sendTemplate({"template_name": template_name, "template_content": template_content, "message": message, "async": async, "ip_pool": ip_pool, "send_at": send_at}, function(result) {
			for (i=0;i<result.length;i++){
				console.log(JSON.stringify(result[i]));
			}	
		
		}, function(e) {
		    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
		}
	);
}
