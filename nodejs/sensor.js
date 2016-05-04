var http = require("http");

var config = require("./config.json");

function Sensor ( sensor_data ) {
    this.id = sensor_data.id;
    this.desc = sensor_data.desc;
    this.name = sensor_data.name; 
    this.type = sensor_data.type;
    this.unit = sensor_data.unit;
    this.formula = sensor_data.foumla;
    this.attr = sensor_data.attributes;
    
    this.device_id = sensor_data.device_id; 
    
    this.getInfo = function () {
        var options = {
            hostname: config.hostname,
            port: 80,
            path: `/iot/v1/device/${this.device_id}/sensor/${this.id}`,
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
    
    /*
     * Fake data
     */
    this.getNumericRawData = function () {
        return {
            "id": this.id, 
            "value": ["123.4", "56.80"]
        }; 
    };
    
    this.getLatestUploadRawData = function ( callback ) {
        var options = {
            hostname: config.hostname,
            port: 80,
            path: `/iot/v1/device/${this.device_id}/sensor/${this.id}/rawdata`,
            method: "GET", 
            headers: { "CK": config.key }
        };
        
        var req = http.request(options, (res) => {
            var html_body = "";
            res.on("data", (chunk) => {
                html_body = html_body + chunk;
            });
            res.on("end", () => {
                // console.log( html_body );
                callback(null, html_body );
            });
        });
        
        req.on("error", (e) => {
            console.log(`problem with request: ${e.message}`);
        });
        
        req.end();          
    };
        
    
    this.modify = function (sensor_data) {
        if ( (this.id == undefined) || (this.device_id == undefined) ){
            console.log(" no sensor id or device id ");
            return;
        }
        var options = {
            hostname: config.hostname,
            port: 80,
            path: `/iot/v1/device/${this.device_id}/sensor/${this.id}`,
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
        var post_data = JSON.stringify(sensor_data);
        req.write(post_data);
        req.end();         
    };
    
    this.suicide = function () {
        if (this.id == undefined) {
            console.log(" no sensor id ");
            return;
        }
        var options = {
            hostname: config.hostname,
            port: 80,
            path: `/iot/v1/device/${this.device_id}/sensor/${this.id}`,
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
}

module.exports = Sensor;
