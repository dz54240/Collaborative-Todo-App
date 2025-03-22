# frozen_string_literal: true

class InviteSerializer
  include JSONAPI::Serializer

  set_type :invite
  set_id :id

  attribute :status
end
