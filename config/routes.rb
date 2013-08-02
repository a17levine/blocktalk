Blocktalk::Application.routes.draw do

  resources :meetings do
  	member do
  		post '', to: 'meetings#choose_time'
  	end
  end

  root :to => 'meetings#index'

end
