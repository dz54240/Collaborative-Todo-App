# frozen_string_literal: true

class ApplicationController < ActionController::API
  include JsonResponses
  include ModelFormProcessor
  include Pundit::Authorization
  skip_before_action :verify_authenticity_token
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from Pundit::NotAuthorizedError, with: :render_forbidden
end
