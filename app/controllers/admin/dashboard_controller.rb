class Admin::DashboardController < ApplicationController
  before_action :admin_basic_auth

  def index
    @today_stat = UsageStat.find_by(date: Date.current)

    @today_pv     = @today_stat&.page_views.to_i
    @today_checks = @today_stat&.total_checks.to_i

    @total_pv     = UsageStat.sum(:page_views)
    @total_checks = UsageStat.sum(:total_checks)

    @last_7_days = UsageStat
      .where(date: 6.days.ago.to_date..Date.current)
      .order(:date)
  end

  private

  def admin_basic_auth
    return unless ENV["ADMIN_USER"].present? && ENV["ADMIN_PASS"].present?

    authenticate_or_request_with_http_basic do |user, pass|
      user == ENV["ADMIN_USER"] && pass == ENV["ADMIN_PASS"]
    end
  end
end
