const PubNub = require('pubnub');

const publishKey = "pub-c-22d7266d-4ebc-43b7-bbed-8feb537f0eb2";
const subscribeKey = "sub-c-56c59d4e-b6d6-11e6-a071-02ee2ddab7fe";

const pubnub = new PubNub({
    subscribeKey: subscribeKey,
    publishKey: publishKey,
    ssl: true
});


module.exports = {
           
    publishMessage: (message) => {
        
        const publishConfig = {
            channel : "pinchy_channel",
            message : message
        }
        pubnub.publish(publishConfig, (status, response) => {
            //console.log(status, response);
        });
    },
       
    addChannelListener: (channelName, connectedCallback, responseCallback) => {

        pubnub.addListener({
    
            message: (m) => {
                // handle message
                let channelName = m.channel; // The channel for which the message belongs
                let channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
                let pubTT = m.timetoken; // Publish timetoken
                let msg = m.message; // The Payload
                responseCallback(m)
            },
            presence: (p) => {
                // handle presence
                let action = p.action; // Can be join, leave, state-change or timeout
                let channelName = p.channel; // The channel for which the message belongs
                let occupancy = p.occupancy; // No. of users connected with the channel
                let state = p.state; // User State
                let channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
                let publishTime = p.timestamp; // Publish timetoken
                let timetoken = p.timetoken;  // Current timetoken
                let uuid = p.uuid; // UUIDs of users who are connected with the channel
            },
            status: (statusEvent) => {
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