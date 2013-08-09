
$(document).ready(function(){

	var _selectRange = false;
	var _deselectQueue = [];
	var selectionArray = [];
  var date = moment();
  //Setting up variable for Lightbox later on
  var meetingId = '';


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

  //Prepare the lightbox
  var meetingLink = 'http://' + window.location.host + '/meetings/' + meetingId + '/'
  $(".fancybox").fancybox({
           //used to be window.location.href
          afterLoad   : function() {
            this.inner.prepend( '<h1>Share this link with your friend:</h1>' );
            this.content = "<textarea name='box-content' font-size: 48px; id='zclip' rows='2' cols='70'>" + meetingLink + '</textarea>' + '<br />' + 
            "<div class='row'><a href='http://" + meetingLink + "'><h6>click to proceed</h6></a></div>"
             
            // Copy Button for later:      "<p><input type='button' data-clipboard-target='fetext' id='copy' class='button' name='copy' value='copy' data-clipboard-text='Test'/></p>"
            // Document Icon for later:    "<i class='icon-file-text-alt icon-4x'></i>"
          }
        });

  paintDay(0);
  disableBeforeNow();
  disableButtons();  // need to add this to disable anything in the past.
  
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
        //Setting Lightbox variable to the AJAX response
        meetingId = response;

        // Display the lightbox
        $(".fancybox").click();
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
    $('.ui-selected').removeClass('ui-selected');
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

  function clickCalendarDates(){
      $('td').click(function(){
      var dayclicked = $( this ).text()
      var currentday = date.format("D")
      paintDay(dayclicked-currentday)
    })
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
    clickCalendarDates()
  }

  function disableButtons() {
    // console.log(moment().format("MM/DD/YYYY") + " Hello")
    if (date.format("MM/DD/YYYY") <= moment().format("MM/DD/YYYY")){
          $('.icon-chevron-sign-left').hide()
    }
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

  //Zero Clipboard integration
  // var clip = new ZeroClipboard($("#zeroclip"));
  // });

  // $("#clear-test").on("click", function(){
  //   $("#fe_text").val(meetingLink);
  //   $("#testarea").val("");

    // $('a#zclip').zclip({
    //   path:'js/ZeroClipboard.swf',
    //   copy:$('p#zclip').text()
    // });

    // $('a#copy-zclip').zclip({
    //   path:'js/ZeroClipboard.swf',
    //   copy:function(){return $('input#zclip').val();}
    // });

    // // _______________________
    // //set path
    // ZeroClipboard.setMoviePath('http://davidwalsh.name/demo/ZeroClipboard.swf');
    // //create client
    // var clip = new ZeroClipboard.Client();
    // //event
    // clip.addEventListener('mousedown',function() {
    // clip.setText(document.getElementById('box-content').value);
    // });
    // clip.addEventListener('complete',function(client,text) {
    //   alert('copied: ' + text);
    // });
    // //glue it to the button
    // clip.glue('copy');


})
