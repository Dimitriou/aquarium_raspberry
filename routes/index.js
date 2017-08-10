var express = require('express');
var router = express.Router();
var app = require('../server.js');


router.get('/', function(req, res, next) {
  // res.render('home');
  res.render('home', { title: 'Aquarium' });
});


router.post('/food_now', function(req, res, next) {
	var pass = req.body.password;

	// console.log("Calling food now route: pass: " + pass);

	if (pass == "paok1994") {
		foodNow(20);
		res.render('home', { title: 'Aquarium (Food Now - Success)' });
	} else {
		res.render('home', { title: 'Aquarium (Food Now - Wrong Password)' });
	}
});

router.post('/food_vacations', function(req, res, next) {
	var pass = req.body.password;

	if (pass == "paok1994") {
		foodVacations(900, 999999);
		res.render('home', { title: 'Aquarium (Food Vacations - Success)' });
	} else {
		res.render('home', { title: 'Aquarium (Food Vacations - Wrong Password)' });
	}
});

router.post('/food_auto', function(req, res, next) {
	var pass = req.body.password;

	if (pass == "paok1994") {
		foodAuto(10678230);
		res.render('home', { title: 'Aquarium (Food Auto - Success)' });
	} else {
		res.render('home', { title: 'Aquarium (Food Auto - Wrong Password)' });
	}
});

router.get('/*', function(req, res, next) {
  res.render('home', { title: 'Aquarium (wrong url, redirected to home)' });
});


//////////////////// *** FUNCTIONS *** ////////////////////

function GPIO() {
	var  ledToggle, pressCount;
	//provision the gpio pins 22 for the led output and 17 for the button input
	var led= require("pi-pins").connect(22),
	    button = require("pi-pins").connect(17);

	//set the pin mode,  setting pin 22 as an output and 17 as an input
	button.mode('in');
	led.mode('out');

	//set the initial value of the LED to be off.
	ledToggle = false;
	pressCount= 0;
	led.value(true);

	//look for a button press event and switch on the LED for 2 seconds when this happens.
	button.on('rise', function () {
	    console.log("button pressed: "+ (++pressCount) +" time(s)");
	    ledToggle = !ledToggle;
	    led.value(ledToggle);
	});	
}


function foodNow(seconds) {
	console.log("function: FOOD NOW");
	connectGPIO();
}


function foodVacations(seconds, vacation_time) {
	console.log("function: FOOD VACATIONS");
}


function foodAuto(seconds) {
	console.log("function: FOOD AUTO");
}

function connectGPIO() {
	var servo = require("pi-pins").connect(17);

	servo.mode('out');

	servo.value(false);
	setTimeout(function(){
		servo.value(true);
		console.log("Servo closed");
	},30000);
}


module.exports = router;
