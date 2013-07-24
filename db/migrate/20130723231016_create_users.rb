class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
    	t.string			:email
    	t.string			:latest_time_zone
      t.timestamps
    end
  end
end
