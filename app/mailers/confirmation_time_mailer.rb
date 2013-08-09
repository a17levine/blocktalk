class ConfirmationTimeMailer < ActionMailer::Base
  
  # default from: "mksblocktalk@gmail.com"
  default from: "blocktalk.io"

  def confirmation_time_email(meeting)
  	@host = meeting.host
  	@guest = meeting.guest
    @subject_line = "Scheduled: #{@host.email_username} + #{@guest.email_username} - blocktalk"
    # binding.pry
    mail(to: "<#{@host.email}>, <#{@guest.email}>", subject: @subject_line)
  end
end
