# app/services/rakuten_checker.rb
require "net/http"
require "json"

class RakutenChecker
  API_BASE = "https://network.mobile.rakuten.co.jp/restriction/eir/v1/rest-api/public/imei"

  STATUS_MAP = {
    0 => "○",
    1 => "△",
    2 => "×"
  }.freeze

  def self.check(imei)
    uri = URI("#{API_BASE}/#{imei}")
    res = Net::HTTP.get_response(uri)

    return "－" unless res.is_a?(Net::HTTPSuccess)

    json = JSON.parse(res.body)

    status = json["status"]
    STATUS_MAP.fetch(status, "－")
  rescue => e
    Rails.logger.error("RakutenChecker error: #{e.message}")
    "－"
  end
end
