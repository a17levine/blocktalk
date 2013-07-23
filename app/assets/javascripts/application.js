// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

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
	// var result = $( "#select-result" ).empty();
	// $( "ui-selected", this ).each(function() {
	// 	var index = $( ".hours" ).index( this );
	// 	result.append ( " #" + ( index + 1 ) );
	// 	});
	});
});