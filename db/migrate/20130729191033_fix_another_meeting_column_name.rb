class FixAnotherMeetingColumnName < ActiveRecord::Migration
  def change
  	rename_column :meetings, :agreed_time_block, :time_block_id
  end
end
