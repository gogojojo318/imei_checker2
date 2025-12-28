class ChecksController < ApplicationController
  def check
    imei = params[:imei].to_s.strip

    unless imei.match?(/\A\d{15}\z/)
      return render json: { error: "IMEIは15桁の数字で入力してください" }, status: :bad_request
    end

    results = {
      docomo:   DocomoChecker.check(imei),
      au:       AuChecker.check(imei),
      softbank: SoftbankChecker.check(imei),
      rakuten:  RakutenChecker.check(imei),
      mineo:    MineoChecker.check(imei)
    }

    render json: results
  end
end
