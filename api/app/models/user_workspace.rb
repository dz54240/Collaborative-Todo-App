# frozen_string_literal: true

# == Schema Information
#
# Table name: user_workspaces
#
#  id           :bigint           not null, primary key
#  user_id      :bigint           not null
#  workspace_id :bigint           not null
#  admin        :boolean
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
class UserWorkspace < ApplicationRecord
  belongs_to :user, inverse_of: :user_workspaces
  belongs_to :workspace, inverse_of: :user_workspaces

  validates :admin, inclusion: { in: [true, false] }
  validate :only_one_admin_per_workspace

  private

  def only_one_admin_per_workspace
    return unless admin?
    return unless UserWorkspace.where(workspace_id:, admin: true).where.not(id:).exists?

    errors.add(:admin, 'already exists for this workspace')
  end
end
