# frozen_string_literal: true

# == Schema Information
#
# Table name: invites
#
#  id           :bigint           not null, primary key
#  sender_id    :bigint           not null
#  receiver_id  :bigint           not null
#  workspace_id :bigint           not null
#  status       :string           default("pending"), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
class Invite < ApplicationRecord
  belongs_to :sender, class_name: 'User', inverse_of: :sent_invites
  belongs_to :receiver, class_name: 'User', inverse_of: :received_invites
  belongs_to :workspace

  validates :status, presence: true, inclusion: { in: %w[pending accepted rejected], message: 'is not a valid status' }

  scope :pending, -> { where(status: 'pending') }
  scope :accepted, -> { where(status: 'accepted') }
  scope :rejected, -> { where(status: 'rejected') }
end
