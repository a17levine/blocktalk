class User < ActiveRecord::Base
	has_many :time_blocks
	has_and_belongs_to_many :meetings
  attr_accessible :email, :latest_time_zone

  def self.return_user_from_email(email)
  	#see if user exists
  	#return user when complete
  	if User.find_by_email(email)
  		User.find_by_email(email)
  	else
  		User.create(email: email)
  	end
  end
end