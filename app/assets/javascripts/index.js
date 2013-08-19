
$(document).ready(function(){

	var _selectRange = false
	var _deselectQueue = []
	var selectionArray = []
  var date = moment();
  var meetingId = ''
  var meetingLink = ''
  var successfulAjax = false;

  //Getting ENTER KEY to submit email address

  $('input').keypress(function (e) {
  if (e.which == 13) {
    $('.button').first().click();
    return false;
    }
  });

  //CALENDAR
  $(function(){  
    $('#datepicker').datepicker({  
      inline: false,  
      showOtherMonths: false,  
      dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    });
    styleCalendar();
    clickCalendarDates();
  });

  //SELECTABLE
	$(function() {
    $( ".selectable" ).selectable({
      filter: "div:not(.ignore)",
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
        //adds 'ui-selected class to selection'
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
  
  $(".fancybox").fancybox({
          afterLoad   : function() {
            this.inner.prepend( "<div class='row'><div class='small-10 small-offset-2 columns'><h2>Share this link with your friend:</h2></div></div>" );

            this.content = "<div class='row'><div class='small-10 small-offset-1 columns'><textarea name='box-content' font-size: 48px; id='zclip' rows='2' cols='60'>" + meetingLink + '</textarea></div></div>' + '<br />'; 
            // "<div class='row'><a class='button small-4 small-offset-4' href='" + meetingLink + "'>click to proceed</a></div>";
             
            // Copy Button for later:      "<p><input type='button' data-clipboard-target='fetext' id='copy' class='button' name='copy' value='copy' data-clipboard-text='Test'/></p>"
            // Document Icon for later:    "<i class='icon-file-text-alt icon-4x'></i>"
          }
        });

  paintDay(0);
  disableBeforeNow();
  disableButtons();
  
  // ** ON FORWARD BUTTON CLICK **
	$('.icon-chevron-sign-right').click(function(){
		slideScheduleLeft();
		paintDay(1);
    disableBeforeNow();
    styleCalendar();
    disableButtons();
	});

  // ** ON BACKWARDS BUTTON CLICK **
	$('.icon-chevron-sign-left').click(function(){
		slideScheduleRight();
		paintDay(-1);
    disableBeforeNow();
    styleCalendar();
    disableButtons();
	});

  // ** ON SUBMIT BUTTON CLICK **
	$('.large.button').click(function(event){
    if (successfulAjax == false) {
  		//When submit button is pressed, prevent default
    		event.preventDefault();
  		//Now take times and convert them into moment.js objects
  		var avails = []
  		$(selectionArray).each(function(){
  			var m = moment(this, "YYYY/MM/DD, HH").toJSON();
  			avails.push(m);
  		});

      //validate that user selects at least one timeblock
      if (avails.length == 0){
        alert("Please select at least one timeblock.");
        return false;
      }

      //use regex to validate user email
      else if (validateEmail($('.hostEmail').val()) == false){
        alert("Please enter a valid email address.");
        return false;
      }

          //validate format of email
      function validateEmail(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      } 

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
        dataType: "json",
        success: function(response){
          //Setting Lightbox variable to the AJAX response
          meetingId = response.token;

          //Prepare the lightbox
          meetingLink = "http://" + window.location.host + '/meetings/' + meetingId + '/';
          // Display the lightbox
          $(".fancybox").click();
          disableSubmitButton();
        },
      });
    };
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
    //adds numdays days to the date variable (-1 or +1)
    date.add('d',numdays);
    //updates the day header with the new date variable in the format.
    $('.day_header').text(date.format("MM/DD/YYYY"));
    displayDateHelper();
    //now variable becomes 11PM of the day before the new date variable.
    var now = date.startOf('day').subtract('h',1);
    //set the data-time attributes of each div to one hour increments, starting at 12AM.
    $('.hour').each(function(){
      //set the data-time attributes of each div to one hour increments, starting at 12AM.
      $(this).attr("data-time", now.add('h',1).format("YYYY/MM/DD, HH"));
      })

    //add ui-selected class to each previously selected hour
    $.each(selectionArray, function(index, selection){
      $('.hour').each(function(){
        if ($( this ).attr('data-time') == selection){
          $( this ).addClass('ui-selected');  
        }
      });
    });
  }

  function clickCalendarDates(){
      $('td:not(.disable)').click(function(){
      var dayclicked = $( this ).text()
      var currentday = date.format("D")
      paintDay(dayclicked-currentday)
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

// ** BUTTON VISIBILITY **
  function disableButtons() {
    if (date.format("MM/DD/YYYY") <= moment().format("MM/DD/YYYY")){
          //remove left chevron button
          $('.icon-chevron-sign-left').hide()
    }     //show left chevron button
    else {$('.icon-chevron-sign-left').show()};
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

  function disableSubmitButton() {
    $('.button').first().attr("disabled", "disabled");
    successfulAjax = true;
  }
})
