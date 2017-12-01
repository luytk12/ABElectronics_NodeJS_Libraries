
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
            node.on("input", function (msg) {
                if (msg.hasOwnProperty("payload")) {
                    var pin = msg.payload['pin'] || null;
                    var value = (msg.payload['value'] === true);
                    if ((typeof (value) === 'boolean') && (pin != null && (typeof (pin) == 'number') && (pin >= 1 && pin <= 16))) {
                        var bus = parseInt(this.ioPlusConfig.bus);
                        node.log("bus: " + bus + " pin: " + pin + " value: " + value);

                        var client = new IoPi(bus);
                        client.setPortDirection(0, 0x00); // set to output
                        client.setPortPullups(0, 0x00); // disable internal pull-up resistors	                       
                        var writeResult = client.writePin(msg.pin, msg.value);
                        node.log("writeResult: " + writeResult);
                    }
                    else { node.warn('IoPi: incorrect pin or value!'); }
                }
                else { node.warn('IoPi: no payload'); }
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
    RED.nodes.registerType("IoPlus out", ioPlusOutNode);

    // IoPlus in
    function ioPlusInNode(config) {
        RED.nodes.createNode(this, config);
        this.ioPlusConfig = RED.nodes.getNode(config.IoPlus);

        if (this.ioPlusConfig) {
            var node = this;
            var pin = parseInt(config.pin);
            if (pin != null && (typeof (pin) == 'number') && (pin >= 1 && pin <= 16)) {
                var bus = parseInt(this.ioPlusConfig.bus);
                node.log("bus: " + bus + " pin: " + pin);

                var client = new IoPi(bus);
                client.setPortDirection(0, 0xFF); // set to input
                client.setPortPullups(0, 0xFF); // enable the internal pull-up resistors
                node.log("readpin: " + client.readPin(pin));
            }
            else { node.warn('IoPi: incorrect pin or value!'); }
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