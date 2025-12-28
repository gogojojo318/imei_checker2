require 'mechanize'
require 'nokogiri'

class DocomoChecker
  def self.check(imei)
    agent = Mechanize.new

    # ブラウザっぽく見せる（超重要）
    agent.user_agent_alias = 'Windows Chrome'

    # ① 判定ページを開く（Cookie取得）
    agent.get('http://nw-restriction.nttdocomo.co.jp/search.php')

    # ② IMEIをフォーム送信
    result_page = agent.post(
      'http://nw-restriction.nttdocomo.co.jp/search.php',
      { productno: imei }
    )

    # ③ Shift_JIS → UTF-8 変換
    html = result_page.body
      .force_encoding('Shift_JIS')
      .encode('UTF-8', invalid: :replace, undef: :replace)

    # ④ HTML解析
    doc = Nokogiri::HTML(html)

    # ⑤ 判定結果取得
    result = doc.css('div.result-panel')[1]&.text&.strip

    # 表示を統一
    result = result.tr('-', '－') if result.present?

    result.present? ? result : '結果が取得できません'
  rescue => e
    Rails.logger.error "DocomoChecker Error: #{e.message}"
    'チェック中にエラーが発生しました'
  end
end
