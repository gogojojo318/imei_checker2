Rails.application.routes.draw do
  get 'imei/index'
  root "imei#index"
  post "/check", to: "checks#check"
end
