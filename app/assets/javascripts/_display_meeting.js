$(document).ready(function(){
	// alert(meetingTimeMoment.fromNow());
	$('.date').first().text(meetingTimeMoment.format("@ h:mm a dddd, MMMM Do YYYY"));
	function meetingTimeInWords() {
	  //figure out if the time speaking is before now or after

	  if (meetingTimeMoment > moment()){
	    //if in the future display 'will be speaking in'
	    //insert the moment words into the right div
	    var futureText = "will be meeting " + meetingTimeMoment.fromNow();
	    // var futureText = meetingTimeMoment.fromNow();
	    $('.speakingWords').first().text(futureText)
	  }
	 else {
	    //if in the past display 'spoke'
	    //insert moment words into the right div
	  }
  }

  meetingTimeInWords();

})