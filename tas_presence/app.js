var net = require('net');
var util = require('util');
var fs = require('fs');
var xml2js = require('xml2js');

var wdt = require('./wdt');

var useparentport = '';
var useparenthostname = '';

var upload_arr = [];
var download_arr = [];

var conf = {};

// This is an async file read
fs.readFile('conf.xml', 'utf-8', function (err, data) {
    if (err) {
        console.log("FATAL An error occurred trying to read in the file: " + err);
        console.log("error : set to default for configuration")
    }
    else {
        var parser = new xml2js.Parser({explicitArray: false});
        parser.parseString(data, function (err, result) {
            if (err) {
                console.log("Parsing An error occurred trying to read in the file: " + err);
                console.log("error : set to default for configuration")
            }
            else {
                var jsonString = JSON.stringify(result);
                conf = JSON.parse(jsonString)['m2m:conf'];

                useparenthostname = conf.tas.parenthostname;
                useparentport = conf.tas.parentport;

                if (conf.upload != null) {
                    if (conf.upload['ctname'] != null) {
                        upload_arr[0] = conf.upload;
                    }
                    else {
                        upload_arr = conf.upload;
                    }
                }

                if (conf.download != null) {
                    if (conf.download['ctname'] != null) {
                        download_arr[0] = conf.download;
                    }
                    else {
                        download_arr = conf.download;
                    }
                }
            }
        });
    }
});

var tas_state = 'init';
var upload_client = null;
var t_count = 0;
var tas_download_count = 0;

function on_receive(data) {
    if (tas_state == 'connect' || tas_state == 'reconnect' || tas_state == 'upload') {
        var data_arr = data.toString().split('<EOF>');
        if (data_arr.length >= 2) {
            for (var i = 0; i < data_arr.length - 1; i++) {
                var line = data_arr[i];
                var sink_str = util.format('%s', line.toString());
                var sink_obj = JSON.parse(sink_str);

                if (sink_obj.ctname == null || sink_obj.con == null) {
                    console.log('Received: data format mismatch');
                }
                else {
                    if (sink_obj.con == 'hello') {
                        console.log('Received: ' + line);

                        if (++tas_download_count >= download_arr.length) {
                            tas_state = 'upload';
                        }
                    }
                    else {
                        for (var j = 0; j < upload_arr.length; j++) {
                            if (upload_arr[j].ctname == sink_obj.ctname) {
                                console.log('ACK : ' + line + ' <----');
                                break;
                            }
                        }

                        for (j = 0; j < download_arr.length; j++) {
                            if (download_arr[j].ctname == sink_obj.ctname) {
                                g_down_buf = JSON.stringify({id: download_arr[i].id, con: sink_obj.con});
                                console.log(g_down_buf + ' <----');
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}



const Gpio = require('onoff').Gpio
const alone = new Gpio(19, 'in', 'rising', {debounceTimeout: 30});   // GPIO16 (pin): alone input
const start = new Gpio(13, 'in', 'rising', {debounceTimeout: 30});  
  
let currentDate = new Date();//button 16

//led
const pinRed = 26;//20; // GPIO17 (pin11): red]
const pinSpeaker = 4;//12;
const ledRed = new Gpio(pinRed, 'out');
const speaker = new Gpio(pinSpeaker, 'out');

function TurnOnLED() {
    ledRed.writeSync(1);
}
function TurnOffLED() {
    ledRed.writeSync(0);
}

//sj's code
var Prescore = 30;
var updown = 0;
var status = 0;
var TimeCount = 5;//preAlarm
var currentDay;
var PreTime;
var uploadstatus = 0;
var Presence;
var repeat = 1;
var notReady = false;
var startstatus = 0;
const gpio = require('node-wiring-pi');
function preAlarm() { 
    if (Prescore < 20) { return 3; }//Math.floor(Math.random() * 4) + 10
    else if (Prescore >= 20 && Prescore <= 35) { return 7; }//Math.floor(Math.random() * 19) + 20
    else if (Prescore > 35) { return 15; }//Math.floor(Math.random() * 19) + 60
}


function Alarm() {
    TurnOnLED();
    //gpio.delay(100);
    speaker.writeSync(1);
    /*gpio.delay(200);
    speaker.writeSync(0);  */     
    var timer1 = setTimeout(function () {
        speaker.writeSync(0);
        clearTimeout(timer1);
    }, 300);
            
    console.log("Speaker on");//speaker on
}

function finishAlarm() {
    TimeCount = preAlarm();
    status = 0;
    notReady = false;
}

function upload() {
    if (Prescore < 10) {}
    if (tas_state == 'upload') {
        for (var i = 0; i < upload_arr.length; i++) {
            if (upload_arr[i].ctname == 'presence') {
                let currentDay = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
                console.log("The Cin is : " + Presence + ", " + "9/10/2020, " + new Date().toLocaleTimeString("ko-KR", {timeZone: "Asia/Seoul"}) + ", " + Prescore + ", " + updown);
                if (Prescore < 10) {var cin = { ctname: upload_arr[i].ctname, con: Presence + "," + "9/10/2020, " + new Date().toLocaleTimeString("ko-KR", {timeZone: "Asia/Seoul"}) + ", 0" + Prescore + "," + updown }; }
                else var cin = { ctname: upload_arr[i].ctname, con: Presence + "," + "9/10/2020, " + new Date().toLocaleTimeString("ko-KR", {timeZone: "Asia/Seoul"}) + ", " + Prescore + "," + updown };
                
                console.log('SEND : ' + JSON.stringify(cin) + ' ---->');
                upload_client.write(JSON.stringify(cin) + '<EOF>');
                break;
            }
        }
    }
}

start.watch((err, value) => {
    if(startstatus ==0){ startstatus=1;
    console.log("start on")}
    else {
        startstatus =0; console.log("startoff");}
});

function PresenceAlarm() { 
    Alarm();

    var count = 10;//Presence First counting Alarm Second               
    var counter = setInterval(timer, 1000);


    function timer() {
        count--;
        console.log("Timer start : " + count);

        alone.watch((err, value) => {
            // console.log('alone pressed: ' + value
            if (notReady == false) { ; }
            else {
                uploadstatus = 1;
                clearInterval(counter);
            }
        });

        if (count <= 0) {
            updown = 1;//score is down                                
            Presence = 1;//no response
            Prescore -= 1;//no response

            if (Prescore < 0) { Prescore = 0; }
            upload();
            TurnOffLED();

            if (Presence == 1) {
                Alarm();

                var recount = 7;//Recounting Alarm second
                var recounter = setInterval(retimer, 1000);
                TurnOnLED();

                function retimer() {
                    recount--;
                    console.log("!!!!reTimer start" + recount);//

                    if (uploadstatus == 2) { clearInterval(recounter); uploadstatus = 0; }

                    if (recount <= 0) {
                        Presence = 2;//Breakaway
                        Prescore -= 2;//Breakaway score is -3-7 = total -10
                        if (Prescore < 0) { Prescore = 0; }
                        updown = 1;//score is down

                        upload();
                        TurnOffLED();

                        //recount = 0;
                        finishAlarm();
                        console.log("finish alarm and next TimeCount is : " + TimeCount);
                        Presence = -1;
                        clearInterval(recounter);
                    }
                }
            }
            clearInterval(counter);
        }
    }      
}


function tas_watchdog() {
    //upload();
    console.log(TimeCount);

    if(startstatus==0) {TimeCount = 6;}

    if (uploadstatus == 1) {
        if (Presence == 1) {
            Presence = 3;
            updown = 2;
            uploadstatus = 2;
        } else {
            Presence = 0; Prescore += 5; updown = 0;
            uploadstatus = 0;
        }
        upload();
        TurnOffLED();
        finishAlarm();
        
    }
    if (status == 0) { TimeCount--;}
    if (status == 0 && TimeCount <= 0) {
        console.log("presence function!");
        
        PresenceAlarm();
        status = 1;
        
        
        notReady = true;
    }
    if (tas_state == 'init') {
        upload_client = new net.Socket();

        upload_client.on('data', on_receive);

        upload_client.on('error', function(err) {
            console.log(err);
            tas_state = 'reconnect';
        });

        upload_client.on('close', function() {
            console.log('Connection closed');
            upload_client.destroy();
            tas_state = 'reconnect';
        });

        if (upload_client) {
            console.log('tas init ok');
            tas_state = 'init_thing';
        }
    }
    else if (tas_state == 'init_thing') {
        // init things
        
        tas_state = 'connect';
    }
    else if (tas_state == 'connect' || tas_state == 'reconnect') {
        upload_client.connect(useparentport, useparenthostname, function() {
            console.log('upload Connected');
            tas_download_count = 0;
            for (var i = 0; i < download_arr.length; i++) {
                console.log('download Connected - ' + download_arr[i].ctname + ' hello');
                var cin = {ctname: download_arr[i].ctname, con: 'hello'};
                upload_client.write(JSON.stringify(cin) + '<EOF>');
            }

               if (tas_download_count >= download_arr.length) {
                tas_state = 'upload';
            }
        });
    }
}

//console.log("Test Start");
//console.log(Math.floor(Math.random() * 100));
//var asiaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
//console.log('Asia time: ' + asiaTime.toLocaleString())

//wdt.set_wdt(require('shortid').generate(), PreTime, Presence);
// Every 3 seconds, check if the TAS is not working
wdt.set_wdt(require('shortid').generate(), 1, tas_watchdog);