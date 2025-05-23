# frozen_string_literal: true

module Api
  class WorkspacesController < ApplicationController
    before_action :authenticate_user
    before_action :preload_resource, only: [:show, :update, :destroy]
    before_action :create_resource, only: [:create]

    def index
      render_json(policy_scope(Workspace))
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
      UserWorkspace.find_by(workspace_id: @resource.id, user_id: current_user.id).destroy

      @resource.destroy if @resource.users.empty?

      head :no_content
    end

    private

    def saver(params)
      @saver ||= Base::WorkspaceSaver.new(@resource || @new_resource, params, current_user)
    end
  end
end
