
module.exports = function (RED) {
	"use strict";
	var settings = RED.settings;
	//var events = require("events");
	var Iopi = require("./iopi");

	function nodeIoPlus(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		node.log('created IoPlus');
	
		//default
		//0x20 32 IC1
		//0x21 33 IC2
		node.bus = config.bus;

		var client = new Iopi(config.bus);
	}

	RED.nodes.registerType("IoPlus", nodeIoPlus);



	//// We will read the inputs 1 to 8 from bus 1 so set port 0 to be inputs and
	//// enable the internal pull-up resistors

	//bus1.setPortDirection(0, 0xFF);
	//bus1.setPortPullups(0, 0xFF);

	//// Set port 0 to be outputs
	//bus1.setPortDirection(0, 0x00);

	







	//function serialOutNode(config) {
	//    RED.nodes.createNode(this, config);
	////    this.serial = config.serial;
	////    this.serialConfig = RED.nodes.getNode(this.serial);

	//    if (this.serialConfig) {
	//        var node = this;
	//        //node.port = serialPool.get(this.serialConfig.serialport,
	//        //    this.serialConfig.serialbaud,
	//        //    this.serialConfig.databits,
	//        //    this.serialConfig.parity,
	//        //    this.serialConfig.stopbits,
	//        //    this.serialConfig.newline);
	//        //node.addCh = "";
	//        //if (node.serialConfig.addchar == "true" || node.serialConfig.addchar === true) {
	//        //    node.addCh = this.serialConfig.newline.replace("\\n", "\n").replace("\\r", "\r").replace("\\t", "\t").replace("\\e", "\e").replace("\\f", "\f").replace("\\0", "\0"); // jshint ignore:line
	//        //}
	//        node.on("input", function (msg) {
	//            if (msg.hasOwnProperty("payload")) {
	//                var payload = msg.payload;
	//                if (!Buffer.isBuffer(payload)) {
	//                    if (typeof payload === "object") {
	//                        payload = JSON.stringify(payload);
	//                    }
	//                    else {
	//                        payload = payload.toString();
	//                    }
	//                    payload += node.addCh;
	//                }
	//            //    else if (node.addCh !== "") {
	//            //        payload = Buffer.concat([payload, new Buffer(node.addCh)]);
	//            //    }
	//            //    node.port.write(payload, function (err, res) {
	//            //        if (err) {
	//            //            var errmsg = err.toString().replace("Serialport", "Serialport " + node.port.serial.path);
	//            //            node.error(errmsg, msg);
	//            //        }
	//                //});
	//            }
	//        });
	//        node.port.on('ready', function () {
	//            node.status({ fill: "green", shape: "dot", text: "node-red:common.status.connected" });
	//        });
	//        node.port.on('closed', function () {
	//            node.status({ fill: "red", shape: "ring", text: "node-red:common.status.not-connected" });
	//        });
	//    }
	//    else {
	//        this.error(RED._("serial.errors.missing-conf"));
	//    }

	//    this.on("close", function (done) {
	//        //clean up node

	//        //if (this.serialConfig) {
	//        //    serialPool.close(this.serialConfig.serialport, done);
	//        //}
	//        //else {
	//            done();
	//        //}
	//    });
	//}
	//RED.nodes.registerType("serial out", serialOutNode);
}