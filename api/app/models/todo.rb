# frozen_string_literal: true

# == Schema Information
#
# Table name: todos
#
#  id          :bigint           not null, primary key
#  title       :string           not null
#  description :text
#  status      :string           default("todo"), not null
#  priority    :string           default("low"), not null
#  due_date    :date
#  section_id  :bigint           not null
#  assignee_id :bigint
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
class Todo < ApplicationRecord
  after_create_commit { broadcast_todo('created') }
  after_update_commit { broadcast_todo('updated') }
  after_destroy_commit { broadcast_todo('deleted') }

  belongs_to :section
  belongs_to :assignee, class_name: 'User', optional: true
  belongs_to :created_by, class_name: 'User', optional: true
  belongs_to :updated_by, class_name: 'User', optional: true

  validates :title, presence: true, length: { minimum: 1 }
  validates :status, presence: true, inclusion: { in: %w[todo working done], message: 'not a valid status' }
  validates :priority, presence: true, inclusion: { in: %w[low medium high], message: 'not a valid priority status' }

  private

  def broadcast_todo(action)
    ActionCable.server.broadcast(
      "todos_channel",
      {
        action: action,
        todo: TodoSerializer.new(self).serializable_hash[:data]
      }
    )
  end
end
