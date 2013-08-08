class ConfirmationTimeMailer < ActionMailer::Base
  
  default from: "mksblocktalk@gmail.com"

  def confirmation_time_email(email1)
    mail(to: "User Name <#{email1}>", subject: "Blocktalk Confirmation")
  end

end
