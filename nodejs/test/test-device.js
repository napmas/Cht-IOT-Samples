var fs = require("fs");
var config = require("../config.json");
var Sensor = require("../sensor.js");
var Device = require("../device.js");
var assert = require('chai').assert;
/* 
 * test create a new device 
 */ 
var device_data = {
    "name": "Hygrometer3",  
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
var modified_data = {
    "name": "Hygrometer_modified",  
    "desc": "Your Hygrometer modified",  
    "type": "general",  
    "uri": "http://a.b.c.d/modified",  
    "lat": 12.34,  
    "lon": 567.89,  
    "attributes": [
        {  
            "key": "modified key",  
            "value": "modified value"  
        }  
    ]  
};
// Device.add( device_data ) ;

var sensor_data = {  
    "id": "temperature",
    "name": "temperature",  
    "desc": "Your Temperature",  
    "type": "gauge",  
    "unit": "度",  
    "formula": " / 100.0",  
    "attributes": [{  
        "key": "label",  
        "value": "溫濕度計"  
    },{  
        "key": "region",  
        "value": "Taiwan"  
    }]  
};

var device;

describe('Device', function() {
    // create a device at first
    var device; 
    before(function (done) {
        console.log("  Creating a the test device..");
        Device.add(device_data, function(err, json_str) {
            assert.isNull(err, "there was an error while creating device");
            if (!err) {
                device = JSON.parse( json_str ) ;
            } 
            console.log("  Succeed.");            
            done();
        });        
    });
    
    // after(function( done) {
    //     console.log("  Deleting the test device...");
    //     var test_device = new Device( device.id );
    //     test_device.suicide( function(err, result_str){
    //         assert.equal(err, "200", "Removing device doesn't return HTTP 200 with msg \n" + result_str);
    //         console.log("  Succeed.");
    //         done();
    //     });
    // });
    
    // test get deviec info
    describe("#getInfo()", function () {
        it("should get correct device info ", function (done) {
            var test_device = new Device( device.id );
            test_device.getInfo( function (err, json_str){
                var rtn_device = JSON.parse( json_str );
                for (var key in device_data) {
                    if (key != "attributes") {
                        assert.equal( rtn_device[key], device_data[key], "The " + key + " field is not equal to input data");
                    } else {
                        for (var i in device_data[key]) {
                            for( var akey in device_data[key][i] ) {
                                assert.equal( rtn_device[key][i][akey], device_data[key][i][akey], "The " + akey + " attriute is not equal to input data");
                            }
                        }
                    }
                }

                done();
            });
            
        });
    }); 
    
    // test modify device 
    describe("#modify()", function() {
        it("should return HTTP 200 if success.", function (done) {
            var test_device = new Device( device.id );
            test_device.modify(modified_data, function(err, json_str){
                assert.equal(err, "200", "Modifying device doesn't return HTTP 200 with msg \n" + json_str);
                done();
            });
        });
    }); 
    
    // test create sensor and get sensor info
    describe("#addSensor()", function(){
        it("should return HTTP 200 if success.", function (done) {
            var test_device = new Device( device.id );
            test_device.addSensor(sensor_data, function(err, json_str){
                assert.equal(err, "200", "Modifying device doesn't return HTTP 200 with msg \n" + json_str);
                // console.log(json_str);
                // console.log( device.id);
                sensor_data["device_id"] = device.id;
                var test_sensor = new Sensor( sensor_data );
                test_sensor.getInfo( function(err, result_str){
                    assert.equal(err, "200", "Getting sensor doesn't return HTTP 200 with msg \n" + result_str);
                    var rtn_sensor_info = JSON.parse( result_str );
                    for (var key in sensor_data) {
                        if (key == "device_id") {
                            continue;
                        } else if (key == "attributes") {
                            for (var i in sensor_data[key]) {
                                for( var akey in sensor_data[key][i] ) {
                                    assert.equal( rtn_sensor_info[key][i][akey], sensor_data[key][i][akey], "The " + akey + " attriute is not equal to input data");
                                }
                            }
                        } else {
                            assert.equal( rtn_sensor_info[key], sensor_data[key], "The " + key + " field is not equal to input data");    
                        }
                    }                    
                    
                    done();
                });
                
            });
        });
    });
    
    // test modify sensor and get sensor info  
    describe("sensor#modify()", function() {
        it("should return HTTP 200 if success.", function (done) {
            for (var key in sensor_data) {
                if ( (key == "device_id") || (key == "id") || ( key == "type" ) ){
                    continue;
                } else if (key == "attributes") {
                    for (var i in sensor_data[key]) {
                        for( var akey in sensor_data[key][i] ) {
                            // assert.equal( rtn_sensor_info[key][i][akey], sensor_data[key][i][akey], "The " + akey + " attriute is not equal to input data");
                            sensor_data[key][i][akey] = sensor_data[key][i][akey] + "_modified";
                        }
                    }
                } else {
                    // assert.equal( rtn_sensor_info[key], sensor_data[key], "The " + key + " field is not equal to input data");
                    sensor_data[key] = sensor_data[key] + "_modified";    
                }
            }
            // console.log( sensor_data );
            var test_sensor = new Sensor( sensor_data );
            delete sensor_data["device_id"]; // have to remove this attributes, or server will return error
     
            test_sensor.modify (sensor_data, function(err, result_str){
                assert.equal(err, "200", "Getting sensor doesn't return HTTP 200 with msg \n" + result_str);
                sensor_data["device_id"] = device.id;
                var test_sensor = new Sensor( sensor_data );
                test_sensor.getInfo( function(err, result_str){
                    assert.equal(err, "200", "Getting sensor doesn't return HTTP 200 with msg \n" + result_str);
                    var rtn_sensor_info = JSON.parse( result_str );
                    for (var key in sensor_data) {
                        if (key == "device_id") {
                            continue;
                        } else if (key == "attributes") {
                            for (var i in sensor_data[key]) {
                                for( var akey in sensor_data[key][i] ) {
                                    assert.equal( rtn_sensor_info[key][i][akey], sensor_data[key][i][akey], "The " + akey + " attriute is not equal to input data");
                                }
                            }
                        } else {
                            assert.equal( rtn_sensor_info[key], sensor_data[key], "The " + key + " field is not equal to input data");    
                        }
                    }                    
                    
                    done();
                });    
            });

        });
    }); 
    
    // test get all sensors of a device
    describe("#getAllSensor", function(){
       it("should return sensor list if success", function(done) {
           var test_device = new Device( device.id );
           test_device.getAllSensor(function(err, result){
               assert.instanceOf( result, Array, "Result is not Array");
               assert.equal(result.length, 1, "Result should contain only one sensor");
               done();
           });
       });
    });
    
    // test upload raw data and retrieve it back
    describe("#updateRawData()", function (){
        it("should return HTTP 200 if success.", function (done) {
            var test_device = new Device( device.id );
            var test_sensor = new Sensor (sensor_data) ;
            var test_data = test_sensor.getNumericRawData();
            test_device.uploadRawData([ test_data ], function (err, result_str){
                assert.equal(err, "200", "Upload raw data  doesn't return HTTP 200 with msg \n" + result_str);
                
                test_sensor.getLatestUploadRawData( function (err, data_string) {
                    assert.equal(err, "200", "Get latest upload raw data doesn't return HTTP 200 with msg \n" + data_string);
                    var result_obj = JSON.parse( data_string);
                    for (var key in test_data) {
                        assert.equal( result_obj[key].toString(), test_data[key].toString(), "The " + key +" field of result doesn't equal to input");
                    }
                    done();    
                });
                
            });            
            
        });
    });
    
    describe("#uploadSnapShot", function (){
       it("should return HTTP 200 if success.", function (done) {
           var test_device = new Device( device.id );
        //    var test_sensor = new Sensor (sensor_data) ;
           var meta = { 
                   id: sensor_data.id,  
                   time: "2014-12-11T10:43:58",  
                   lat: 24.95,  
                   lon: 121.16,  
                   value: [ "fire alarm" ]
               };
           var test_data = { 
               meta : { 
                   value :JSON.stringify( meta ), 
                   content_type : "application/json"
               },
               body : {
                   file : "test/data/img03.jpg",
                   content_type : "image/jpeg" 
               }   
           };
           test_device.uploadSnapShot( test_data, function (err, result_str) {
            //    console.log( err, result_str");
               assert.equal(err, "200", "upload snap shot  doesn't return HTTP 200 with msg \n" + result_str);
               done(); 
           });
                       
           
       }) 
    });
    
    describe("#downloadSnapshot", function(){
       it("should return HTTP 200 if success.", function (done){
           var test_device = new Device( device.id );
           test_device.getLastUploadSnapShotBySensor( sensor_data.id, function(err, result){
               assert.equal(err, "200", "upload snap shot  doesn't return HTTP 200 with msg \n" + result);
               console.log("result");
               console.log( result );
               fs.open('test/data/download.jpg', "w", function(err, fd){
                   if (err) {
                       console.log("Error open file ");
                   } else {
                       fs.write(fd, result, 0, result.length, null, function(err){
                           if (err) {
                               throw "Error while writing file : " + err ;
                           }
                          
                           fs.close(fd, function(){
                               console.log("File downloaded.");
                           });
                           
                       });
                   }
               });
               done(); 
           });
       });
    });
    
    // describe("Sensor", function () {
    //    describe("#suicide", function (){
    //       it("should return HTTP 200 if success", function (done){
    //           var test_sensor = new Sensor (sensor_data) ;
    //           test_sensor.suicide( function (err, result_str) {
    //               assert.equal(err, "200", "Removing sensor doesn't return HTTP 200 with msg \n" + result_str);
    //               done();    
    //           });
              
    //       });
    //    });
    // });
});