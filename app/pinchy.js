var interface = require('./interface')
var five = require('johnny-five');
var board = new five.Board();

var connectedDevices = [];
//implement security

module.exports = board.on('ready', function() {
  //blink lights
  led = new five.Led(13); // pin 13
  led.blink(500); // 500ms interval

  /*create listener on channel with 
  callback on established connection and
  callback with response*/
  interface.addChannelListener('pinchy_channel', function(){
    //Connection callback
    //example message: tag, sender, videoId, videoTime
    var testMessage = responseFactory('notify', 'test', 'test', '3000')
    console.log('connection established, sends test object: ' + testMessage.tag);
    interface.publishMessage(testMessage);
  },
  function(m){
    //response callback
    console.log('recieved message on ' + m.channel + ': ' + m.message.tag);
    formatResponse(m);

  });


  var formatResponse = function(m){
    //check tag and format response accordingly
    if(m.channel=='pinchy_channel'){
      
      var response = m.message;

      switch(m.message.tag){
        case 'connect':
          if(!connectedDevices.includes(m.message.sender)){
            connectedDevices.push(m.message.sender);
          }
          console.log('nr of connected devices: ' + connectedDevices.length);
          break;
        case 'notify':
          //activity started, initialize other device
          response.tag = 'init';
          response.sender = 'pinchy';
          response.timeStamp = Date.now();
          console.log('sending ' + response.tag);
          interface.publishMessage(response);
          break;

        case 'ready':
          //activate sensor listeners
          addSensorListener();
          break;

        case 'info':
          //swicth playing device, send start and stop
          var transmitDuration = calcDiff(m.message.timeStamp);
          //console.log('transmitDuration in milliseconds: ' + transmitDuration);
          //console.log('time to start/stop: ' + response.info.time);
          console.log('Sending start and stop');
          var start = responseFactory('start', 'pinchy', 'test', transmitDuration + 1000);
          var stop = responseFactory('stop', 'pinchy', 'test', transmitDuration + 1000);
          interface.publishMessage(start);
          interface.publishMessage(stop);
          break;

        default:
          console.log('ignoring...');
      }

      
      //...
      //do publish
      //add new listener
    }
    else{
      //...no channel
    }
  }

  var calcDiff = function(timestamp){
    return Date.now() - parseInt(timestamp);
  }

  var addSensorListener = function(){
    //when couch sensor is triggered, send question, then listen for finger input

    //when finger input, send choice and info
  }
  var responseFactory = function(tag, sender, videoId, time){
      return {
        "tag": tag,
        "sender": sender,
        "info": {
          "videoId": videoId,
          "time": time
        },
        "timeStamp": Date.now()
      }
  }

});
