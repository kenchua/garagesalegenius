

// references:
// http://www.jquerybyexample.net/2012/06/jquery-string-functions.html

// examples of time:
// 9:00am -2:00pm
// 10 am - 5 pm
// 8-noon
// 7am-2pm
// 9:00am -2:00pm
// 9AM-1PM
// 8 a.m. to 2 p.m.
// 8am-3pm
// 8am
// 8:00am to 3:00pm

var AddressParser = {
	parse: function(freeText) {

		var freeTextCopy;
		var freeTextLength;
		var digitStartIndex;
		var streetNumberStartIndex;

		this.log(false, '>>>>> freeText input: \n' + freeText);

		// make a copy of freeText and perform some data sanitizing
		this.log(true, '>>>>> pre-process input.');
		this.log(true, 'input length before pre-processing: ' + freeText.length);
		this.log(true, 'trim input');
		freeText = $.trim(freeText);
		this.log(true, 'clone input');
		freeTextCopy = freeText.substring(0);
		freeTextCopy = freeTextCopy.toUpperCase();
		this.log(true, 'replace AM and PM variations');
		freeTextCopy = freeTextCopy.replace(/A.M./, 'AM');
		freeTextCopy = freeTextCopy.replace(/P.M./, 'PM');
		freeTextCopy = freeTextCopy.replace(/ AM/g, 'AM');
		freeTextCopy = freeTextCopy.replace(/ PM/g, 'PM');
		freeTextLength = freeTextCopy.length;

		this.log(true, 'input length after pre-processing: ' + freeTextCopy.length);
		$('#freeText').val(freeTextCopy);

/*		// STEP 2 - look for numbers
		this.log(true, '>>>>> look for numbers');
		for (var i=0; i<freeTextLength; i++) {
			var currChar = freeText.charAt(i);
			if ( $.isNumeric(currChar) ) {
				// a digit was found. look for a string with continuous digits followed by spaces(s)
				digitStartIndex = i;
				var spaceIndex = freeText.indexOf(' ', i);
				var possibleStreetNumber = freeText.substring(i, spaceIndex);	// character at spaceIndex is excluded
				var textSnippetAfterPossibleStreetNumber = ((freeTextLength -1)-spaceIndex > 20)? freeText.substr(spaceIndex, 20) : freeText.substring(spaceIndex);	// show 10 characters after spaceIndex, otherwise, just show the remaining characters

				if ($.isNumeric(possibleStreetNumber)) {
					this.log(true, 'possible street #: ' + possibleStreetNumber + '  some text following #: ' + textSnippetAfterPossibleStreetNumber);

					// later on after we find an address, advance index to search for the next address in freeText
					i = spaceIndex;
				}


			}
		}*/

		// look for the address
		this.log(true, '>>>>> search for address');

		this.log(true, '>>>>> search for the start and end time');
		var startTime = -1, endTime = -1;
		var amTimeIndex = freeTextCopy.search(/\s[0-9]+(:)?[0-9]*AM/);	// space followed by the start time ending in AM, the hour is optionally followed by a semicolon and optionally followed by minutes after the hour
		if (amTimeIndex > 0) {
			amTimeIndex++;	// added 1 to index to exclude the leading space
			this.log(true, 'found start time at pos ' + amTimeIndex);
			startTime = freeTextCopy.substring(amTimeIndex, freeTextCopy.indexOf('AM', amTimeIndex)); 
			this.log(true, 'found start time ' + startTime);

			// in most cases, the end time "PM" should immediately follow the start time "AM", ie, just a few characters further ahead
			var pmTimeIndex = freeTextCopy.search(/[0-9]+(:)?[0-9]*PM/);	// end time ending in PM (with leading space ignored), the hour is optionally followed by a semicolon and optionally followed by minutes after the hour
			if (pmTimeIndex >=0 && (pmTimeIndex - amTimeIndex) <= 15) {	// "PM" index being 15 characters or less from "AM"
				this.log(true, 'found end time at pos ' + pmTimeIndex);
				endTime = freeTextCopy.substring(pmTimeIndex, freeTextCopy.indexOf('PM', pmTimeIndex));
				this.log(true, 'found end time ' + endTime);

			}
		}

		return;

		for (var i=0; i<freeTextLength; i++) {

			// look for the word "AM" (morning) and work backwards to get the start time
			//var amTimeIndex = freeTextCopy.

			var currChar = freeText.charAt(i);
			if ( $.isNumeric(currChar) ) {
				// a digit was found. look for a string with continuous digits followed by spaces(s)
				digitStartIndex = i;
				var spaceIndex = freeText.indexOf(' ', i);
				var possibleStreetNumber = freeText.substring(i, spaceIndex);	// character at spaceIndex is excluded
				var textSnippetAfterPossibleStreetNumber = ((freeTextLength -1)-spaceIndex > 20)? freeText.substr(spaceIndex, 20) : freeText.substring(spaceIndex);	// show 10 characters after spaceIndex, otherwise, just show the remaining characters

				if ($.isNumeric(possibleStreetNumber)) {
					this.log(true, 'possible street #: ' + possibleStreetNumber + '  some text following #: ' + textSnippetAfterPossibleStreetNumber);

					// later on after we find an address, advance index to search for the next address in freeText
					i = spaceIndex;
				}


			}
		}

	},
	
	log: function(show, message) {
		if (show) console.log(message);
	}
}

var ap = AddressParser;



