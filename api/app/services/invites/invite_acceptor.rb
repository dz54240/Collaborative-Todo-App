# frozen_string_literal: true

module Invites
  class InviteAcceptor < Invites::InviteManager
    def accept
      ActiveRecord::Base.transaction do
        invite.update!(status: 'accepted')

        create_user_workspace
      end

      invite
    end

    private

    def create_user_workspace
      UserWorkspace.create!(
        user_id: current_user.id,
        workspace_id: invite.workspace_id,
        admin: false
      )
    end
  end
end
