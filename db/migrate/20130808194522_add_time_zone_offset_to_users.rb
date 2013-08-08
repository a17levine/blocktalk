class AddTimeZoneOffsetToUsers < ActiveRecord::Migration
  def change
    add_column :users, :latest_time_zone_offset, :string
  end
end
