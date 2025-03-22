# frozen_string_literal: true

class WorkspaceSerializer
  include JSONAPI::Serializer

  set_type :workspace
  set_id :id

  attribute :name
  attribute :description
  attribute :created_at
  attribute :updated_at
end
