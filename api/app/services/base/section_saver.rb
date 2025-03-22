# frozen_string_literal: true

module Base
  class SectionSaver < Base::BaseSaver
    def save
      unless workspace_accessible?
        record.errors.add(:workspace_id, 'is not accesible')
        return Base::BaseSaverResult.failure(record.errors.full_messages)
      end

      super
    end

    private

    def workspace_accessible?
      return true if params[:workspace_id].nil?

      current_user.workspace_ids.include?(params[:workspace_id])
    end
  end
end
