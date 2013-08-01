class MeetingsController < ApplicationController

	protect_from_forgery :except => [:create]

	def new
		@meeting = Meeting.new
		@user = User.new
	end

	# def create
	# 	if User.find_by_email(params[:meeting][:email])
	# 		@user = User.find_by_email(params[:meeting][:email])
	# 		@meeting = @user.meetings.create
	# 		#next, add timeblocks to the above meeting
	# 	else #if user does not exist yet, create one
	# 		@user = User.create(params[:meeting][:email])
	# 		@meeting = @user.meetings.create
	# 		#next, add timeblocks to the above meeting
	# 	end
	# end

	def create
		# binding.pry

		logger.info "********************************"

		logger.info "Here are the params"
		logger.info "#{params[:createMessage]}"

		@meeting = Meeting.create_meeting(params[:createMessage][:hostEmail], params[:createMessage][:availableDates])

		# the browser will be sending an AJAX POST to this
		# action. i need to use the code that recognises JSON
		# and proceeds accordingly

		# the JSON object must have at least 3 times and have
		# time zone and offset. if not, I should error out 

		# the information that i get from the JSON file should be
		# added to the database.

		# user should be added / created
		# meeting should be created through that user
		# user should be assigned as 'host' of meeting
		# time blocks should be converted to ruby DateTime
		# objects in UTC
		# timeblocks


		# in AJAX function, success must paint the 'paste' link
		# to the show page
	end

	def show
		@meeting = Meeting.find(params[:id])

		# if a time has not been chosen, show the available
		# times for the meeting and the email input for the guest

		# if a time has been chosen, show a countdown
		# until the meeting will start
	end
end
