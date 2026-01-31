class CreateUsageCounters < ActiveRecord::Migration[7.1]
  def change
    create_table :usage_counters do |t|
      t.string :name
      t.integer :count

      t.timestamps
    end
  end
end
