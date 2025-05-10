# frozen_string_literal: true

module Base
  class TodoSaver < Base::BaseSaver
    include ActiveModel::Validations

    validate :section_must_be_accessible

    def save
      set_creator_and_updater

      return Base::BaseSaverResult.failure(errors.full_messages) unless valid?

      super
    end

    private

    def set_creator_and_updater
      record.created_by_id = current_user.id if record.new_record?
      record.updated_by_id = current_user.id
    end

    def section_must_be_accessible
      return if section_id.nil?
      return if section_scope.exists?(id: section_id)

      errors.add(:section_id, 'is not accessible')
    end

    def section_id
      params[:section_id]
    end

    def section_scope
      SectionPolicy::Scope.new(current_user, Section).resolve
    end
  end
end
