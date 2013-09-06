function meetingTimeInWords() {
	//figure out if the time speaking is before now or after
  if (meetingTimeMoment > moment()){
    //if in the future display 'will be speaking in'
    //insert the moment words into the right div
    var futureText = "will meet " + meetingTimeMoment.fromNow().replace('in ','') + " from now";
    $('.speakingWords').first().text(futureText)
  } 
  else {
    //if in the past display 'met'
    //insert moment words into the right div
    var pastText = "met " + meetingTimeMoment.fromNow();
    $('.speakingWords').first().text(pastText);
  }
}


$(document).ready(function(){
	$('.date').first().text("Local time: " + meetingTimeMoment.format("h:mma dddd, MMMM Do YYYY"));
  meetingTimeInWords();
})