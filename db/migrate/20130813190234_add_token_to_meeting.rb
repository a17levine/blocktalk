class AddTokenToMeeting < ActiveRecord::Migration
  def change
    add_column :meetings, :token, :string, :unique => true
    add_index(:meetings, :token)
  end
end
