# frozen_string_literal: true

class InvitePolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    user_inviter? || user_receiver?
  end

  def create?
    true
  end

  def accept?
    user_receiver? && record.status == 'pending'
  end

  def reject?
    user_receiver? && record.status == 'pending'
  end

  def destroy?
    user_inviter? || user_receiver?
  end

  def permitted_attributes_for_create
    permitted_attributes
  end

  def permitted_attributes_for_update
    permitted_attributes
  end

  class Scope < Scope
    def resolve
      sent_invites.or(received_invites)
    end

    def sent_invites
      scope.where(sender_id: user.id)
    end

    def received_invites
      scope.where(receiver_id: user.id)
    end
  end

  private

  def permitted_attributes
    [:receiver_email, :workspace_id, :status]
  end

  def user_inviter?
    record.sender_id == user.id
  end

  def user_receiver?
    record.receiver_id == user.id
  end
end
