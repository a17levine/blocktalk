Blocktalk::Application.routes.draw do

  get "static_pages/welcome"

  resources :meetings do
  	member do
  		post '', to: 'meetings#choose_time'
  	end
  end

  root :to => 'static_pages#index'

end
