class CreateMeetings < ActiveRecord::Migration
  def change
    create_table :meetings do |t|

      t.timestamps
    end
  end
end
