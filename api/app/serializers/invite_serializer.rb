# frozen_string_literal: true

class InviteSerializer
  include JSONAPI::Serializer

  set_type :invite
  set_id :id

  attribute :status
  attribute :created_at
  attribute :updated_at
end
