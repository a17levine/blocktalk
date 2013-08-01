 $(document).ready(function(){
	var _selectRange = false, _deselectQueue = [];
	var selectionArray = [];
	$(function() {
	    $( ".selectable" ).selectable({
	        selecting: function (event, ui) {
	        	//Not sure what this does
	            if (event.detail == 0) {
	                _selectRange = true;
	                return true;

	            }
	            //if div has already been selected, adds div to queue
	            //to be deselected.
	            if ($(ui.selecting).hasClass('ui-selected')) {
	                _deselectQueue.push(ui.selecting);
	            }

	            var time2 = $(ui.selecting)[0].getAttribute('data-time');
	            if (jQuery.inArray(time2, selectionArray)==-1){
	            	selectionArray.push(time2);
	            }
	            else {
	            	selectionArray.splice( $.inArray(time2,selectionArray),1 );
	            }
	            console.log(selectionArray);
	        },
	        unselecting: function (event, ui) {
	            $(ui.unselecting).addClass('ui-selected');
	        },
	        stop: function () {
	            if (!_selectRange) {
	            	//removes selected class from everything in the queue.
	                $.each(_deselectQueue, function (ix, de) {
	                    $(de)
	                        .removeClass('ui-selecting')
	                        .removeClass('ui-selected');
	                });
	            }
	            _selectRange = false;
	            //clears the queue
	            _deselectQueue = [];

	            var result = $( "#select-result" ).empty();
	            $( ".ui-selected", this ).each(function() {
	            	// var index = $( ".hour" ).index( this );
	            	var time = this.getAttribute('data-time');
	            	result.append( " #" + (time) );
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
              })
	        }
	    });
	});

	//Current date.  Displayed in the header. 
	var date = moment();
	$('.day_header').text(date.format("MM/DD/YYYY"));

	//adds the date and certain number of hours to each div
	var now = date.startOf('day').subtract('h',1);
	var num = 0
	$('.hour').each(function(){
		$(this).attr("data-time", now.add('h',1).format("YYYY/MM/DD, HH"));
	})
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
		//For now, remove ui-selected class on click.
		$('.ui-selected').removeClass('ui-selected');
		//When forward button is clicked, check already-selected times
		$.each(selectionArray, function(index, selection){
			$('.hour').each(function(){
				if ($( this ).attr('data-time') == selection){
					$( this ).addClass('ui-selected');	
				}
			})
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
 		$(".day").addClass("slideToRight").delay(300).queue(function(){
 			$(".day").addClass("slideFromLeft");
 			$(this).dequeue();
 		});
 		window.setTimeout(function(){$(".day").removeClass("slideToRight")
									 $(".day").removeClass("slideFromLeft")},600);
 	}

 	function slideScheduleLeft(){
 		//add class to slide right, wait, then add class to slide from left side.
 		$(".day").addClass("slideToLeft").delay(300).queue(function(){
 			$(".day").addClass("slideFromRight");
 			$(this).dequeue();
 		});
 		window.setTimeout(function(){$(".day").removeClass("slideToLeft")
									 $(".day").removeClass("slideFromRight")},600);
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
		//For now, remove ui-selected class on click.
		$('.ui-selected').removeClass('ui-selected');
		//When back button is clicked, check already-selected times
		$.each(selectionArray, function(index, selection){
			$('.hour').each(function(){
				if ($( this ).attr('data-time') == selection){
					$( this ).addClass('ui-selected');	
				}
			})
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
		

		// var hostTimes = { 
		// // 	'email' : placeEmailHere, 
		// 	'timezone' : {'tzname' : Eastern, 'tzformat' : moment(avails[0]).format('ZZ')}
		// 	'availTimes' : avails			], 
  // 		}
		
  		    		var createMessage = 
			{ 
				"createMessage"  : 
					{
					'hostEmail'  	 : $('.hostEmail').val(), 
					'timeZoneOffset' : moment(avails[0]).format('ZZ'),
					'timeZoneLabel'  : label, 
					'availableDates' : avails, 
					}
	  		}

	  		$.ajax({  
  			type: "POST",  
  			url: "/meetings",  
  			data: createMessage,  
  			success: function(){  
    			alert('This shit succeeded');
    			// $('#contact_form').html("<div id='message'></div>");  
			    // $('#message').html("<h2>Contact Form Submitted!</h2>")  
			    // .append("<p>We will be in touch soon.</p>")  
			    // .hide()  
			    // .fadeIn(1500, function() {  
      		// 	$('#message').append("<img id='checkmark' src='images/check.png' />");  
		    		
		    	} 
			 // return false; 
		})
	})
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

			 


   		// console.log(createMessage);

  		// $.ajax({  
  		// 	type: "POST",  
  		// 	url: "/meetings",  
  		// 	data: createMessage,  
  		// 	success: function(){  
    // 			alert('This shit succeeded')
    // 			// $('#contact_form').html("<div id='message'></div>");  
			 //    // $('#message').html("<h2>Contact Form Submitted!</h2>")  
			 //    // .append("<p>We will be in touch soon.</p>")  
			 //    // .hide()  
			 //    // .fadeIn(1500, function() {  
    //   		// 	$('#message').append("<img id='checkmark' src='images/check.png' />");  
		  //   		return false; 
		  //   	}) 