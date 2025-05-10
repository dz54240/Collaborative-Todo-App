# frozen_string_literal: true

module Base
  class SectionSaver < Base::BaseSaver
    include ActiveModel::Validations

    validate :workspace_must_be_accessible

    def save
      return Base::BaseSaverResult.failure(errors.full_messages) unless valid?

      super
    end

    private

    def workspace_must_be_accessible
      return if workspace_id.nil?
      return if workspace_scope.exists?(id: workspace_id)

      errors.add(:workspace_id, 'is not accessible')
    end

    def workspace_id
      params[:workspace_id]
    end

    def workspace_scope
      WorkspacePolicy::Scope.new(current_user, Workspace).resolve
    end
  end
end
