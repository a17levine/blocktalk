class AddPlannedToMeeting < ActiveRecord::Migration
  def change
    add_column :meetings, :planned, :boolean
  end
end
