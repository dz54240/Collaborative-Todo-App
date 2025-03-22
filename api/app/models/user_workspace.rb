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

  validates :admin, presence: true, inclusion: { in: [true, false] }
end
