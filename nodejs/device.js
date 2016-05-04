var http = require("http");

var config = require("./config.json");
var Sensor = require("./sensor.js");

function Device(id) {
    this.id = id;
    this.about = function (){
        console.log(`this is ${this.id}`);
    };
    
    this.getInfo = function () {
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
                console.log( html_body );
            });
        });
        
        req.on("error", (e) => {
            console.log(`problem with request: ${e.message}`);
        });
        
        req.end();        
    };
    
    this.modify = function (device_data ) {
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

            if (res.statusCode == 200)
                console.log("success... and no further info = =a ");
            else
                console.log("fail and no further info,  neither!!!! ");

            var html_body = "";
            res.on("data", (chunk) => {
                html_body = html_body + chunk;
            });
            res.on("end", () => {
                console.log(html_body);
            });
        });

        req.on("error", (e) => {
            console.log(`problem with request: ${e.message}`);
        });
        var post_data = JSON.stringify(device_data);
        req.write(post_data);
        req.end();    
    };
    
    this.suicide = function () {
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

            if (res.statusCode == 200)
                console.log("success... and no further info = =a ");
            else
                console.log("fail and no further info,  neither!!!! ");

            var html_body = "";
            res.on("data", (chunk) => {
                html_body = html_body + chunk;
            });
            res.on("end", () => {
                console.log(html_body);
            });
        });

        req.on("error", (e) => {
            console.log(`problem with request: ${e.message}`);
        });
        req.end();         
    };
    
    this.addSensor = function ( sensor_data ) {
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
            if (res.statusCode == 200)
                console.log("success... and no further info = =a ");
            else
                console.log("fail and no further info,  neither!!!! ");

            var html_body = "";
            res.on("data", (chunk) => {
                html_body = html_body + chunk;
            });
            res.on("end", () => {
                console.log(html_body);
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
            
                callback(null, result);
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
                        // result.push( )
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
            if (res.statusCode == 200) {
                console.log("success... and no further info = =a ");
                callback( null );
            } else {
                console.log("fail and no further info,  neither!!!! ");
                callback ( res.statusCode );
            }
                            
            var html_body = "";
            res.on("data", (chunk) => {
                html_body = html_body + chunk;
            });
            res.on("end", () => {
                console.log ( html_body );
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
}

module.exports = Device;

module.exports.add = function ( device_data ) {
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
        
        if ( res.statusCode == 200) 
            console.log("success... and no further info = =a ");
        else 
            console.log("fail and no further info,  neighter!!!! ");
             
        var html_body = "";
        res.on("data", (chunk) => {
            html_body = html_body + chunk;
        });
        res.on("end", () => {
            console.log( html_body );
        });
    });
    
    req.on("error", (e) => {
        console.log(`problem with request: ${e.message}`);
    });
    var post_data = JSON.stringify( device_data );
    
    req.write( post_data );
    req.end();  
};