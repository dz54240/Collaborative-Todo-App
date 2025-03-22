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

  def update?
    user_inviter? || user_receiver?
  end

  def destroy?
    user_inviter? || user_receiver?
  end

  def permitted_attributes
    [:sender_id, :receiver_id, :workspace_id, :status]
  end

  class Scope < Scope
    def resolve
      user.sent_invites + user.received_invites
    end
  end

  private

  def user_inviter?
    record.inviter_id == user.id
  end

  def user_receiver?
    record.receiver_id == user.id
  end
end
