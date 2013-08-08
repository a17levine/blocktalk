class ConfirmationTimeMailer < ActionMailer::Base
  
  default from: "mksblocktalk@gmail.com"


  def confirmation_time_email(email)
    @email = email
    mail(to: "User Name <#{@email}>", subject: "Blocktalk Confirmation")
  end

end
