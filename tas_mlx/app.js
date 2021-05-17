/**
 * Created by J. Yun, SCH Univ. (yun@sch.ac.kr)
 * - use ADXL345 accelerometer with 'i2c-bus' Node.js module
 * - use ADXL345 example (ADXL345.cpp) in Exploring RPi book by D. Molloy
 * - use tas_sample created by I.-Y. Ahn, KETI
 */

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

function tas_watchdog() {
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

// Every 3 seconds, check if the TAS is not working
wdt.set_wdt(require('shortid').generate(), 3, tas_watchdog);

// var rpio = require('rpio');
const i2c = require('i2c-bus');

//new mlx
var MLX90614 = function (addr=0x5A) {

        // MLX90614 Default I2C Address //
    if (addr % 2 == 0 && addr <= 0xFF) {
        this.MLX_I2CADDR = addr;
        this.i2cBus = i2c.openSync(1);
    }
    else {
        err = "Bad i2c device address"
        console.error(err);
    }

}

MLX90614.prototype.register = {
    // MLX90614 RAM and EEPROM Addresses //
    'DEVICE_ID'     : 0xd0,
    'RESET'         : 0xe0,
    'CTRL_MEAS'     : 0xf4,
    'ADC_OUT_MSB'   : 0xf6,
    'ADC_OUT_LSB'   : 0xf7,
    'ADC_OUT_XLSB'  : 0xf8,

    'RAW_IR1'       : 0x04,
    'RAW_IR2'       : 0x05,
    'TA'            : 0x06,
    'TOBJ1'         : 0x07,
    'TOBJ2'         : 0x08,

    'TOMAX'         : 0x20,
    'TOMIN'         : 0x21,
    'PWMCTRL'       : 0x22,
    'TARANGE'       : 0x23,
    'KE'            : 0x24,
    'CONFIG'        : 0x25,
    'ADDRESS'       : 0x2E,
    'ID0'           : 0x3C,
    'ID1'           : 0x3D,
    'ID2'           : 0x3E,
    'ID3'           : 0x3F,

    'REG_SLEEP'     : 0xFF
}

MLX90614.prototype.readObject = function (cb) {
    this.i2cBus.readWord(this.MLX_I2CADDR, this.register.TOBJ1, function(err, data) {
        if (err) {
            console.error(err);
            cb(err);
        }
        else {
            var temp = data * 0.02;
            temp -= 273.15;
            cb(err, temp);
        }
    });  
}

MLX90614.prototype.readObjectSync = function () {
    temp = this.i2cBus.readWordSync(this.MLX_I2CADDR, this.register.TOBJ1);
    temp *= 0.02;
    temp -= 273.15;
    //console.log(temp.toString());
    return temp;
}

MLX90614.prototype.close = function () {
    this.i2cBus.closeSync()
}

var sensor = new MLX90614();

function getTemp() {
    var temp = sensor.readObjectSync();
    var cuttemp = temp.toFixed(2);//Cut decimal point 0.01
  //console.log(temp);
  return cuttemp;
}

//led
const Gpio = require('onoff').Gpio;
const pinRed = 22; // GPIO17 (pin11): red

function turnOnRed() {
    const ledRed = new Gpio(pinRed, 'out');
    ledRed.writeSync(1);
}

function turnOffRed() {
    const ledRed = new Gpio(pinRed, 'out');
    ledRed.writeSync(0);
}

//recheck
const gpio = require('node-wiring-pi');
function recheck(){
    const ledRed = new Gpio(pinRed, 'out');
    ledRed.writeSync(1);
    gpio.delay(80);
    ledRed.writeSync(0);
    gpio.delay(80);
    ledRed.writeSync(1);
    gpio.delay(80);
    ledRed.writeSync(0);
    gpio.delay(80);
    ledRed.writeSync(1);

}

//button
const button = new Gpio(27, 'in', 'rising', {debounceTimeout: 30});


//
//var
var count = 0;
var ttemp = 0;

//repeat 6seconds - LedOn
setInterval(() => {
    turnOnRed();
}
,6000);
 
    //check temp
    button.watch((err, value) => {
        ttemp = getTemp();        
        console.log(ttemp);
        if(ttemp < 30){
            console.log("Recheck Please");
            recheck();
        }else if(ttemp >= 30 && count == 0){
            turnOffRed();
            count = 1;        
            if (tas_state=='upload') { //Upload to TAS
                for(var i = 0; i < upload_arr.length; i++) {
                    if(upload_arr[i].id != "Temp") {
                    var cin = {ctname: upload_arr[i].ctname, con: "Temp: " + ttemp + " , Date: 9/10/2020, " + new Date().toLocaleTimeString("ko-KR", {timeZone: "Asia/Seoul"}) + " , check 2/1"};
                    console.log("SEND : " + JSON.stringify(cin) + ' ---->')
                    upload_client.write(JSON.stringify(cin) + '<EOF>');
                    break;
                    }
                }
            }
        }else if(ttemp > 30 && count == 1){
            turnOffRed();
            count = 0;          
            if (tas_state=='upload') { //Upload to TAS
                for(var i = 0; i < upload_arr.length; i++) {
                    if(upload_arr[i].id != "Temp") {
                    var cin = {ctname: upload_arr[i].ctname, con: "Temp: " + ttemp + " , Date: 9/10/2020, " + new Date().toLocaleTimeString("ko-KR", {timeZone: "Asia/Seoul"}) + " , check 2/2"};
                    console.log("SEND : " + JSON.stringify(cin) + ' ---->')
                    upload_client.write(JSON.stringify(cin) + '<EOF>');
                    break;
                    }
                }
            }
        }
    });

wdt.set_wdt((require('shortid').generate(), 3, tas_watchdog)); 