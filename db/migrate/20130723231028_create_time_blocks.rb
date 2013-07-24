class CreateTimeBlocks < ActiveRecord::Migration
  def change
    create_table :time_blocks do |t|
    	t.datetime		:start_time
    	t.integer 		:meeting_id
      t.timestamps
    end
  end
end
