# frozen_string_literal: true

# == Schema Information
#
# Table name: sections
#
#  id           :bigint           not null, primary key
#  name         :string           not null
#  position     :integer          default(0)
#  workspace_id :bigint           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
class Section < ApplicationRecord
  after_create_commit { broadcast_section('created') }
  after_update_commit { broadcast_section('updated') }
  after_destroy_commit { broadcast_section('deleted') }

  belongs_to :workspace

  has_many :todos, dependent: :destroy

  validates :name, presence: true, length: { minimum: 1 }
  validates :position, presence: true, numericality: { greater_than_or_equal_to: 0 }

  private

  def broadcast_section(action)
    ActionCable.server.broadcast(
      "sections_channel",
      {
        action: action,
        section: SectionSerializer.new(self).serializable_hash[:data]
      }
    )
  end
end
