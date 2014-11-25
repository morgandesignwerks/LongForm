
// Global
LongForm = function () {};

LongForm.prototype.init = function () {
	this.bindEvents();
};

LongForm.prototype.bindEvents = function() {
	$("body").on("click", "#send", $.proxy(this.handleSendClickEvent, this));
};

// Call all our post-click events and get the string into the UI
LongForm.prototype.handleSendClickEvent = function () {
	if (this.validateInputs()) {
		var sFormattedDollars = "";
		this.cleanUpAndSplit();
		
		// Handle if this person is broke, e.g. input is "0.75" or ".75"
		sFormattedDollars = this.dollars.length == 0 || (this.dollars.length == 1 && this.dollars[0] == "0")
			? "zero"
			: this.buildHundredsWithMagnitude(this.dollars);
		
		// Final output with the first letter capitalized
		sFormattedDollars = sFormattedDollars.charAt(0).toUpperCase() + sFormattedDollars.slice(1);
		$("#output").append(sFormattedDollars + " and " + this.cents + "/100 dollars");
	}
};

// Handle bad inputs: strings, nothing, spaces.
LongForm.prototype.validateInputs = function () {
	var success = false;
	this.sInputNumber = $("#inputNumber").val();
	
	// Clear the output
	$("#output").empty();
	
	// If there's nothing or just empty spaces
	if (!this.sInputNumber || this.sInputNumber.indexOf(" ") >= 0) {
		alert("Please type a number into the box");
	}
	// If it's not a number
	else if (isNaN(this.sInputNumber)) {
		alert("You must enter a valid number with no letters or spaces");
	}
	// Pass
	else {
		success = true;
	}
	return success;
};

LongForm.prototype.cleanUpAndSplit = function () {
	this.splitDollarsAndCents();
	this.removeLeadingZeros();
	this.roundOffCents();
};

LongForm.prototype.splitDollarsAndCents = function () {
	var splitAmount = this.sInputNumber.split(".");
	this.dollars = splitAmount[0];
	
	if (splitAmount.length > 1) {
		this.cents = splitAmount[1];
	}
	else {
		this.cents = "00";
	}
	
	// Ya know what... if someone has more than 999 billion dollars, I don't think they need this tool.
	if (this.dollars.length > 12) {
		alert("Woah, hold on there cowboy. We only go up to billions in these parts. We'll shave that down for ya.");
		this.dollars = this.dollars.substring(this.dollars.length - 12, this.dollars.length);
        console.log(this.dollars);
        $("#inputNumber").val(this.dollars);
	}
};

// If someone types something like '000.25' we need to remove the leading zeros and get down to just one.
LongForm.prototype.removeLeadingZeros = function () {
	var sScratch = this.dollars;
	
	for (var i = 0; i < this.dollars.length; i++) {
		// As soon as we hit a digit != 0, break out of the for loop
		if (this.dollars[i] != "0") {
			break;
		}
		else {
			if (i != (this.dollars.length - 1)) {
				// Unless we are on the last position, we don't use a leading zero, e.g. "0"
				sScratch = this.dollars.substring(i + 1, this.dollars.length);
			}
		}
	}
	this.dollars = sScratch;
};

// Convert to a floating point number to round up, then send back only what's on the right of the decimal, as a string.
LongForm.prototype.roundOffCents = function() {
	var nCents = parseFloat("." + this.cents).toFixed(2);
	this.cents = nCents.toString().split(".")[1];
};


// Build the string using recursion one block of magnitude at a time
LongForm.prototype.buildHundredsWithMagnitude = function (sNumber, iMagnitude) {
	// Create some arrays of strings for us to grab as needed
	var singles = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
	var teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
	var tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
	var magnitude = ["", " thousand ", " million ", " billion "];
	
	// Get the 3 rightmost digits to use as indices in the above arrays
	var i = (sNumber.length - 1);
	var iOnes = parseInt(this.dollars[i]);
	var	iTens =  parseInt(this.dollars[i - 1]);
	var iHundreds = parseInt(this.dollars[i - 2]);
	
	// We aren't passing iMagnitude on the first call, so initialize at value of zero
	if (iMagnitude == null) {
		iMagnitude = 0;
	}
	
	var sResult = 
		// Handle the hundreds
		(iHundreds && iHundreds != "0" ? (singles[iHundreds] + " hundred ") : "")
		// Handle the teens and tens, return nothing if we have no tens. Two layers of ternery to handle teens as well as if there are no tens.
		+ (iTens
			? (iTens == "1" ? (teens[iOnes]) : (tens[iTens]))
				+ (iTens != "0" && iTens != "1" && iOnes != "0" ? "-" : "") // If no teens and the one is not zero, we need a hyphen, e.g. "twenty-five"
			: "")
		// Handle the singles, unless we had a teen
		+ (iOnes && iTens != "1" ? (singles[iOnes]) : "")
		// Add magnitude
		+ magnitude[iMagnitude];
	
	// Return the result if there are no digits remaining on the left (thousands or greater)
	if (sNumber.length <= 3) {
		return sResult;
	}
	else {
		iMagnitude++;
		// Recrusion! Exclamation points!
		return this.buildHundredsWithMagnitude(sNumber.substring(0, sNumber.length - 3), iMagnitude) + " " + sResult;
	}
	
};

$(document).ready(function() {
	var longForm = new LongForm();
	longForm.init();
});