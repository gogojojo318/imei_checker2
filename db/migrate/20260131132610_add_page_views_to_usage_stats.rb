class AddPageViewsToUsageStats < ActiveRecord::Migration[7.1]
  def change
    add_column :usage_stats, :page_views, :integer
  end
end
