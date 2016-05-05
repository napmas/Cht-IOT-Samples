/*
 * * subscribe 設備組態設定異動通知
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
    console.log("OMFG, connected, publish some data ");
    // client.subscribe();
    client.publish(`/v1/registry/${serial_id}`, "hello mqtt");
    // client.end();
});
 
client.on("message", function (topic, message) {
  // message is Buffer
    console.log("OMFG, got message!!");
    console.log(`with topic ${topic}`); 
    console.log(message.toString());
    client.end();
});
