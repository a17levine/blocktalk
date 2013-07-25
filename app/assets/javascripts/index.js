// $(document).ready(function(){

// times = []
  
//   $('.hour').mousedown(function(){
//     $(this).toggleClass('chosen')
//   });
// });



// $(document).ready(function(){
//   $(function() {
//     $( ".day" ).selectable({	
//       stop: function() {
//         var result = $( "#select-result" ).empty();
//         $( ".ui-selected", this ).each(function() {
//           var index = $( ".hour" ).index( this );
//           result.append( " #" + ( index + 1 ) );
//         });
//       }
//     });
//   });

// });

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

	            var result = $( "#select-result" );//.empty
	            $( ".ui-selected", this ).each(function() {
	            	// var index = $( ".hour" ).index( this );
	            	var time = this.getAttribute('data-time');
	            	result.append( " #" + (time) );
	            });
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
	});
	//On click, back button removes one day from the date variable.
	$('.icon-chevron-sign-left').click(function(){
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

	});
});