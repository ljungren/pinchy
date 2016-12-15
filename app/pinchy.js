const apiInterface = require('./interface')
const five = require('johnny-five');
const board = new five.Board();

let connectedDevices = [];
//implement security

module.exports = board.on('ready', function() {
  var clickCount = 0;
//blink lights
//module.exports = () => {
//led = new five.Led(13); // pin 13
//led.blink(500); // 500ms interval
  var touch = new five.Button({
    controller: "TINKERKIT",
    pin: "I0",
   });
 
 var accel = new five.Accelerometer({
    pins: ["I1", "I2"],
    freq: 100
  });
  
 

  // "axischange"
  //
  // Fires only when X, Y or Z has changed
  //
  /*accel.on("axischange", function() {

    console.log("axischange", this.raw);
  });*/
  function clickSensorInput() {
        clickCount++;
    if (clickCount === 1) {
        singleClickTimer = setTimeout(function() {
            clickCount = 0;
            //singleClick();
            console.log("One click");
        }, 400);
    } else if (clickCount === 2) {
        clearTimeout(singleClickTimer);
        clickCount = 0;
        console.log("two click");
        //doubleClick();
    }
}

  //Handle push button events 
/*function startTimer() {
    var timer = 4, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        //display.textContent = minutes + ":" + seconds;
        if(nrOfClicks>1){
          //Skicka JAAAAAA
          timer = duration;
        }
        if(--timer<0 || nrOfClicks<=1)
          timer = duration;
          //Skicka Neeeeej
      },1000);
  }*/




  /*create listener on channel with
  callback on established connection and on request*/
  apiInterface.addChannelListener('pinchy_channel', () => {
    //Connection callback
    let testMessage = responseFactory('info', 'sender', 'videoId', '3000')
    console.log('connection established, sends test object: ' + testMessage.tag);
    apiInterface.publishMessage(testMessage);
  },
  (m) => {
    //response callback
    console.log('recieved message on ' + m.channel + ': ' + m.message.tag);
    formatResponse(m);

  });


  let formatResponse = (m) => {
    //check tag and format response accordingly
    if(m.channel=='pinchy_channel'){
      switch(m.message.tag){
        case 'connect':
          if(!connectedDevices.includes(m.message.sender)){
            connectedDevices.push(m.message.sender);
          }
          console.log('nr of connected devices: ' + connectedDevices.length);
          break;
        case 'notify':
          //activity started, initialize other device
          let init = responseFactory('init', 'pinchy', 'videoId...', transmitDuration + 1000);
          console.log('sending ' + init.tag);
          apiInterface.publishMessage(init);
          break;

        case 'ready':
          //activate sensor listeners
          addSensorListener();
          break;

        case 'info':
          //swicth playing device, send start and stop
          let transmitDuration = calcDiff(m.message.timeStamp);
          //console.log('transmitDuration in milliseconds: ' + transmitDuration);
          //console.log('time to start/stop: ' + response.info.time);
          console.log('Sending start and stop');
          let start = responseFactory('start', 'pinchy', 'videoId...', transmitDuration + 1000);
          let stop = responseFactory('stop', 'pinchy', 'videoId...', transmitDuration + 1000);
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
     ["down"].forEach(function(type) {
      touch.on(type, function() {
       clickSensorInput();
        console.log(type);
      });
    });
    //when finger input, send choice and info
  
  }
  let responseFactory = (tag, sender, videoId, time) => {
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
//}
