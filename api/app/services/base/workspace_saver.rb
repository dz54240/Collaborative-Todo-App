# frozen_string_literal: true

module Base
  class WorkspaceSaver < Base::BaseSaver
    def save
      return super if record.persisted?

      ActiveRecord::Base.transaction do
        @result = super

        create_user_workspace(@result.data.id) if @result.success?
      end

      @result
    end

    private

    def create_user_workspace(workspace_id)
      UserWorkspace.create(
        user_id: current_user.id,
        workspace_id:,
        admin: true
      )
    end
  end
end
