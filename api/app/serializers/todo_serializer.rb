# frozen_string_literal: true

class TodoSerailizer
  include JSONAPI::Serializer

  set_type :todo
  set_id :id

  attribute :title
  attribute :description
  attribute :status
  attribute :priority
  attribute :due_date
end
