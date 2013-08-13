class Meeting < ActiveRecord::Base

	has_many :timeblocks, class_name: "TimeBlock"
	has_and_belongs_to_many :users
	belongs_to :host,  class_name: "User", foreign_key: "host_id"
	belongs_to :guest,  class_name: "User", foreign_key: "guest_id"
	belongs_to :agreed_time_block, class_name: "TimeBlock", foreign_key: "time_block_id"
  
  attr_accessible :host, :guest, :time_block_id, :host_id, :planned, :token #:agreed_time_block

  def self.create_meeting(parameters)
  	@host_email = parameters[:createMessage][:hostEmail]
    @start_times_array_in_iso8601 = parameters[:createMessage][:availableDates]

    @user = User.return_user_from_email(@host_email)
    @user.latest_time_zone = parameters[:createMessage][:timeZoneLabel] #assign the user the latest_time_zone with the label of the time zone
    @user.latest_time_zone_offset = parameters[:createMessage][:timeZoneOffset] #assign the user the latest_time_zone_offset with the string offset of the time zone
  	@meeting = @user.meetings.create(host_id: @user.id, planned: false, token: Meeting.generate_token)
		@start_times_array_in_iso8601.each do |startTimeIso8601|
			unless @meeting.timeblocks.find_by_start_time(DateTime.iso8601(startTimeIso8601))
				# this didn't do what I wanted. the idea was to
				# avoid having duplicate info be generated if the
				# submit button was hit twice. oh well, not a big issue now
			@meeting.timeblocks.create(start_time: DateTime.iso8601(startTimeIso8601))
			end
		end
    @user.save
    @meeting
  end

  def process_guest(guest_email)
		@guest = User.return_user_from_email(guest_email)
		self.users << @guest # associate guest user to meeting array of users
		self.guest = @guest # set guest as guest on the meeting
		self.save
		@guest
  end

  def process_chosen_time(chosen_time_in_iso8601)
  	@time = self.timeblocks.find_by_start_time(Time.zone.at(DateTime.iso8601(chosen_time_in_iso8601).to_i))
  	self.agreed_time_block = @time # on meeting, set agreed_time_block to the timeblock ID
  	self.planned = true
  	self.save
  end

  def guest_json
  	@available_times_in_iso = ""
  	self.timeblocks.each do |timeblock|
  		@available_times_in_iso << "'#{timeblock.start_time.iso8601}',"
  	end
  	@available_times_in_iso.chomp!(",")
  	@guest_json = "{'guestMessage':{'hostEmail': '#{self.host.email.split('@').first}','availableDates': [#{@available_times_in_iso}]}}"
  end


  def self.generate_token
    number = SecureRandom.hex(3)
    while Meeting.find_by_token(number)
      number = SecureRandom.hex(3)
    end
    number
  end
end