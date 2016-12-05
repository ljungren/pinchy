var interface = require('./interface')
var five = require('johnny-five');
var board = new five.Board();


module.exports = board.on('ready', function() {
  //blink lights
  led = new five.Led(13); // pin 13
  led.blink(500); // 500ms interval

  //when sensor is triggered, do something


  /*create listener on channel with 
  callback on established connection and
  callback with response*/
  interface.addChannelListener('pinchy_channel', function(){
    //Connection callback
    console.log('sends publish: Hello from Joakim');
    interface.publishMessage("Hello from Joakim");
  },
  function(message){
    console.log('recieved message on: ' + message.channel);
    //response callback
    if(message.channel=='pinchy_channel'){
      console.log("this is the pinchy channel");
      //do Response...
    }
    else if(message.channel=='other_channel'){
      //...
    }
    else{
      //...
    }

  });

});
