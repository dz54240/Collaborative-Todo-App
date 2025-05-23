# frozen_string_literal: true

class InviteSerializer
  include JSONAPI::Serializer

  set_type :invite
  set_id :id

  attribute :status
  attribute :receiver_id
  attribute :sender_id
  attribute :workspace_id
  attribute :created_at
  attribute :updated_at

  belongs_to :receiver, serializer: UserSerializer
  belongs_to :sender, serializer: UserSerializer
  belongs_to :workspace, serializer: WorkspaceSerializer
end
