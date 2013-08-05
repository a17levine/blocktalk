 $(document).ready(function(){
	
  var hostChoices = guestMessage;
  var _selectRange = false, _deselectQueue = [];
  var selectionArray = []
  var finalTime = ""
  var avails = hostChoices["guestMessage"]["availableDates"];
  //push all of the selections made by the first user onto selectionArray, so that
  //it can be displayed in the view
  $(avails).each(function(){
      var m = moment(this).format("YYYY/MM/DD, HH")
      selectionArray.push(m);
  });

		//STYLE THE DAYS ON THE CALENDAR
	//remove all existing selectedDate classes
	$('td').removeClass('selectedDate');
	//loop through each member of the selection array, and if the day matches
	//the day of the month, add the selectedDate class to that day on the calendar.
	$.each(selectionArray, function(index, selection){
	$('td').each(function(i){
	  if ($(this).text() == moment(selection, "YYYY/MM/DD, HH").format("D") 
	    &&  date.format("M")== moment(selection, "YYYY/MM/DD, HH").format("M")
	    ){
	    $(this).addClass("selectedDate");
	  }
	});
	});


 	// Grab first available date (from host array)
		var dateCalibrate = hostChoices["guestMessage"]["availableDates"][0];
	// 

	// Snap calendar show to that date. 
		date = moment(dateCalibrate);
	
	$('.day_header').text(date.format("MM/DD/YYYY"));

	//adds the date and certain number of hours to each div
	var now = date.startOf('day').subtract('h',1);
	var num = 0
	$('.hour').each(function(){
		$(this).attr("data-time", now.add('h',1).format("YYYY/MM/DD, HH"));
	})

	$.each(selectionArray, function(index, selection){
		$('.hour').each(function(){
			if ($( this ).attr('data-time') == selection){
				$( this ).addClass('ui-selected');	
			}
		})
	});

	//On click, forward button adds 1 day to the date variable.
	$('.icon-chevron-sign-right').click(function(){
		//fly right
		slideScheduleLeft()
		//adds 1 day to the date variable
		date.add('d',1);
		//updates the day header with the new date variable in the format.
		$('.day_header').text(date.format("MM/DD/YYYY"));
		//now variable becomes 11PM of the day before the new date variable.
		var now = date.startOf('day').subtract('h',1);
		$('.hour').each(function(){
		//set the data-time attributes of each div to one hour increments, starting at 12AM.
		$(this).attr("data-time", now.add('h',1).format("YYYY/MM/DD, HH"));
		})
		//cancel the previous click function
		$('.ui-selected').unbind();
		//For now, remove ui-selected class on click.
		$('.ui-selected').removeClass('chosen');
		$('.ui-selected').removeClass('ui-selected');
		//When forward button is clicked, check already-selected times
		$.each(selectionArray, function(index, selection){
			$('.hour').each(function(){
				if ($( this ).attr('data-time') == selection){
					$( this ).addClass('ui-selected');	
				}
			})
		});

 	$('.ui-selected').click(function() {
		finalTime = this.getAttribute('data-time');
 		$('.hour').removeClass('chosen');
 		$(this).addClass('chosen');
 		console.log(finalTime);
 		});



		//Update the calendar to the current date.
		var myDate = date.toDate()
		$('#datepicker').datepicker('setDate', myDate);

		$('td').removeClass('selectedDate');
        //loop through each member of the selection array, and if the day matches
        //the day of the month, add the selectedDate class to that day on the calendar.
	    $.each(selectionArray, function(index, selection){
	      $('td').each(function(i){
	        if ($(this).text() == moment(selection, "YYYY/MM/DD, HH").format("D") 
	          &&  date.format("M")== moment(selection, "YYYY/MM/DD, HH").format("M")
	          ){
	          $(this).addClass("selectedDate");
	           }
            });
          })
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

	//On click, back button removes one day from the date variable.
	$('.icon-chevron-sign-left').click(function(){
		//fly left
		slideScheduleRight()
		//subtracts 1 day from the date variable
		date.subtract('d',1);
		//updates the day header with the new date variable in the format.
		$('.day_header').text(date.format("MM/DD/YYYY"));
		//now variable becomes 11PM of the day before the new date variable.
		var now = date.startOf('day').subtract('h',1);
		$('.hour').each(function(){
		//set the data-time attributes of each div to one hour increments, starting at 12AM.
		$(this).attr("data-time", now.add('h',1).format("YYYY/MM/DD, HH"));
		})
		//cancel the previous click function
		$('.ui-selected').unbind();
		//For now, remove ui-selected class on click.
		$('.ui-selected').removeClass('chosen');
		$('.ui-selected').removeClass('ui-selected');
		//When back button is clicked, check already-selected times
		$.each(selectionArray, function(index, selection){
			$('.hour').each(function(){
				if ($( this ).attr('data-time') == selection){
					$( this ).addClass('ui-selected');	
				}
			})
		});

		//check if any times have been chosen for the final selection
		$('.hour').each(function(){
			if ($( this ).attr('data-time') == finalTime){
				$( this ).addClass('chosen');
			}
		});

 		$('.ui-selected').click(function() {
			finalTime = this.getAttribute('data-time');
 			$('.hour').removeClass('chosen');
 			$(this).addClass('chosen');
 			console.log(finalTime);
 		});

		//Update the calendar to the current date.
		var myDate = date.toDate()
		$('#datepicker').datepicker('setDate', myDate);
			
		$('td').removeClass('selectedDate');
        //loop through each member of the selection array, and if the day matches
        //the day of the month, add the selectedDate class to that day on the calendar.
	    $.each(selectionArray, function(index, selection){
	      $('td').each(function(i){
	        if ($(this).text() == moment(selection, "YYYY/MM/DD, HH").format("D") 
	          &&  date.format("M")== moment(selection, "YYYY/MM/DD, HH").format("M")
	          ){
	          $(this).addClass("selectedDate");
	           }
            });
          })	

	});
	$('.large.button').click(function(event){
		//When submit button is pressed, prevent default
  		event.preventDefault();
		//Now take times and convert them into moment.js objects

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
					'guestEmail'  	 : $('.guestEmail').val(), 
					'chosenTime' 	 : moment(avails[0]).format('ZZ'),
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

 	$('.ui-selected').click(function() {
		finalTime = this.getAttribute('data-time');
 		$('.hour').removeClass('chosen');
 		$(this).addClass('chosen');
 		console.log(finalTime);
	});


	//CALENDAR
	$(function(){  
        $('#datepicker').datepicker({  
            inline: false,  
            showOtherMonths: false,  
            dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],  
        });  
    });  

});