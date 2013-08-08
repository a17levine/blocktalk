class MeetingsController < ApplicationController

	protect_from_forgery :except => [:create]

	def new
		@meeting = Meeting.new
		@user = User.new
	end

	def create
		@meeting = Meeting.create_meeting(params[:createMessage][:hostEmail], params[:createMessage][:availableDates])

		respond_to do |format|
			format.js  { }
		end
	end

	def show
		@meeting = Meeting.find(params[:id])
	end

	def choose_time
		puts "========================================="
		puts "choose time function ran"
		puts "Here are the params:"
		puts params.inspect

		@meeting = Meeting.find(params[:id])
		puts "@meeting is #{@meeting}"
		@guest = @meeting.process_guest(params[:guestChoice][:guestEmail]) #this creates the user, adds it to the meeting users, sets as guest
		puts "@guest is #{@guest}"
		puts "chosen time is #{params[:guestChoice][:availableDate]}"
		@meeting.process_chosen_time(params[:guestChoice][:availableDate])
		 # send emails to both parties

		render nothing: true
	end
end