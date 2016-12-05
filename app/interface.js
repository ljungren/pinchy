var PubNub = require('pubnub');

var publishKey = "pub-c-22d7266d-4ebc-43b7-bbed-8feb537f0eb2";
var subscribeKey = "sub-c-56c59d4e-b6d6-11e6-a071-02ee2ddab7fe";

var pubnub = new PubNub({
    subscribeKey: subscribeKey,
    publishKey: publishKey,
    ssl: true
});


module.exports = {
           
    publishMessage: function(message) {
        
        var publishConfig = {
            channel : "pinchy_channel",
            message : message
        }
        pubnub.publish(publishConfig, function(status, response) {
            //console.log(status, response);
        });
    },
       
    addChannelListener: function(channelName, connectedCallback, responseCallback) {

        pubnub.addListener({
    
            message: function(m) {
                // handle message
                var channelName = m.channel; // The channel for which the message belongs
                var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
                var pubTT = m.timetoken; // Publish timetoken
                var msg = m.message; // The Payload
                responseCallback(m)
            },
            presence: function(p) {
                // handle presence
                var action = p.action; // Can be join, leave, state-change or timeout
                var channelName = p.channel; // The channel for which the message belongs
                var occupancy = p.occupancy; // No. of users connected with the channel
                var state = p.state; // User State
                var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
                var publishTime = p.timestamp; // Publish timetoken
                var timetoken = p.timetoken;  // Current timetoken
                var uuid = p.uuid; // UUIDs of users who are connected with the channel
            },
            status: function(statusEvent) {
              if (statusEvent.category === "PNConnectedCategory") {
                //sends publish when listener is connected
                connectedCallback();
              }
            },
        });
        console.log("Subscribing..");
        pubnub.subscribe({
            channels: [channelName]
        });   
    }
};