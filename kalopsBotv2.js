if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('botkit');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

var saidGodmorning = false;
var today;
var oldDay = -1;

controller.hears(['godmorgon', 'morn', 'morning','god morgon', 'gomorron', 'morrn'], ['ambient', 'message_received'], function(bot, message) {
     today = new Date().getDate();

     if (saidGodmorning && (today !== oldDay)){
        saidGodmorning = false;
     }
    if (!saidGodmorning) {
         var reply_with_attachments = {
        'username': 'Hannah' ,
        'text': 'God morgon!',  
        'icon_url': 'https://i.imgflip.com/72idw.jpg'
        }
        bot.reply(message, reply_with_attachments);
        saidGodmorning = true;
        oldDay = today;
    }
});    

controller.hears(['hittar','hitta','finns'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });

    var reply_with_attachments = {
        'username': 'Kalops Bot' ,
        'text': 'Vad glad jag är att du frågade! <https://www.google.se/maps/dir/Drottninggatan,+Stockholm/Himalayas/@38.0988188,15.3726478,3z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x465f9d671678d6b5:0x36db426378426473!2m2!1d18.0600595!2d59.3352268!1m5!1m1!1s0x3995b9ebef1235bd:0x3ae1297b70640201!2m2!1d83.9310623!2d28.5983159?hl=en|Vägen till kalops>',  
        'icon_url': 'http://mittkok.expressen.se/wp-content/uploads/2014/01/IMG_15991-1-305x305.jpg'
        }
        bot.reply(message, reply_with_attachments);
});    

controller.hears(['hi', 'hello', 'hej','hejsan','tja','tjena'], 'direct_message,direct_mention,mention', function(bot,message) {

  bot.startConversation(message,function(err,convo) {
    convo.say('Hej snygging!');
    convo.ask('Sugen på kalops? Svara ja eller nä', [
        {
            pattern: 'ja',
            callback: function(response,convo) {
                var reply_with_attachments = {
                    'username': 'Kalops Bot' ,
                    'text': 'Vad glad jag är att du frågade! <https://www.google.se/maps/dir/Drottninggatan,+Stockholm/Himalayas/@38.0988188,15.3726478,3z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x465f9d671678d6b5:0x36db426378426473!2m2!1d18.0600595!2d59.3352268!1m5!1m1!1s0x3995b9ebef1235bd:0x3ae1297b70640201!2m2!1d83.9310623!2d28.5983159?hl=en|Vägen till kalops>',  
                    'icon_url': 'http://mittkok.expressen.se/wp-content/uploads/2014/01/IMG_15991-1-305x305.jpg'
                }
    
                convo.say(reply_with_attachments);
                convo.next();
            }
        },
            {
            pattern: 'nä',
            callback: function(response, convo) {
               var reply_with_attachments = {
                    'username': 'Kalops Bot' ,
                    'text': 'Fan va tråkig man ska vara då...',  
                    'icon_url': 'http://images.lifeandstylemag.com/uploads/posts/image/47360/grumpy-cat.jpg'
                }
    
                convo.say(reply_with_attachments);
                // stop the conversation. this will cause it to end with status == 'stopped'
                //convo.stop();
                convo.next();
            }
        },
            {
            default: true,
            callback: function(response, convo) {
                convo.repeat();
                convo.next();
            }
                            
        }
        ]);
  });
});

controller.hears(['buss hem'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'bus',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });
    var http = require("https");
    var parser = require('xml2json');
    var busHome = "";
    var todayDate = new Date();
    var minutes = ('0' + todayDate.getMinutes()).slice(-2);
    var time = todayDate.getHours() + ":" + minutes;
    var fullYear = "" + todayDate.getFullYear();
    fullYear = fullYear.slice(-2);
    var m = parseInt(todayDate.getMonth()) + 1;
    var month = ('0' + m).slice(-2);
    var day = ('0' + todayDate.getDate()).slice(-2);
    var date = fullYear + month + day;  


    var pathOne = "/androidv1/resultspage.asp??NoOf=8&selDirection=0&selpointto=%7C50%7C0&cmdaction=search&selpointfr=%7C3847%7C0&selPriority=0&selChangeTime=0&chkWalkToOtherStop=0&selWalkSpeed=0&customer=ogt&lang=sv&alt=2&inpDate=" + date + "&inpTime=" + time;

    var options = {
        "method": "GET",
        "hostname": "www.iphone.fskab.se",
        "port": null,
        "path": pathOne,
        "headers": {
        "cache-control": "no-cache",
        "postman-token": "25137fea-a090-5f1d-7e48-7d8925b87e22"
        }
    };
    

    var req = http.request(options, function (res) {
    var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            var jsonString = parser.toJson(body.toString());
            var json = JSON.parse(jsonString);
            busHome = setDepartureList(json);
            var reply_with_attachments = {
                'username': 'Buss' ,
                'text': busHome,    
                'icon_url': 'http://littlebabybum.com/es/wp-content/uploads/sites/14/2015/06/las-ruedas-del-autobus-amarillo.png'
            }
            bot.reply(message, reply_with_attachments);
        });
    });
    req.end();   
});

controller.hears(['buss jobb'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'bus',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });
    
    var http = require("https");
    var parser = require('xml2json');
    var busWork = "";
    var todayDate = new Date();
    var minutes = ('0' + todayDate.getMinutes()).slice(-2);
    var time = todayDate.getHours() + ":" + minutes;
    var fullYear = "" + todayDate.getFullYear();
    fullYear = fullYear.slice(-2);
    var m = parseInt(todayDate.getMonth()) + 1;
    var month = ('0' + m).slice(-2);
    var day = ('0' + todayDate.getDate()).slice(-2);
    var date = fullYear + month + day;  
    
    var pathOne = "/androidv1/resultspage.asp?NoOf=8&selDirection=0&selpointto=%7C3847%7C0&cmdaction=search&selpointfr=%7C46%7C0&selPriority=1&selChangeTime=0&chkWalkToOtherStop=0&selWalkSpeed=0&customer=ogt&lang=sv&alt=2&inpDate=" + date + "&inpTime=" + time + "&transportMode=2";
    

    var options = {
        "method": "GET",
        "hostname": "www.iphone.fskab.se",
        "port": null,
        "path": pathOne,
        "headers": {
        "cache-control": "no-cache",
        "postman-token": "25137fea-a090-5f1d-7e48-7d8925b87e22"
        }
    };
    

    var req = http.request(options, function (res) {
    var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);

            var jsonString = parser.toJson(body.toString());
            var json = JSON.parse(jsonString);
            busWork = setDepartureList(json);
            var reply_with_attachments = {
                'username': 'Buss' ,
                'text': busWork,    
                'icon_url': 'http://littlebabybum.com/es/wp-content/uploads/sites/14/2015/06/las-ruedas-del-autobus-amarillo.png'
            }
            bot.reply(message, reply_with_attachments);
        });
    });
    req.end();   
});    


controller.hears(['håll käften!'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.ask('Säkert?', [
            {
                pattern: 'ja',
                callback: function(response, convo) {
                    convo.say('Jaja');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    }, 3000);
                }
            },
        {
            pattern: 'nä',
            default: true,
            callback: function(response, convo) {
                convo.say('Oki');
                convo.next();
            }
        }
        ]);
    });
});

controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'],
    'direct_message,direct_mention,mention', function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            ':robot_face: I am a bot named <@' + bot.identity.name +
             '>. I have been running for ' + uptime + ' on ' + hostname + '.');

});

function setDepartureList (json) {

    var journeysList = json["soap:Envelope"]["soap:Body"]["GetJourneyResponse"]["GetJourneyResult"]["Journeys"]["Journey"];
    
    if (journeysList != undefined) {
    var routeLink, departureDate, minutes, departureTime, from, to, line, timeDeviationrouteLink;
    var departureList = [];

    for (var i = 0; i < journeysList.length; i++) {
        var newDepartureTime = "-";
        routeLink = journeysList[i]["RouteLinks"]["RouteLink"];
        departureDate = new Date(routeLink["DepDateTime"]);
        minutes = ('0' + departureDate.getUTCMinutes()).slice(-2);
        departureTime = departureDate.getUTCHours() + ":" + minutes;
        from = routeLink["From"]["Name"];
        to = routeLink["To"]["Name"];
        line = routeLink["Line"]["Name"];
        timeDeviationrouteLink = routeLink["RealTime"]["RealTimeInfo"];
        if (timeDeviationrouteLink !== undefined) {
            var depTimeDev = timeDeviationrouteLink["DepTimeDeviation"];
            var timeDeviation = parseInt(depTimeDev);
            newDepartureTime = new Date(departureDate.setMinutes(departureDate.getUTCMinutes() + timeDeviation));
            minutes = ('0' + newDepartureTime.getUTCMinutes()).slice(-2);
            newDepartureTime = newDepartureTime.getUTCHours() + ":" + minutes;
        }
        if (line === "4" || line === "2"){
            line = line + ":an  ";
        } else {
            line = line + ":an";
        }
        departureList.push(["\n", line + "  Avgår: ", departureTime, " -> ", newDepartureTime]);
        }
        busTable = from + " -> " + to;
        for (var i = 0; i < departureList.length; i++) {
            for (var j = 0; j < departureList[i].length; j++){
                var item = departureList[i][j];
                busTable = busTable + "  " +  item;
            }
        }
    
    return busTable;
    } else {
        return "Nått blev knas"
    }
}

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}