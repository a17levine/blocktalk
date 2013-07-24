class User < ActiveRecord::Base
	has_many :time_blocks
  attr_accessible :email, :latest_time_zone

end
