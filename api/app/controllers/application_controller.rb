# frozen_string_literal: true

class ApplicationController < ActionController::API
  include JsonResponses
  include ModelFormProcessor
  include Pundit::Authorization
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from Pundit::NotAuthorizedError, with: :render_forbidden
  after_action :verify_policy_scoped, only: :index

  def current_user
    @current_user ||= User.find_by(token: headers_token)
  end

  private

  def authenticate_user
    render_unauthorized if headers_token.nil? || current_user.nil?
  end

  def headers_token
    request.headers['Authorization'].split(' ')[1]
  end
end
