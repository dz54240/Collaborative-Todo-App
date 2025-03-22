# frozen_string_literal: true

module Base
  class WorkspaceSaver < Base::BaseSaver
    def save
      return super if record.persisted?

      ActiveRecord::Base.transaction do
        @result = super

        create_user_workspace(@result.data.id) if @result.success?

        create_default_section(@result.data.id) if @result.success?
      end

      @result
    end

    private

    def create_user_workspace(workspace_id)
      UserWorkspace.create!(
        user_id: current_user.id,
        workspace_id:,
        admin: true
      )
    end

    def create_default_section(workspace_id)
      Section.create!(
        name: 'Todo section',
        workspace_id:,
        position: 0
      )
    end
  end
end
