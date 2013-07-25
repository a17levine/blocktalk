class User < ActiveRecord::Base
	has_many :time_blocks
	has_and_belongs_to_many :meetings
  attr_accessible :email, :latest_time_zone

end
