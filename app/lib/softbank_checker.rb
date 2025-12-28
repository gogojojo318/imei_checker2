class SoftbankChecker
  def self.check(imei)
    script = Rails.root.join('scripts/softbank_checker.cjs')
    output = `node #{script} #{imei}`.strip
    output.presence || "不明"
  rescue => e
    Rails.logger.error("SoftbankChecker error: #{e.message}")
    "不明"
  end
end