class Meeting < ActiveRecord::Base

	has_many :timeblocks, class_name: "TimeBlock"
	has_and_belongs_to_many :users
	belongs_to :host,  class_name: "User", foreign_key: "host_id"
	belongs_to :guest,  class_name: "User", foreign_key: "guest_id"
	belongs_to :agreed_time_block, class_name: "TimeBlock", foreign_key: "time_block_id"
  
  attr_accessible :host, :guest, :agreed_time_block, :host_id, :planned

  def self.create_meeting(host_email, start_times_array_in_iso8601)
  	@user = User.return_user_from_email(host_email)
  	@meeting = @user.meetings.create(host_id: @user.id, planned: false)
		start_times_array_in_iso8601.each do |startTimeIso8601|
			unless @meeting.timeblocks.find_by_start_time(DateTime.iso8601(startTimeIso8601))
				# this didn't do what I wanted. the idea was to
				# avoid having duplicate info be generated if the
				# submit button was hit twice. oh well, not a big issue now
			@meeting.timeblocks.create(start_time: DateTime.iso8601(startTimeIso8601))
			end
		end
  end

  def guest_json
  	@available_times_in_iso = ""
  	self.timeblocks.each do |timeblock|
  		@available_times_in_iso << "'#{timeblock.start_time.iso8601}',"
  	end
  	@available_times_in_iso.chomp!(",")
  	@guest_json = "{'guestMessage':{'hostEmail': '#{self.host.email.split('@').first}','availableDates': [#{@available_times_in_iso}]}}"
  end
end