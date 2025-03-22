# frozen_string_literal: true

# == Schema Information
#
# Table name: workspaces
#
#  id          :bigint           not null, primary key
#  name        :string           not null
#  description :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
class Workspace < ApplicationRecord
  has_many :invites, dependent: :destroy
  has_many :user_workspaces, dependent: :destroy, inverse_of: :workspace
  has_many :sections, dependent: :destroy
  has_many :users, through: :user_workspaces

  validates :name, presence: true, length: { minimum: 1 }

  def admin
    users.merge(UserWorkspace.where(admin: true)).first
  end
end
