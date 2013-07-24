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
	$(function() {
	    $( ".selectable" ).selectable({
	        selecting: function (event, ui) {
	            if (event.detail == 0) {
	                _selectRange = true;
	                return true;
	            }
	            if ($(ui.selecting).hasClass('ui-selected')) {
	                _deselectQueue.push(ui.selecting);
	            }
	        },
	        unselecting: function (event, ui) {
	            $(ui.unselecting).addClass('ui-selected');
	        },
	        stop: function () {
	            if (!_selectRange) {
	                $.each(_deselectQueue, function (ix, de) {
	                    $(de)
	                        .removeClass('ui-selecting')
	                        .removeClass('ui-selected');
	                });
	            }
	            _selectRange = false;
	            _deselectQueue = [];

	            var result = $( "#select-result" ).empty();
	            $( ".ui-selected", this ).each(function() {
	            	// var index = $( ".hour" ).index( this );
	            	var time = this.getAttribute('data-time');
	            	result.append( " #" + (time) );
	            });
	            console.log(result)
	        }
	    });
	});

	var now = moment().startOf('day').format("YYYY/MM/DD, HH");
	$('.hour').each(function(){
		$(this).attr("data-time", now);
	})
});