class User < ActiveRecord::Base
	has_many :time_blocks
	has_and_belongs_to_many :meetings
  attr_accessible :email, :latest_time_zone

  def self.return_user_from_email(email)
  	#see if user exists
  	#return user when complete
    User.find_or_create_by_email(email)
  end
end