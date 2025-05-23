# frozen_string_literal: true

class ApplicationController < ActionController::API
  include JsonResponses
  include Pundit::Authorization
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from Pundit::NotAuthorizedError, with: :render_forbidden
  before_action :authorize_model, only: :index
  after_action :verify_policy_scoped, only: :index

  def current_user
    @current_user ||= User.find_by(token: headers_token)
  end

  private

  def preload_resource
    authorize @resource = class_name.find(params[:id])
  end

  def includes
    []
  end

  def create_resource
    authorize @new_resource = class_name.new
  end

  def authenticate_user
    render_unauthorized('Invalid token') if headers_token.nil? || current_user.nil?
  end

  def headers_token
    return unless request.headers['Authorization']

    request.headers['Authorization'].split(' ')[1]
  end

  def authorize_model
    authorize class_name
  end

  def class_name
    controller_name.classify.constantize
  end

  def update_params
    params.require(:data).permit(policy(@resource).permitted_attributes_for_update)
  end

  def create_params
    params.require(:data).permit(policy(class_name).permitted_attributes_for_create)
  end

  def save_record(params)
    result = saver(params).save

    if result.success?
      render_json(result.data)
    else
      render_errors(result.errors)
    end
  end

  def saver(params)
    @saver ||= Base::BaseSaver.new(@resource || @new_resource, params, current_user)
  end
end
