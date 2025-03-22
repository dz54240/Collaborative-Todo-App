# frozen_string_literal: true

class SectionPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    belongs_to_user_workspace?
  end

  def create?
    user_has_any_workspace?
  end

  def update?
    belongs_to_user_workspace?
  end

  def destroy?
    belongs_to_user_workspace?
  end

  def permitted_attributes_for_create
    permitted_attributes
  end

  def permitted_attributes_for_update
    permitted_attributes
  end

  class Scope < Scope
    def resolve
      Section.where(workspace_id: user.workspaces.pluck(:id))
    end
  end

  private

  def permitted_attributes
    [:name, :position, :workspace_id]
  end

  def belongs_to_user_workspace?
    user.workspace_ids.include?(record.workspace_id)
  end

  def user_has_any_workspace?
    user.user_workspaces.exists?
  end
end
