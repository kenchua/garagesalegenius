

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
        this.parseMethod1(freeText);
    },

	parseMethod1: function(freeText) {

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
		freeTextCopy = freeTextCopy.replace(/(\s)+AM/g, 'AM');
		freeTextCopy = freeTextCopy.replace(/(\s)+PM/g, 'PM');
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
		var startTime = -1, endTime = -1, dayOfWeekIndex = -1;
        var month = 0; dayOfMonth = '';
        // regex note: + means 1 to many; ? means 0 or 1; * means 0 to many
		var amTimeIndex = freeTextCopy.search(/(\s)+[0-9]+(:)?[0-9]*AM/);	// space(s) followed by the start time ending in AM, the hour is optionally followed by a semicolon and optionally followed by minutes after the hour
		if (amTimeIndex > 0) {
			amTimeIndex++;	// added 1 to index to exclude the leading space
			this.log(true, 'found start time at pos ' + amTimeIndex);
			startTime = freeTextCopy.substring(amTimeIndex, freeTextCopy.indexOf('AM', amTimeIndex)); 
			this.log(true, 'found start time ' + startTime);

			// assumption: in most cases, the end time "PM" should immediately follow the start time "AM", ie, just a few characters further ahead
			var pmTimeIndex = freeTextCopy.search(/[0-9]+(:)?[0-9]*PM/);	// end time ending in PM (with leading space ignored), the hour is optionally followed by a semicolon and optionally followed by minutes after the hour
			if (pmTimeIndex >=0 && (pmTimeIndex - amTimeIndex) <= 15) {	// assumption: "PM" index being 15 characters or less from "AM"
				this.log(true, 'found end time at pos ' + pmTimeIndex);
                var pmWordIndex = freeTextCopy.indexOf('PM', pmTimeIndex);
				endTime = freeTextCopy.substring(pmTimeIndex, pmWordIndex);
				this.log(true, 'found end time ' + endTime);
                
                this.log(true, '>>>>> search for the date');
                // assumption: in most cases, the date appears before the start time

                this.log(true, '>>>>> search for the month');
                // assumption: there is at least one space before and after the month name
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
                    this.log(true, 'found date and time ' + freeTextCopy.substring(monthIndex, pmWordIndex));
                    
                    this.log(true, '>>>>> search for day of the week before the date');
                    // assumption: if the day of week can be found before the date, it should occur maximum 12 characters before the date
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' MON ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found MON'): null;}
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' MON. ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found MON.'): null;}
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' MONDAY ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found MONDAY'): null;}
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' TUE ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found TUE'): null;}
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' TUE. ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found TUE.'): null;}
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' TUESDAY ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found TUESDAY'): null;}
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' WED ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found WED'): null;}
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' WED. ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found WED.'): null;}
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' WEDNESDAY ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found WEDNESDAY'): null;}
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' THU ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found THU'): null;}
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' THU. ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found THU.'): null;}
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' THURSDAY ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found THURSDAY'): null;}
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' FRI ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found FRI'): null;}
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' FRI. ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found FRI.'): null;}
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' FRIDAY ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found FRIDAY'): null;}
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' SAT ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found SAT'): null;}
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' SAT. ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found SAT.'): null;}
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' SATURDAY ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found SATURDAY'): null;}
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' SUN ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found SUN'): null;}
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' SUN. ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found SUN.'): null;}
                    if (dayOfWeekIndex < 0) {dayOfWeekIndex = freeTextCopy.indexOf(' SUNDAY ', monthIndex - 12); (dayOfWeekIndex > 0)? this.log(true, 'found SUNDAY'): null;}
                    this.log(true, 'day of week found at pos ' + dayOfWeekIndex);
                    
                    this.log(true, '>>>>> search for the address before the date and time');
                    var addressSpace = freeTextCopy.substring(0, (dayOfWeekIndex > 0)? dayOfWeekIndex : monthIndex);
                    this.log(true, 'look for the address in this text:\n' + addressSpace);
                    // assumption: the street number is all numeric followed by space(s)
                    var streetNumberIndex = addressSpace.search(/\s[0-9]+(\s)+/);
                    this.log(true, 'possible street number found at pos ' + streetNumberIndex);
                }
			}
            

		}

		return;

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
		}

	},
	
	log: function(show, message) {
		if (show) console.log(message);
	}
}

var ap = AddressParser;



