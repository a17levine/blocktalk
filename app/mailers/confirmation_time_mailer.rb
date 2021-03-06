class ConfirmationTimeMailer < ActionMailer::Base
  
  # default from: "mksblocktalk@gmail.com"
  # default from: "blocktalk.io"

  def confirmation_time_email(meeting)
  	@meeting = meeting
  	@host = meeting.host
  	@guest = meeting.guest
    @subject_line = "scheduled: #{@guest.email_username} + #{@host.email_username} - blocktalk"
    # binding.pry
    @agreed_time = meeting.agreed_time_block.start_time.to_datetime
    attachments['event.ics'] = {:mime_type => 'text/calendar', :content => create_ical }
    mail(from: @host.email, reply_to: @host.email, to: "<#{@host.email}>, <#{@guest.email}>", subject: @subject_line)
  end

  def create_ical
   ical = Icalendar::Calendar.new
   e = Icalendar::Event.new
   e.start = (@agreed_time).utc
   e.start.icalendar_tzid="UTC" # set timezone as "UTC"
   e.end = (@agreed_time + 30.minutes).utc
   e.end.icalendar_tzid="UTC"
   e.organizer "#{@host.email}"
   # i dont think the following function works
   # trying to add the guests on to the ical email
   # not easy apparently

   @meeting.users.each do |user|
   	e.add_attendee "mailto:#{user.email}"
   end
   
   e.uid "MeetingRequest #{@meeting.token}"
   e.summary @subject_line
   e.description "This meeting was created with blocktalk"
   ical.add_event(e)
   ical.publish
   ical.to_ical
  end
end
