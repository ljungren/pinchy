const apiInterface = require('./interface')
//const five = require('johnny-five');
//const board = new five.Board();

let connectedDevices = [];
//implement security

//module.exports = board.on('ready', function() {
  //blink lights
module.exports = () => {
  // led = new five.Led(13); // pin 13
  // led.blink(500); // 500ms interval

  /*create listener on channel with
  callback on established connection and on request*/
  apiInterface.addChannelListener('pinchy_channel', () => {
    //Connection callback
    let testMessage = responseFactory('info', 'sender', null, null);
    console.log('connection established, sends test info');
    apiInterface.publishMessage(testMessage);
  },
  (m) => {
    //response callback
    let channel = m.channel;
    let message = JSON.parse(m.message);

    console.log('recieved message on ' + channel + ': ' + message.tag);
    formatResponse(channel, message);

  });


  let formatResponse = (channel, message) => {
    let videoId = null;
    let startTime = null;
    //check tag and format response accordingly
    if(channel=='pinchy_channel'){
      switch(message.tag){
        case 'connect':
          if(!connectedDevices.includes(message.sender)){
            connectedDevices.push(message.sender);
          }
          console.log('nr of connected devices: ' + connectedDevices.length);
          break;
        case 'notify':
          //activity started, initialize other device
          videoId = parseInt(message.info.videoId);
          startTime = parseInt(message.info.time);
          let init = responseFactory('init', 'pinchy', videoId, startTime);
          console.log('sending ' + init.tag);
          apiInterface.publishMessage(init);
          break;

        case 'ready':
          //activate sensor listeners
          addSensorListener();
          break;

        case 'info':
          //swicth playing device, send start and stop
          let transmitDuration = calcDiff(message.timeStamp);
          //console.log('transmitDuration in milliseconds: ' + transmitDuration);
          //console.log('time to start/stop: ' + response.info.time);
          videoId = parseInt(message.info.videoId);
          startTime = parseInt(message.info.time);
          
          let start = responseFactory('start', 'pinchy', videoId, startTime + transmitDuration + 1000);
          let stop = responseFactory('stop', 'pinchy', videoId, startTime + transmitDuration + 1000);
          apiInterface.publishMessage(start);
          apiInterface.publishMessage(stop);
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

  let calcDiff = (timestamp) => {
    return Date.now() - parseInt(timestamp);
  }

  let addSensorListener = () => {
    //when couch sensor is triggered, send question, then listen for finger input
    console.log('listen for sensor input');
    //when finger input, send choice and info
  }
  let responseFactory = (tag, sender, videoId, time) => {
      return JSON.stringify({
        "tag": tag,
        "sender": sender,
        "info": {
          "videoId": videoId,
          "time": time
        },
        "timeStamp": Date.now()
      });
  }

//});
}
