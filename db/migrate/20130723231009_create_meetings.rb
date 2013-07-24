class CreateMeetings < ActiveRecord::Migration
  def change
    create_table :meetings do |t|
    	t.integer			:host
    	t.integer			:guest
    	t.integer			:agreed_time_block
      t.timestamps
    end
  end
end
