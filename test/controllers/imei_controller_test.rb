require "test_helper"

class ImeiControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get imei_index_url
    assert_response :success
  end
end
