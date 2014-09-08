

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
        // assumption: time includes the text AM and PM
        // assumption: start time is in the morning (AM)
		var startTime = -1, endTime = -1;
        var month = 0; dayOfMonth = '';
        // regex note: + means 1 to many; ? means 0 or 1; * means 0 to many
		var amTimeIndex = freeTextCopy.search(/\s[0-9]+(:)?[0-9]*AM/);	// space followed by the start time ending in AM, the hour is optionally followed by a semicolon and optionally followed by minutes after the hour
		if (amTimeIndex > 0) {
			amTimeIndex++;	// added 1 to index to exclude the leading space
			this.log(true, 'found start time at pos ' + amTimeIndex);
			startTime = freeTextCopy.substring(amTimeIndex, freeTextCopy.indexOf('AM', amTimeIndex)); 
			this.log(true, 'found start time ' + startTime);

			// assumption: in most cases, the end time "PM" should immediately follow the start time "AM", ie, just a few characters further ahead
			var pmTimeIndex = freeTextCopy.search(/[0-9]+(:)?[0-9]*PM/);	// end time ending in PM (with leading space ignored), the hour is optionally followed by a semicolon and optionally followed by minutes after the hour
			if (pmTimeIndex >=0 && (pmTimeIndex - amTimeIndex) <= 15) {	// assumption: "PM" index being 15 characters or less from "AM"
				this.log(true, 'found end time at pos ' + pmTimeIndex);
				endTime = freeTextCopy.substring(pmTimeIndex, freeTextCopy.indexOf('PM', pmTimeIndex));
				this.log(true, 'found end time ' + endTime);
			}
            
            this.log(true, '>>>>> search for the date');
            // assumption: in most cases, the date appears before the start time
            
            this.log(true, '>>>>> search for the month');
            // assumption: there is at least one space before and after the month
            var monthIndex = -1; monthLength = -1;
            
            // regex note: the literal dot (escaped by \).  a dot by itself matches any character which isn't what we need
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sJAN\s/); month = 1; monthLength = 3;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sJAN\.\s/); month = 1; monthLength = 4;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sJANUARY\s/); month = 1; monthLength = 7;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sFEB\s/); month = 2; monthLength = 3;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sFEB\.\s/); month = 2; monthLength = 4;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sFEBRUARY\s/); month = 2; monthLength = 8;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sMAR\s/); month = 3; monthLength = 3;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sMAR\.\s/); month = 3; monthLength = 4;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sMARCH\s/); month = 3; monthLength = 5;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sAPR\s/); month = 4; monthLength = 3;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sAPR\.\s/); month = 4; monthLength = 4;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sAPRIL\s/); month = 4; monthLength = 5;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sMAY\s/); month = 5; monthLength = 3;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sJUN\s/); month = 6; monthLength = 3;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sJUNE\s/); month = 6; monthLength = 4;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sJUL\s/); month = 7; monthLength = 3;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sJULY\s/); month = 7; monthLength = 4;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sAUG\s/); month = 8; monthLength = 3;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sAUG\.\s/); month = 8; monthLength = 4;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sAUGUST\s/); month = 8; monthLength = 6;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sSEP\s/); month = 9; monthLength = 3;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sSEP\.\s/); month = 9; monthLength = 4;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sSEPT\s/); month = 9; monthLength = 4;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sSEPT\.\s/); month = 9; monthLength = 5;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sSEPTEMBER\s/); month = 9; monthLength = 9;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sOCT\s/); month = 10; monthLength = 3;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sOCT\.\s/); month = 10; monthLength = 4;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sOCTOBER\s/); month = 10; monthLength = 7;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sNOV\s/); month = 11; monthLength = 3;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sNOV\.\s/); month = 11; monthLength = 4;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sNOVEMBER\s/); month = 11; monthLength = 8;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sDEC\s/); month = 12; monthLength = 3;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sDEC\.\s/); month = 12; monthLength = 4;}
            if (monthIndex < 0) {monthIndex = freeTextCopy.search(/\sDECEMBER\s/); month = 12; monthLength = 8;}

            if (monthIndex > 0) monthIndex++; //    exclude the leading space

            if (monthIndex > 0 && monthIndex < amTimeIndex) {
                this.log(true, 'found month at pos ' + monthIndex + ' ; monthLength = ' + monthLength);
                this.log(true, 'char at monthIndex is ' + freeTextCopy.charAt(monthIndex));
                this.log(true, 'found month ' + month);
                this.log(true, 'confirmed month appears before time');
                this.log(true, '>>>>> search for the day of the month');
                // assumption: day of month should be found within 5 characters from the end of the month name
                this.log(true, 'char at pos ' + monthIndex + ' + ' + monthLength + ' is ' + freeTextCopy.charAt(monthIndex + monthLength));
                var digitFound = false;
                for (var i=(monthIndex + monthLength); i < (monthIndex + monthLength + 6); i++) {
                    if ($.isNumeric(freeTextCopy.charAt(i))) {
                        digitFound = true;
                        dayOfMonth = dayOfMonth + '' + freeTextCopy.charAt(i);
                    } else {
                        if (digitFound) break;
                    }
                }
                this.log(true, 'day of month is ' + dayOfMonth);
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



