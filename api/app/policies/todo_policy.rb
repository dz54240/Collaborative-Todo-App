# frozen_string_literal: true

class TodoPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    user_can_access_section?
  end

  def create?
    user_has_any_workspace?
  end

  def update?
    user_can_access_section?
  end

  def destroy?
    user_can_access_section?
  end

  def permitted_attributes
    [:title, :description, :status, :priority, :due_date, :section_id, :assignee_id]
  end

  class Scope < Scope
    def resolve
      Todo.joins(:section).where(sections: { workspace_id: user.workspace_ids })
    end
  end

  private

  def user_can_access_section?
    user.workspace_ids.include?(record.section.workspace_id)
  end

  def user_has_any_workspace?
    user.user_workspaces.exists?
  end
end
