# frozen_string_literal: true

module Invites
  class InviteManager
    def initialize(invite, current_user)
      @invite = invite
      @current_user = current_user
    end

    def accept; end

    def reject; end

    private

    attr_reader :invite, :current_user
  end
end
