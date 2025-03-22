# frozen_string_literal: true

class WorkspacePolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    user_is_member?
  end

  def create?
    true
  end

  def update?
    user_is_admin?
  end

  def destroy?
    user_is_admin?
  end

  def permitted_attributes
    [:name, :description]
  end

  class Scope < Scope
    def resolve
      user.workspaces
    end
  end

  private

  def user_is_member?
    record.users.exists?(id: user.id)
  end

  def user_is_admin?
    record.admin&.id == user.id
  end
end
