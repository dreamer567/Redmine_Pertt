# Plugin's routes
# See: http://guides.rubyonrails.org/routing.html
get '/pertt', :to => 'pertt#index'
get '/pertt/create', :to => 'pertt#create'
get '/pertt/:id/edit', :to => 'pertt#edit'
get '/pertt/:id/show', :to => 'pertt#show'
get	'/pertt/:id/amend', :to => 'pertt#amend'

post '/pertt/create', :to => 'pertt#create'
post '/pertt/:id/update', :to => 'pertt#update'

delete '/pertt/:id', :to => 'pertt#delete'
delete '/pertt/:id/delete', :to => 'pertt#delete'

resources :pertt_charts, :path => 'pertt'
