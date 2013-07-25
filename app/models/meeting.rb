class Meeting < ActiveRecord::Base
	has_many :timeblocks
	has_and_belongs_to_many :users
	# belongs_to :host,  class_name: "User"
	# belongs_to :guest,  class_name: "User"
	belongs_to :agreed_time_block, class_name: "TimeBlock"
  
  attr_accessible :host, :guest, :agreed_time_block
end
