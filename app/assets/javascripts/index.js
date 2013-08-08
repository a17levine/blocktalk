
$(document).ready(function(){

	var _selectRange = false
	var _deselectQueue = []
	var selectionArray = []
  var date = moment()


  //CALENDAR
  $(function(){  
    $('#datepicker').datepicker({  
      inline: false,  
      showOtherMonths: false,  
      dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    });
    styleCalendar()
  });

  //SELECTABLE
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

        styleCalendar()
	    }
	  })
  });

	//Lightbox activation
	// $(".fancybox").fancybox();

  paintDay(0)
  // disableButtons()  // need to add this to disable anything in the past.
  
  // ** ON FORWARD BUTTON CLICK **
	$('.icon-chevron-sign-right').click(function(){
		slideScheduleLeft()
    //remove pre-existing ui-selected class
    $('.ui-selected').removeClass('ui-selected');
		paintDay(1)
    styleCalendar()
	});

  // ** ON BACKWARDS BUTTON CLICK **
	$('.icon-chevron-sign-left').click(function(){
		slideScheduleRight()
    //remove pre-existing ui-selected class
    $('.ui-selected').removeClass('ui-selected');
		paintDay(-1)
    styleCalendar()
	});

  // ** ON SUBMIT BUTTON CLICK **
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

	  		var ajaxRequest = $.ajax({  
  			type: "POST",  
  			url: "/meetings",  
  			data: createMessage,  
  			success: function(response){
  				alert(response)
		    	} 
			})
	})

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
    console.log(date.format("MM/DD/YYYY"))
    //updates the day header with the new date variable in the format.
    $('.day_header').text(date.format("MM/DD/YYYY"));
    //now variable becomes 11PM of the day before the new date variable.
    var now = date.startOf('day').subtract('h',1);
    //set the data-time attributes of each div to one hour increments, starting at 12AM.
    $('.hour').each(function(){
      //set the data-time attributes of each div to one hour increments, starting at 12AM.
      $(this).attr("data-time", now.add('h',1).format("YYYY/MM/DD, HH"));
      //add ui-selected class to each previously selected hour
      })

    $.each(selectionArray, function(index, selection){
      $('.hour').each(function(){
        if ($( this ).attr('data-time') == selection){
          $( this ).addClass('ui-selected');  
        }
      });
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
  }

  // function disableButtons() {
  //   var l = 0
  //   var r = 0
  //   var newdate = moment(date)
  //   $.each( selectionArray, function(index, selection){
  //     if (selection < date.startOf('day').format("YYYY/MM/DD, HH")){
  //       l=1
  //     }
  //     else if (selection > newdate.endOf('day').format("YYYY/MM/DD, HH")){
  //       r=1
  //     }

  //   });
  // //If not, disable the backwards button
  // if (l == 0){$('.icon-chevron-sign-left').hide()}
  // else {$('.icon-chevron-sign-left').show()};
  
  // if (r == 0){$('.icon-chevron-sign-right').hide()}
  // else {$('.icon-chevron-sign-right').show()};
  // }


})
