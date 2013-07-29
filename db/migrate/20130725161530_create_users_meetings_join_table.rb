class CreateUsersMeetingsJoinTable < ActiveRecord::Migration
  def change
  	create_table :meetings_users, id: false do |t|
      t.integer :user_id
      t.integer :meeting_id
    end
  end
end
