
let currentQuote = "";
let numMinutes;
let characterCount;

const quotes = [
	"The quick brown fox jumps over the lazy dog.",
	"Always remember: you're unique, just like everyone else.",
	"The road to success is always under construction.",
	"Wear short sleeves. Support your right to bare arms!",
	"When everything's coming your way, you're in the wrong lane.",
	"When you're right, no one remembers. When you're wrong, no one forgets.",
	"Well-behaved women rarely make history.",
	"A clear conscience is usually the sign of a bad memory."
];


/* Timer Functions ========================================================== */

const getTimeRemaining = function(endTime) {
	// get seconds remaining in countdown from now to future date
	let tr = Date.parse(endTime) - Date.parse(new Date());
	
	// get seconds remaining
	let secondsRemaining = Math.floor((tr / 1000) % 60);
	
	// get minutes remaining
	let minutesRemaining = Math.floor((tr / 1000 / 60) % 60);

	let timeRemainingObj = {
		total: tr,
		seconds: secondsRemaining,
		minutes: minutesRemaining
	};

	return timeRemainingObj;
}

const pickFutureDate = function(minutes = 1) {
	numMinutes = minutes;

	// select Date (minutes) from now
	return new Date(Date.parse(new Date()) + minutes * 60 * 1000);
}

const initializeTimer = function(futureDate) {
	// get ui components 
	let minuteSpan = document.querySelector('.timer .minutes');
	let secondSpan = document.querySelector('.timer .seconds');

	// update clock func 
	const updateClock = function() {

		let timeRemaining = getTimeRemaining(futureDate);

		// update ui
		minuteSpan.innerHTML = ('0' + timeRemaining.minutes).slice(-2);
		secondSpan.innerHTML = ('0' + timeRemaining.seconds).slice(-2);

		// check if timer is done
		if (timeRemaining.total <= 0) {
			clearInterval(interval);
			endWPMTest();
		}

	}

	// setinterval
	updateClock();
	const interval = setInterval(updateClock, 1000);

}

const calculateResults = function(charCount, minutesTyped) {

	// calc total word count
	let wordCount = Math.floor(charCount / 5);

	// calculate wpm 
	let gross = Math.floor((charCount / 5) / minutesTyped);

	// let net = gross - ( errorCount / minutesTyped );

	return {
		finalWordCount : wordCount, 
		totalTime: minutesTyped,
		grossWPM: gross
	}

}

const displayResults = function(results) {

	// update ui
	document.querySelector('.final-word-count').innerHTML = results.finalWordCount;
	document.querySelector('.gross-wpm').innerHTML = results.grossWPM;
	document.querySelector('.total-time').innerHTML = ('0' + results.totalTime).slice(-2) + ":00";

	document.querySelector('.results').style.display = "block";

}


/* WPM Functions ============================================================= */

const endWPMTest = function() {

	// disable input
	disableInput();

	// add overlay
	overlayOn();

	const results = calculateResults(characterCount, numMinutes);

	// display results 
	displayResults(results);

}

const setupTest = function() {

	// reset word count
	characterCount = 0;
	updateCharCountUI(characterCount);

	// new quote and clear input
	resetQuoteAndInput();

	// setup timer
	const futureDate = pickFutureDate(numMinutes);
	
	initializeTimer(futureDate);


}

// current quote finished, select new 
const setQuote = function() {

	// select new quote 
	currentQuote = quotes[getRandomNumber(0, quotes.length)];
	
	// set quote HTML
	document.querySelector('.quote').innerHTML = "<p>" + currentQuote + "</p>";

}

const resetQuoteAndInput = function() {

	disableInput();

	clearInput();

	setQuote();

	enableInput();

}

/* Helper Functions ========================================================== */

const getRandomNumber = function(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

const clearInput = function() {
	document.querySelector('.input input').value = "";
}

const disableInput = function() {
	document.querySelector('.input input').setAttribute('disabled', "disabled");
}

const enableInput = function() {
	document.querySelector('.input input').removeAttribute('disabled');
}


// compare the equality of two arrays
const isEqual = function(a, b) {

	// check that they are of same type (Array)
	const type = Object.prototype.toString.call(a);

	if (type !== Object.prototype.toString.call(b) 
		|| type !== '[object Array]') return false;

	// check that they have the number of items 
	if (a.length !== b.length) return false;

	// check that each item is equal to its counterpart in the other array 
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}

	return true;

}

const updateQuoteUI = function(quote, divide) {

	let quoteHTML = "<p><span class='highlight'>";

	const highlightedQuote = quote.substring(0, divide);
	quoteHTML += highlightedQuote + "</span>";

	const unhighlistedQuote = quote.substring(divide, quote.length);
	quoteHTML += unhighlistedQuote + "</p>";

	// replace html in quote box
	document.querySelector('.quote').innerHTML = quoteHTML;

}

const updateCharCountUI = function(charCount) {
	document.querySelector('.word-count').innerHTML = charCount;
}

const overlayOn = function() {
	document.querySelector('.overlay').style.display = "block";
}

const overlayOff = function() {
	document.querySelector('.overlay').style.display = "none";
}

/* Event Listeners ========================================================= */


// catch user input 
const onInputListener = function(event) {

	// get user input as an array 
	const inputArr = [...this.value];
	const quoteArr = [...currentQuote];


	// check if the user input matches the enire quote 
	if (quoteArr.length === inputArr.length && isEqual(quoteArr, inputArr)) {
		// quote is complete, reset 
		characterCount++;
		updateCharCountUI(characterCount);
		resetQuoteAndInput();
	}

	// check that the most recently added character matches
	 else if (quoteArr[inputArr.length - 1] === inputArr[inputArr.length - 1] 
		&& isEqual(quoteArr.slice(0, inputArr.length), inputArr)) {

		// check if user has completed a word (space)
	console.log(event.key);
		if (event.key !== "Unidentified" 
			&& event.key !== "Shift"
			&& event.key !== "Alt"
			&& event.key !== "Meta" 
			&& event.key !== "Enter"
			&& event.key !== "Tab"
			&& event.key !== "Backspace"
			&& event.key !== "Delete") {
			characterCount++;
			updateCharCountUI(characterCount);
		}

		updateQuoteUI(currentQuote, inputArr.length);

	}

}

document.querySelector('.input input').addEventListener('keyup', onInputListener);


const startBtnListener = function() {
	overlayOff();

	setupTest();

	document.querySelector('.input input').focus();
}

document.querySelector('.start').addEventListener('click', startBtnListener);

const radioBtnListener = function() {

	// remove checked class from any other elements 
	document.querySelectorAll('.list-item').forEach((item) => {
		item.classList.remove('checked');

		if (item === this) {
			item.classList.add('checked');
		}
	});

	// set num minutes 
	numMinutes = this.children[0].value;

}

document.querySelectorAll('.list-item').forEach((item) => {
	item.addEventListener('click', radioBtnListener);
});

// reset user input on browser load
const resetBrowser = function() {
	// start with overlay on
	overlayOn();
}

document.querySelector('body').onload = resetBrowser;