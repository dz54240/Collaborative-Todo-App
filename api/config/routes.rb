# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    resource :sessions, only: [:create, :destroy]

    resources :users, except: [:new, :edit]
  end
end
