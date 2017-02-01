# Pinchy
An IoT system. The missing link for smart homes.

## Info

The project is a real-time communication system for keeping the user in control of an automated home. The system senses the context but lets the user make the choice over what device to continue media playback. This is a prototype with arduino and tinkerkit sensors, but the vision is that the user makes the decision with a simple pinch of the fingers to change screen.

![alt text][interface]

[interface]: https://github.com/ljungren/pinchy/blob/master/doc/interface_small.png "Interface"

### System components

* Node server (this repo)
* Arduino + accelerometer, button
* [Android application](https://github.com/wahjlen/pinchy-android)
* [Web applicatoin](https://github.com/ljungren/pinchy-web)
* [Pubnub](https://www.pubnub.com/) API keys

### System architecture
 
![alt text][structure]

[structure]: https://github.com/ljungren/pinchy/blob/master/doc/structure_small.png "System structure"

### System communication

When a device is playing a video:
 
![alt text][communication]

[communication]: https://github.com/ljungren/pinchy/blob/master/doc/communication.png "System communication"

## License
ISC

