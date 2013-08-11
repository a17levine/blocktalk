$(document).ready(function(){
  var guestURL = "/meetings/" + meetingId;
  console.log("guestURL is " + guestURL);
	
  var hostChoices = guestMessage;
  var avails = hostChoices["guestMessage"]["availableDates"];
  var _selectRange = false;
  var _deselectQueue = [];
  var selectionArray = [];
  //Setting up variable for Lightbox later on
  var finalTime = "";

  //Push all of the selections made by the first user into selectionArray, so that
  //they can be displayed in the view
  $(avails).each(function(){
    var m = moment(this).format("YYYY/MM/DD, HH");
    selectionArray.push(m);
  });

  //  **  CALENDAR  **
  $(function(){  
    $('#datepicker').datepicker({  
        inline: false,  
        showOtherMonths: false,  
        dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],  
    });  
    styleCalendar(); 
  });  

 	// Grab first available date from host array
	var dateCalibrate = hostChoices["guestMessage"]["availableDates"][0];
	// Snap the show view to that date. 
	date = moment(dateCalibrate);
  paintDay(0);
  selectFinalTime();
  disableBeforeNow();
  disableButtons();

  //Prepare the lightbox
  $(".fancybox").fancybox({
    'type': 'inline',
    afterLoad   : function() {
      this.inner.append( '<h1>real talk, right quick:</h1>' );
      this.inner.append( '<h3>we just emailed you. check for a calendar invite.</h3>' );
      this.inner.append( "<a href='" + guestURL + "'><p>go to meeting page</p></a> ");
    }
  });




	// ** ON FORWARD BUTTON CLICK **
	$('.icon-chevron-sign-right').click(function(){
    //cancel the now outdated click functions
    $('.ui-selected').unbind();
		slideScheduleLeft();
    //Remove classes
    $('.ui-selected').removeClass('chosen');
    $('.ui-selected').removeClass('ui-selected');
    paintDay(1);
    selectFinalTime();
    disableBeforeNow();
    styleCalendar();
    disableButtons();
	});

	// ** ON BACKWARD BUTTON CLICK **
	$('.icon-chevron-sign-left').click(function(){
    //cancel the previous click function
    $('.ui-selected').unbind();
		slideScheduleRight();
    //Remove classes.
    $('.ui-selected').removeClass('chosen');
    $('.ui-selected').removeClass('ui-selected');
    paintDay(-1);
    selectFinalTime();
    disableBeforeNow();
    styleCalendar();
    disableButtons();
	});

  // ** ON SUBMIT BUTTON CLICK **
	$('.large.button').click(function(event){
		//When submit button is pressed, prevent default
  		event.preventDefault();
		//Take times and convert them into moment.js objects
		var avails = [];
		var m = moment(finalTime, "YYYY/MM/DD, HH").toJSON();
		avails.push(m);
		
		//Convert Moment object into JS Date object to get timezone
		//Turning crude date into a moment string, then splitting it
		var label = moment(finalTime, "YYYY/MM/DD, HH").toDate().toString().split(' ');
		//Getting the last item (timezone) in resulting array
		label = label.pop();
		//Shaving off parentheses
		label = label.replace(/[()]/g,'');
		
  	var guestChoice = 
			{ 
				"guestChoice": 
					{
					'guestEmail' : $('.guestEmail').val(), 
					'timeZoneOffset' : moment(avails[0]).format('ZZ'),
          'timeZoneLabel' : label,
          'availableDate' : avails[0]
					}
	  	};

    $('.button').first().attr("disabled", "disabled")

       


	  $.ajax({  
			type: "POST",  
			url: guestURL,  
			data: guestChoice,  
			success: function(response){  
  			//Setting Lightbox variable to the AJAX response
        // Display the lightbox
        $(".fancybox").click();
        $('.fancybox-error').hide();
      }
    });
  });

 	function slideScheduleRight(){
 		//add class to slide right, wait, then add class to slide from left side.
 		$(".day").addClass("slideToRight").delay(100).queue(function(){
 			$(".day").addClass("slideFromLeft");
 			$(this).dequeue();
 		});
 		window.setTimeout(function(){$(".day").removeClass("slideToRight")
									 $(".day").removeClass("slideFromLeft")},200);
 	}

 	function slideScheduleLeft(){
 		//add class to slide right, wait, then add class to slide from left side.
 		$(".day").addClass("slideToLeft").delay(100).queue(function(){
 			$(".day").addClass("slideFromRight");
 			$(this).dequeue();
 		});
 		window.setTimeout(function(){$(".day").removeClass("slideToLeft")
									 $(".day").removeClass("slideFromRight")},200);
 	}

  function displayDateHelper(){
    //if currently on today's calendar, display "tomorrow"
    if (moment().format("YYYY/MM/DD") == date.format("YYYY/MM/DD")){
      $('h3.day_helper').text("today")}
    //if on tomorrow's calendar, display "tomorrow"
    else if (moment().add("day",1).format("YYYY/MM/DD") == date.format("YYYY/MM/DD")){
      $('h3.day_helper').text("tomorrow")}
    //if on the next day's calendar, display "the day after"
    else if (moment().add("day",2).format("YYYY/MM/DD") == date.format("YYYY/MM/DD")){
      $('h3.day_helper').text("the day after")
    }
    //otherwise display the date in this format --> mon march 2nd
    else {$('h3.day_helper').text(date.format("ddd MMMM Do"))}
  }

  function paintDay(numdays){
    $('.ui-selected').removeClass('ui-selected');
    $('.chosen').removeClass('chosen');
    //adds numdays days to the date variable (-1 or +1)
    date.add('d',numdays);
    //updates the day header with the new date variable in the format.
    $('.day_header').text(date.format("MM/DD/YYYY"));
    displayDateHelper();
    //now variable becomes 11PM of the day before the new date variable.
    var now = date.startOf('day').subtract('h',1);
    //set the data-time attributes of each div to one hour increments, starting at 12AM.
    $('.hour').each(function(){
      $(this).attr("data-time", now.add('h',1).format("YYYY/MM/DD, HH"));
      //check if any times on the current day have already been chosen for the final selection.
      if ($(this).attr("data-time") == finalTime){
        $(this).addClass('chosen');
        }
    })
    //add ui-selected class to each hour that was previously selected by the first user.
    $.each(selectionArray, function(index, selection){
      $('.hour').each(function(){
        if ($( this ).attr('data-time') == selection){
          $( this ).addClass('ui-selected');  
        }
      })
    });
  }

  function clickCalendarDates(){
      $('td:not(.disable)').click(function(){
      var dayclicked = $( this ).text()
      var currentday = date.format("D")
      paintDay(dayclicked-currentday)
      selectFinalTime()
    })
  }

  function disableCalendarDates(){
    if ($('span.ui-datepicker-month').text() == moment().format("MMMM")){
      $('td').each(function(){
        if (parseInt($( this ).text()) < parseInt(moment().format("D"))){
          console.log("this: " + $( this ).text() + "  now: " + moment().format("D"))
          $(this).addClass("disable")
        }
      })
    }
  }

  function selectFinalTime() {
    $('.ui-selected').click(function() {
    finalTime = this.getAttribute('data-time');
    $('.hour').removeClass('chosen');
    $(this).addClass('chosen');
    });
  }

  function styleCalendar() {
    //Update the calendar to the current date.
    $('#datepicker').datepicker('setDate', date.toDate());
    $('td').removeClass('selectedDate');
    //loop through each member of the selection array, and if the day matches
    //the day of the month, add the selectedDate class to that day on the calendar.
    $.each(selectionArray, function(index, selection){
      $('td').each(function(){
        if ($( this ).text() == moment(selection, "YYYY/MM/DD, HH").format("D") &&
            date.format("M")== moment(selection, "YYYY/MM/DD, HH").format("M"))
          { $(this).addClass("selectedDate"); }
      });
    })

    disableCalendarDates()
    clickCalendarDates()
  }

  function disableButtons() {
    var l = 0;
    var r = 0;
    var newdate = moment(date);
    $.each( selectionArray, function(index, selection){
      if (selection < date.startOf('day').format("YYYY/MM/DD, HH")){
        l=1
      }
      else if (selection > newdate.endOf('day').format("YYYY/MM/DD, HH")){
        r=1
      }

    });
    //If not, disable the backwards button
    if (l == 0){$('.icon-chevron-sign-left').hide()}
    else {$('.icon-chevron-sign-left').show()};
    
    if (r == 0){$('.icon-chevron-sign-right').hide()}
    else {$('.icon-chevron-sign-right').show()};
  }

  function disableBeforeNow() {
    //disable all divs whos data-times are in the past.
    $('div').each(function(){
      if ($(this).attr("data-time") <= moment().format("YYYY/MM/DD, HH")){
        $(this).addClass("ignore")
      }
      else {$(this).removeClass("ignore") 
      }
    })
  }
});