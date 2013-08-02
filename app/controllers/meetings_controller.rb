class MeetingsController < ApplicationController

	protect_from_forgery :except => [:create]

	def new
		@meeting = Meeting.new
		@user = User.new
	end

	def create
		@meeting = Meeting.create_meeting(params[:createMessage][:hostEmail], params[:createMessage][:availableDates])
	end

	def show
		@meeting = Meeting.find(params[:id])
	end

	def choose_time
		@meeting = Meeting.find(params[:id])
		@guest = @meeting.process_guest(params[:guestChoice][:email])
		@meeting.process_chosen_time(params[:guestChoice][:chosenTime])
		 # send emails to both parties
	end
end