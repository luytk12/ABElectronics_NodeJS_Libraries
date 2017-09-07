//================================================
// ABElectronics IO Pi Pin Write demo
// Requires rpio to be installed, install with: npm install rpio
// test Koen Luyten
// run with: sudo node iopiwrite.js
// ================================================

// Aigle Dressage

var iopi = require('../../lib/iopi/iopi');

// initialise default address
var bus1 = new IoPi(0x20);

// Set port 0 to be outputs
bus1.setPortDirection(0, 0x00);

// Create a timer that runs every 100ms
var x = 0;
var myVar = setInterval(myTimer, 100);


// change the state of the output based on the x variable.  This will toggle the pin on and off
function myTimer() {

    bus1.writePin(1, x);

        if (x == 0) {
            x = 1;
        }
        else { x = 0; }

}
