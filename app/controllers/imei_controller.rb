class ImeiController < ApplicationController
  def index
    today = Date.current
    stat = UsageStat.find_or_create_by!(date: today) do |s|
      s.page_views = 0
    end
    stat.increment!(:page_views)
  end
end
