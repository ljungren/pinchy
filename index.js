var PubNub = require('pubnub')
// PubNub = require('pubnub');      ES5
//import PubNub from 'pubnub';        

var publishKey = "pub-c-22d7266d-4ebc-43b7-bbed-8feb537f0eb2";
var subscribeKey = "sub-c-56c59d4e-b6d6-11e6-a071-02ee2ddab7fe";
 
var pubnub = new PubNub({
    subscribeKey: subscribeKey,
    publishKey: publishKey,
    ssl: true
})

function publish() {
       
    function publishSampleMessage() {
        console.log("Since we're publishing on subscribe connectEvent, we're sure we'll receive the following publish.");
        var publishConfig = {
            channel : "pinchy_channel",
            message : "Hello from Joakim"
        }
        pubnub.publish(publishConfig, function(status, response) {
            console.log(status, response);
        })
    }
       
    pubnub.addListener({
        status: function(statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                publishSampleMessage();
            }
        },
        message: function(message) {
            console.log("New Message!!", message);
        },
        presence: function(presenceEvent) {
            // handle presence
        }
    })      
    console.log("Subscribing..");
    pubnub.subscribe({
        channels: ['pinchy_channel'] 
    });
};

publish();