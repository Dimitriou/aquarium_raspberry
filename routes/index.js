var express = require('express');
var router = express.Router();
var app = require('../server.js');
var piblaster = require('pi-blaster.js');

var overallTimeout = null;
var overallInterval = null;
var foodNowTimeout = null;
var servoInterval = null;
var servoPin = null;


router.get('/', function(req, res, next) {
  // res.render('home');
  res.render('home', { title: 'Aquarium' });
});


router.post('/food_now', function(req, res, next) {
	var pass = req.body.password;

	// console.log("Calling food now route: pass: " + pass);

	if (pass == "paok1994") {
		foodNow(3000);
		res.render('home', { title: 'Aquarium (Food Now - Success)' });
	} else {
		res.render('home', { title: 'Aquarium (Food Now - Wrong Password)' });
	}
});

router.post('/food_vacations', function(req, res, next) {
	var pass = req.body.password;
	var vacation_days = req.body.days;
	var msVacations = 86400000 * vacation_days;

	if (pass == "paok1994") {
		foodVacations(3000, msVacations);
		res.render('home', { title: 'Aquarium (Food Vacations - Success)' });
	} else {
		res.render('home', { title: 'Aquarium (Food Vacations - Wrong Password)' });
	}
});

router.post('/food_auto', function(req, res, next) {
	var pass = req.body.password;

	if (pass == "paok1994") {
		foodAuto(3000);
		res.render('home', { title: 'Aquarium (Food Auto - Success)' });
	} else {
		res.render('home', { title: 'Aquarium (Food Auto - Wrong Password)' });
	}
});

router.post('/stop_all', function(req, res, next) {
	var pass = req.body.password;

	if (pass == "paok1994") {
		exitAll();
		res.render('home', { title: 'Aquarium (Stop All - Success)' });
	} else {
		res.render('home', { title: 'Aquarium (Stop All - Wrong Password)' });
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


function foodNow(timeOfFood) {
	console.log("function: FOOD NOW");
	// connectGPIO();

	// servoPin.value(false);

	servoStart();
	foodNowTimeout = setTimeout(function(){
		// servoPin.value(true);
		servoStop();
		console.log("Food for 3 seconds, closing food_now");
	},timeOfFood);
}


function foodVacations(timeOfFood, vacation_time) {
	console.log("function: FOOD VACATIONS");
	var timeBetweenFood = 10000;
	// var timeBetweenFood = 43200000;

	foodNow(timeOfFood);
	overallInterval = setInterval(function() {
		foodNow(timeOfFood);
	}, timeBetweenFood);

	overallTimeout = setTimeout(function() {
		console.log("Servo closed");
		clearTimeout(foodNowTimeout);
		clearInterval(overallInterval);
	},vacation_time);

}


function foodAuto(timeOfFood) {
	console.log("function: FOOD AUTO");
	var timeBetweenFood = 10000;
	// var timeBetweenFood = 43200000;


	foodNow(timeOfFood);
	overallInterval = setInterval(function() {
		foodNow(timeOfFood);
	}, timeBetweenFood);
}


function exitAll() {
	if (overallTimeout) {
		clearTimeout(overallTimeout);
		console.log("Force QUIT Timeouts");
		overallTimeout = null;
	}

	if (overallInterval) {
		clearInterval(overallInterval);
		console.log("Force QUIT Intervals");
		overallInterval = null;
	}

	if (foodNowTimeout) {
		clearTimeout(foodNowTimeout);
		console.log("Force QUIT FoodNowTimeout");
		foodNowTimeout = null;
	}

	if (servoInterval) {
		clearInterval(servoInterval);
		console.log("Force QUIT servoInterval");
		servoInterval = null;
	}
}

function servoStart() {
	// var piblaster = require('pi-blaster.js');
	console.log("Calling servoStart");

	piblaster.setPwm(17, 0.99);
}

function servoStop() {
	// var piblaster = require('pi-blaster.js');
	console.log("Calling servoStop");

	piblaster.setPwm(17, 1);
}

// Used for everything that doesn't need PWM pulse (led, relay, etc)
function connectGPIO() {
	// Connect to GPIO 17 and set mode output
	if (!servoPin) {
		servoPin = require("pi-pins").connect(17);
		servoPin.mode('out');
	}
}

module.exports = router;
