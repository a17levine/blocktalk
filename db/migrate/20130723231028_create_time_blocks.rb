class CreateTimeBlocks < ActiveRecord::Migration
  def change
    create_table :time_blocks do |t|

      t.timestamps
    end
  end
end
