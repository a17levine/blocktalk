class Meeting < ActiveRecord::Base

	#after_create :assign_creator_as_host

	has_many :timeblocks, class_name: "TimeBlock"
	has_and_belongs_to_many :users
	belongs_to :host,  class_name: "User", foreign_key: "host_id"
	belongs_to :guest,  class_name: "User", foreign_key: "guest_id"
	belongs_to :agreed_time_block, class_name: "TimeBlock", foreign_key: "time_block_id"
  
  attr_accessible :host, :guest, :agreed_time_block, :host_id

 

  # def assign_creator_as_host(user)
  # 	#self.update_attribute(:host_id, user.id)
  # 	puts "this is a puts of what self.users is after create =========="
  # 	puts user.inspect
  # end

end
