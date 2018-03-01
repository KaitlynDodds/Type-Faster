
let currentQuote;
let wordCount;

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
		}

	}

	// setinterval
	updateClock();
	const interval = setInterval(updateClock, 1000);

}


/* WPM Functions ============================================================= */

const setupTest = function() {

	// reset word count
	wordCount = 0;
	updateWordCountUI(wordCount);

	// new quote and clear input
	resetQuoteAndInput();

	// setup timer
	const futureDate = pickFutureDate(5);
	
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
	// clear user input 
	document.querySelector('.input input').value = "";
}

const disableInput = function() {
	// add disabled attribute 
	document.querySelector('.input input').setAttribute('disabled', "disabled");
}

const enableInput = function() {
	// remove disable attr
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

const updateWordCountUI = function(count) {
	document.querySelector('.word-count').innerHTML = count;
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
		wordCount++;
		updateWordCountUI(wordCount);
		resetQuoteAndInput();
	}

	// check that the most recently added character matches
	 else if (quoteArr[inputArr.length - 1] === inputArr[inputArr.length - 1] 
		&& isEqual(quoteArr.slice(0, inputArr.length), inputArr)) {

		// check if user has completed a word (space)
		if (event.key === " ") {
			wordCount++;
			updateWordCountUI(wordCount);
		}

		updateQuoteUI(currentQuote, inputArr.length);

	}

}

document.querySelector('.input input').addEventListener('keyup', onInputListener);

const startWPMTest = function() {
	setupTest();
}

document.querySelector('.start').addEventListener('click', startWPMTest);


// reset user input on browser load
const resetBrowser = function() {

	wordCount = 0;

	clearInput();

    setQuote();

}

document.querySelector('body').onload = resetBrowser;