Rails.application.routes.draw do
  namespace :admin do
  get "dashboard", to: "dashboard#index"
  end
  get 'imei/index'
  root "imei#index"
  post "/check", to: "checks#check"
end
