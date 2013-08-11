class TimeBlock < ActiveRecord::Base
	belongs_to :user #may not be necessary
	belongs_to :meeting
  
  attr_accessible :start_time, :meeting_id

end
