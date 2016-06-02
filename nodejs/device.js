var fs = require("fs");
var http = require("http");
var needle = require ("needle");

var config = require("./config.json");
var Sensor = require("./sensor.js");

function Device(id) {
    this.id = id;
    this.about = function (){
        console.log(`this is ${this.id}`);
    };
    
    this.getInfo = function (callback) {
        var options = {
            hostname: config.hostname,
            port: 80,
            path: `/iot/v1/device/${this.id}`,
            method: "GET", 
            headers: { "CK": config.key }
        };
        
        var req = http.request(options, (res) => {
            var html_body = "";
            res.on("data", (chunk) => {
                html_body = html_body + chunk; 
            });
            res.on("end", () => {
                callback(null, html_body);
            });
        });
        
        req.on("error", (e) => {
            console.log(`problem with request: ${e.message}`);
        });
        
        req.end();        
    };
    
    this.modify = function (device_data, callback ) {
        if (this.id == undefined) {
            console.log(" no device id ");
            return;
        }
        var options = {
            hostname: config.hostname,
            port: 80,
            path: `/iot/v1/device/${this.id}`,
            method: "PUT",
            headers: { "CK": config.key }
        };


        var req = http.request(options, (res) => {
            // console.log(`STATUS: ${res.statusCode}`);
            // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);       
            var html_body = "";
            res.on("data", (chunk) => {
                html_body = html_body + chunk;
            });
            res.on("end", () => {
                callback(res.statusCode, html_body);
            });
        });

        req.on("error", (e) => {
            console.log(`problem with request: ${e.message}`);
        });
        var post_data = JSON.stringify(device_data);
        req.write(post_data);
        req.end();    
    };
    
    this.suicide = function (callback) {
        if (this.id == undefined) {
            console.log(" no device id ");
            return;
        }
        var options = {
            hostname: config.hostname,
            port: 80,
            path: `/iot/v1/device/${this.id}`,
            method: "DELETE",
            headers: { "CK": config.key }
        };
        var req = http.request(options, (res) => {
            // console.log(`STATUS: ${res.statusCode}`);
            // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);       

            var html_body = "";
            res.on("data", (chunk) => {
                html_body = html_body + chunk;
            });
            res.on("end", () => {
                callback(res.statusCode, html_body);
            });
        });

        req.on("error", (e) => {
            console.log(`problem with request: ${e.message}`);
        });
        req.end();         
    };
    
    this.addSensor = function ( sensor_data, callback ) {
        var options = {
            hostname: config.hostname,
            port: 80,
            path: `/iot/v1/device/${this.id}/sensor`,
            method: "POST",
            headers: { "CK": config.key }
        };


        var req = http.request(options, (res) => {
            // console.log(`STATUS: ${res.statusCode}`);
            // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);       

            var html_body = "";
            res.on("data", (chunk) => {
                html_body = html_body + chunk;
            });
            res.on("end", () => {
                callback(res.statusCode, html_body);
            });
        });

        req.on("error", (e) => {
            console.log(`problem with request: ${e.message}`);
        });
        var post_data = JSON.stringify( sensor_data );

        req.write(post_data);
        req.end();         
    };
    
    this.getAllSensor = function (callback) {
        var options = {
            hostname: config.hostname,
            port: 80,
            path: `/iot/v1/device/${this.id}/sensor`,
            method: "GET",
            headers: { "CK": config.key }
        };
        var req = http.request(options, (res) => {
            var html_body = "";
            res.on("data", (chunk) => {
                html_body = html_body + chunk;
            });
            res.on("end", () => {
                var result = [];
                var arr = JSON.parse( html_body) ;
                for (var i in arr) {
                    arr[i]["device_id"] = this.id;
                    result.push (new Sensor(arr[i]));
                }
            
                callback(res.statusCode, result);
            });
        });

        req.on("error", (e) => {
            console.log(`problem with request: ${e.message}`);
            callback(e, "");
        });

        req.end();        
    };
    
    this.getSensor= function (sensor_id , callback) {
        var options = {
            hostname: config.hostname,
            port: 80,
            path: `/iot/v1/device/${this.id}/sensor`,
            method: "GET",
            headers: { "CK": config.key }
        };
        var req = http.request(options, (res) => {
            var html_body = "";
            res.on("data", (chunk) => {
                html_body = html_body + chunk;
            });
            res.on("end", () => {
                var result = [];
                var arr = JSON.parse( html_body) ;
                for (var i in arr) {
                    arr[i]["device_id"] = this.id;
                    if ( arr[i]["id"] == sensor_id ) {
                        result.push (new Sensor(arr[i]));
                    }
                }
            
                callback(null, result);
            });
        });

        req.on("error", (e) => {
            console.log(`problem with request: ${e.message}`);
            callback(e, "");
        });

        req.end();           
    };
    
    this.uploadRawData = function ( data, callback ) {
        var options = {
            hostname: config.hostname,
            port: 80,
            path: `/iot/v1/device/${this.id}/rawdata`,
            method: "POST",
            headers: { "CK": config.key }
        };
        var req = http.request(options, (res) => {
                            
            var html_body = "";
            res.on("data", (chunk) => {
                html_body = html_body + chunk;
            });
            res.on("end", () => {
                callback ( res.statusCode, html_body );
            });
        });

        req.on("error", (e) => {
            console.log(`problem with request: ${e.message}`);
            callback(e, "");
        });
        var post_data = JSON.stringify(data);
        req.write(post_data);
        req.end();          
    };
    
    this.uploadSnapShot = function ( data, callback ) {
        var options = {
            hostname: config.hostname,
            port: 80,
            path: `/iot/v1/device/${this.id}/snapshot`,
            method: "POST",
            headers: { "CK": config.key }, 
            multipart : true
        };
        // console.log( options );        
        needle.post( options.hostname + options.path, data, options, function (err, resp, html_body){
            if (err) {
                callback(500, err.code);
            } else {
                callback(resp.statusCode,  resp.statusMessage);
            } 
            
        });              
    };

    
    this.getLastUploadSnapShotBySensor = function ( sensor_id, callback ) {
        var options = {
            hostname: config.hostname,
            port: 80,
            path: `/iot/v1/device/${this.id}/sensor/${sensor_id}/snapshot`,
            headers: { "CK": config.key }
        };
        needle.get( options.hostname + options.path, options, function (err, res) {
            if (err) {
                callback( 500, err.Code);
            } else {
                callback( res.statusCode, res.body );
            }
        } );        
    };
}

module.exports = Device;

module.exports.add = function ( device_data, callback ) {
    var options = {
        hostname: config.hostname,
        port: 80,
        path: "/iot/v1/device" ,
        method: "POST", 
        headers: { "CK": config.key }
    };
    
    var req = http.request(options, (res) => {
        // console.log(`STATUS: ${res.statusCode}`);
        // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);       
             
        var html_body = "";
        res.on("data", (chunk) => {
            html_body = html_body + chunk;
        });
        res.on("end", () => {
            if ( res.statusCode == 200) {
                callback ( null, html_body );
            } else {
                callback( res.statusCode);
            }            
        });
    });
    
    req.on("error", (e) => {
        console.log(`problem with request: ${e.message}`);
    });
    var post_data = JSON.stringify( device_data );
    
    req.write( post_data );
    req.end();  
};