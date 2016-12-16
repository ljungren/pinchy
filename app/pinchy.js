const apiInterface = require('./interface')
const five = require('johnny-five');
const board = new five.Board();

let connectedDevices = [];
//implement security on device recognition, 
//only those who are connected can communicate

module.exports = board.on('ready', function() {
  
  let clickCount = 0;
  let touch = new five.Button({
    controller: "TINKERKIT",
    pin: "I0",
  });
  let accel = new five.Accelerometer({
    pins: ["I1", "I2"],
    freq: 100
  });

  /*create listener on channel with
  callback on established connection and on request*/
  apiInterface.addChannelListener('pinchy_channel', () => {
    //Connection callback
    // let testMessage = responseFactory('requestInfo', 'sender', null, null);
    console.log('connection established');
    // apiInterface.publishMessage(testMessage);
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
          videoId = message.info.videoId;
          startTime = parseInt(message.info.time);
          let init = responseFactory('init', 'pinchy', videoId, startTime, null, null);
          console.log('sending init');
          apiInterface.publishMessage(init);
          //addSensorListener();
          break;

        case 'ready':
          //activate sensor listeners
          addSensorListener();
          break;

        case 'info':
          //swicth playing device, send start and stop
          let transmitDuration = parseInt(calcDiff(message.timeStamp)/1000);

          //console.log('transmitDuration in milliseconds: ' + transmitDuration);
          //console.log('time to start/stop: ' + response.info.time);
          videoId = message.info.videoId;
          console.log(videoId);
          startTime = parseInt(message.info.time/1000);
          
          let start = responseFactory('start', 'pinchy', videoId, startTime + transmitDuration, transmitDuration, null);
          let stop = responseFactory('stop', 'pinchy', videoId, startTime, transmitDuration, null);
          apiInterface.publishMessage(start);
          apiInterface.publishMessage(stop);
          break;

        default:
          console.log('ignoring...');
      }
    }
    else{
      //...no channel
      console.log('received on unidentified channel');
    }
  }

  let calcDiff = (timestamp) => {
    return Date.now() - parseInt(timestamp);
  }

  let addSensorListener = () => {
    //when couch sensor is triggered, send question, then listen for finger input
    console.log('listen for sensor input');

    accel.on("axischange", () => {
      console.log("axischange", this.raw);
      let temp = this.raw;
      setTimeOut( () => {
        if(this.raw-temp >= 5 || this.raw-temp <= 5){
          console.log('couch sensor triggered, send question and listen for finger input');
          let question = responseFactory('question', 'pinchy', null, null, null, null);
          apiInterface.publishMessage(question);
          addfingerSensorListener();
        }
      }), 200);
    });
  }

  let addSensorListener = () => {
    //listen for finger input
    ["down"].forEach(function(type) {
      touch.on(type, function() {
        clickSensorInput();
      });
    });
  }

  let clickSensorInput = function() {
    clickCount++;
    if (clickCount == 1) {
        singleClickTimer = setTimeout(function() {
            if (clickCount >= 2) {
              console.log("Double click, send choice");
              let choice = responseFactory('choice', 'pinchy', null, null, null, 'no');
              apiInterface.publishMessage(choice);
            } else{
              console.log("One click, send request");
              let request = responseFactory('requestInfo', 'pinchy', null, null, null, null);
              let choice = responseFactory('choice', 'pinchy', null, null, null, 'yes');
              apiInterface.publishMessage(request);
              apiInterface.publishMessage(choice);
            }
            clickCount = 0;
        }, 400);
    }
  }
  let responseFactory = (tag, sender, videoId, startTime, delay, choice) => {
      return JSON.stringify({
        "tag": tag,
        "sender": sender,
        "info": {
          "videoId": videoId,
          "time": startTime,
          "delay": delay,
          "choice": choice
        },
        "timeStamp": Date.now()
      });
  }

});
// }
