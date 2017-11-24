
module.exports = function (RED) {
    "use strict";
    var settings = RED.settings;
    var events = require("events");
    var iopi = require("./iopi");

    // config
    function nodeIoPlus(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        //0x20 32 IC1
        //0x21 33 IC2
        this.IoPlus = config.IoPlus;
        this.bus = config.bus;
    }

    RED.nodes.registerType("IoPlus", nodeIoPlus);

    // IoPlus out
    function ioPlusOutNode(config) {
        RED.nodes.createNode(this, config);
        this.ioPlusConfig = RED.nodes.getNode(config.IoPlus);
        if (this.ioPlusConfig) {
            var node = this;
            node.log('boe');
            node.on("input", function (msg) {
                // do write shit
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
                }
            });
            //	node.port.on('ready', function () {
            //		node.status({ fill: "green", shape: "dot", text: "node-red:common.status.connected" });
            //	});
            //	node.port.on('closed', function () {
            //		node.status({ fill: "red", shape: "ring", text: "node-red:common.status.not-connected" });
            //	});
        }
        else {
            this.error(RED._("IoPlus.errors.missing-conf"));
        }

        this.on("close", function (done) {
            //clean up node
            done();
        });
    }
    RED.nodes.registerType("IoPlus out", ioPlusOutNode);

    // IoPlus in
    function ioPlusInNode(config) {
        RED.nodes.createNode(this, config);
        this.ioPlusConfig = RED.nodes.getNode(config.IoPlus);

        var client = new IoPi(0x20);

        if (this.ioPlusConfig) {
            var node = this;
            node.log('en ba');
            node.log(this.ioPlusConfig.bus);
            // all

            cclient.setPortDirection(0, 0xFF); // set to inputs

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
            this.error(RED._("IoPlus.errors.missing-conf"));
        }
        this.on("close", function (done) {
            //clean up node
            done();
        });
    }
    RED.nodes.registerType("IoPlus in", ioPlusInNode);
}