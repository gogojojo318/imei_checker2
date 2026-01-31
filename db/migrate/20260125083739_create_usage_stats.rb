class CreateUsageStats < ActiveRecord::Migration[7.1]
  def change
    create_table :usage_stats do |t|
      t.date :date
      t.integer :total_checks

      t.timestamps
    end
  end
end
