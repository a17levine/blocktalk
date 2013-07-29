class FixColumnNamesInMeetings < ActiveRecord::Migration
  def change
  	rename_column :meetings, :host, :host_id
  	rename_column :meetings, :guest, :guest_id
  end
end
