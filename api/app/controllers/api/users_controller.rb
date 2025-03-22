# frozen_string_literal: true

module Api
  class UsersController < ApplicationController
    before_action :authenticate_user, except: [:create]
    before_action :preload_resource, only: [:show, :update, :destroy]
    before_action :create_resource, only: [:create]

    def index
      render_json(policy_scope(User))
    end

    def show
      render_json(@resource)
    end

    def create
      save_record(create_params)
    end

    def update
      save_record(update_params)
    end

    def destroy
      @resource.destroy

      head :no_content
    end
  end
end
