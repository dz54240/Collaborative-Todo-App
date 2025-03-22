# frozen_string_literal: true

module Api
  class SessionsController < ApplicationController
    before_action :authenticate_user, only: [:destroy]

    def create
      render_credentials_error unless session_info

      render_session_data(session_info)
    end

    def destroy
      current_user.regenerate_token
      head :no_content
    end

    private

    def session_info
      @session_info ||= session_manager.create_session
    end

    def session_manager
      @session_manager ||= Sessions::SessionManager.new(user_email, user_password)
    end

    def user_email
      params.dig('data', 'email')
    end

    def user_password
      params.dig('data', 'password')
    end
  end
end
