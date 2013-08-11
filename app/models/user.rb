class User < ActiveRecord::Base
	has_many :time_blocks
	has_and_belongs_to_many :meetings
  attr_accessible :email, :latest_time_zone, :latest_time_zone_offset

  def self.return_user_from_email(email)
  	#see if user exists
  	#return user when complete
  	if User.find_by_email(email)
  		User.find_by_email(email)
  	else
  		User.create(email: email)
  	end
  end

  def add_time_zones(time_zone_name, time_zone_offset)
    self.latest_time_zone = time_zone_name
    self.latest_time_zone_offset = time_zone_offset
    self.save
  end

  def email_username
    self.email.split('@').first
  end
end