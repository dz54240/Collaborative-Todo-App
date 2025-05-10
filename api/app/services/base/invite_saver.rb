# frozen_string_literal: true

module Base
  class InviteSaver < BaseSaver
    include ActiveModel::Validations

    validate :receiver_exists
    validate :user_is_not_already_invited
    validate :workspace_must_be_accessible

    def save
      set_sender

      return BaseSaverResult.failure(errors.full_messages) unless valid?

      super
    end

    private

    def set_sender
      record.sender_id = sender_id
    end

    def receiver_exists
      return if receiver

      errors.add(:receiver_id, 'does not exist')
    end

    def user_is_not_already_invited
      return unless old_invite || receiver.workspaces.pluck(:id).include?(workspace_id)

      errors.add(:receiver_id, 'has already been invited')
    end

    def workspace_must_be_accessible
      return if workspace_scope.exists?(id: workspace_id)

      errors.add(:workspace_id, 'is not accessible')
    end

    def workspace_scope
      WorkspacePolicy::Scope.new(current_user, Workspace).resolve
    end

    def receiver
      @receiver ||= User.find_by(id: receiver_id)
    end

    def old_invite
      @old_invite ||= Invite.find_by(sender_id:, receiver_id:, workspace_id:, status: 'pending')
    end

    def sender_id
      current_user.id
    end

    def receiver_id
      params[:receiver_id]
    end

    def workspace_id
      params[:workspace_id]
    end
  end
end
