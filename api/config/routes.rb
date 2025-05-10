# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    resource :sessions, only: [:create, :destroy]

    resources :users, except: [:new, :edit]

    resources :workspaces, except: [:new, :edit]

    resources :sections, except: [:new, :edit]

    resources :todos, except: [:new, :edit]

    resources :invites, only: [:create, :index, :destroy] do
      member do
        patch :accept
        patch :reject
      end
    end
  end
end
