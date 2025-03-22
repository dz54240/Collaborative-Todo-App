# frozen_string_literal: true

module Base
  class BaseSaver
    def initialize(record, params, current_user = nil)
      @record = record
      @params = params
      @current_user = current_user
      @result = nil
    end

    def save
      record.assign_attributes(params)

      return BaseSaverResult.success(record) if record.save

      BaseSaverResult.failure(record.errors.full_messages)
    end

    private

    attr_accessor :record, :params, :current_user
  end
end
