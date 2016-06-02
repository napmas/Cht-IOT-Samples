var config = require("./config.json");
var Sensor = require("./sensor.js");
var Device = require("./device.js");

/* 
 * test create a new device 
 */ 
var device_data = {
    // "name": "Hygrometer",  
    "desc": "Your Hygrometer",  
    "type": "general",  
    "uri": "http://a.b.c.d/xxx",  
    "lat": 24.95,  
    "lon": 121.16,  
    "attributes": [
        {  
            "key": "label",  
            "value": "溫濕度計"  
        },
        {  
            "key": "region", 
            "value": "Taiwan"
        }  
    ]  
};
Device.add( device_data, function (err, json_str) {
    console.log(json_str);
    if (err) 
        console.log(" got error ");
    else 
        console.log(" add success" + json_str);
}) ;

/* 
 * test get device info 
 */ 
// var device = new Device( 27 );
// device.getInfo();

/**
 *  test modify device 
 */
// var device_data = {
//     "name": "Device 02",  
//     "desc": "description of device 02", 
//     "type": "general"
// };
// var device = new Device( 32 );
// device.modify( device_data );

/* 
 * test remove a device
 */ 
// var device = new Device( 32 );
// device.suicide();

/**
 * test add a sensor 
 */
// var device = new Device( 27 );
// var sensor_data = {  
//     "id": "temperature",
//     "name": "temperature",  
//     "desc": "Your Temperature",  
//     "type": "gauge",  
//     "unit": "度",  
//     "formula": " / 100.0",  
//     "attributes": [{  
//         "key": "label",  
//         "value": "溫濕度計"  
//     },{  
//         "key": "region",  
//         "value": "Taiwan"  
//     }]  
// };
// device.addSensor( sensor_data ) ;

/**
 * test get sensors of device
 */
// var device = new Device( 27 );

// device.getAllSensor( function (err, result) {
//     if (err) {
//         console.log(`error : ${err}`);
//     } else {
//         console.log("get all sensor result");
//         for (var i in result ) {
//             console.log( result[i] ) ;
//             console.log("------");
//         }
//     }
// });

/**
 * test modify sensor
 */
// var sensor = new Sensor({"id": "sensor01", "device_id":27});
// sensor.getInfo();
// var sensor_data = {
//     "name" : "sensor01test", 
//     "type" : "gauge", 
//     "unit" : "day"
// };
// sensor.modify (sensor_data);

/**
 * test remove sensor 
 */
// var sensor = new Sensor({"id":"temperature", "device_id":27});
// sensor.suicide();

/* 
 * test send raw data 
 */
// var device = new Device( 27 );
// var sensor_id = "sensor01";
// device.getSensor(sensor_id, function(err, result) {
//     if ( err ) {
//         console.log(`Got error : ${err}`);
//         return;
//     }    
    
//     if ( result.length > 0) {
//         var sensor = new Sensor(result[0]); // should be unique XD
//         // sensor.getInfo();
//         device.uploadRawData([ sensor.getNumericRawData() ], function (err){
//             if (err) {
//                 console.log(`got error : ${err}`);
//                 return;
//             } 
//             sensor.getLatestUploadRawData( function (err, data_string) {
//                 if (err) {
//                     console.log (`Got err : ${err}`);
//                     return;
//                 }
//                 console.log(`Get lates upload raw data : ${data_string}.`);
//             });
            
//         });
//     } else {
//         console.log("This device doesn't have sensor with id :{sensor_id}");
//     }
// });
// var sensor = new Sensor({"id": "sensor01", "device_id":27});
// sensor.getInfo();

