# frozen_string_literal: true

module Sessions
  class SessionManager
    def initialize(user_email, user_password)
      @user_email = user_email
      @user_password = user_password
    end

    def create_session
      return unless valid_credentials?

      session_data
    end

    private

    attr_accessor :user_email, :user_password

    def valid_credentials?
      user&.authenticate(user_password)
    end

    def session_data
      {
        token: user.token,
        user: UserSerializer.new(user).serializable_hash[:data]
      }
    end

    def user
      @user ||= User.find_by(email: user_email)
    end
  end
end
