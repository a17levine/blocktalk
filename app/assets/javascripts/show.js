

 $(document).ready(function(){
	
  var hostChoices = guestMessage;
  var avails = hostChoices["guestMessage"]["availableDates"];
  var _selectRange = false 
  var _deselectQueue = []
  var selectionArray = []
  var finalTime = ""

  //Push all of the selections made by the first user into selectionArray, so that
  //they can be displayed in the view
  $(avails).each(function(){
    var m = moment(this).format("YYYY/MM/DD, HH")
    selectionArray.push(m);
  });

 	// Grab first available date from host array
	var dateCalibrate = hostChoices["guestMessage"]["availableDates"][0];
	// Snap the show view to that date. 
	date = moment(dateCalibrate);
  paintDay(0)
  selectFinalTime()
  styleCalendar()

	// ** ON FORWARD BUTTON CLICK **
	$('.icon-chevron-sign-right').click(function(){
    //cancel the now outdated click functions
    $('.ui-selected').unbind();
		//fly right
		slideScheduleLeft()
    //Remove classes
    $('.ui-selected').removeClass('chosen');
    $('.ui-selected').removeClass('ui-selected');
    paintDay(1)
    selectFinalTime()
    styleCalendar()

	});

	// ** ON BACKWARD BUTTON CLICK **
	$('.icon-chevron-sign-left').click(function(){
    //cancel the previous click function
    $('.ui-selected').unbind();
		//fly left
		slideScheduleRight()
    //Remove classes.
    $('.ui-selected').removeClass('chosen');
    $('.ui-selected').removeClass('ui-selected');
    paintDay(-1)
    selectFinalTime()
    styleCalendar()

	});

	$('.large.button').click(function(event){
		//When submit button is pressed, prevent default
  		event.preventDefault();
		//Take times and convert them into moment.js objects
		var avails = []
		$(selectionArray).each(function(){
			var m = moment(this, "YYYY/MM/DD, HH").toJSON();
			avails.push(m);
			console.log(avails)
		});
		
		//Convert Moment object into JS Date object to get timezone
		//Turning crude date into a moment string, then splitting it
		var label = moment(selectionArray[0], "YYYY/MM/DD, HH").toDate().toString().split(' ');
		//Getting the last item (timezone) in resulting array
		label = label.pop();
		//Shaving off parentheses
		label = label.replace(/[()]/g,'');
		
  		var guestChoice = 
			{ 
				"guestChoice"  : 
					{
					'guestEmail' : $('.guestEmail').val(), 
					'chosenTime' : moment(avails[0]).format('ZZ'),
					}
	  		}

	  		$.ajax({  
  			type: "POST",  
  			url: "/meetings/[:id]",  
  			data: guestChoice,  
  			success: function(){  
    			alert('This shit succeeded');	
		    	} 
		})
	})

	//  **  CALENDAR  **
	$(function(){  
        $('#datepicker').datepicker({  
            inline: false,  
            showOtherMonths: false,  
            dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],  
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

  function paintDay(numdays){
    //adds numdays days to the date variable (-1 or +1)
    date.add('d',numdays);
    //updates the day header with the new date variable in the format.
    $('.day_header').text(date.format("MM/DD/YYYY"));
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
      $('td').each(function(i){
        if ($(this).text() == moment(selection, "YYYY/MM/DD, HH").format("D") &&
            date.format("M")== moment(selection, "YYYY/MM/DD, HH").format("M"))
          { $(this).addClass("selectedDate"); }
      });
    })
  }

});