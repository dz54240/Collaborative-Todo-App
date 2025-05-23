# frozen_string_literal: true

class TodoSerializer
  include JSONAPI::Serializer

  set_type :todo
  set_id :id

  attribute :title
  attribute :description
  attribute :status
  attribute :priority
  attribute :due_date
  attribute :section_id
  attribute :created_at
  attribute :updated_at

  belongs_to :created_by, serializer: UserSerializer
  belongs_to :updated_by, serializer: UserSerializer
end
