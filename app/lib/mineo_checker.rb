class MineoChecker
  def self.check(imei)
    script = Rails.root.join('scripts/mineo_checker.cjs')
    output = `node #{script} #{imei}`.strip
    output.presence || "不明"
  rescue => e
    Rails.logger.error("MineoChecker error: #{e.message}")
    "不明"
  end
end
