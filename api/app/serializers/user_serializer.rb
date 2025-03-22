# frozen_string_literal: true

class UserSerializer
  include JSONAPI::Serializer

  set_type :user
  set_id :id

  attribute :first_name
  attribute :last_name
  attribute :email
  attribute :created_at
  attribute :updated_at
end
