# frozen_string_literal: true

module Api
  class SectionsController < ApplicationController
    before_action :authenticate_user
    before_action :preload_resource, only: [:show, :update, :destroy]
    before_action :create_resource, only: [:create]

    def index
      render_json(policy_scope(Section.where(workspace_id: workspace_filter)))
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

    private

    def workspace_filter
      params[:workspace]
    end

    def saver(params)
      @saver ||= Base::SectionSaver.new(@resource || @new_resource, params, current_user)
    end
  end
end
