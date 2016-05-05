/*
 * subscriber
 */

var mqtt = require("mqtt");
var config = require("./config.json");

var opts = {
    "username" : config.key, 
    "password" : config.key
};
var client  = mqtt.connect(`tcp://${config.hostname}:${config.mqtt_port}`, opts);
 
var device_id = 27;
var sensor_id = "sensor01";
 
client.on("connect", function () {
    console.log("OMFG, connected");
    client.subscribe(`/v1/device/${device_id}/sensor/${sensor_id}/rawdata`);
});
 
client.on("message", function (topic, message) {
  // message is Buffer
    console.log("OMFG, got message!!");
    console.log(`with topic ${topic}`); 
    console.log(message.toString());
    // client.end();
});
