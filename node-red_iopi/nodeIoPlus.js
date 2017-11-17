
module.exports = function (RED) {
	"use strict";
	var settings = RED.settings;
	var events = require("events");
	var Iopi = require("./iopi");

	// config
	function nodeIoPlus(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		//0x20 32 IC1
		//0x21 33 IC2
		node.bus = config.bus;
		node.log('created IoPlus');
	}

	RED.nodes.registerType("IoPlus", nodeIoPlus);

	// IoPlus out
	function ioPlusOutNode(config) {
		RED.nodes.createNode(this, config);
		this.ioPlus = RED.nodes.getNode(config.ioPlus);

		if (this.ioPlus) {
			var node = this;
			//node.port = serialPool.get(this.serialConfig.serialport,
			//    this.serialConfig.serialbaud,
			//    this.serialConfig.newline);
			//node.addCh = "";
			//if (node.serialConfig.addchar == "true" || node.serialConfig.addchar === true) {
			//    node.addCh = this.serialConfig.newline.replace("\\n", "\n").replace("\\r", "\r").replace("\\t", "\t").replace("\\e", "\e").replace("\\f", "\f").replace("\\0", "\0"); // jshint ignore:line
			//}
			node.on("input", function (msg) {
				if (msg.hasOwnProperty("payload")) {
					var payload = msg.payload;
					if (!Buffer.isBuffer(payload)) {
						if (typeof payload === "object") {
							payload = JSON.stringify(payload);
						}
						else {
							payload = payload.toString();
						}
						payload += node.addCh;
					}
				//    else if (node.addCh !== "") {
				//        payload = Buffer.concat([payload, new Buffer(node.addCh)]);
				//    }
				//    node.port.write(payload, function (err, res) {
				//        if (err) {
				//            var errmsg = err.toString().replace("Serialport", "Serialport " + node.port.serial.path);
				//            node.error(errmsg, msg);
				//        }
					//});
				}
			});
			node.port.on('ready', function () {
				node.status({ fill: "green", shape: "dot", text: "node-red:common.status.connected" });
			});
			node.port.on('closed', function () {
				node.status({ fill: "red", shape: "ring", text: "node-red:common.status.not-connected" });
			});
		}
		else {
			this.error(RED._("serial.errors.missing-conf"));
		}

		this.on("close", function (done) {
			//clean up node

			//if (this.serialConfig) {
			//    serialPool.close(this.serialConfig.serialport, done);
			//}
			//else {
				done();
			//}
		});
	}
	RED.nodes.registerType("IoPlus out", ioPlusOutNode);

	// IoPlus in
	function ioPlusInNode(config) {
		RED.nodes.createNode(this, config);
		this.ioPlus = config.ioplus;
		this.ioPlusConfig = RED.nodes.getNode(this.ioPlus);

		var client = new Iopi(config.bus);

		if (this.ioPlusConfig) {
			var node = this;
			node.bus = config.bus;
			// all
			node.bus.setPortDirection(0, 0xFF); // set to inputs
			node.bus.setPortPullups(0, 0xFF); // enable internal pull-up resistors

			node.log('Pin 1: %d', node.bus.readPin(1));


			this.port.on('data', function (msg) {
				// single char buffer
				if ((node.serialConfig.newline === 0) || (node.serialConfig.newline === "")) {
					if (node.serialConfig.bin !== "bin") { node.send({ "payload": String.fromCharCode(msg) }); }
					else { node.send({ "payload": new Buffer([msg]) }); }
				}
			});
			this.port.on('ready', function () {
				node.status({ fill: "green", shape: "dot", text: "node-red:common.status.connected" });
			});
			this.port.on('closed', function () {
				node.status({ fill: "red", shape: "ring", text: "node-red:common.status.not-connected" });
			});
		}
		else {
			this.error(RED._("serial.errors.missing-conf"));
		}
		this.on("close", function (done) {
			//if (this.serialConfig) {
			//	serialPool.close(this.serialConfig.serialport, done);
			//}
			//else {
				done();
			//}
		});
	}
	RED.nodes.registerType("IoPlus in", ioPlusInNode);
}