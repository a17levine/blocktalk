Blocktalk::Application.routes.draw do

  resources :meetings
  root :to => 'meetings#index'

end
