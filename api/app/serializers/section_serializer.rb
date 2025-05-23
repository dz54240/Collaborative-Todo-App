# frozen_string_literal: true

class SectionSerializer
  include JSONAPI::Serializer

  set_type :section
  set_id :id

  attribute :name
  attribute :position
  attribute :workspace_id
  attribute :created_at
  attribute :updated_at
end
